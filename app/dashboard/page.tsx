"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2, Minimize2, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import dynamic from "next/dynamic"
import VehicleTable from "@/components/vehicle-table"
import MainNav from "@/components/main-nav"
import SosButton from "@/components/sos-button"
import WeatherWidget from "@/components/weather-widget"
import type { Vehicle } from "@/lib/types"
import { generateMockVehicles, updateVehiclePositions } from "@/lib/mock-data"
import { generateMockAccidents } from "@/lib/accident-data"
import { generateMockWeather } from "@/lib/weather-data"
import { generateMockGeofences } from "@/lib/geofence-data"
import { useWebSocket } from "@/hooks/use-websocket"

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
  const [accidents, setAccidents] = useState<any[]>([])
  const [weather, setWeather] = useState<any>(null)
  const [geofences, setGeofences] = useState<any[]>([])
  const [showAccidents, setShowAccidents] = useState(true)
  const [showGeofences, setShowGeofences] = useState(true)
  const [showWeather, setShowWeather] = useState(true)
  const [useMockData, setUseMockData] = useState(true)

  // Initialize WebSocket connection
  const { isConnected, vehicles: wsVehicles, alerts: wsAlerts, error: wsError } = useWebSocket(vehicleId)

  // Initialize data when component mounts or vehicleId changes
  useEffect(() => {
    if (vehicleId) {
      // Generate mock data for the vehicle and its history
      const allVehicles = generateMockVehicles(20, vehicleId)
      const currentVehicle = allVehicles.find((v) => v.id === vehicleId) || null
      setCurrentVehicle(currentVehicle)
      setVehicles(allVehicles)

      // Filter nearby vehicles (within 2km)
      if (currentVehicle) {
        const nearby = allVehicles.filter((v) => {
          if (v.id === vehicleId) return false

          // Calculate distance from current vehicle
          const distance = calculateDistance(
            currentVehicle.position.lat,
            currentVehicle.position.lng,
            v.position.lat,
            v.position.lng,
          )

          v.distanceFromCurrent = distance
          return distance <= 2
        })

        setNearbyVehicles(nearby)

        // Generate mock data with current vehicle's position
        setAccidents(generateMockAccidents(currentVehicle.position))
        setWeather(generateMockWeather(currentVehicle.position))
        setGeofences(generateMockGeofences(currentVehicle.position))
      }
    }
  }, [vehicleId])

  // Handle WebSocket connection errors
  useEffect(() => {
    if (wsError) {
      console.error("WebSocket error:", wsError)
      // Fall back to mock data if WebSocket connection fails
      setUseMockData(true)
    }
  }, [wsError])

  // Define updateNearbyVehicles as a memoized function to prevent recreating it on every render
  const updateNearbyVehicles = useCallback(
    (allVehicles: Vehicle[], current: Vehicle) => {
      // Create a new array instead of modifying the original objects
      const nearby = allVehicles
        .filter((v) => {
          if (v.id === vehicleId) return true

          // Calculate distance from current vehicle
          const distance = calculateDistance(current.position.lat, current.position.lng, v.position.lat, v.position.lng)

          // Return a new object with the distance calculated
          return distance <= 2
        })
        .map((v) => {
          if (v.id === vehicleId) return v

          // Calculate distance for the filtered vehicles
          const distance = calculateDistance(current.position.lat, current.position.lng, v.position.lat, v.position.lng)

          // Create a new object instead of modifying the original
          return {
            ...v,
            distanceFromCurrent: Number.parseFloat(distance.toFixed(2)),
          }
        })

      // Only update state if the nearby vehicles have actually changed
      setNearbyVehicles((prev) => {
        // Check if the arrays are the same
        if (
          prev.length === nearby.length &&
          prev.every((p) => nearby.some((n) => n.id === p.id && n.distanceFromCurrent === p.distanceFromCurrent))
        ) {
          return prev
        }
        return nearby
      })
    },
    [vehicleId],
  )

  // Calculate distance between two points in km using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return Number.parseFloat(distance.toFixed(2))
  }, [])

  const deg2rad = useCallback((deg: number) => {
    return deg * (Math.PI / 180)
  }, [])

  // Use WebSocket data if connected, otherwise use mock data
  useEffect(() => {
    if (isConnected && wsVehicles.length > 0) {
      setUseMockData(false)
      
      // Find the current vehicle from WebSocket data
      const current = wsVehicles.find((v) => v.id === vehicleId) || null
      
      if (current) {
        // Generate mock data for other vehicles
        const mockVehicles = generateMockVehicles(20, vehicleId)
          .filter(v => v.id !== vehicleId) // Exclude the current vehicle
        
        // Combine WebSocket data for current vehicle with mock data for others
        const combinedVehicles = [...mockVehicles, current]
        setVehicles(combinedVehicles)
        setCurrentVehicle(current)
        updateNearbyVehicles(combinedVehicles, current)
      }
    }
  }, [isConnected, wsVehicles, vehicleId, updateNearbyVehicles])

  // Use WebSocket alerts if connected
  useEffect(() => {
    if (isConnected && wsAlerts.length > 0) {
      console.log("Using WebSocket data for alerts:", wsAlerts)
      setAccidents(wsAlerts)
    }
  }, [isConnected, wsAlerts])

  // Generate mock vehicle data if not using WebSocket
  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    let intervalId: NodeJS.Timeout | null = null

    if (useMockData) {
      // Initial setup - only run once
      const allVehicles = generateMockVehicles(50, vehicleId)
      setVehicles(allVehicles)

      // Find the current vehicle
      const current = allVehicles.find((v) => v.id === vehicleId) || null

      if (current) {
        setCurrentVehicle(current)

        // Generate static data that doesn't need to be regenerated on every update
        setAccidents(generateMockAccidents(current.position))
        setWeather(generateMockWeather(current.position))
        setGeofences(generateMockGeofences(current.position))

        // Initial calculation of nearby vehicles
        updateNearbyVehicles(allVehicles, current)
      }

      // Set up interval to update vehicle positions with REDUCED FREQUENCY (5 seconds instead of 1)
      intervalId = setInterval(() => {
        setVehicles((prevVehicles) => {
          const updatedVehicles = updateVehiclePositions(prevVehicles)
          const updatedCurrent = updatedVehicles.find((v) => v.id === vehicleId) || null

          if (updatedCurrent) {
            setCurrentVehicle(updatedCurrent)
            updateNearbyVehicles(updatedVehicles, updatedCurrent)
          }

          return updatedVehicles
        })
      }, 5000) // Update every 5 seconds
    } else if (currentVehicle) {
      // If using WebSocket but we need static data
      setWeather(generateMockWeather(currentVehicle.position))
      setGeofences(generateMockGeofences(currentVehicle.position))
    }

    // Clean up interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [vehicleId, router, useMockData, updateNearbyVehicles])

  // Store position and handle events
  useEffect(() => {
    // Only run this effect if currentVehicle exists and has changed
    if (!currentVehicle) return

    console.log("Current vehicle position updated:", currentVehicle.position)

    // Store the current vehicle position in localStorage for SOS functionality
    localStorage.setItem("currentVehiclePosition", JSON.stringify(currentVehicle.position))

    // Event handlers are defined inside the effect to avoid recreating them on every render
    const handleSosEmergency = (event: CustomEvent) => {
      const newAccident = event.detail
      console.log("SOS emergency event received:", newAccident)
      setAccidents((prevAccidents) => [...prevAccidents, newAccident])
    }

    const handleNewAlert = (event: CustomEvent) => {
      const newAlert = event.detail
      console.log("New alert event received:", newAlert)
      setAccidents((prevAccidents) => [...prevAccidents, newAlert])
    }

    // Add event listeners
    window.addEventListener("sosEmergency", handleSosEmergency as EventListener)
    window.addEventListener("newAlert", handleNewAlert as EventListener)

    // Check localStorage for any accidents created by SOS - only do this once when currentVehicle changes
    const storedAccidents = JSON.parse(localStorage.getItem("accidents") || "[]")
    if (storedAccidents.length > 0) {
      setAccidents((prevAccidents) => {
        // Combine existing accidents with stored ones, avoiding duplicates
        const existingIds = prevAccidents.map((a) => a.id)
        const newOnes = storedAccidents.filter((a: any) => !existingIds.includes(a.id))
        return [...prevAccidents, ...newOnes]
      })
    }

    // Clean up event listeners
    return () => {
      window.removeEventListener("sosEmergency", handleSosEmergency as EventListener)
      window.removeEventListener("newAlert", handleNewAlert as EventListener)
    }
  }, [currentVehicle])

  const handleVehicleIdChange = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard?vehicleId=${vehicleId}`)
  }

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen)
  }

  if (!currentVehicle) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 w-full bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="p-0" onClick={() => router.push("/")}>
                <span className="flex items-center font-bold text-xl">
                  <span className="text-primary">V2V</span>
                  <span className="text-muted-foreground">Connect</span>
                </span>
              </Button>
            </div>

            <MainNav vehicleId={vehicleId} />

            <div className="flex items-center space-x-2">
              <div className="flex items-center mr-4">
                {isConnected ? (
                  <div className="flex items-center text-green-600">
                    <Wifi className="h-4 w-4 mr-1" />
                    <span className="text-xs">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <WifiOff className="h-4 w-4 mr-1" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>
              <form onSubmit={handleVehicleIdChange} className="flex space-x-2">
                <Input
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  placeholder="Vehicle ID"
                  className="w-32 md:w-40"
                />
                <Button type="submit" variant="outline" size="sm">
                  Change
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 flex items-center">
                <SosButton vehicleId={vehicleId} />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-medium">Accident Alerts</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAccidents(!showAccidents)}>
                    {showAccidents ? "Hide" : "Show"}
                  </Button>
                </div>
                <div className="mt-2 text-sm">
                  <p>
                    {accidents.length} accident{accidents.length !== 1 ? "s" : ""} reported nearby
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">{weather && <WeatherWidget weather={weather} />}</CardContent>
            </Card>
          </div>

          <div className={`grid ${isMapFullscreen ? "" : "lg:grid-cols-2"} gap-4`}>
            <Card className={isMapFullscreen ? "col-span-full" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Vehicle Map</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowGeofences(!showGeofences)}>
                      {showGeofences ? "Hide Geofences" : "Show Geofences"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowWeather(!showWeather)}>
                      {showWeather ? "Hide Weather" : "Show Weather"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleMapFullscreen}>
                      {isMapFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMapFullscreen ? "h-[calc(100vh-250px)]" : "h-[400px]"}`}>
                  <VehicleMap
                    vehicles={nearbyVehicles}
                    currentVehicleId={vehicleId}
                    accidents={showAccidents ? accidents : []}
                    geofences={showGeofences ? geofences : []}
                    weather={showWeather ? weather : null}
                  />
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

