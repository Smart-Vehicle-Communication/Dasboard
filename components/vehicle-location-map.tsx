"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Vehicle } from "@/lib/types"

interface VehicleLocationMapProps {
  vehicle: Vehicle
  nearbyVehicles: Vehicle[]
  showSafetyOverlay?: boolean
}

export default function VehicleLocationMap({
  vehicle,
  nearbyVehicles,
  showSafetyOverlay = false,
}: VehicleLocationMapProps) {
  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    // This is needed to fix the marker icon issue with Leaflet in Next.js
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  // Create custom icons for vehicles
  const movingVehicleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const stoppedVehicleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const currentVehicleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const defaultPosition: [number, number] = [vehicle.position.lat, vehicle.position.lng]

  // Function to determine which icon to use
  const getVehicleIcon = (v: Vehicle) => {
    if (v.id === vehicle.id) {
      return currentVehicleIcon
    }
    return v.speed > 0 ? movingVehicleIcon : stoppedVehicleIcon
  }

  // Generate mock safety incident locations
  const safetyIncidents = showSafetyOverlay
    ? [
        {
          position: [vehicle.position.lat + 0.003, vehicle.position.lng - 0.002],
          type: "Sudden Braking",
          severity: "medium",
        },
        {
          position: [vehicle.position.lat - 0.002, vehicle.position.lng + 0.004],
          type: "Lane Departure",
          severity: "low",
        },
        {
          position: [vehicle.position.lat + 0.005, vehicle.position.lng + 0.003],
          type: "Weather Adaptation",
          severity: "high",
        },
      ]
    : []

  return (
    <MapContainer center={defaultPosition} zoom={14} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Safety radius - 2km range */}
      <Circle
        center={defaultPosition}
        radius={2000}
        pathOptions={{
          fillColor: showSafetyOverlay ? "rgba(255, 0, 0, 0.05)" : "rgba(0, 0, 255, 0.05)",
          fillOpacity: 0.2,
          color: showSafetyOverlay ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 0, 255, 0.3)",
          weight: 1,
        }}
      />

      {/* Current vehicle */}
      <Marker position={[vehicle.position.lat, vehicle.position.lng]} icon={currentVehicleIcon}>
        <Popup>
          <div className="p-1">
            <h3 className="font-bold">Vehicle {vehicle.id}</h3>
            <p>Speed: {vehicle.speed} km/h</p>
            <p>Battery: {vehicle.battery}%</p>
          </div>
        </Popup>
      </Marker>

      {/* Nearby vehicles */}
      {nearbyVehicles.map((v) => (
        <Marker key={v.id} position={[v.position.lat, v.position.lng]} icon={getVehicleIcon(v)}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">Vehicle {v.id}</h3>
              <p>Speed: {v.speed} km/h</p>
              <p>Distance: {v.distanceFromCurrent} km</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Safety incidents */}
      {showSafetyOverlay &&
        safetyIncidents.map((incident, index) => (
          <Circle
            key={index}
            center={incident.position as [number, number]}
            radius={100}
            pathOptions={{
              fillColor: incident.severity === "high" ? "red" : incident.severity === "medium" ? "orange" : "yellow",
              fillOpacity: 0.6,
              color: "white",
              weight: 1,
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold">{incident.type}</h3>
                <p>Severity: {incident.severity}</p>
              </div>
            </Popup>
          </Circle>
        ))}
    </MapContainer>
  )
}

