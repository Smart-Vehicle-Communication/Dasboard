"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Vehicle } from "@/lib/types"
import { AlertTriangle, CloudRain, CloudSun, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

// Component to recenter map on current vehicle
function MapCenterSetter({ position }: { position: [number, number] }) {
  const map = useMap()
  const lastPositionRef = useRef<[number, number]>(position)

  useEffect(() => {
    // Only update the map view if the position has changed significantly
    const [lat1, lng1] = lastPositionRef.current
    const [lat2, lng2] = position

    // Calculate distance between points (simple approximation)
    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2))

    // If distance is significant, update the map view
    if (distance > 0.0001) {
      // Threshold for movement
      map.setView(position, map.getZoom())
      lastPositionRef.current = position
      console.log("Map center updated to:", position)
    }
  }, [position, map])

  return null
}

interface VehicleMapProps {
  vehicles: Vehicle[]
  currentVehicleId: string
  accidents?: any[]
  geofences?: any[]
  weather?: any
}

export default function VehicleMap({
  vehicles,
  currentVehicleId,
  accidents = [],
  geofences = [],
  weather = null,
}: VehicleMapProps) {
  const router = useRouter()
  const mapRef = useRef<L.Map | null>(null)

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

  // Create custom car icons for vehicles
  const movingVehicleIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #1890ff; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
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

  const stoppedVehicleIcon = new L.DivIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #d9d9d9; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
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
  const accidentIcon = new L.DivIcon({
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

  // Replace the weather icon with different icons based on condition
  const getWeatherIcon = (condition: string) => {
    if (!weather) return null

    switch (condition) {
      case "Sunny":
        return new L.DivIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #faad14; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })
      case "Rainy":
        return new L.DivIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #1890ff; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="16" y1="13" x2="16" y2="21"></line>
                    <line x1="8" y1="13" x2="8" y2="21"></line>
                    <line x1="12" y1="15" x2="12" y2="23"></line>
                    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })
      case "Windy":
        return new L.DivIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #52c41a; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })
      case "Partly Cloudy":
        return new L.DivIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #722ed1; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })
      default:
        return new L.DivIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #d9d9d9; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })
    }
  }

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

  // Update the vehicle click handler to show a popup instead of navigating
  const handleVehicleClick = (vehicleId: string) => {
    // Instead of navigating to a vehicle details page, we'll just show details in the popup
    console.log(`Vehicle ${vehicleId} clicked`)
  }

  // Log vehicle positions for debugging
  console.log("Current vehicle position:", currentVehicle.position)
  console.log(
    "All vehicle positions:",
    vehicles.map((v) => ({ id: v.id, position: v.position })),
  )

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenterSetter position={defaultPosition} />

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
        </Polygon>
      ))}

      {/* Safety radius - 2km range */}
      <Circle
        center={defaultPosition}
        radius={2000}
        pathOptions={{
          fillColor: "rgba(0, 0, 255, 0.05)",
          fillOpacity: 0.2,
          color: "rgba(0, 0, 255, 0.3)",
          weight: 1,
        }}
      />

      {/* Weather indicator */}
      {weather && (
        <Marker
          position={[currentVehicle.position.lat + 0.01, currentVehicle.position.lng + 0.01]}
          icon={getWeatherIcon(weather.condition)}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center mb-2">
                {weather.condition === "Sunny" ? (
                  <CloudSun className="h-5 w-5 text-yellow-500 mr-2" />
                ) : weather.condition === "Rainy" ? (
                  <CloudRain className="h-5 w-5 text-blue-500 mr-2" />
                ) : (
                  <Wind className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <span className="ml-2 font-medium">{weather.condition}</span>
              </div>
              <p>Temperature: {weather.temperature}°C</p>
              <p>Wind: {weather.wind} km/h</p>
              <p>Visibility: {weather.visibility} km</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Accident markers */}
      {accidents.map((accident, index) => (
        <Marker key={`accident-${index}`} position={[accident.position.lat, accident.position.lng]} icon={accidentIcon}>
          <Popup>
            <div className="p-2">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-bold">Accident Report</h3>
              </div>
              <p className="text-sm mb-1">Type: {accident.type}</p>
              <p className="text-sm mb-1">Severity: {accident.severity}</p>
              <p className="text-sm mb-1">Time: {accident.time}</p>
              <p className="text-sm mb-1">Vehicles involved: {accident.vehiclesInvolved}</p>
              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => router.push(`/accidents/${accident.id}?vehicleId=${currentVehicleId}`)}
              >
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Vehicle markers */}
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.position.lat, vehicle.position.lng]}
          icon={getVehicleIcon(vehicle)}
          eventHandlers={{
            click: () => handleVehicleClick(vehicle.id),
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">Vehicle {vehicle.id}</h3>
              <p>Speed: {vehicle.speed.toFixed(2)} km/h</p>
              {vehicle.id !== currentVehicleId && <p>Distance: {vehicle.distanceFromCurrent?.toFixed(2)} km</p>}
              <p>Status: {vehicle.speed > 0 ? "Moving" : "Stopped"}</p>
              <p>Battery: {vehicle.battery}%</p>
              <p>Position: {vehicle.position.lat.toFixed(6)}, {vehicle.position.lng.toFixed(6)}</p>
              {vehicle.lastUpdated && <p>Last updated: {new Date(vehicle.lastUpdated).toLocaleTimeString()}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

