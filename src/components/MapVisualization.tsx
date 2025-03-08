
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix the Leaflet icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

// Vehicle marker icons
const createVehicleIcon = (status: 'normal' | 'warning' | 'critical') => {
  const statusColors = {
    normal: '#34C759',
    warning: '#FF9500',
    critical: '#FF3B30',
  };
  
  return L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="white" stroke="${statusColors[status]}" stroke-width="2"/>
        <path d="M10 16H22M16 10V22" stroke="${statusColors[status]}" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    className: `vehicle-marker status-${status}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Accident marker icon
const accidentIcon = L.divIcon({
  html: `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="white" stroke="#FF3B30" stroke-width="2"/>
      <path d="M16 8V18M16 22V24" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  className: 'accident-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const MapVisualization: React.FC = () => {
  const { vehicles, accidents, selectedVehicleId, statusFilter, setSelectedVehicleId } = useDashboard();
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default to SF
  const [zoom, setZoom] = useState(13);
  
  // Filter vehicles based on status filter
  const filteredVehicles = vehicles.filter(v => statusFilter.includes(v.status));
  
  // If a vehicle is selected, center the map on it
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        setMapCenter(vehicle.location);
        setZoom(15);
      }
    } else if (filteredVehicles.length > 0) {
      // If no vehicle is selected, use the average position of all vehicles
      const avgLat = filteredVehicles.reduce((sum, v) => sum + v.location[0], 0) / filteredVehicles.length;
      const avgLng = filteredVehicles.reduce((sum, v) => sum + v.location[1], 0) / filteredVehicles.length;
      setMapCenter([avgLat, avgLng]);
      setZoom(13);
    }
  }, [selectedVehicleId, filteredVehicles]);
  
  // Find connections between vehicles that are within 0.5km of each other
  const connections = React.useMemo(() => {
    const results: { from: string; to: string; points: [number, number][] }[] = [];
    
    for (let i = 0; i < filteredVehicles.length; i++) {
      for (let j = i + 1; j < filteredVehicles.length; j++) {
        const v1 = filteredVehicles[i];
        const v2 = filteredVehicles[j];
        
        // Simple distance calculation (not accurate for long distances, but fine for our demo)
        const latDiff = v1.location[0] - v2.location[0];
        const lngDiff = v1.location[1] - v2.location[1];
        const distanceSquared = latDiff * latDiff + lngDiff * lngDiff;
        
        // If distance is less than ~0.5km (in coordinate units)
        if (distanceSquared < 0.00005) {
          results.push({
            from: v1.id,
            to: v2.id,
            points: [v1.location, v2.location],
          });
        }
      }
    }
    
    return results;
  }, [filteredVehicles]);
  
  return (
    <Card className="h-full glassmorphism animate-fade-in">
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Live Vehicle Map</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-white/50">Vehicles: {filteredVehicles.length}</Badge>
            <Badge variant="outline" className="bg-white/50">Accidents: {accidents.length}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4 px-4">
        <div className="h-[calc(100%-2rem)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Connections between nearby vehicles */}
            {connections.map((connection, index) => (
              <Polyline
                key={`connection-${index}`}
                positions={connection.points}
                pathOptions={{ color: 'rgba(0, 122, 255, 0.4)', weight: 2, dashArray: '5, 5' }}
              />
            ))}
            
            {/* Vehicle markers */}
            {filteredVehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                position={vehicle.location}
                icon={createVehicleIcon(vehicle.status)}
                eventHandlers={{
                  click: () => {
                    setSelectedVehicleId(vehicle.id === selectedVehicleId ? null : vehicle.id);
                  },
                }}
              >
                <Popup>
                  <div className="font-sans p-1">
                    <h3 className="font-medium text-base">{vehicle.id}</h3>
                    <div className="grid grid-cols-2 gap-x-4 text-sm mt-1">
                      <span className="text-gray-500">Status:</span>
                      <span className={`status-${vehicle.status} px-2 rounded-full text-center`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                      
                      <span className="text-gray-500">Speed:</span>
                      <span>{Math.round(vehicle.speed)} mph</span>
                      
                      <span className="text-gray-500">Battery:</span>
                      <span>{Math.round(vehicle.batteryLevel)}%</span>
                      
                      <span className="text-gray-500">Last Update:</span>
                      <span>{vehicle.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Accident markers */}
            {accidents.map(accident => (
              <TooltipProvider key={accident.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleMarker
                      center={accident.location}
                      radius={15}
                      pathOptions={{
                        color: '#FF3B30',
                        fillColor: '#FF3B30',
                        fillOpacity: 0.2,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">Accident: {accident.id}</p>
                      <p>Severity: {accident.severity}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            
            {/* Accident markers */}
            {accidents.map(accident => (
              <Marker
                key={accident.id}
                position={accident.location}
                icon={accidentIcon}
              >
                <Popup>
                  <div className="font-sans p-1">
                    <h3 className="font-medium text-base">Accident {accident.id}</h3>
                    <div className="grid grid-cols-2 gap-x-4 text-sm mt-1">
                      <span className="text-gray-500">Severity:</span>
                      <span className="text-red-500 font-medium">
                        {accident.severity.charAt(0).toUpperCase() + accident.severity.slice(1)}
                      </span>
                      
                      <span className="text-gray-500">Time:</span>
                      <span>{accident.timestamp.toLocaleTimeString()}</span>
                      
                      <span className="text-gray-500">Vehicles:</span>
                      <span>{accident.involvedVehicles.join(', ')}</span>
                    </div>
                    
                    {accident.nearbyFacilities && (
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">Nearby Facilities:</h4>
                        <ul className="text-xs mt-1 space-y-1">
                          {accident.nearbyFacilities.hospital && (
                            <li>🏥 {accident.nearbyFacilities.hospital}</li>
                          )}
                          {accident.nearbyFacilities.policeStation && (
                            <li>👮 {accident.nearbyFacilities.policeStation}</li>
                          )}
                          {accident.nearbyFacilities.fireBrigade && (
                            <li>🚒 {accident.nearbyFacilities.fireBrigade}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapVisualization;
