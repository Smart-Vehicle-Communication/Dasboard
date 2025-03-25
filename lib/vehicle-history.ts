// Generate mock historical data for a vehicle
export function generateVehicleHistory(hours: number) {
  const now = new Date()
  const speedData = []
  const batteryData = []

  // Start with a random battery level between 50-100%
  let batteryLevel = 50 + Math.floor(Math.random() * 50)

  // Generate data points for each hour
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeString = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Generate a random speed between 0-120 km/h with some continuity
    const prevSpeed = i < hours ? speedData[speedData.length - 1].speed : 60
    const speedVariation = Math.random() > 0.7 ? (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 10
    const speed = Math.max(0, Math.min(120, prevSpeed + speedVariation))

    speedData.push({
      time: timeString,
      speed: Math.round(speed),
    })

    // Battery decreases over time, with occasional charging
    const batteryChange = speed > 0 ? -0.5 : Math.random() > 0.7 ? 2 : -0.1
    batteryLevel = Math.max(0, Math.min(100, batteryLevel + batteryChange))

    batteryData.push({
      time: timeString,
      level: Math.round(batteryLevel),
    })
  }

  return {
    speedData,
    batteryData,
  }
}

// Generate energy consumption data
export function generateEnergyData(hours: number) {
  const now = new Date()
  const data = []

  // Generate data points for each hour
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeString = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Generate random consumption between 5-20 kWh
    const consumption = 5 + Math.random() * 15

    // Generate random regeneration between 0-5 kWh
    const regeneration = Math.random() * 5

    data.push({
      time: timeString,
      consumption: Number.parseFloat(consumption.toFixed(1)),
      regeneration: Number.parseFloat(regeneration.toFixed(1)),
    })
  }

  return data
}

// Generate safety metrics data
export function generateSafetyData() {
  return [
    { category: "Collision Avoidance", score: 92 },
    { category: "Lane Keeping", score: 95 },
    { category: "Following Distance", score: 88 },
    { category: "Speed Compliance", score: 97 },
    { category: "Pedestrian Detection", score: 94 },
    { category: "Weather Adaptation", score: 85 },
  ]
}

