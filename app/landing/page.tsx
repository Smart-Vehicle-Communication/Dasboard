"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Car, ShieldAlert, User } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export default function LandingPage() {
  const [vehicleId, setVehicleId] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isConnected, error: wsError } = useWebSocket()

  const handleUserMode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleId.trim()) {
      setError("Please enter a vehicle ID")
      return
    }

    // Store the vehicle ID in localStorage for persistence
    localStorage.setItem("selectedVehicleId", vehicleId)

    // Navigate to the dashboard with the selected vehicle
    router.push(`/dashboard?vehicleId=${vehicleId}`)
  }

  const handleAdminMode = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword !== "admin") {
      setError('Invalid password. Hint: The password is "admin"')
      return
    }

    // Navigate to the fleet management dashboard
    router.push("/fleet-management")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vehicle Communication System</h1>
          <p className="text-gray-300">Monitor and manage your vehicle fleet in real-time</p>

          {/* WebSocket connection status */}
          <div className="mt-4 flex justify-center">
            <div
              className={`px-3 py-1 rounded-full flex items-center gap-2 ${isConnected ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
              <span>{isConnected ? "Connected to server" : "Using offline mode"}</span>
            </div>
          </div>

          {wsError && <div className="mt-2 text-amber-400 text-sm">{wsError}</div>}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Mode
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Admin Mode
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TabsContent value="user" className="col-span-1 md:col-span-2">
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    User Mode
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter a vehicle ID to monitor a specific vehicle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUserMode} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="vehicleId" className="text-sm font-medium text-gray-300">
                        Vehicle ID
                      </label>
                      <Input
                        id="vehicleId"
                        placeholder="Enter vehicle ID (e.g. V001)"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Access Vehicle Dashboard
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-sm text-gray-400 border-t border-gray-700 pt-4">
                  User mode provides access to a single vehicle&apos;s data, location, and status.
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="col-span-1 md:col-span-2">
              <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    Admin Mode
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter admin password to access the fleet management dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminMode} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="adminPassword" className="text-sm font-medium text-gray-300">
                        Admin Password
                      </label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Access Fleet Management
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-sm text-gray-400 border-t border-gray-700 pt-4">
                  Admin mode provides access to the entire fleet, analytics, and management tools.
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

