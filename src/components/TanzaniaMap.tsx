import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Truck } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  pickup_address: string;
  delivery_address: string;
  status: string;
  courier_id: string;
  estimated_delivery_time: string;
  couriers?: {
    name: string;
    status: string;
    vehicle_type: string;
  };
}

const TanzaniaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: orders, loading } = useSupabaseData<Order>({
    table: 'orders',
    select: `
      *,
      couriers:courier_id(name, status, vehicle_type)
    `,
    orderBy: { column: 'created_at', ascending: false },
    realtime: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'in_transit': return '#3b82f6';
      case 'assigned': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTR3aW1jenMwMXcyMnFwemZwMW45d3pnIn0.CgeNYZcVBUJJGXfWJiVumg'; // Temporary token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [39.2083, -6.7924], // Dar es Salaam coordinates
      zoom: 11,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add Tanzania boundary and major cities
    map.current.on('style.load', () => {
      // Add a subtle boundary for Dar es Salaam
      map.current?.addLayer({
        id: 'dar-boundary',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [39.1, -6.7],
                [39.3, -6.7],
                [39.3, -6.9],
                [39.1, -6.9],
                [39.1, -6.7]
              ]]
            }
          }
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 2,
          'line-opacity': 0.6
        }
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Add markers for orders
  useEffect(() => {
    if (!map.current || !orders.length) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.delivery-marker');
    existingMarkers.forEach(marker => marker.remove());

    orders.slice(0, 50).forEach((order) => {
      // Extract coordinates from pickup_location (POINT format)
      const locationMatch = order.pickup_address?.match(/-?\d+\.?\d*/g);
      if (!locationMatch || locationMatch.length < 2) return;

      const lng = parseFloat(locationMatch[0]);
      const lat = parseFloat(locationMatch[1]);

      if (isNaN(lng) || isNaN(lat)) return;

      // Create custom marker
      const markerEl = document.createElement('div');
      markerEl.className = 'delivery-marker';
      markerEl.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${getStatusColor(order.status)};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Add truck icon for in-transit orders
      if (order.status === 'in_transit') {
        markerEl.innerHTML = '🚚';
        markerEl.style.fontSize = '10px';
      }

      // Create popup with order details
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(`
        <div style="padding: 8px; max-width: 250px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
            ${order.order_number}
          </h4>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Customer:</strong> ${order.customer_name}
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Status:</strong> <span style="color: ${getStatusColor(order.status)}; font-weight: bold;">${order.status.replace('_', ' ').toUpperCase()}</span>
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Delivery:</strong> ${order.delivery_address}
          </p>
          ${order.couriers ? `
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Courier:</strong> ${order.couriers.name}
            </p>
          ` : ''}
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      markerEl.addEventListener('click', () => {
        setSelectedOrder(order);
      });
    });
  }, [orders]);

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
        <div className="absolute top-4 left-4 z-10">
          <Card className="w-64">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Dar es Salaam Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Orders:</span>
                  <Badge variant="secondary">{orders.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active Deliveries:</span>
                  <Badge variant="default">
                    {orders.filter(o => o.status === 'in_transit').length}
                  </Badge>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>In Transit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Assigned</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedOrder && (
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{selectedOrder.order_number}</h4>
                <Badge 
                  variant="outline" 
                  style={{ color: getStatusColor(selectedOrder.status) }}
                >
                  {selectedOrder.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <p className="text-sm">{selectedOrder.customer_name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pickup</label>
                  <p className="text-sm">{selectedOrder.pickup_address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery</label>
                  <p className="text-sm">{selectedOrder.delivery_address}</p>
                </div>
                
                {selectedOrder.couriers && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Courier</label>
                    <p className="text-sm">{selectedOrder.couriers.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedOrder.couriers.vehicle_type} • {selectedOrder.couriers.status}
                    </p>
                  </div>
                )}
                
                {selectedOrder.estimated_delivery_time && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Est. Delivery</label>
                    <p className="text-sm">
                      {new Date(selectedOrder.estimated_delivery_time).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TanzaniaMap;