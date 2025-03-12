"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Vehicle } from "@/lib/types"

// Component to recenter map on current vehicle
function MapCenterSetter({ position }: { position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])

  return null
}

interface VehicleMapProps {
  vehicles: Vehicle[]
  currentVehicleId: string
}

export default function VehicleMap({ vehicles, currentVehicleId }: VehicleMapProps) {
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

  const currentVehicle = vehicles.find((v) => v.id === currentVehicleId)
  const defaultPosition: [number, number] = currentVehicle
    ? [currentVehicle.position.lat, currentVehicle.position.lng]
    : [0, 0]

  if (!currentVehicle) {
    return <div>Loading map...</div>
  }

  // Function to determine which icon to use
  const getVehicleIcon = (vehicle: Vehicle) => {
    if (vehicle.id === currentVehicleId) {
      return currentVehicleIcon
    }
    return vehicle.speed > 0 ? movingVehicleIcon : stoppedVehicleIcon
  }

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenterSetter position={defaultPosition} />

      {vehicles.map((vehicle) => (
        <Marker key={vehicle.id} position={[vehicle.position.lat, vehicle.position.lng]} icon={getVehicleIcon(vehicle)}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">Vehicle {vehicle.id}</h3>
              <p>Speed: {vehicle.speed} km/h</p>
              {vehicle.id !== currentVehicleId && <p>Distance: {vehicle.distanceFromCurrent} km</p>}
              <p>Status: {vehicle.speed > 0 ? "Moving" : "Stopped"}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

