"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Car, Battery, Gauge, MapPin, Activity, AlertTriangle, BarChart2, Users, Zap } from "lucide-react"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts"
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

    // Generate efficiency data
    const efficiencyData = [
      { name: "Jan", efficiency: 65 },
      { name: "Feb", efficiency: 68 },
      { name: "Mar", efficiency: 70 },
      { name: "Apr", efficiency: 72 },
      { name: "May", efficiency: 75 },
      { name: "Jun", efficiency: 78 },
      { name: "Jul", efficiency: 80 },
      { name: "Aug", efficiency: 82 },
      { name: "Sep", efficiency: 85 },
      { name: "Oct", efficiency: 87 },
      { name: "Nov", efficiency: 89 },
      { name: "Dec", efficiency: 90 },
    ]

    // Generate usage patterns
    const usagePatterns = [
      { name: "Morning (6-10)", value: Math.floor(Math.random() * 20) + 15 },
      { name: "Midday (10-14)", value: Math.floor(Math.random() * 15) + 10 },
      { name: "Afternoon (14-18)", value: Math.floor(Math.random() * 25) + 20 },
      { name: "Evening (18-22)", value: Math.floor(Math.random() * 15) + 10 },
      { name: "Night (22-6)", value: Math.floor(Math.random() * 10) + 5 },
    ]

    // Generate driver performance data
    const driverPerformance = [
      { subject: "Speed Compliance", A: 120, B: 110, fullMark: 150 },
      { subject: "Fuel Efficiency", A: 98, B: 130, fullMark: 150 },
      { subject: "Safety Score", A: 86, B: 130, fullMark: 150 },
      { subject: "Maintenance", A: 99, B: 100, fullMark: 150 },
      { subject: "Route Adherence", A: 85, B: 90, fullMark: 150 },
      { subject: "Timeliness", A: 65, B: 85, fullMark: 150 },
    ]

    // Generate energy consumption data
    const energyConsumption = [
      { name: "Jan", consumption: 4000 },
      { name: "Feb", consumption: 3000 },
      { name: "Mar", consumption: 2000 },
      { name: "Apr", consumption: 2780 },
      { name: "May", consumption: 1890 },
      { name: "Jun", consumption: 2390 },
      { name: "Jul", consumption: 3490 },
      { name: "Aug", consumption: 3490 },
      { name: "Sep", consumption: 2490 },
      { name: "Oct", consumption: 2790 },
      { name: "Nov", consumption: 3290 },
      { name: "Dec", consumption: 3890 },
    ]

    // Generate vehicle type distribution
    const vehicleTypes = [
      { name: "Sedan", value: 20 },
      { name: "SUV", value: 15 },
      { name: "Truck", value: 10 },
      { name: "Van", value: 5 },
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
      efficiencyData,
      usagePatterns,
      driverPerformance,
      energyConsumption,
      vehicleTypes,
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
              <Button variant="outline" size="sm" onClick={() => router.push(`/`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
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
                Production Dashboard
              </h1>
              <p className="text-muted-foreground">Comprehensive overview of your vehicle fleet</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                      <ChartContainer
                        config={{
                          moving: {
                            label: "Moving",
                            color: "hsl(var(--chart-1))",
                          },
                          stopped: {
                            label: "Stopped",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={fleetStats.statusDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {fleetStats.statusDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
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
                      <ChartContainer
                        config={{
                          value: {
                            label: "Vehicles",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={fleetStats.batteryDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="value" fill="var(--color-value)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
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
                    <ChartContainer
                      config={{
                        value: {
                          label: "Vehicles",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={fleetStats.speedDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="value" fill="var(--color-value)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-0 space-y-6">
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="mr-2 h-5 w-5 text-primary" /> Fleet Efficiency Trend
                  </CardTitle>
                  <CardDescription>Monthly efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        efficiency: {
                          label: "Efficiency (%)",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fleetStats.efficiencyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="efficiency"
                            stroke="var(--color-efficiency)"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
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
                      <ChartContainer
                        config={{
                          count: {
                            label: "Accidents",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={fleetStats.weeklyAccidents}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="count" fill="var(--color-count)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="mr-2 h-5 w-5 text-primary" /> Usage Patterns
                    </CardTitle>
                    <CardDescription>Vehicle usage by time of day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Vehicles",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={fleetStats.usagePatterns}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {fleetStats.usagePatterns.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
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
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Vehicles",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={fleetStats.maintenanceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#4ade80" /> {/* Up to date - green */}
                              <Cell fill="#facc15" /> {/* Due soon - yellow */}
                              <Cell fill="#f87171" /> {/* Overdue - red */}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
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
                      <ChartContainer
                        config={{
                          value: {
                            label: "Vehicles",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { category: "Excellent", value: Math.floor(fleetStats.totalVehicles * 0.6) },
                              { category: "Good", value: Math.floor(fleetStats.totalVehicles * 0.25) },
                              { category: "Fair", value: Math.floor(fleetStats.totalVehicles * 0.1) },
                              { category: "Poor", value: Math.floor(fleetStats.totalVehicles * 0.05) },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="value" fill="var(--color-value)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
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

            <TabsContent value="analytics" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Users className="mr-2 h-5 w-5 text-primary" /> Driver Performance
                    </CardTitle>
                    <CardDescription>Performance metrics comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          A: {
                            label: "Current Month",
                            color: "hsl(var(--chart-1))",
                          },
                          B: {
                            label: "Previous Month",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={90} data={fleetStats.driverPerformance}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} />
                            <Radar
                              name="Current Month"
                              dataKey="A"
                              stroke="var(--color-A)"
                              fill="var(--color-A)"
                              fillOpacity={0.6}
                            />
                            <Radar
                              name="Previous Month"
                              dataKey="B"
                              stroke="var(--color-B)"
                              fill="var(--color-B)"
                              fillOpacity={0.6}
                            />
                            <Legend />
                            <Tooltip content={<ChartTooltipContent />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="mr-2 h-5 w-5 text-primary" /> Energy Consumption
                    </CardTitle>
                    <CardDescription>Monthly energy usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          consumption: {
                            label: "Energy (kWh)",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={fleetStats.energyConsumption}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="consumption"
                              stroke="var(--color-consumption)"
                              fill="var(--color-consumption)"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Car className="mr-2 h-5 w-5 text-primary" /> Vehicle Type Distribution
                  </CardTitle>
                  <CardDescription>Fleet composition by vehicle type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Vehicles",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={fleetStats.vehicleTypes}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {fleetStats.vehicleTypes.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
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

