"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Car, Battery, Gauge, MapPin, Activity, AlertTriangle, BarChart2 } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateMockAccidents } from "@/lib/accident-data"

export default function FleetManagement() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get("vehicleId") || ""
  const [vehicles, setVehicles] = useState<any[]>([])
  const [fleetStats, setFleetStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    // Generate mock data
    const allVehicles = generateMockVehicles(50, vehicleId)
    setVehicles(allVehicles)

    // Generate fleet statistics
    const movingVehicles = allVehicles.filter((v) => v.speed > 0).length
    const stoppedVehicles = allVehicles.length - movingVehicles

    // Calculate average battery level
    const avgBattery = Math.round(allVehicles.reduce((sum, v) => sum + v.battery, 0) / allVehicles.length)

    // Calculate average speed
    const avgSpeed = Math.round(allVehicles.reduce((sum, v) => sum + v.speed, 0) / allVehicles.length)

    // Generate mock accidents
    const accidents = generateMockAccidents({ lat: 12.9716, lng: 77.5946 })

    // Generate vehicle status distribution
    const statusDistribution = [
      { name: "Moving", value: movingVehicles },
      { name: "Stopped", value: stoppedVehicles },
    ]

    // Generate battery level distribution
    const batteryDistribution = [
      { name: "0-25%", value: allVehicles.filter((v) => v.battery <= 25).length },
      { name: "26-50%", value: allVehicles.filter((v) => v.battery > 25 && v.battery <= 50).length },
      { name: "51-75%", value: allVehicles.filter((v) => v.battery > 50 && v.battery <= 75).length },
      { name: "76-100%", value: allVehicles.filter((v) => v.battery > 75).length },
    ]

    // Generate speed distribution
    const speedDistribution = [
      { name: "0-30 km/h", value: allVehicles.filter((v) => v.speed <= 30).length },
      { name: "31-60 km/h", value: allVehicles.filter((v) => v.speed > 30 && v.speed <= 60).length },
      { name: "61-90 km/h", value: allVehicles.filter((v) => v.speed > 60 && v.speed <= 90).length },
      { name: "91+ km/h", value: allVehicles.filter((v) => v.speed > 90).length },
    ]

    // Generate hourly activity data
    const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activeVehicles: Math.floor(Math.random() * 30) + 10,
      avgSpeed: Math.floor(Math.random() * 60) + 20,
    }))

    // Generate weekly accident data
    const weeklyAccidents = [
      { day: "Mon", count: Math.floor(Math.random() * 5) },
      { day: "Tue", count: Math.floor(Math.random() * 5) },
      { day: "Wed", count: Math.floor(Math.random() * 5) },
      { day: "Thu", count: Math.floor(Math.random() * 5) },
      { day: "Fri", count: Math.floor(Math.random() * 5) },
      { day: "Sat", count: Math.floor(Math.random() * 5) },
      { day: "Sun", count: Math.floor(Math.random() * 5) },
    ]

    // Generate maintenance data
    const maintenanceData = [
      { name: "Up to date", value: Math.floor(allVehicles.length * 0.7) },
      { name: "Due soon", value: Math.floor(allVehicles.length * 0.2) },
      { name: "Overdue", value: Math.floor(allVehicles.length * 0.1) },
    ]

    setFleetStats({
      totalVehicles: allVehicles.length,
      movingVehicles,
      stoppedVehicles,
      avgBattery,
      avgSpeed,
      accidents: accidents.length,
      statusDistribution,
      batteryDistribution,
      speedDistribution,
      hourlyActivity,
      weeklyAccidents,
      maintenanceData,
    })
  }, [vehicleId, router])

  if (!fleetStats) {
    return <div className="flex min-h-screen items-center justify-center">Loading fleet data...</div>
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

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
                <BarChart2 className="mr-2 h-6 w-6 text-primary" />
                Fleet Management Dashboard
              </h1>
              <p className="text-muted-foreground">Comprehensive overview of your vehicle fleet</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                      <h3 className="text-2xl font-bold">{fleetStats.totalVehicles}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                      <h3 className="text-2xl font-bold">{fleetStats.movingVehicles}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <Battery className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Battery</p>
                      <h3 className="text-2xl font-bold">{fleetStats.avgBattery}%</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-amber-100 rounded-full p-3 mr-4">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accidents</p>
                      <h3 className="text-2xl font-bold">{fleetStats.accidents}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="mr-2 h-5 w-5 text-primary" /> Vehicle Status
                    </CardTitle>
                    <CardDescription>Distribution of moving vs. stopped vehicles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4">
                          <div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full mb-1 mx-auto"></div>
                            <p className="text-sm">Moving: {fleetStats.movingVehicles}</p>
                          </div>
                          <div>
                            <div className="w-4 h-4 bg-gray-400 rounded-full mb-1 mx-auto"></div>
                            <p className="text-sm">Stopped: {fleetStats.stoppedVehicles}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-lg font-medium">Total: {fleetStats.totalVehicles} vehicles</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round((fleetStats.movingVehicles / fleetStats.totalVehicles) * 100)}% of fleet is
                            currently active
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Battery className="mr-2 h-5 w-5 text-primary" /> Battery Distribution
                    </CardTitle>
                    <CardDescription>Battery levels across the fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <div className="space-y-4 pt-4">
                        {fleetStats.batteryDistribution.map((item: any, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">{item.value} vehicles</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(item.value / fleetStats.totalVehicles) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Gauge className="mr-2 h-5 w-5 text-primary" /> Speed Distribution
                  </CardTitle>
                  <CardDescription>Vehicle speeds across the fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <div className="space-y-4 pt-4">
                      {fleetStats.speedDistribution.map((item: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-sm font-medium">{item.value} vehicles</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${(item.value / fleetStats.totalVehicles) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-0 space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="mr-2 h-5 w-5 text-primary" /> Hourly Activity
                  </CardTitle>
                  <CardDescription>Vehicle activity over 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-24 gap-1 h-[300px] items-end">
                        {fleetStats.hourlyActivity.map((hour: any, index: number) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-full bg-blue-500 rounded-t-sm"
                              style={{ height: `${(hour.activeVehicles / 40) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-1">{hour.hour}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <span className="text-sm text-muted-foreground">Hour of Day</span>
                        <span className="text-sm text-muted-foreground">Active Vehicles</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <AlertTriangle className="mr-2 h-5 w-5 text-primary" /> Weekly Accidents
                    </CardTitle>
                    <CardDescription>Accident frequency by day of week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <div className="grid grid-cols-7 gap-2 h-[250px] items-end pt-4">
                        {fleetStats.weeklyAccidents.map((day: any, index: number) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-full bg-orange-500 rounded-t-sm"
                              style={{ height: `${(day.count / 5) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-1">{day.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="mr-2 h-5 w-5 text-primary" /> Geographic Distribution
                    </CardTitle>
                    <CardDescription>Vehicle distribution by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="space-y-4 w-full max-w-md">
                        {[
                          { name: "North Bangalore", value: 15, color: "#0088FE" },
                          { name: "South Bangalore", value: 12, color: "#00C49F" },
                          { name: "East Bangalore", value: 8, color: "#FFBB28" },
                          { name: "West Bangalore", value: 10, color: "#FF8042" },
                          { name: "Central Bangalore", value: 5, color: "#8884d8" },
                        ].map((region, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: region.color }}
                                ></div>
                                <span className="text-sm">{region.name}</span>
                              </div>
                              <span className="text-sm font-medium">{region.value} vehicles</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full"
                                style={{
                                  width: `${(region.value / 50) * 100}%`,
                                  backgroundColor: region.color,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Car className="mr-2 h-5 w-5 text-primary" /> Maintenance Status
                    </CardTitle>
                    <CardDescription>Vehicle maintenance schedule status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="space-y-4 w-full max-w-md">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-green-100 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-green-700">{fleetStats.maintenanceData[0].value}</p>
                            <p className="text-sm text-green-700">Up to date</p>
                          </div>
                          <div className="bg-yellow-100 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-700">{fleetStats.maintenanceData[1].value}</p>
                            <p className="text-sm text-yellow-700">Due soon</p>
                          </div>
                          <div className="bg-red-100 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-red-700">{fleetStats.maintenanceData[2].value}</p>
                            <p className="text-sm text-red-700">Overdue</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="h-4 flex rounded-full overflow-hidden">
                            <div
                              className="bg-green-500"
                              style={{
                                width: `${(fleetStats.maintenanceData[0].value / fleetStats.totalVehicles) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{
                                width: `${(fleetStats.maintenanceData[1].value / fleetStats.totalVehicles) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{
                                width: `${(fleetStats.maintenanceData[2].value / fleetStats.totalVehicles) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-center mt-2 text-muted-foreground">
                            {Math.round((fleetStats.maintenanceData[0].value / fleetStats.totalVehicles) * 100)}% of
                            fleet is up to date with maintenance
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Battery className="mr-2 h-5 w-5 text-primary" /> Battery Health
                    </CardTitle>
                    <CardDescription>Battery health across the fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <div className="space-y-4 pt-4">
                        {[
                          { category: "Excellent", value: Math.floor(fleetStats.totalVehicles * 0.6) },
                          { category: "Good", value: Math.floor(fleetStats.totalVehicles * 0.25) },
                          { category: "Fair", value: Math.floor(fleetStats.totalVehicles * 0.1) },
                          { category: "Poor", value: Math.floor(fleetStats.totalVehicles * 0.05) },
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.category}</span>
                              <span className="text-sm font-medium">{item.value} vehicles</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === 1
                                      ? "bg-blue-500"
                                      : index === 2
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${(item.value / fleetStats.totalVehicles) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="mr-2 h-5 w-5 text-primary" /> Maintenance Schedule
                  </CardTitle>
                  <CardDescription>Upcoming maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-start p-3 bg-muted/30 rounded-lg">
                        <div
                          className={`rounded-full p-2 mr-3 ${
                            index === 0
                              ? "bg-red-100 text-red-700"
                              : index === 1
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <Car className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Vehicle{" "}
                            {`V${Math.floor(Math.random() * 10000)
                              .toString()
                              .padStart(4, "0")}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0
                              ? "Maintenance overdue by 3 days"
                              : index === 1
                                ? "Maintenance due tomorrow"
                                : `Scheduled for maintenance in ${index + 3} days`}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {index === 0
                              ? "Battery replacement"
                              : index === 1
                                ? "Tire rotation"
                                : index === 2
                                  ? "Software update"
                                  : index === 3
                                    ? "Brake inspection"
                                    : "Regular service"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

