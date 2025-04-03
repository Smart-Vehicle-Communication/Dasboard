"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Car, Shield, MapPin, AlertTriangle, CloudSun, BarChart2, Lock } from "lucide-react"

export default function LandingPage() {
  const [vehicleId, setVehicleId] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [vehicleError, setVehicleError] = useState("")
  const [adminError, setAdminError] = useState("")
  const router = useRouter()

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId.trim()) {
      setVehicleError("Please enter a vehicle ID")
      return
    }

    // Navigate to dashboard with the vehicle ID
    router.push(`/dashboard?vehicleId=${vehicleId}`)
  }

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminPassword.trim()) {
      setAdminError("Please enter the admin password")
      return
    }

    if (adminPassword === "admin") {
      // Navigate to fleet management dashboard
      router.push(`/fleet-management?vehicleId=ADMIN`)
    } else {
      setAdminError("Invalid password")
    }
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
            <div className="text-sm text-muted-foreground">Autonomous Vehicle Network</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-tight">Vehicle-to-Vehicle Communication Network</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect to our advanced autonomous vehicle network for real-time monitoring, safety alerts, and enhanced
              traffic management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Mode Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Car className="mr-2 h-6 w-6 text-primary" /> User Mode
                </CardTitle>
                <CardDescription>Monitor a specific vehicle in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVehicleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="vehicleId"
                      placeholder="Enter Vehicle ID (e.g., V1234)"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="h-12"
                    />
                    {vehicleError && <p className="text-sm text-red-500">{vehicleError}</p>}
                  </div>
                  <Button type="submit" className="w-full h-12">
                    Connect to Vehicle
                  </Button>
                </form>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Real-time Tracking</h3>
                      <p className="text-xs text-muted-foreground">Monitor vehicle location and status</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Accident Alerts</h3>
                      <p className="text-xs text-muted-foreground">Receive notifications about nearby incidents</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <CloudSun className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Weather Integration</h3>
                      <p className="text-xs text-muted-foreground">View weather conditions along routes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-center text-sm text-muted-foreground pt-2 border-t">
                Demo IDs: V1234, V5678, V9012
              </CardFooter>
            </Card>

            {/* Admin Mode Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <BarChart2 className="mr-2 h-6 w-6 text-primary" /> Production Mode
                </CardTitle>
                <CardDescription>Access fleet management and analytics dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="h-12"
                    />
                    {adminError && <p className="text-sm text-red-500">{adminError}</p>}
                  </div>
                  <Button type="submit" className="w-full h-12">
                    Access Production Dashboard
                  </Button>
                </form>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <BarChart2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Fleet Analytics</h3>
                      <p className="text-xs text-muted-foreground">Comprehensive data visualization and metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Safety Monitoring</h3>
                      <p className="text-xs text-muted-foreground">Track safety metrics across the entire fleet</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Administrative Controls</h3>
                      <p className="text-xs text-muted-foreground">Manage fleet settings and configurations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-center text-sm text-muted-foreground pt-2 border-t">
                For demo purposes, use password: "admin"
              </CardFooter>
            </Card>
          </div>
        </div>
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

