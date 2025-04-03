"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, Car } from "lucide-react"

interface AccidentMapProps {
  accidents: any[]
  currentVehicle: any
  onSelectAccident: (accidentId: string) => void
}

export default function AccidentMap({ accidents, currentVehicle, onSelectAccident }: AccidentMapProps) {
  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Create custom car icon for current vehicle
  const currentVehicleIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #f5222d; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
             <circle cx="6.5" cy="16.5" r="2.5"></circle>
             <circle cx="16.5" cy="16.5" r="2.5"></circle>
           </svg>
         </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })

  // Update the accident icon to use a danger symbol
  const activeAccidentIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #ff4d4f; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
             <line x1="12" y1="9" x2="12" y2="13"></line>
             <line x1="12" y1="17" x2="12.01" y2="17"></line>
           </svg>
         </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })

  const clearedAccidentIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #52c41a; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
             <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>
         </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })

  const defaultPosition: [number, number] = [currentVehicle.position.lat, currentVehicle.position.lng]

  return (
    <MapContainer center={defaultPosition} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Current vehicle position */}
      <Marker position={defaultPosition} icon={currentVehicleIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold">Vehicle {currentVehicle.id}</h3>
            <p>Current Position</p>
          </div>
        </Popup>
      </Marker>

      {/* Safety radius - 5km range */}
      <Circle
        center={defaultPosition}
        radius={5000}
        pathOptions={{
          fillColor: "rgba(0, 0, 255, 0.05)",
          fillOpacity: 0.2,
          color: "rgba(0, 0, 255, 0.3)",
          weight: 1,
        }}
      />

      {/* Accident markers */}
      {accidents.map((accident, index) => (
        <Marker
          key={`accident-${index}`}
          position={[accident.position.lat, accident.position.lng]}
          icon={accident.status === "Active" ? activeAccidentIcon : clearedAccidentIcon}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-bold">{accident.type} Accident</h3>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{accident.time}</span>
                </div>

                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Vehicles: {accident.vehiclesInvolved}</span>
                </div>

                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Severity: {accident.severity}</span>
                </div>
              </div>

              <Button size="sm" className="w-full" onClick={() => onSelectAccident(accident.id)}>
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

