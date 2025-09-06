import { useState, useEffect, useCallback } from 'react';
import { AIModelsService, RealTimeDataService } from '@/services/aiModels';

export const useAIModels = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeModels = async () => {
      setIsLoading(true);
      try {
        await AIModelsService.initialize();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError('Failed to initialize AI models');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeModels();
  }, []);

  const predictETA = useCallback(async (
    historicalData: number[], 
    routeFactors: any
  ) => {
    if (!isInitialized) return null;
    
    setIsLoading(true);
    try {
      const result = await AIModelsService.predictETA(historicalData, routeFactors);
      setError(null);
      return result;
    } catch (err) {
      setError('ETA prediction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const analyzeDeliveryPattern = useCallback(async (deliveryData: any) => {
    if (!isInitialized) return null;
    
    try {
      const result = await AIModelsService.analyzeDeliveryPattern(deliveryData);
      return result;
    } catch (err) {
      setError('Pattern analysis failed');
      return null;
    }
  }, [isInitialized]);

  const analyzeZonePerformance = useCallback(async (zoneData: any[]) => {
    if (!isInitialized) return null;
    
    try {
      const result = await AIModelsService.analyzeZonePerformance(zoneData);
      return result;
    } catch (err) {
      setError('Zone analysis failed');
      return null;
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    predictETA,
    analyzeDeliveryPattern,
    analyzeZonePerformance
  };
};

export const useRealTimeData = () => {
  const [trafficData, setTrafficData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [courierLocations, setCourierLocations] = useState<any[]>([]);

  const updateTrafficData = useCallback(async (coordinates: [number, number]) => {
    try {
      const data = await RealTimeDataService.getTrafficData(coordinates);
      setTrafficData(data);
    } catch (error) {
      console.error('Failed to fetch traffic data:', error);
    }
  }, []);

  const updateWeatherData = useCallback(async (coordinates: [number, number]) => {
    try {
      const data = await RealTimeDataService.getWeatherData(coordinates);
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  }, []);

  const updateCourierLocations = useCallback(async () => {
    try {
      const data = await RealTimeDataService.getCourierLocationData();
      setCourierLocations(data);
    } catch (error) {
      console.error('Failed to fetch courier locations:', error);
    }
  }, []);

  useEffect(() => {
    // Update real-time data every 30 seconds
    const interval = setInterval(() => {
      updateCourierLocations();
      // Update traffic and weather for main delivery zones
      updateTrafficData([40.7128, -74.0060]); // NYC coordinates
      updateWeatherData([40.7128, -74.0060]);
    }, 30000);

    // Initial load
    updateCourierLocations();
    updateTrafficData([40.7128, -74.0060]);
    updateWeatherData([40.7128, -74.0060]);

    return () => clearInterval(interval);
  }, [updateCourierLocations, updateTrafficData, updateWeatherData]);

  return {
    trafficData,
    weatherData,
    courierLocations,
    updateTrafficData,
    updateWeatherData,
    updateCourierLocations
  };
};