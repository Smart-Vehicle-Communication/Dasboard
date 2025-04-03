"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Vehicle } from "@/lib/types"

// Define the types for our WebSocket messages
export interface WebSocketMessage {
  type: "vehicle_update" | "alert" | "sos_report"
  data: any
}

// Define the incoming vehicle data format from WebSocket
interface IncomingVehicleData {
  vehicle_id: string
  speed: number
  location: {
    lat: number
    lng: number
  }
  battery?: number
}

export interface AlertData {
  id: string
  type: string
  severity: string
  time: string
  position: {
    lat: number
    lng: number
  }
  vehiclesInvolved: number
  description: string
}

export interface SosReportData {
  vehicleId: string
  position: {
    lat: number
    lng: number
  }
  timestamp: string
  description: string
  severity: string
}

export function useWebSocket(vehicleId?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const vehicleIdRef = useRef(vehicleId)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update ref when vehicleId changes
  useEffect(() => {
    vehicleIdRef.current = vehicleId
  }, [vehicleId])

  // Transform incoming vehicle data to our application's format
  const transformVehicleData = useCallback((incomingData: any): Vehicle => {
    console.log("Transforming incoming vehicle data:", incomingData)

    // Check if the data is already in our format
    if (incomingData.id && incomingData.position) {
      return incomingData as Vehicle
    }

    // Handle the format: {'vehicle_id': 'V123', 'speed': 0.0, 'location': {'lat': 12.9753, 'lng': 77.591}}
    if (incomingData.vehicle_id && incomingData.location) {
      return {
        id: incomingData.vehicle_id,
        speed: incomingData.speed || 0,
        position: {
          lat: incomingData.location.lat,
          lng: incomingData.location.lng,
        },
        battery: incomingData.battery || 100,
        lastUpdated: Date.now(),
      }
    }

    // If we can't determine the format, log an error and return a default
    console.error("Unknown vehicle data format:", incomingData)
    return {
      id: incomingData.id || incomingData.vehicle_id || "unknown",
      speed: incomingData.speed || 0,
      position: incomingData.position || incomingData.location || { lat: 0, lng: 0 },
      battery: incomingData.battery || 100,
      lastUpdated: Date.now(),
    }
  }, [])

  // Function to send SOS report to backend
  const sendSosReport = useCallback((sosData: SosReportData) => {
    console.log("Sending SOS report to backend:", sosData)

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(
          JSON.stringify({
            type: "sos_report",
            data: sosData,
          }),
        )
        console.log("SOS report sent successfully via WebSocket")
        return true
      } catch (err) {
        console.error("Error sending SOS report via WebSocket:", err)
        return false
      }
    } else {
      console.warn("WebSocket not connected, storing SOS report locally")
      // Store locally if WebSocket is not connected
      const alertData: AlertData = {
        id: `local-sos-${Date.now()}`,
        type: "SOS Emergency",
        severity: sosData.severity || "High",
        time: sosData.timestamp || new Date().toISOString(),
        position: sosData.position,
        vehiclesInvolved: 1,
        description: sosData.description || "SOS Emergency Button Pressed",
      }

      setAlerts((prevAlerts) => [...prevAlerts, alertData])

      // Store in localStorage
      const storedAlerts = JSON.parse(localStorage.getItem("accidents") || "[]")
      localStorage.setItem("accidents", JSON.stringify([...storedAlerts, alertData]))

      // Dispatch event for other components
      const alertEvent = new CustomEvent("sosEmergency", { detail: alertData })
      window.dispatchEvent(alertEvent)

      return false
    }
  }, [])

  // Function to send subscription messages
  const sendSubscriptionMessages = useCallback((socket: WebSocket) => {
    if (vehicleIdRef.current) {
      socket.send(
        JSON.stringify({
          type: "subscribe",
          target: "vehicle",
          id: vehicleIdRef.current,
        }),
      )
    } else {
      socket.send(
        JSON.stringify({
          type: "subscribe",
          target: "all_vehicles",
        }),
      )
    }

    socket.send(
      JSON.stringify({
        type: "subscribe",
        target: "alerts",
      }),
    )
  }, [])

  useEffect(() => {
    // Only attempt to connect in browser environment
    if (typeof window === "undefined") return

    // CHANGE THIS URL TO YOUR WEBSOCKET SERVER
    const wsUrl = process.env.NODE_ENV === "production" 
      ? "wss://your-production-server.com/ws" 
      : "ws://127.0.0.1:8000/ws"

    const connect = () => {
      try {
        const socket = new WebSocket(wsUrl)
        socketRef.current = socket

        socket.onopen = () => {
          console.log("WebSocket connection established")
          setIsConnected(true)
          setError(null)
          sendSubscriptionMessages(socket)
        }

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log("Received WebSocket message:", message)

            if (message.type === "vehicle_update") {
              const transformedData = transformVehicleData(message.data)
              setVehicles((prevVehicles) => {
                const updatedVehicles = [...prevVehicles]
                const vehicleIndex = updatedVehicles.findIndex((v) => v.id === transformedData.id)

                if (vehicleIndex >= 0) {
                  updatedVehicles[vehicleIndex] = {
                    ...updatedVehicles[vehicleIndex],
                    ...transformedData,
                    lastUpdated: Date.now(),
                  }
                } else {
                  updatedVehicles.push({
                    ...transformedData,
                    lastUpdated: Date.now(),
                  })
                }

                return updatedVehicles
              })
            } else if (message.type === "alert") {
              setAlerts((prevAlerts) => [...prevAlerts, message.data])
              const storedAlerts = JSON.parse(localStorage.getItem("accidents") || "[]")
              localStorage.setItem("accidents", JSON.stringify([...storedAlerts, message.data]))
              const alertEvent = new CustomEvent("newAlert", { detail: message.data })
              window.dispatchEvent(alertEvent)
            }
          } catch (err) {
            console.error("Error handling WebSocket message:", err)
          }
        }

        socket.onerror = (event) => {
          console.error("WebSocket error:", event)
          setError("Failed to connect to the server. Using mock data instead.")
          setIsConnected(false)
        }

        socket.onclose = () => {
          console.log("WebSocket connection closed")
          setIsConnected(false)
          socketRef.current = null

          // Attempt to reconnect after a delay
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...")
            connect()
          }, 5000) // Retry after 5 seconds
        }
      } catch (err) {
        console.error("Error creating WebSocket connection:", err)
        setError("Failed to connect to the server. Using mock data instead.")
        setIsConnected(false)
      }
    }

    // Initial connection
    connect()

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close()
      }
    }
  }, [transformVehicleData, sendSubscriptionMessages])

  return {
    isConnected,
    vehicles,
    alerts,
    error,
    sendSosReport,
  }
}

