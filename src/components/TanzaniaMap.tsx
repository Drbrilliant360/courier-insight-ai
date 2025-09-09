import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { tanzaniaRegions, tanzaniaBoundary, darEsSalaamZones } from '@/data/tanzaniaGeoData';

const TanzaniaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const ordersData = useSupabaseData({ table: 'orders' });
  const couriersData = useSupabaseData({ table: 'couriers' });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTFkdnJsYnowMWMzMmpzYTAzNGtlNzZwIn0.oUBYblss3ZQvkYo6Hg64HA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [35.7419, -6.1722], // Tanzania center
      zoom: 6,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      console.log('Tanzania map loaded successfully');
      setMapLoaded(true);
      
      // Add Tanzania regions
      if (map.current) {
        map.current.addSource('tanzania-regions', {
          type: 'geojson',
          data: tanzaniaRegions
        });

        map.current.addLayer({
          id: 'tanzania-regions-fill',
          type: 'fill',
          source: 'tanzania-regions',
          paint: {
            'fill-color': '#3b82f6',
            'fill-opacity': 0.1
          }
        });

        map.current.addLayer({
          id: 'tanzania-regions-line',
          type: 'line',
          source: 'tanzania-regions',
          paint: {
            'line-color': '#2563eb',
            'line-width': 2,
            'line-opacity': 0.6
          }
        });

        // Add orders and couriers
        addOrdersToMap();
        addCouriersToMap();
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  const addOrdersToMap = () => {
    if (!map.current || !ordersData.data.length) return;

    ordersData.data.forEach((order) => {
      if (order.pickup_location) {
        const coords = parseLocationString(order.pickup_location);
        if (coords) {
          const marker = new mapboxgl.Marker({ color: '#ef4444' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${order.order_number}</h3>
                <p>Status: ${order.status}</p>
                <p>Customer: ${order.customer_name}</p>
              </div>
            `))
            .addTo(map.current!);
        }
      }
    });
  };

  const addCouriersToMap = () => {
    if (!map.current || !couriersData.data.length) return;

    couriersData.data.forEach((courier) => {
      if (courier.current_location) {
        const coords = parseLocationString(courier.current_location);
        if (coords) {
          const marker = new mapboxgl.Marker({ color: '#10b981' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${courier.name}</h3>
                <p>Status: ${courier.status}</p>
                <p>Rating: ${courier.rating}/5</p>
              </div>
            `))
            .addTo(map.current!);
        }
      }
    });
  };

  const parseLocationString = (locationStr: string): [number, number] | null => {
    try {
      if (locationStr.includes('POINT')) {
        const coords = locationStr.match(/POINT\(([^)]+)\)/);
        if (coords) {
          const [lng, lat] = coords[1].split(' ').map(Number);
          return [lng, lat];
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-bold text-sm">Tanzania Delivery Map</h3>
        <p className="text-xs text-gray-600">
          {ordersData.data.length} orders • {couriersData.data.length} couriers
        </p>
      </div>
    </div>
  );
};

export default TanzaniaMap;