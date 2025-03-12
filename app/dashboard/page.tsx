"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2, Minimize2 } from "lucide-react"
import dynamic from "next/dynamic"
import VehicleTable from "@/components/vehicle-table"
import type { Vehicle } from "@/lib/types"
import { generateMockVehicles, updateVehiclePositions } from "@/lib/mock-data"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const VehicleMap = dynamic(() => import("@/components/vehicle-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md"></div>,
})

export default function Dashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [vehicleId, setVehicleId] = useState(searchParams.get("vehicleId") || "")
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([])
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null)

  // Generate mock vehicle data
  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    const allVehicles = generateMockVehicles(50, vehicleId)
    setVehicles(allVehicles)

    // Find the current vehicle
    const current = allVehicles.find((v) => v.id === vehicleId) || null
    setCurrentVehicle(current)

    // Filter vehicles within 2km range
    if (current) {
      updateNearbyVehicles(allVehicles, current)
    }

    // Set up interval to update vehicle positions
    const intervalId = setInterval(() => {
      setVehicles((prevVehicles) => {
        const updatedVehicles = updateVehiclePositions(prevVehicles)
        const updatedCurrent = updatedVehicles.find((v) => v.id === vehicleId) || null

        if (updatedCurrent) {
          setCurrentVehicle(updatedCurrent)
          updateNearbyVehicles(updatedVehicles, updatedCurrent)
        }

        return updatedVehicles
      })
    }, 1000) // Update every second

    return () => clearInterval(intervalId)
  }, [vehicleId, router])

  const updateNearbyVehicles = (allVehicles: Vehicle[], current: Vehicle) => {
    const nearby = allVehicles.filter((v) => {
      if (v.id === vehicleId) return true

      // Calculate distance from current vehicle
      const distance = calculateDistance(current.position.lat, current.position.lng, v.position.lat, v.position.lng)

      v.distanceFromCurrent = distance
      return distance <= 2
    })

    setNearbyVehicles(nearby)
  }

  const handleVehicleIdChange = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard?vehicleId=${vehicleId}`)
  }

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen)
  }

  // Calculate distance between two points in km using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return Number.parseFloat(distance.toFixed(2))
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  if (!currentVehicle) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Autonomous Vehicle Network</CardTitle>
                <form onSubmit={handleVehicleIdChange} className="flex space-x-2">
                  <Input
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    placeholder="Vehicle ID"
                    className="w-40"
                  />
                  <Button type="submit" variant="outline">
                    Change
                  </Button>
                </form>
              </div>
            </CardHeader>
          </Card>

          <div className={`grid ${isMapFullscreen ? "" : "lg:grid-cols-2"} gap-4`}>
            <Card className={isMapFullscreen ? "col-span-full" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Vehicle Map</CardTitle>
                  <Button variant="ghost" size="icon" onClick={toggleMapFullscreen}>
                    {isMapFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMapFullscreen ? "h-[calc(100vh-250px)]" : "h-[400px]"}`}>
                  <VehicleMap vehicles={nearbyVehicles} currentVehicleId={vehicleId} />
                </div>
              </CardContent>
            </Card>

            {!isMapFullscreen && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Nearby Vehicles (2km Range)</CardTitle>
                </CardHeader>
                <CardContent>
                  <VehicleTable vehicles={nearbyVehicles} currentVehicleId={vehicleId} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

