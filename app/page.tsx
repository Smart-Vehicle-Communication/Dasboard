"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Autonomous Vehicle Network</CardTitle>
          <CardDescription className="text-center">Enter your vehicle ID to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="vehicleId"
                placeholder="Enter Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="h-12"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full h-12">
              Connect to Network
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

