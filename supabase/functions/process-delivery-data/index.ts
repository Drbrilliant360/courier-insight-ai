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

    console.log(`Processing large dataset for user ${user.id}: ${filename} (${fileSize} bytes, ${data.length} records)`);

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

    // Batch processing for large datasets
    const BATCH_SIZE = 1000;
    const batches = [];
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      batches.push(data.slice(i, i + BATCH_SIZE));
    }

    console.log(`Processing ${data.length} records in ${batches.length} batches of ${BATCH_SIZE}`);

    // Process background task for large datasets
    const processLargeDataset = async () => {
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

        const batchPromises = batch.map(async (record) => {
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
              return null;
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
                    vehicle_type: 'bike',
                    rating: 5.0,
                  },
                ])
                .select()
                .single();

              if (courierError) {
                errors.push(`Failed to create courier ${record.courier_name}: ${courierError.message}`);
                return null;
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
              if (orderError.code === '23505') {
                const { error: updateError } = await supabaseClient
                  .from('orders')
                  .update(orderData)
                  .eq('order_number', record.order_id);

                if (updateError) {
                  errors.push(`Failed to update order ${record.order_id}: ${updateError.message}`);
                  return null;
                }
              } else {
                errors.push(`Failed to create order ${record.order_id}: ${orderError.message}`);
                return null;
              }
            }

            return record.order_id;
          } catch (error) {
            errors.push(`Error processing record ${record.order_id}: ${error.message}`);
            return null;
          }
        });

        // Wait for batch to complete
        const batchResults = await Promise.allSettled(batchPromises);
        const successfulInBatch = batchResults.filter(result => 
          result.status === 'fulfilled' && result.value !== null
        ).length;
        
        processedCount += successfulInBatch;

        // Update progress after each batch
        await supabaseClient
          .from('analytics_data')
          .update({ 
            processed_records: processedCount,
            processing_status: batchIndex === batches.length - 1 ? 
              (processedCount === data.length ? 'completed' : 'completed_with_errors') : 'processing'
          })
          .eq('id', analyticsId);

        console.log(`Batch ${batchIndex + 1} completed: ${successfulInBatch}/${batch.length} records processed`);
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
            errors: errors.slice(0, 10),
            total_errors: errors.length,
            batch_size: BATCH_SIZE,
            total_batches: batches.length,
          },
        })
        .eq('id', analyticsId);

      console.log(`Large dataset processing completed: ${processedCount}/${data.length} records processed`);
    };

    // For large datasets (>10,000 records), use background processing
    if (data.length > 10000) {
      // Start background processing
      EdgeRuntime.waitUntil(processLargeDataset());
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Large dataset processing started in background',
          total: data.length,
          analytics_id: analyticsId,
          background_processing: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 202,
        }
      );
    }

    // For smaller datasets, process synchronously
    await processLargeDataset();

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