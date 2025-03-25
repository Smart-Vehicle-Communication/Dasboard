"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { AlertTriangle } from "lucide-react"

interface AccidentDetailMapProps {
  accident: any
}

export default function AccidentDetailMap({ accident }: AccidentDetailMapProps) {
  // Fix Leaflet marker icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

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

  const defaultPosition: [number, number] = [accident.location.coordinates.lat, accident.location.coordinates.lng]

  return (
    <MapContainer center={defaultPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Accident marker */}
      <Marker position={defaultPosition} icon={accidentIcon}>
        <Popup>
          <div className="p-2">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-bold">{accident.type} Accident</h3>
            </div>
            <p className="text-sm">{accident.location.address}</p>
            <p className="text-sm">Near {accident.location.intersection}</p>
          </div>
        </Popup>
      </Marker>

      {/* Impact radius */}
      <Circle
        center={defaultPosition}
        radius={100}
        pathOptions={{
          fillColor: "rgba(255, 0, 0, 0.1)",
          fillOpacity: 0.5,
          color: "rgba(255, 0, 0, 0.5)",
          weight: 1,
        }}
      />
    </MapContainer>
  )
}

