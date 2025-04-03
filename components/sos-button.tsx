"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useWebSocket, type SosReportData } from "@/hooks/use-websocket"

interface SosButtonProps {
  vehicleId: string
}

export default function SosButton({ vehicleId }: SosButtonProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState("High")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Get the WebSocket hook to send SOS reports
  const { isConnected, sendSosReport } = useWebSocket(vehicleId)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Get current position from localStorage or use default
    let position
    try {
      const positionStr = localStorage.getItem("currentVehiclePosition")
      position = positionStr ? JSON.parse(positionStr) : { lat: 12.9716, lng: 77.5946 }
    } catch (e) {
      console.error("Error parsing position from localStorage:", e)
      position = { lat: 12.9716, lng: 77.5946 } // Default to Bangalore coordinates
    }

    // Create SOS report data in the specified format
    const sosData = {
      id: `sos-${Date.now()}`,
      vehicle_id: vehicleId,
      alert_type: 'collision',
      location: {
        lat: position.lat,
        lng: position.lng
      },
      timestamp: new Date().toISOString()
    }

    // Send SOS report via WebSocket
    const success = sendSosReport(sosData)
    console.log(`SOS report ${success ? "sent to backend" : "stored locally"}`)

    // If not using WebSocket or if sending failed, create a local alert
    if (!isConnected) {
      // Create a custom event to notify the dashboard
      const accidentData = {
        id: sosData.id,
        type: "SOS Emergency",
        severity,
        time: new Date().toLocaleTimeString(),
        position: sosData.location,
        vehiclesInvolved: 1,
        description: description || "SOS Emergency Button Pressed",
      }

      // Store in localStorage
      const storedAccidents = JSON.parse(localStorage.getItem("accidents") || "[]")
      localStorage.setItem("accidents", JSON.stringify([...storedAccidents, accidentData]))

      // Dispatch event
      const sosEvent = new CustomEvent("sosEmergency", { detail: accidentData })
      window.dispatchEvent(sosEvent)
    }

    // Show success state
    setSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setOpen(false)
      setDescription("")
      setSeverity("High")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-16 text-xl font-bold flex items-center justify-center gap-2"
        >
          <AlertTriangle className="h-6 w-6" />
          SOS Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[1000]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>SOS Emergency Alert</DialogTitle>
              <DialogDescription>
                Please provide details about the emergency. This will alert nearby vehicles and emergency services.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                <RadioGroup value={severity} onValueChange={setSeverity} className="flex space-x-4" id="severity">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the emergency situation..."
                  className="resize-none"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {isConnected ? (
                  <span className="text-green-600">Connected to emergency services</span>
                ) : (
                  <span className="text-amber-600">
                    Offline mode: Alert will be stored locally and sent when connection is restored
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send SOS Alert"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">SOS Alert Sent</h3>
            <p className="text-muted-foreground mb-4">
              Your emergency alert has been {isConnected ? "transmitted to emergency services" : "saved locally"}.
            </p>
            <p className="text-sm">This dialog will close automatically...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

