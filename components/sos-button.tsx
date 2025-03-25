"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PhoneCall, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

interface SosButtonProps {
  vehicleId: string
}

export default function SosButton({ vehicleId }: SosButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [emergencyType, setEmergencyType] = useState("accident")
  const [description, setDescription] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSendSOS = () => {
    setIsSending(true)

    // Simulate sending SOS
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)

      // Create a new accident event in localStorage
      const currentPosition = JSON.parse(
        localStorage.getItem("currentVehiclePosition") || '{"lat": 12.9716, "lng": 77.5946}',
      )

      const newAccident = {
        id: `SOS${Date.now()}`,
        position: {
          lat: currentPosition.lat,
          lng: currentPosition.lng,
        },
        type:
          emergencyType === "accident"
            ? "Collision"
            : emergencyType === "medical"
              ? "Medical Emergency"
              : emergencyType === "vehicle"
                ? "Vehicle Breakdown"
                : "Other",
        severity: "Severe",
        time: new Date().toLocaleTimeString(),
        vehiclesInvolved: 1,
        description: description || "Emergency SOS signal sent from vehicle.",
        status: "Active",
      }

      // Store the accident in localStorage
      const accidents = JSON.parse(localStorage.getItem("accidents") || "[]")
      accidents.push(newAccident)
      localStorage.setItem("accidents", JSON.stringify(accidents))

      // Trigger a custom event that the dashboard can listen for
      const sosEvent = new CustomEvent("sosEmergency", { detail: newAccident })
      window.dispatchEvent(sosEvent)

      // Reset after showing success
      setTimeout(() => {
        setIsSent(false)
        setOpen(false)
        setDescription("")

        // Redirect to dashboard to see the accident
        router.push(`/dashboard?vehicleId=${vehicleId}`)
      }, 3000)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white" size="lg">
          <PhoneCall className="mr-2 h-5 w-5" />
          SOS Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Emergency SOS
          </DialogTitle>
          <DialogDescription>
            Send an emergency SOS signal with your current location and vehicle details.
          </DialogDescription>
        </DialogHeader>

        {!isSent ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-type">Emergency Type</Label>
                <RadioGroup
                  id="emergency-type"
                  value={emergencyType}
                  onValueChange={setEmergencyType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accident" id="accident" />
                    <Label htmlFor="accident">Accident</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medical" id="medical" />
                    <Label htmlFor="medical">Medical Emergency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vehicle" id="vehicle" />
                    <Label htmlFor="vehicle">Vehicle Breakdown</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about the emergency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSendSOS}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send SOS"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">SOS Signal Sent</h3>
            <p className="mt-2 text-sm text-gray-500">
              Emergency services have been notified of your location and situation. Help is on the way.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

