"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polygon, Tooltip, Marker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Shield } from "lucide-react"

interface GeofenceDetailMapProps {
  geofence: any
}

export default function GeofenceDetailMap({ geofence }: GeofenceDetailMapProps) {
  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Get color based on geofence type
  const getGeofenceColor = (type: string) => {
    switch (type) {
      case "school":
        return { fill: "rgba(255, 0, 0, 0.2)", border: "red" }
      case "residential":
        return { fill: "rgba(0, 0, 255, 0.2)", border: "blue" }
      case "highway":
        return { fill: "rgba(0, 255, 0, 0.2)", border: "green" }
      case "hospital":
        return { fill: "rgba(255, 0, 255, 0.2)", border: "purple" }
      case "construction":
        return { fill: "rgba(255, 165, 0, 0.2)", border: "orange" }
      default:
        return { fill: "rgba(0, 0, 255, 0.2)", border: "blue" }
    }
  }

  const colors = getGeofenceColor(geofence.type)

  // Calculate center of polygon
  const calculateCenter = (coordinates: number[][]) => {
    const latSum = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const lngSum = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    return [latSum / coordinates.length, lngSum / coordinates.length]
  }

  const center = calculateCenter(geofence.coordinates)

  return (
    <MapContainer center={center as [number, number]} zoom={15} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Geofence polygon */}
      <Polygon
        positions={geofence.coordinates}
        pathOptions={{
          fillColor: colors.fill,
          weight: 2,
          opacity: 0.7,
          color: colors.border,
        }}
      >
        <Tooltip direction="center" permanent>
          <div className="text-xs font-medium">
            {geofence.name} ({geofence.speedLimit} km/h)
          </div>
        </Tooltip>
      </Polygon>

      {/* Center marker */}
      <Marker position={center as [number, number]}>
        <Tooltip>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{geofence.name}</span>
          </div>
        </Tooltip>
      </Marker>
    </MapContainer>
  )
}

