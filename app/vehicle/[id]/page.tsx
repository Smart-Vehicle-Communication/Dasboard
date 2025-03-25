"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Battery, Gauge, MapPin, Activity, Zap, Clock, AlertTriangle, Car } from "lucide-react"
import type { Vehicle } from "@/lib/types"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateVehicleHistory, generateSafetyData, generateEnergyData } from "@/lib/vehicle-history"
import VehicleSpeedChart from "@/components/vehicle-speed-chart"
import VehicleBatteryGauge from "@/components/vehicle-battery-gauge"
import VehicleProximityChart from "@/components/vehicle-proximity-chart"
import VehicleLocationMap from "@/components/vehicle-location-map"
import VehicleEnergyChart from "@/components/vehicle-energy-chart"
import VehicleSafetyChart from "@/components/vehicle-safety-chart"
import MainNav from "@/components/main-nav"

export default function VehicleDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [nearbyVehicles, setNearbyVehicles] = useState<Vehicle[]>([])
  const [speedHistory, setSpeedHistory] = useState<{ time: string; speed: number }[]>([])
  const [proximityData, setProximityData] = useState<{ id: string; distance: number }[]>([])
  const [energyData, setEnergyData] = useState<{ time: string; consumption: number; regeneration: number }[]>([])
  const [safetyData, setSafetyData] = useState<{ category: string; score: number }[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Generate mock data for the vehicle and its history
    const allVehicles = generateMockVehicles(20, params.id)
    const currentVehicle = allVehicles.find((v) => v.id === params.id) || null

    if (currentVehicle) {
      setVehicle(currentVehicle)

      // Filter nearby vehicles (within 2km)
      const nearby = allVehicles.filter((v) => {
        if (v.id === params.id) return false

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

      // Generate history data
      const history = generateVehicleHistory(24) // Last 24 hours
      setSpeedHistory(history.speedData)

      // Generate proximity data for nearby vehicles
      const proximity = nearby
        .map((v) => ({
          id: v.id,
          distance: v.distanceFromCurrent || 0,
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5) // Top 5 closest

      setProximityData(proximity)

      // Generate energy consumption data
      setEnergyData(generateEnergyData(12)) // Last 12 hours

      // Generate safety metrics
      setSafetyData(generateSafetyData())
    }
  }, [params.id])

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

  const goBack = () => {
    router.back()
  }

  if (!vehicle) {
    return <div className="flex min-h-screen items-center justify-center">Loading vehicle data...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-12">
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

            <MainNav vehicleId={params.id} />

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle {params.id}</h1>
                <p className="text-muted-foreground">Autonomous vehicle telemetry and performance metrics</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Speed</p>
                  <h3 className="text-2xl font-bold">{vehicle.speed} km/h</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Battery className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Battery Level</p>
                  <h3 className="text-2xl font-bold">{vehicle.battery}%</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <h3 className="text-2xl font-bold">{vehicle.speed > 0 ? "Moving" : "Stopped"}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="mr-2 h-5 w-5 text-primary" /> Current Location
                </CardTitle>
                <CardDescription>Real-time position and nearby vehicles</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px]">
                  <VehicleLocationMap vehicle={vehicle} nearbyVehicles={nearbyVehicles} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Gauge className="mr-2 h-5 w-5 text-primary" /> Speed History
                </CardTitle>
                <CardDescription>Last 24 hours of speed data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <VehicleSpeedChart data={speedHistory} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Battery className="mr-2 h-5 w-5 text-primary" /> Battery Status
                </CardTitle>
                <CardDescription>Current charge level and estimated range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col items-center justify-center">
                  <VehicleBatteryGauge value={vehicle.battery} />
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">Estimated Range</p>
                    <p className="text-xl font-medium">{Math.round(vehicle.battery * 3.5)} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Activity className="mr-2 h-5 w-5 text-primary" /> Proximity to Nearby Vehicles
                </CardTitle>
                <CardDescription>Distance to the 5 closest vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <VehicleProximityChart data={proximityData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-0 space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Energy Consumption
              </CardTitle>
              <CardDescription>Power usage and regeneration over the last 12 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <VehicleEnergyChart data={energyData} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-primary" /> Operational Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Average Speed</p>
                      <p className="text-sm font-medium">
                        {Math.round(speedHistory.reduce((acc, curr) => acc + curr.speed, 0) / speedHistory.length)} km/h
                      </p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.min(100, speedHistory.reduce((acc, curr) => acc + curr.speed, 0) / speedHistory.length / 1.2)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Energy Efficiency</p>
                      <p className="text-sm font-medium">87%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "87%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">System Responsiveness</p>
                      <p className="text-sm font-medium">95%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Battery Health</p>
                      <p className="text-sm font-medium">92%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-primary" /> System Status
                </CardTitle>
                <CardDescription>Current system health and diagnostics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                      <p className="font-medium">Navigation System</p>
                    </div>
                    <p className="text-sm text-green-600">Optimal</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                      <p className="font-medium">Sensor Array</p>
                    </div>
                    <p className="text-sm text-green-600">Optimal</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-3"></div>
                      <p className="font-medium">Battery System</p>
                    </div>
                    <p className="text-sm text-yellow-600">Good</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                      <p className="font-medium">Communication</p>
                    </div>
                    <p className="text-sm text-green-600">Optimal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="mr-2 h-5 w-5 text-primary" /> Safety Metrics
                </CardTitle>
                <CardDescription>Key safety performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <VehicleSafetyChart data={safetyData} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="mr-2 h-5 w-5 text-primary" /> Incident Log
                </CardTitle>
                <CardDescription>Recent safety events and interventions</CardDescription>
              </CardHeader>
              <CardContent className="p-0 max-h-[350px] overflow-auto">
                <div className="divide-y">
                  <div className="p-4 flex items-start">
                    <div className="bg-yellow-100 text-yellow-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Sudden Braking Event</p>
                      <p className="text-sm text-muted-foreground">Today, 10:23 AM</p>
                      <p className="text-sm mt-1">Vehicle ahead stopped suddenly. Automatic braking system engaged.</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Lane Departure Correction</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 3:45 PM</p>
                      <p className="text-sm mt-1">Minor lane drift detected. Automatic correction applied.</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Proximity Warning</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 1:12 PM</p>
                      <p className="text-sm mt-1">
                        Vehicle approaching from rear at high speed. Defensive positioning engaged.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex items-start">
                    <div className="bg-red-100 text-red-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Weather Adaptation</p>
                      <p className="text-sm text-muted-foreground">2 days ago, 9:30 AM</p>
                      <p className="text-sm mt-1">
                        Heavy rain detected. Reduced speed and increased following distance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 h-5 w-5 text-primary" /> Safety Map
              </CardTitle>
              <CardDescription>Recent safety events mapped by location</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[350px]">
                <VehicleLocationMap vehicle={vehicle} nearbyVehicles={nearbyVehicles} showSafetyOverlay={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>
  )
}

