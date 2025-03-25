"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Shield } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateMockGeofences, generateGeofenceDetails } from "@/lib/geofence-data"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const GeofenceMap = dynamic(() => import("@/components/geofence-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md"></div>,
})

export default function GeofencingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get("vehicleId") || ""
  const [currentVehicle, setCurrentVehicle] = useState<any>(null)
  const [geofences, setGeofences] = useState<any[]>([])
  const [geofenceDetails, setGeofenceDetails] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("map")

  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    // Generate mock data
    const allVehicles = generateMockVehicles(10, vehicleId)
    const current = allVehicles.find((v) => v.id === vehicleId)

    if (current) {
      setCurrentVehicle(current)

      // Generate mock geofences
      const mockGeofences = generateMockGeofences(current.position)
      setGeofences(mockGeofences)

      // Generate detailed geofence information
      const details = mockGeofences.map((geofence) => generateGeofenceDetails(geofence.id))
      setGeofenceDetails(details)
    }
  }, [vehicleId, router])

  const handleViewGeofenceDetails = (geofenceId: string) => {
    router.push(`/geofencing/${geofenceId}?vehicleId=${vehicleId}`)
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
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard?vehicleId=${vehicleId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <MapPin className="mr-2 h-6 w-6 text-primary" />
                Geofencing
              </h1>
              <p className="text-muted-foreground">Speed-restricted zones and compliance monitoring</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-2">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="map" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Geofence Map</CardTitle>
                <CardDescription>Speed-restricted zones in your vicinity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px]">
                  <GeofenceMap
                    geofences={geofences}
                    currentVehicle={currentVehicle}
                    onSelectGeofence={handleViewGeofenceDetails}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Geofenced Areas</CardTitle>
                <CardDescription>{geofenceDetails.length} geofenced areas found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geofenceDetails.map((geofence) => (
                    <Card key={geofence.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div
                            className={`p-4 md:w-1/4 flex items-center justify-center ${
                              geofence.type === "school"
                                ? "bg-red-50 text-red-700"
                                : geofence.type === "residential"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            <div className="text-center">
                              <Shield className="h-8 w-8 mx-auto mb-2" />
                              <h3 className="font-bold">{geofence.name}</h3>
                              <p className="text-sm">{geofence.speedLimit} km/h limit</p>
                            </div>
                          </div>

                          <div className="p-4 md:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{geofence.description}</p>
                                <p className="text-sm text-muted-foreground mt-2">Active Hours</p>
                                <p className="font-medium">{geofence.activeHours}</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                                <p className="font-medium">{geofence.complianceRate}%</p>
                                <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${geofence.complianceRate}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Recent Violations</p>
                                <p className="font-medium">
                                  {geofence.violations.today} today, {geofence.violations.thisWeek} this week
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Button size="sm" onClick={() => handleViewGeofenceDetails(geofence.id)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

