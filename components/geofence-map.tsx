"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface GeofenceMapProps {
  geofences: any[]
  currentVehicle: any
  onSelectGeofence: (geofenceId: string) => void
}

export default function GeofenceMap({ geofences, currentVehicle, onSelectGeofence }: GeofenceMapProps) {
  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Create custom icons
  const currentVehicleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const defaultPosition: [number, number] = [currentVehicle.position.lat, currentVehicle.position.lng]

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
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
            <p>Speed: {currentVehicle.speed} km/h</p>
          </div>
        </Popup>
      </Marker>

      {/* Geofenced areas */}
      {geofences.map((geofence, index) => (
        <Polygon
          key={`geofence-${index}`}
          positions={geofence.coordinates}
          pathOptions={{
            fillColor:
              geofence.type === "school"
                ? "rgba(255, 0, 0, 0.2)"
                : geofence.type === "residential"
                  ? "rgba(0, 0, 255, 0.2)"
                  : "rgba(0, 255, 0, 0.2)",
            weight: 2,
            opacity: 0.7,
            color: geofence.type === "school" ? "red" : geofence.type === "residential" ? "blue" : "green",
          }}
        >
          <Tooltip direction="center" permanent>
            <div className="text-xs font-medium">
              {geofence.name} ({geofence.speedLimit} km/h)
            </div>
          </Tooltip>
          <Popup>
            <div className="p-2">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-bold">{geofence.name}</h3>
              </div>
              <p className="text-sm mb-2">Speed limit: {geofence.speedLimit} km/h</p>
              <p className="text-sm mb-3">Type: {geofence.type.charAt(0).toUpperCase() + geofence.type.slice(1)}</p>
              <Button size="sm" className="w-full" onClick={() => onSelectGeofence(geofence.id)}>
                View Details
              </Button>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  )
}

