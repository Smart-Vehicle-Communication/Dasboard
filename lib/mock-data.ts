import type { Vehicle } from "./types"

export function generateMockVehicles(count: number, currentVehicleId: string): Vehicle[] {
  const vehicles: Vehicle[] = []

  // Generate a base position (centered on Bangalore city)
  const baseLat = 12.9716 // Bangalore latitude
  const baseLng = 77.5946 // Bangalore longitude

  // Create the current vehicle first
  const currentVehicle: Vehicle = {
    id: currentVehicleId,
    speed: Math.floor(Math.random() * 120),
    position: {
      lat: baseLat,
      lng: baseLng,
    },
    battery: Math.floor(Math.random() * 100),
    distanceFromCurrent: 0,
    lastUpdated: Date.now(),
  }

  vehicles.push(currentVehicle)

  // Generate other vehicles
  for (let i = 1; i < count; i++) {
    // Generate a random ID that's not the current vehicle ID
    let vehicleId
    do {
      vehicleId = `V${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`
    } while (vehicleId === currentVehicleId)

    // Random position within ~5km of the base position
    // 0.045 degrees is roughly 5km at the equator
    const latVariation = (Math.random() - 0.5) * 0.045
    const lngVariation = (Math.random() - 0.5) * 0.045

    const vehicle: Vehicle = {
      id: vehicleId,
      speed: Number((Math.random() * 120).toFixed(2)),
      position: {
        lat: baseLat + latVariation,
        lng: baseLng + lngVariation,
      },
      battery: Math.floor(Math.random() * 100),
      lastUpdated: Date.now(),
    }

    vehicles.push(vehicle)
  }

  return vehicles
}

// Function to update vehicle positions based on their speed
export function updateVehiclePositions(vehicles: Vehicle[]): Vehicle[] {
  const now = Date.now()

  return vehicles.map((vehicle) => {
    // If speed is 0, don't update position
    if (vehicle.speed === 0) {
      return { ...vehicle, lastUpdated: now }
    }

    // Calculate time elapsed since last update in seconds
    const timeElapsed = (now - (vehicle.lastUpdated || now)) / 1000

    // Calculate distance traveled in km
    // speed is in km/h, so divide by 3600 to get km/s
    const distanceTraveled = (vehicle.speed / 3600) * timeElapsed

    // Convert distance to approximate lat/lng changes
    // This is a simplified calculation - 0.00001 degrees is roughly 1.11 meters at the equator
    const latChange = (Math.random() - 0.5) * 0.00001 * distanceTraveled * 1000
    const lngChange = (Math.random() - 0.5) * 0.00001 * distanceTraveled * 1000

    // Update position
    return {
      ...vehicle,
      position: {
        lat: vehicle.position.lat + latChange,
        lng: vehicle.position.lng + lngChange,
      },
      // Randomly adjust speed occasionally with decimal precision
      speed:
        Math.random() > 0.9
          ? Number(Math.max(0, Math.min(120, vehicle.speed + (Math.random() - 0.5) * 10)).toFixed(2))
          : vehicle.speed,
      lastUpdated: now,
    }
  })
}

