import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeliveryRecord {
  order_id: string;
  courier_name: string;
  pickup_location: string;
  delivery_location: string;
  pickup_time: string;
  delivery_time: string;
  status: string;
  customer_name?: string;
  customer_phone?: string;
  special_instructions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const { data, filename, fileSize } = await req.json();

    console.log(`Processing delivery data for user ${user.id}: ${filename} (${fileSize} bytes)`);

    // Store analytics metadata
    const { data: analyticsData, error: analyticsError } = await supabaseClient
      .from('analytics_data')
      .insert([
        {
          uploaded_by: user.id,
          filename,
          file_size: fileSize,
          total_records: data.length,
          processed_records: 0,
          processing_status: 'processing',
          metadata: {
            upload_timestamp: new Date().toISOString(),
            columns: Object.keys(data[0] || {}),
          },
        },
      ])
      .select()
      .single();

    if (analyticsError) {
      console.error('Error storing analytics data:', analyticsError);
      return new Response(
        JSON.stringify({ error: 'Failed to store analytics data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const analyticsId = analyticsData.id;
    let processedCount = 0;
    const errors: string[] = [];

    // Process each delivery record
    for (const record of data) {
      try {
        // Parse location coordinates
        const parseLocation = (locationStr: string): [number, number] | null => {
          try {
            // Try to parse as "lat,lng" format
            if (locationStr.includes(',')) {
              const [lat, lng] = locationStr.split(',').map(s => parseFloat(s.trim()));
              if (!isNaN(lat) && !isNaN(lng)) {
                return [lng, lat]; // PostGIS expects [lng, lat]
              }
            }
            return null;
          } catch {
            return null;
          }
        };

        const pickupCoords = parseLocation(record.pickup_location);
        const deliveryCoords = parseLocation(record.delivery_location);

        if (!pickupCoords || !deliveryCoords) {
          errors.push(`Invalid location format for order ${record.order_id}`);
          continue;
        }

        // Find or create courier
        let courier;
        const { data: existingCourier } = await supabaseClient
          .from('couriers')
          .select('id')
          .eq('name', record.courier_name)
          .single();

        if (existingCourier) {
          courier = existingCourier;
        } else {
          const { data: newCourier, error: courierError } = await supabaseClient
            .from('couriers')
            .insert([
              {
                name: record.courier_name,
                status: 'available',
                vehicle_type: 'bike', // Default
                rating: 5.0,
              },
            ])
            .select()
            .single();

          if (courierError) {
            errors.push(`Failed to create courier ${record.courier_name}: ${courierError.message}`);
            continue;
          }
          courier = newCourier;
        }

        // Create order
        const orderData = {
          order_number: record.order_id,
          customer_name: record.customer_name || 'Unknown Customer',
          customer_phone: record.customer_phone || null,
          pickup_location: `POINT(${pickupCoords[0]} ${pickupCoords[1]})`,
          pickup_address: record.pickup_location,
          delivery_location: `POINT(${deliveryCoords[0]} ${deliveryCoords[1]})`,
          delivery_address: record.delivery_location,
          status: record.status.toLowerCase().replace(/\s+/g, '_') as any,
          estimated_pickup_time: record.pickup_time ? new Date(record.pickup_time).toISOString() : null,
          actual_pickup_time: record.pickup_time ? new Date(record.pickup_time).toISOString() : null,
          estimated_delivery_time: record.delivery_time ? new Date(record.delivery_time).toISOString() : null,
          actual_delivery_time: record.delivery_time ? new Date(record.delivery_time).toISOString() : null,
          courier_id: courier.id,
          special_instructions: record.special_instructions || null,
          priority_level: 1,
        };

        const { error: orderError } = await supabaseClient
          .from('orders')
          .insert([orderData]);

        if (orderError) {
          // If order already exists, try to update it
          if (orderError.code === '23505') { // Unique constraint violation
            const { error: updateError } = await supabaseClient
              .from('orders')
              .update(orderData)
              .eq('order_number', record.order_id);

            if (updateError) {
              errors.push(`Failed to update order ${record.order_id}: ${updateError.message}`);
              continue;
            }
          } else {
            errors.push(`Failed to create order ${record.order_id}: ${orderError.message}`);
            continue;
          }
        }

        processedCount++;

        // Update progress
        if (processedCount % 10 === 0) {
          await supabaseClient
            .from('analytics_data')
            .update({ processed_records: processedCount })
            .eq('id', analyticsId);
        }
      } catch (error) {
        errors.push(`Error processing record ${record.order_id}: ${error.message}`);
      }
    }

    // Final update
    await supabaseClient
      .from('analytics_data')
      .update({
        processed_records: processedCount,
        processing_status: processedCount === data.length ? 'completed' : 'completed_with_errors',
        metadata: {
          ...analyticsData.metadata,
          processing_completed: new Date().toISOString(),
          errors: errors.slice(0, 10), // Store first 10 errors
          total_errors: errors.length,
        },
      })
      .eq('id', analyticsId);

    console.log(`Processing completed: ${processedCount}/${data.length} records processed`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        total: data.length,
        errors: errors.length,
        analytics_id: analyticsId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing delivery data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});