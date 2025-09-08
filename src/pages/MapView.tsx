import TanzaniaMap from "@/components/TanzaniaMap";

export default function MapView() {
  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Real-Time Delivery Map</h1>
        <p className="text-muted-foreground mt-1">
          Live tracking of deliveries across Dar es Salaam, Tanzania
        </p>
      </div>
      
      <div className="h-[calc(100vh-200px)]">
        <TanzaniaMap />
      </div>
    </div>
  );
}