import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for optimal performance
env.allowLocalModels = false;
env.useBrowserCache = true;

// AI Models Service for Delivery Intelligence
export class AIModelsService {
  private static timeSeriesPipeline: any = null;
  private static textClassificationPipeline: any = null;
  private static initialized = false;

  static async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('Initializing AI models...');
      
      // Initialize Chronos for time series forecasting (ETA prediction)
      this.timeSeriesPipeline = await pipeline(
        'text-generation',
        'amazon/chronos-t5-tiny',
        { device: 'webgpu' }
      );

      // Initialize text classification for anomaly detection
      this.textClassificationPipeline = await pipeline(
        'text-classification',
        'microsoft/DialoGPT-medium',
        { device: 'webgpu' }
      );

      this.initialized = true;
      console.log('AI models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI models:', error);
      // Fallback to CPU if WebGPU fails
      try {
        this.timeSeriesPipeline = await pipeline(
          'text-generation',
          'amazon/chronos-t5-tiny'
        );
        this.initialized = true;
      } catch (fallbackError) {
        console.error('Fallback initialization failed:', fallbackError);
      }
    }
  }

  // Predict delivery ETA using time series analysis
  static async predictETA(historicalData: number[], routeFactors: any) {
    await this.initialize();
    
    if (!this.timeSeriesPipeline) {
      // Fallback to traditional calculation
      return this.fallbackETACalculation(historicalData, routeFactors);
    }

    try {
      // Format data for Chronos model
      const timeSeriesInput = historicalData.slice(-10).join(',');
      const prompt = `Historical delivery times: ${timeSeriesInput}. Predict next delivery time considering traffic: ${routeFactors.traffic}, distance: ${routeFactors.distance}km, weather: ${routeFactors.weather}`;
      
      const result = await this.timeSeriesPipeline(prompt, {
        max_new_tokens: 10,
        temperature: 0.1
      });

      // Extract predicted time from result
      const prediction = this.extractETAFromResult(result);
      return {
        predictedETA: prediction,
        confidence: this.calculateConfidence(historicalData),
        model: 'chronos-t5'
      };
    } catch (error) {
      console.error('ETA prediction error:', error);
      return this.fallbackETACalculation(historicalData, routeFactors);
    }
  }

  // Analyze delivery patterns for anomaly detection
  static async analyzeDeliveryPattern(deliveryData: any) {
    await this.initialize();

    const analysis = {
      isAnomalous: false,
      confidence: 0,
      factors: [] as string[],
      severity: 'low' as 'low' | 'medium' | 'high'
    };

    try {
      // Speed analysis
      if (deliveryData.actualTime < deliveryData.predictedTime * 0.3) {
        analysis.isAnomalous = true;
        analysis.factors.push('Suspicious speed');
        analysis.severity = 'high';
      }

      // Route deviation analysis
      if (deliveryData.routeDeviation > 2) {
        analysis.isAnomalous = true;
        analysis.factors.push('Route deviation');
        analysis.severity = analysis.severity === 'high' ? 'high' : 'medium';
      }

      // Time pattern analysis
      if (deliveryData.actualTime > deliveryData.predictedTime * 2) {
        analysis.isAnomalous = true;
        analysis.factors.push('Extended delay');
        analysis.severity = analysis.severity === 'high' ? 'high' : 'medium';
      }

      analysis.confidence = analysis.isAnomalous ? 
        Math.min(0.95, analysis.factors.length * 0.3 + 0.4) : 0.1;

      return analysis;
    } catch (error) {
      console.error('Pattern analysis error:', error);
      return analysis;
    }
  }

  // Geospatial analysis for zone optimization
  static async analyzeZonePerformance(zoneData: any[]) {
    const analysis = zoneData.map(zone => {
      const efficiencyScore = this.calculateZoneEfficiency(zone);
      const demandPrediction = this.predictZoneDemand(zone);
      
      return {
        ...zone,
        efficiencyScore,
        demandPrediction,
        optimizationSuggestions: this.generateOptimizationSuggestions(zone, efficiencyScore)
      };
    });

    return analysis.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  }

  // Helper methods
  private static fallbackETACalculation(historicalData: number[], routeFactors: any) {
    const avgTime = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const trafficMultiplier = routeFactors.traffic === 'heavy' ? 1.5 : 
                              routeFactors.traffic === 'moderate' ? 1.2 : 1.0;
    const weatherMultiplier = routeFactors.weather === 'poor' ? 1.3 : 1.0;
    
    const prediction = Math.round(avgTime * trafficMultiplier * weatherMultiplier);
    
    return {
      predictedETA: `${prediction} min`,
      confidence: 75,
      model: 'fallback'
    };
  }

  private static extractETAFromResult(result: any): string {
    // Extract ETA from model result - simplified for demo
    const text = result[0]?.generated_text || '';
    const timeMatch = text.match(/(\d+)\s*min/);
    return timeMatch ? `${timeMatch[1]} min` : '25 min';
  }

  private static calculateConfidence(historicalData: number[]): number {
    const variance = this.calculateVariance(historicalData);
    return Math.max(60, Math.min(95, 100 - variance * 2));
  }

  private static calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    return variance;
  }

  private static calculateZoneEfficiency(zone: any): number {
    const deliveryDensity = zone.deliveries / (zone.area || 1);
    const timeEfficiency = 30 / parseFloat(zone.avgTime || '30');
    const anomalyPenalty = 1 - (zone.anomalies / zone.deliveries);
    
    return Math.round((deliveryDensity * timeEfficiency * anomalyPenalty) * 100) / 100;
  }

  private static predictZoneDemand(zone: any): string {
    // Simple demand prediction based on historical patterns
    const currentHour = new Date().getHours();
    const peakHours = [12, 13, 18, 19, 20]; // Lunch and dinner times
    
    if (peakHours.includes(currentHour)) {
      return zone.deliveries > 200 ? 'Very High' : 'High';
    }
    
    return zone.deliveries > 100 ? 'Medium' : 'Low';
  }

  private static generateOptimizationSuggestions(zone: any, efficiency: number): string[] {
    const suggestions = [];
    
    if (efficiency < 0.5) {
      suggestions.push('Consider adding more couriers to this zone');
    }
    
    if (zone.anomalies > 3) {
      suggestions.push('Implement additional monitoring for anomaly prevention');
    }
    
    if (parseFloat(zone.avgTime) > 30) {
      suggestions.push('Optimize route planning for faster deliveries');
    }
    
    return suggestions;
  }
}

// Real-time data integration
export class RealTimeDataService {
  static async getTrafficData(coordinates: [number, number]): Promise<any> {
    // Mock real-time traffic data - in production, integrate with mapping APIs
    const mockTraffic = ['light', 'moderate', 'heavy'][Math.floor(Math.random() * 3)];
    
    return {
      traffic: mockTraffic,
      roadConditions: 'good',
      estimatedDelay: mockTraffic === 'heavy' ? 5 : mockTraffic === 'moderate' ? 2 : 0
    };
  }

  static async getWeatherData(coordinates: [number, number]): Promise<any> {
    // Mock weather data - in production, integrate with weather APIs
    const conditions = ['clear', 'cloudy', 'rain', 'snow'][Math.floor(Math.random() * 4)];
    
    return {
      condition: conditions,
      temperature: Math.round(Math.random() * 30 + 10),
      visibility: conditions === 'rain' || conditions === 'snow' ? 'poor' : 'good'
    };
  }

  static async getCourierLocationData(): Promise<any[]> {
    // Mock real-time courier locations
    return [
      { courierId: 'C001', lat: 40.7128, lng: -74.0060, speed: 25, heading: 'north' },
      { courierId: 'C002', lat: 40.6962, lng: -73.9961, speed: 30, heading: 'east' },
      { courierId: 'C003', lat: 40.7505, lng: -73.9370, speed: 0, heading: 'stopped' }
    ];
  }
}