"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertTriangle, MapPin, Car, Users, FileText, Ambulance, ShieldAlert } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateAccidentReport } from "@/lib/accident-data"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const AccidentDetailMap = dynamic(() => import("@/components/accident-detail-map"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-slate-100 animate-pulse rounded-md"></div>,
})

export default function AccidentDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const accidentId = params.id as string
  const vehicleId = searchParams.get("vehicleId") || ""
  const [accident, setAccident] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    // Generate mock accident report
    const accidentReport = generateAccidentReport(accidentId)
    setAccident(accidentReport)
  }, [accidentId, vehicleId, router])

  if (!accident) {
    return <div className="flex min-h-screen items-center justify-center">Loading accident data...</div>
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
              <Button variant="outline" size="sm" onClick={() => router.push(`/accidents?vehicleId=${vehicleId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Accidents
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-amber-500" />
                <h1 className="text-3xl font-bold">Accident Report: {accident.id}</h1>
              </div>
              <div className="flex items-center mt-2">
                <Badge variant={accident.status === "Active" ? "destructive" : "outline"}>{accident.status}</Badge>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {accident.date} at {accident.time}
                </span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Accident Location</CardTitle>
                  <CardDescription>Map view of the accident site</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <AccidentDetailMap accident={accident} />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                  <div className="w-full">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">{accident.location.address}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Near {accident.location.intersection}</p>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Accident Summary</CardTitle>
                  <CardDescription>Key information about the incident</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{accident.type}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">
                          {accident.date}, {accident.time}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Vehicles Involved</p>
                        <p className="font-medium">{accident.vehicles.length}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Injuries</p>
                        <p className="font-medium">
                          {accident.injuries.fatal > 0 ? `${accident.injuries.fatal} Fatal, ` : ""}
                          {accident.injuries.severe} Severe, {accident.injuries.minor} Minor
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{accident.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Vehicles Involved</CardTitle>
                <CardDescription>Details of vehicles in the accident</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accident.vehicles.map((vehicle: any, index: number) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Vehicle {vehicle.id}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                Damage: <span className="font-medium">{vehicle.damage}</span>
                              </p>
                              <p className="text-sm">
                                Occupants: <span className="font-medium">{vehicle.occupants}</span>
                              </p>
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

          <TabsContent value="details" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Environmental Conditions</CardTitle>
                  <CardDescription>Conditions at the time of the accident</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Weather</p>
                        <p className="font-medium">{accident.conditions.weather}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Road Condition</p>
                        <p className="font-medium">{accident.conditions.road}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Visibility</p>
                        <p className="font-medium">{accident.conditions.visibility}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Traffic Density</p>
                        <p className="font-medium">{accident.conditions.trafficDensity}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Injury Report</CardTitle>
                  <CardDescription>Summary of injuries from the accident</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-red-600 mb-1">Fatal</p>
                        <p className="text-2xl font-bold text-red-700">{accident.injuries.fatal}</p>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-amber-600 mb-1">Severe</p>
                        <p className="text-2xl font-bold text-amber-700">{accident.injuries.severe}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-blue-600 mb-1">Minor</p>
                        <p className="text-2xl font-bold text-blue-700">{accident.injuries.minor}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-1">Total Occupants</p>
                      <p className="font-medium">
                        {accident.vehicles.reduce((total: number, vehicle: any) => total + vehicle.occupants, 0)} people
                        in {accident.vehicles.length} vehicles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Accident Photos</CardTitle>
                <CardDescription>Images from the accident scene</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {accident.photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Accident photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Emergency Response</CardTitle>
                <CardDescription>Details of emergency services response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <ShieldAlert className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Police</h3>
                          <p className="text-sm text-muted-foreground">
                            {accident.emergencyResponse.police ? "Responded" : "Not dispatched"}
                          </p>
                          {accident.emergencyResponse.police && <p className="text-sm mt-1">First on scene</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-red-100 rounded-full p-2 mr-3">
                          <Ambulance className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Ambulance</h3>
                          <p className="text-sm text-muted-foreground">
                            {accident.emergencyResponse.ambulance ? "Responded" : "Not dispatched"}
                          </p>
                          {accident.emergencyResponse.ambulance && (
                            <p className="text-sm mt-1">Medical assistance provided</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-amber-100 rounded-full p-2 mr-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Fire Service</h3>
                          <p className="text-sm text-muted-foreground">
                            {accident.emergencyResponse.fireService ? "Responded" : "Not dispatched"}
                          </p>
                          {accident.emergencyResponse.fireService && <p className="text-sm mt-1">Hazard management</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Response Timeline</h3>
                  <div className="relative pl-6 border-l border-muted-foreground/20 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-red-100 border-2 border-red-500"></div>
                      <p className="text-sm font-medium">Accident Reported</p>
                      <p className="text-xs text-muted-foreground">{accident.time}</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                      <p className="text-sm font-medium">First Responders Dispatched</p>
                      <p className="text-xs text-muted-foreground">{accident.time}</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-100 border-2 border-green-500"></div>
                      <p className="text-sm font-medium">Emergency Services Arrived</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          new Date(accident.time).getTime() + accident.emergencyResponse.responseTime * 60000,
                        ).toLocaleTimeString()}
                        ({accident.emergencyResponse.responseTime} min response time)
                      </p>
                    </div>

                    {accident.status === "Cleared" && (
                      <div className="relative">
                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-500"></div>
                        <p className="text-sm font-medium">Scene Cleared</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            new Date(accident.time).getTime() + (accident.emergencyResponse.responseTime + 45) * 60000,
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Report Actions</CardTitle>
                <CardDescription>Available actions for this accident report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-auto py-4 flex flex-col items-center">
                    <FileText className="h-5 w-5 mb-2" />
                    <span>Download Report</span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                    <MapPin className="h-5 w-5 mb-2" />
                    <span>Navigate to Scene</span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                    <AlertTriangle className="h-5 w-5 mb-2" />
                    <span>Report Update</span>
                  </Button>

                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                    <Users className="h-5 w-5 mb-2" />
                    <span>Contact Responders</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

