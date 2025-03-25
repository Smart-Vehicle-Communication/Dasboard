"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ArrowLeft, FileText, MapPin, Calendar, Car } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateMockAccidents } from "@/lib/accident-data"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const AccidentMap = dynamic(() => import("@/components/accident-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md"></div>,
})

export default function AccidentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get("vehicleId") || ""
  const [accidents, setAccidents] = useState<any[]>([])
  const [currentVehicle, setCurrentVehicle] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("map")
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

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

      // Generate mock accidents
      const mockAccidents = generateMockAccidents(current.position)

      // Add some historical accidents
      for (let i = 0; i < 8; i++) {
        const historicalAccident = {
          id: `ACC${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          position: {
            lat: current.position.lat + (Math.random() - 0.5) * 0.05,
            lng: current.position.lng + (Math.random() - 0.5) * 0.05,
          },
          type: ["Collision", "Rollover", "Side-swipe", "Rear-end", "Pedestrian"][Math.floor(Math.random() * 5)],
          severity: ["Minor", "Moderate", "Severe"][Math.floor(Math.random() * 3)],
          time: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleString(),
          vehiclesInvolved: Math.floor(Math.random() * 3) + 1,
          description: "Historical accident record.",
          status: "Cleared",
        }
        mockAccidents.push(historicalAccident)
      }

      setAccidents(mockAccidents)
    }
  }, [vehicleId, router])

  const filteredAccidents = accidents.filter((accident) => {
    if (filterType !== "all" && accident.type !== filterType) return false
    if (filterSeverity !== "all" && accident.severity !== filterSeverity) return false
    if (filterStatus !== "all" && accident.status !== filterStatus) return false
    return true
  })

  const handleViewAccidentDetails = (accidentId: string) => {
    router.push(`/accidents/${accidentId}?vehicleId=${vehicleId}`)
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
                <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
                Accident Reports
              </h1>
              <p className="text-muted-foreground">View and manage accident reports in your vicinity</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-2">
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle>Filter Accidents</CardTitle>
                <CardDescription>Refine accident reports by type, severity, and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-type">Accident Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger id="filter-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Collision">Collision</SelectItem>
                        <SelectItem value="Rollover">Rollover</SelectItem>
                        <SelectItem value="Side-swipe">Side-swipe</SelectItem>
                        <SelectItem value="Rear-end">Rear-end</SelectItem>
                        <SelectItem value="Pedestrian">Pedestrian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-severity">Severity</Label>
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                      <SelectTrigger id="filter-severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-status">Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger id="filter-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Cleared">Cleared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="map" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Accident Map</CardTitle>
                <CardDescription>Geographical view of accident reports in your area</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px]">
                  <AccidentMap
                    accidents={filteredAccidents}
                    currentVehicle={currentVehicle}
                    onSelectAccident={handleViewAccidentDetails}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Accident Reports</CardTitle>
                <CardDescription>{filteredAccidents.length} accident reports found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAccidents.length > 0 ? (
                    filteredAccidents.map((accident) => (
                      <Card key={accident.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div
                              className={`p-4 md:w-1/4 flex items-center justify-center ${
                                accident.status === "Active" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                              }`}
                            >
                              <div className="text-center">
                                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                                <h3 className="font-bold">{accident.type}</h3>
                                <p className="text-sm">{accident.severity} Severity</p>
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                                    accident.status === "Active"
                                      ? "bg-red-200 text-red-800"
                                      : "bg-green-200 text-green-800"
                                  }`}
                                >
                                  {accident.status}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 md:w-3/4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Reported: {accident.time}</span>
                                  </div>

                                  <div className="flex items-center mb-2">
                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Location: {accident.position.lat.toFixed(4)}, {accident.position.lng.toFixed(4)}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center mb-2">
                                    <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Vehicles involved: {accident.vehiclesInvolved}
                                    </span>
                                  </div>

                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{accident.description}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button size="sm" onClick={() => handleViewAccidentDetails(accident.id)}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No accidents found</h3>
                      <p className="text-muted-foreground">No accident reports match your current filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

