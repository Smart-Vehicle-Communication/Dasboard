// Generate mock accident data
export function generateMockAccidents(currentPosition: { lat: number; lng: number }) {
  const accidents = []
  const accidentTypes = ["Collision", "Rollover", "Side-swipe", "Rear-end", "Pedestrian"]
  const severityLevels = ["Minor", "Moderate", "Severe"]

  // Generate 2-4 random accidents
  const accidentCount = Math.floor(Math.random() * 3) + 2

  for (let i = 0; i < accidentCount; i++) {
    // Random position within ~1.5km of the current position
    const latVariation = (Math.random() - 0.5) * 0.02
    const lngVariation = (Math.random() - 0.5) * 0.02

    const accident = {
      id: `ACC${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      position: {
        lat: currentPosition.lat + latVariation,
        lng: currentPosition.lng + lngVariation,
      },
      type: accidentTypes[Math.floor(Math.random() * accidentTypes.length)],
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      time: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString(),
      vehiclesInvolved: Math.floor(Math.random() * 3) + 1,
      description: "Vehicle accident reported. Emergency services dispatched.",
      status: Math.random() > 0.3 ? "Active" : "Cleared",
    }

    accidents.push(accident)
  }

  return accidents
}

// Generate detailed accident report
export function generateAccidentReport(accidentId: string) {
  const accidentTypes = ["Collision", "Rollover", "Side-swipe", "Rear-end", "Pedestrian"]
  const weatherConditions = ["Clear", "Rainy", "Foggy", "Windy"]
  const roadConditions = ["Dry", "Wet", "Icy", "Under construction"]

  // Bangalore locations
  const locations = [
    {
      address: "MG Road, Bangalore",
      intersection: "MG Road & Brigade Road",
      coordinates: { lat: 12.9747, lng: 77.6094 },
    },
    {
      address: "Indiranagar, Bangalore",
      intersection: "100 Feet Road & CMH Road",
      coordinates: { lat: 12.9784, lng: 77.6408 },
    },
    {
      address: "Koramangala, Bangalore",
      intersection: "80 Feet Road & 100 Feet Road",
      coordinates: { lat: 12.9352, lng: 77.6245 },
    },
    {
      address: "Whitefield, Bangalore",
      intersection: "Whitefield Main Road & ITPL Road",
      coordinates: { lat: 12.9698, lng: 77.7499 },
    },
  ]

  const selectedLocation = locations[Math.floor(Math.random() * locations.length)]

  return {
    id: accidentId,
    type: accidentTypes[Math.floor(Math.random() * accidentTypes.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleDateString(),
    time: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString(),
    location: selectedLocation,
    vehicles: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
      id: `V${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      type: ["Sedan", "SUV", "Truck", "Motorcycle", "Auto Rickshaw"][Math.floor(Math.random() * 5)],
      damage: ["Minor", "Moderate", "Severe"][Math.floor(Math.random() * 3)],
      occupants: Math.floor(Math.random() * 4) + 1,
    })),
    injuries: {
      fatal: Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 1 : 0,
      severe: Math.floor(Math.random() * 3),
      minor: Math.floor(Math.random() * 5),
    },
    conditions: {
      weather: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      road: roadConditions[Math.floor(Math.random() * roadConditions.length)],
      visibility: ["Good", "Fair", "Poor"][Math.floor(Math.random() * 3)],
      trafficDensity: ["Light", "Moderate", "Heavy"][Math.floor(Math.random() * 3)],
    },
    emergencyResponse: {
      police: true,
      ambulance: Math.random() > 0.5,
      fireService: Math.random() > 0.7,
      responseTime: Math.floor(Math.random() * 10) + 5, // 5-15 minutes
    },
    description:
      "Vehicle collision occurred at intersection. Emergency services responded promptly. Traffic diverted for 45 minutes.",
    status: Math.random() > 0.3 ? "Active" : "Cleared",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  }
}

