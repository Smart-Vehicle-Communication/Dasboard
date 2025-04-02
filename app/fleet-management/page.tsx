"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Car, Battery, Gauge, MapPin, Activity, AlertTriangle, BarChart2 } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateMockAccidents } from "@/lib/accident-data"
import type { Vehicle } from "@/lib/types"

interface FleetStats {
  totalVehicles: number
  activeVehicles: number
  maintenanceVehicles: number
  accidents: any[]
}

export default function FleetManagement() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [fleetStats, setFleetStats] = useState<FleetStats | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Generate mock data for all vehicles
    const allVehicles = generateMockVehicles(50, "admin")
    setVehicles(allVehicles)

    // Calculate fleet statistics
    const stats: FleetStats = {
      totalVehicles: allVehicles.length,
      activeVehicles: allVehicles.filter(v => v.speed > 0).length,
      maintenanceVehicles: allVehicles.filter(v => v.speed === 0).length,
      accidents: generateMockAccidents({ lat: 12.9716, lng: 77.5946 })
    }
    setFleetStats(stats)
  }, [])

  if (!fleetStats) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">V2V Connect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <MainNav vehicleId="admin" />
              <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="accidents">Accidents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                      <h3 className="text-2xl font-bold">{fleetStats.activeVehicles}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <Battery className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Maintenance Vehicles</p>
                      <h3 className="text-2xl font-bold">{fleetStats.maintenanceVehicles}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accidents</p>
                      <h3 className="text-2xl font-bold">{fleetStats.accidents.length}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" /> Vehicle Status
                </CardTitle>
                <CardDescription>Distribution of active vs. maintenance vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <div className="w-4 h-4 bg-green-500 rounded-full mb-1 mx-auto"></div>
                      <p className="text-sm">Active: {fleetStats.activeVehicles}</p>
                    </div>
                    <div>
                      <div className="w-4 h-4 bg-blue-500 rounded-full mb-1 mx-auto"></div>
                      <p className="text-sm">Maintenance: {fleetStats.maintenanceVehicles}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-medium">Total: {fleetStats.totalVehicles} vehicles</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((fleetStats.activeVehicles / fleetStats.totalVehicles) * 100)}% of fleet is active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                      <div>
                        <h3 className="font-medium">{vehicle.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Speed: {vehicle.speed} km/h | Battery: {vehicle.battery}%
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.speed > 0 ? "Active" : "Maintenance"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accidents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Accidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fleetStats.accidents.map((accident) => (
                    <div key={accident.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                      <div>
                        <h3 className="font-medium">{accident.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          Severity: {accident.severity} | Vehicles: {accident.vehiclesInvolved}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {accident.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="w-full bg-white/80 backdrop-blur-sm py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 V2V Connect | Autonomous Vehicle Network
          </div>
        </div>
      </footer>
    </div>
  )
}

