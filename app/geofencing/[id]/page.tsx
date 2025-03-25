"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Shield, Clock, AlertTriangle, Car, Info } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateGeofenceDetails } from "@/lib/geofence-data"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const GeofenceDetailMap = dynamic(() => import("@/components/geofence-detail-map"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-slate-100 animate-pulse rounded-md"></div>,
})

export default function GeofenceDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const geofenceId = params.id as string
  const vehicleId = searchParams.get("vehicleId") || ""
  const [geofence, setGeofence] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    // Generate mock geofence details
    const geofenceDetails = generateGeofenceDetails(geofenceId)
    setGeofence(geofenceDetails)
  }, [geofenceId, vehicleId, router])

  if (!geofence) {
    return <div className="flex min-h-screen items-center justify-center">Loading geofence data...</div>
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
              <Button variant="outline" size="sm" onClick={() => router.push(`/geofencing?vehicleId=${vehicleId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Geofences
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
                <Shield className="mr-2 h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">{geofence.name}</h1>
              </div>
              <div className="flex items-center mt-2">
                <Badge
                  variant={
                    geofence.type === "school"
                      ? "destructive"
                      : geofence.type === "residential"
                        ? "secondary"
                        : "default"
                  }
                >
                  {geofence.type.charAt(0).toUpperCase() + geofence.type.slice(1)} Zone
                </Badge>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{geofence.speedLimit} km/h speed limit</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Geofence Location</CardTitle>
                  <CardDescription>Map view of the geofenced area</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <GeofenceDetailMap geofence={geofence} />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                  <div className="w-full">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Bangalore, Karnataka</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Area: Approximately {Math.floor(Math.random() * 5) + 1} sq. km
                    </p>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Geofence Summary</CardTitle>
                  <CardDescription>Key information about this zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">
                          {geofence.type.charAt(0).toUpperCase() + geofence.type.slice(1)} Zone
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Speed Limit</p>
                        <p className="font-medium">{geofence.speedLimit} km/h</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Active Hours</p>
                        <p className="font-medium">{geofence.activeHours}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{geofence.createdAt}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{geofence.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent events in this geofenced area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-muted-foreground/20 space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const eventTypes = [
                      {
                        icon: <Car className="h-4 w-4" />,
                        bg: "bg-blue-100",
                        text: "text-blue-700",
                        title: "Vehicle Entry",
                        desc: "Vehicle entered the geofenced area",
                      },
                      {
                        icon: <AlertTriangle className="h-4 w-4" />,
                        bg: "bg-amber-100",
                        text: "text-amber-700",
                        title: "Speed Violation",
                        desc: "Vehicle exceeded speed limit",
                      },
                      {
                        icon: <Clock className="h-4 w-4" />,
                        bg: "bg-green-100",
                        text: "text-green-700",
                        title: "Extended Stay",
                        desc: "Vehicle remained in zone for over 30 minutes",
                      },
                      {
                        icon: <Info className="h-4 w-4" />,
                        bg: "bg-purple-100",
                        text: "text-purple-700",
                        title: "Zone Update",
                        desc: "Geofence parameters were updated",
                      },
                    ]

                    const event = eventTypes[index % 4]
                    const timeAgo =
                      index === 0
                        ? "10 minutes ago"
                        : index === 1
                          ? "2 hours ago"
                          : index === 2
                            ? "Yesterday"
                            : "3 days ago"

                    return (
                      <div key={index} className="relative">
                        <div
                          className={`absolute -left-[25px] w-8 h-8 rounded-full ${event.bg} ${event.text} flex items-center justify-center`}
                        >
                          {event.icon}
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{timeAgo}</p>
                          <p className="text-sm mt-1">{event.desc}</p>
                          {index === 1 && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md">
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                                <p className="text-sm text-amber-700">
                                  Speed violation: 45 km/h in a {geofence.speedLimit} km/h zone
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restrictions" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Zone Restrictions</CardTitle>
                <CardDescription>Rules and restrictions for this geofenced area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {geofence.restrictions.map((restriction: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{restriction}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {index === 0
                            ? `Speed enforcement cameras are active in this ${geofence.type} zone.`
                            : index === 1
                              ? "This restriction is enforced by traffic police and automated monitoring systems."
                              : "Violations may result in fines or penalties as per local regulations."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Hours</CardTitle>
                <CardDescription>When restrictions are in effect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Current Schedule</h3>
                    <p>{geofence.activeHours}</p>

                    {geofence.type === "school" && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          Note: Speed restrictions are strictly enforced during school arrival (7:30 AM - 9:00 AM) and
                          dismissal (2:30 PM - 4:00 PM) times.
                        </p>
                      </div>
                    )}

                    {geofence.type === "construction" && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          Note: This is a temporary zone and will be removed once construction is complete (estimated:{" "}
                          {new Date(
                            Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString()}
                          ).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-green-100 rounded-full p-2 mr-3">
                            <Clock className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Enforcement Hours</h3>
                            <p className="text-sm text-muted-foreground">
                              {geofence.type === "school"
                                ? "7:00 AM - 4:00 PM (Mon-Fri)"
                                : geofence.type === "construction"
                                  ? "7:00 AM - 7:00 PM (Mon-Sat)"
                                  : "24/7"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <AlertTriangle className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Penalty Information</h3>
                            <p className="text-sm text-muted-foreground">
                              Fines for violations range from ₹500 to ₹2000 depending on severity
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Compliance Statistics</CardTitle>
                <CardDescription>Speed limit compliance data for this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">Overall Compliance Rate</p>
                        <div className="flex items-center">
                          <span className="text-3xl font-bold">{geofence.complianceRate}%</span>
                          <span className="ml-2 text-sm text-green-600">
                            {Math.random() > 0.5 ? "↑" : "↓"} {Math.floor(Math.random() * 5) + 1}% from last month
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">Today</p>
                        <p className="text-xl font-bold">{geofence.violations.today}</p>
                        <p className="text-xs">violations</p>
                      </div>

                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">This Week</p>
                        <p className="text-xl font-bold">{geofence.violations.thisWeek}</p>
                        <p className="text-xs">violations</p>
                      </div>

                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <p className="text-xl font-bold">{geofence.violations.thisMonth}</p>
                        <p className="text-xs">violations</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Compliance by Time of Day</h3>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Morning (6AM-12PM): 85% Compliance</span>
                    </div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-amber-500" style={{ width: "75%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Afternoon (12PM-6PM): 75% Compliance</span>
                    </div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-red-500" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Evening (6PM-12AM): 65% Compliance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Violation Breakdown</CardTitle>
                <CardDescription>Analysis of speed limit violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Minor Violations</h3>
                          <p className="text-3xl font-bold text-blue-600">
                            {Math.floor(geofence.violations.thisMonth * 0.6)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">1-10 km/h over limit</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Moderate Violations</h3>
                          <p className="text-3xl font-bold text-amber-600">
                            {Math.floor(geofence.violations.thisMonth * 0.3)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">11-20 km/h over limit</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Severe Violations</h3>
                          <p className="text-3xl font-bold text-red-600">
                            {Math.floor(geofence.violations.thisMonth * 0.1)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">20+ km/h over limit</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Enforcement Notice</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Due to increased violations, additional enforcement measures will be implemented in this zone
                          starting {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

