"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Shield, AlertTriangle, Car, MapPin, Activity, CheckCircle } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"

export default function SafetyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get("vehicleId") || ""
  const [currentVehicle, setCurrentVehicle] = useState<any>(null)
  const [safetyScore, setSafetyScore] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

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

      // Generate mock safety score
      setSafetyScore({
        overall: Math.floor(Math.random() * 20) + 80, // 80-100
        categories: [
          { name: "Speed Compliance", score: Math.floor(Math.random() * 20) + 80 },
          { name: "Following Distance", score: Math.floor(Math.random() * 20) + 80 },
          { name: "Lane Keeping", score: Math.floor(Math.random() * 20) + 80 },
          { name: "Braking", score: Math.floor(Math.random() * 20) + 80 },
          { name: "Acceleration", score: Math.floor(Math.random() * 20) + 80 },
          { name: "Turn Signals", score: Math.floor(Math.random() * 20) + 80 },
        ],
        history: Array.from({ length: 7 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          score: Math.floor(Math.random() * 20) + 80,
        })),
        incidents: [
          {
            type: "Hard Braking",
            time: "Today, 10:23 AM",
            location: "Main St & Oak Ave",
            severity: "Moderate",
          },
          {
            type: "Speeding",
            time: "Yesterday, 3:45 PM",
            location: "Highway 101",
            severity: "Minor",
          },
          {
            type: "Lane Departure",
            time: "3 days ago, 2:12 PM",
            location: "Elm Street",
            severity: "Minor",
          },
        ],
        recommendations: [
          "Maintain a safe following distance of at least 3 seconds",
          "Reduce speed in residential areas",
          "Use turn signals consistently when changing lanes",
          "Avoid hard acceleration and braking",
        ],
      })
    }
  }, [vehicleId, router])

  if (!currentVehicle || !safetyScore) {
    return <div className="flex min-h-screen items-center justify-center">Loading safety data...</div>
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
                <Shield className="mr-2 h-6 w-6 text-primary" />
                Safety Report
              </h1>
              <p className="text-muted-foreground">
                Safety performance metrics and recommendations for Vehicle {vehicleId}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                      <h2 className="text-lg font-medium text-muted-foreground mb-1">Overall Safety Score</h2>
                      <div className="flex items-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-24 h-24" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={
                                safetyScore.overall >= 90
                                  ? "#10b981"
                                  : safetyScore.overall >= 80
                                    ? "#3b82f6"
                                    : "#f59e0b"
                              }
                              strokeWidth="10"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * safetyScore.overall) / 100}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <span className="absolute text-3xl font-bold">{safetyScore.overall}</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium">
                            {safetyScore.overall >= 90 ? "Excellent" : safetyScore.overall >= 80 ? "Good" : "Fair"}
                          </p>
                          <p className="text-sm text-muted-foreground">Based on your driving patterns</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={safetyScore.history}>
                          <XAxis dataKey="day" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Daily Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Safety Categories</CardTitle>
                  <CardDescription>Breakdown of safety performance by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safetyScore.categories.map((category: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-sm font-medium">{category.score}/100</p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              category.score >= 90
                                ? "bg-green-500"
                                : category.score >= 80
                                  ? "bg-blue-500"
                                  : category.score >= 70
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Incidents</CardTitle>
                  <CardDescription>Safety incidents in the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safetyScore.incidents.map((incident: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`rounded-full p-2 mr-3 ${
                            incident.severity === "Severe"
                              ? "bg-red-100 text-red-700"
                              : incident.severity === "Moderate"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{incident.type}</p>
                          <p className="text-sm text-muted-foreground">{incident.time}</p>
                          <p className="text-sm text-muted-foreground">{incident.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t">
                  <Button variant="link" className="p-0" onClick={() => setActiveTab("incidents")}>
                    View all incidents
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Safety Incidents</CardTitle>
                <CardDescription>Detailed record of safety incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {safetyScore.incidents.map((incident: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div
                            className={`p-4 md:w-1/4 flex items-center justify-center ${
                              incident.severity === "Severe"
                                ? "bg-red-50 text-red-700"
                                : incident.severity === "Moderate"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            <div className="text-center">
                              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                              <h3 className="font-bold">{incident.type}</h3>
                              <p className="text-sm">{incident.severity} Severity</p>
                            </div>
                          </div>

                          <div className="p-4 md:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center mb-2">
                                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Time: {incident.time}</span>
                                </div>

                                <div className="flex items-center mb-2">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Location: {incident.location}</span>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center mb-2">
                                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">Vehicle: {vehicleId}</span>
                                </div>

                                <div className="flex items-center">
                                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Impact on safety score: -
                                    {incident.severity === "Severe" ? 5 : incident.severity === "Moderate" ? 3 : 1}{" "}
                                    points
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-muted/30 rounded-md">
                              <p className="text-sm font-medium mb-1">Recommendation:</p>
                              <p className="text-sm">
                                {incident.type === "Hard Braking"
                                  ? "Maintain a greater following distance and anticipate stops."
                                  : incident.type === "Speeding"
                                    ? "Adhere to posted speed limits, especially in restricted zones."
                                    : "Stay centered in your lane and use turn signals when changing lanes."}
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

          <TabsContent value="recommendations" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Safety Recommendations</CardTitle>
                <CardDescription>Personalized recommendations to improve your safety score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {safetyScore.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-100 text-green-700 rounded-full p-2 mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{recommendation}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {index === 0
                            ? "This can reduce your risk of rear-end collisions by up to 40%."
                            : index === 1
                              ? "Residential areas often have pedestrians and unexpected hazards."
                              : index === 2
                                ? "Proper signaling reduces the risk of side-swipe accidents."
                                : "Smooth driving improves fuel efficiency and reduces wear on your vehicle."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Safety Resources</CardTitle>
                <CardDescription>Additional resources to improve your driving safety</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-3 mb-3">
                          <Car className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Defensive Driving Course</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn advanced techniques to anticipate and avoid hazards
                        </p>
                        <Button className="mt-3 w-full" variant="outline">
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-3 mb-3">
                          <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Safety Challenge</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete 30 days of safe driving to earn rewards
                        </p>
                        <Button className="mt-3 w-full" variant="outline">
                          Join Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-primary/10 rounded-full p-3 mb-3">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Safety Guide</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Download our comprehensive guide to vehicle safety
                        </p>
                        <Button className="mt-3 w-full" variant="outline">
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

