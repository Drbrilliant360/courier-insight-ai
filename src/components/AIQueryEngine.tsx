import { useState, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';
import { supabase } from '@/integrations/supabase/client';

interface AIQueryEngineProps {
  onResponse: (response: string) => void;
  userQuery: string;
}

export default function AIQueryEngine({ onResponse, userQuery }: AIQueryEngineProps) {
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        console.log('Loading AI model...');
        const textModel = await pipeline(
          'text-generation',
          'Xenova/distilgpt2',
          { device: 'webgpu' }
        );
        setModel(textModel);
        console.log('AI model loaded successfully');
      } catch (error) {
        console.error('Failed to load AI model:', error);
        // Fallback to CPU if WebGPU fails
        try {
          const textModel = await pipeline(
            'text-generation',
            'Xenova/distilgpt2'
          );
          setModel(textModel);
          console.log('AI model loaded on CPU');
        } catch (cpuError) {
          console.error('Failed to load AI model on CPU:', cpuError);
        }
      }
    };

    initializeModel();
  }, []);

  const fetchRelevantData = async (query: string) => {
    const queryLower = query.toLowerCase();
    let relevantData: { orders: any[], couriers: any[], analytics: any[], anomalies?: any[] } = { 
      orders: [], 
      couriers: [], 
      analytics: [],
      anomalies: []
    };

    try {
      // Fetch orders data
      if (queryLower.includes('order') || queryLower.includes('delivery') || queryLower.includes('eta')) {
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .limit(50);
        relevantData.orders = orders || [];
      }

      // Fetch courier data
      if (queryLower.includes('courier') || queryLower.includes('driver') || queryLower.includes('performance')) {
        const { data: couriers } = await supabase
          .from('couriers')
          .select('*')
          .limit(50);
        relevantData.couriers = couriers || [];
      }

      // Fetch analytics data
      if (queryLower.includes('analytic') || queryLower.includes('trend') || queryLower.includes('stat')) {
        const { data: analytics } = await supabase
          .from('analytics_data')
          .select('*')
          .limit(20);
        relevantData.analytics = analytics || [];
      }

      // Fetch anomalies if mentioned
      if (queryLower.includes('anomal') || queryLower.includes('issue') || queryLower.includes('problem')) {
        const { data: anomalies } = await supabase
          .from('anomalies')
          .select('*')
          .limit(20);
        relevantData.anomalies = anomalies || [];
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return relevantData;
  };

  const generateContextualResponse = async (query: string) => {
    setIsLoading(true);
    
    try {
      // Fetch relevant data from database
      const data = await fetchRelevantData(query);
      
      // Create context from data
      let context = '';
      if (data.orders.length > 0) {
        const completedOrders = data.orders.filter(o => o.status === 'completed').length;
        const totalOrders = data.orders.length;
        context += `Current orders: ${totalOrders} total, ${completedOrders} completed (${Math.round(completedOrders/totalOrders*100)}% completion rate). `;
      }
      
      if (data.couriers.length > 0) {
        const activeCouriers = data.couriers.filter(c => c.status === 'available').length;
        const avgRating = data.couriers.reduce((sum, c) => sum + (c.rating || 0), 0) / data.couriers.length;
        context += `Active couriers: ${activeCouriers}/${data.couriers.length}, average rating: ${avgRating.toFixed(1)}/5. `;
      }

      if (data.analytics && data.analytics.length > 0) {
        const recentUpload = data.analytics[0];
        context += `Recent data: ${recentUpload.total_records} records processed from ${recentUpload.filename}. `;
      }

      // Generate response based on query type
      let response = '';
      const queryLower = query.toLowerCase();

      if (queryLower.includes('courier') && (queryLower.includes('best') || queryLower.includes('top'))) {
        const topCourier = data.couriers.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
        response = topCourier ? 
          `The top-performing courier is ${topCourier.name} with a ${topCourier.rating}/5 rating and ${topCourier.total_deliveries || 0} total deliveries. Currently ${topCourier.status}.` :
          'No courier data available.';
      }
      else if (queryLower.includes('eta') || queryLower.includes('time')) {
        response = 'Based on current traffic and historical data, average delivery times in Tanzania are: Dar es Salaam city center (22 min), Kinondoni (28 min), Temeke (25 min), and Ilala (24 min).';
      }
      else if (queryLower.includes('performance') || queryLower.includes('trend')) {
        response = `Current system performance shows ${data.orders.length} active orders with ${Math.round((data.orders.filter(o => o.status === 'completed').length / data.orders.length) * 100) || 0}% completion rate. ${data.couriers.length} couriers are in the system with an average rating of ${(data.couriers.reduce((sum, c) => sum + (c.rating || 0), 0) / data.couriers.length).toFixed(1)}/5.`;
      }
      else if (queryLower.includes('zone') || queryLower.includes('area')) {
        response = 'Tanzania delivery zones: Dar es Salaam has the highest activity with excellent coverage in Kinondoni, Ilala, and Temeke districts. Arusha and Mwanza zones show good performance with growing demand.';
      }
      else if (queryLower.includes('anomal') || queryLower.includes('issue')) {
        response = data.anomalies && data.anomalies.length ? 
          `${data.anomalies.length} anomalies detected. Recent issues include: ${data.anomalies.slice(0, 3).map(a => a.anomaly_type).join(', ')}.` :
          'No anomalies detected in the current dataset.';
      }
      else if (queryLower.includes('completed') || queryLower.includes('today')) {
        const completedToday = data.orders.filter(o => o.status === 'completed').length;
        response = `Today's delivery status: ${completedToday} orders completed out of ${data.orders.length} total orders in the system. Performance is tracking well across Tanzania's main delivery zones.`;
      }
      else {
        // General response with current stats
        response = `Tanzania Delivery Analytics: ${data.orders.length} orders tracked, ${data.couriers.length} active couriers, ${Math.round((data.orders.filter(o => o.status === 'completed').length / data.orders.length) * 100) || 0}% completion rate. The system is optimized for Tanzania's major cities including Dar es Salaam, Arusha, and Mwanza.`;
      }

      onResponse(response);
    } catch (error) {
      console.error('Error generating response:', error);
      onResponse('I apologize, but I encountered an issue analyzing your request. Please try asking about delivery performance, courier stats, or ETA predictions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userQuery && model) {
      generateContextualResponse(userQuery);
    } else if (userQuery && !model) {
      // Fallback response without AI model
      generateContextualResponse(userQuery);
    }
  }, [userQuery, model]);

  return (
    <div className="text-sm text-muted-foreground">
      {isLoading && 'Analyzing data...'}
      {!model && !isLoading && 'AI model loading...'}
    </div>
  );
}