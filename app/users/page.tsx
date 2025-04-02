"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Shield, MapPin, AlertTriangle, CloudSun, ArrowLeft } from "lucide-react"

export default function VehicleLogin() {
  const [vehicleId, setVehicleId] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId.trim()) {
      setError("Please enter a vehicle ID")
      return
    }

    // Navigate to dashboard with the vehicle ID
    router.push(`/dashboard?vehicleId=${vehicleId}`)
  }

  const handleBack = () => {
    router.push('/')
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
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary tracking-tight">
                Vehicle-to-Vehicle Communication Network
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Connect to our advanced autonomous vehicle network for real-time monitoring, safety alerts, and enhanced
                traffic management.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <Card className="bg-white/70 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Enhanced Safety</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Real-time accident alerts and SOS functionality
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Geofencing</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Speed compliance monitoring in designated areas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Accident Reporting</h3>
                      <p className="text-sm text-muted-foreground mt-1">Detailed incident reports and analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-2 mr-4">
                      <CloudSun className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Weather Integration</h3>
                      <p className="text-sm text-muted-foreground mt-1">Real-time weather conditions and alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="w-full max-w-md shadow-lg mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Connect Your Vehicle</CardTitle>
              <CardDescription className="text-center">
                Enter your vehicle ID to access the network dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="vehicleId"
                    placeholder="Enter Vehicle ID (e.g., V1234)"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="h-12"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button type="submit" className="w-full h-12">
                  Connect to Network
                </Button>
                <p className="text-xs text-center text-muted-foreground">Demo IDs: V1234, V5678, V9012</p>
              </form>
            </CardContent>
          </Card>
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