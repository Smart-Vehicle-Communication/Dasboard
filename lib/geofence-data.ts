// Generate mock geofence data
export function generateMockGeofences(position: { lat: number; lng: number }) {
  const geofences = []

  // Bangalore specific geofences

  // School zone near position
  geofences.push({
    id: "geo-school-1",
    name: "National Public School",
    type: "school",
    speedLimit: 25,
    coordinates: [
      [position.lat + 0.005, position.lng - 0.005],
      [position.lat + 0.005, position.lng + 0.005],
      [position.lat - 0.005, position.lng + 0.005],
      [position.lat - 0.005, position.lng - 0.005],
    ],
  })

  // Residential area
  geofences.push({
    id: "geo-residential-1",
    name: "Koramangala Residential Area",
    type: "residential",
    speedLimit: 30,
    coordinates: [
      [position.lat + 0.01, position.lng - 0.01],
      [position.lat + 0.01, position.lng],
      [position.lat, position.lng],
      [position.lat, position.lng - 0.01],
    ],
  })

  // Highway
  geofences.push({
    id: "geo-highway-1",
    name: "Outer Ring Road",
    type: "highway",
    speedLimit: 80,
    coordinates: [
      [position.lat - 0.01, position.lng + 0.01],
      [position.lat - 0.01, position.lng + 0.02],
      [position.lat - 0.02, position.lng + 0.02],
      [position.lat - 0.02, position.lng + 0.01],
    ],
  })

  // Hospital zone
  geofences.push({
    id: "geo-hospital-1",
    name: "Manipal Hospital Zone",
    type: "hospital",
    speedLimit: 20,
    coordinates: [
      [position.lat + 0.008, position.lng + 0.008],
      [position.lat + 0.008, position.lng + 0.015],
      [position.lat + 0.015, position.lng + 0.015],
      [position.lat + 0.015, position.lng + 0.008],
    ],
  })

  return geofences
}

// Generate detailed geofence information
export function generateGeofenceDetails(geofenceId: string) {
  const geofenceTypes = {
    school: {
      description: "School zone with reduced speed limits during school hours",
      activeHours: "7:00 AM - 4:00 PM (Mon-Fri)",
      restrictions: ["Speed limit 25 km/h", "No heavy vehicles", "Extra caution required"],
    },
    residential: {
      description: "Residential area with pedestrian traffic",
      activeHours: "24/7",
      restrictions: ["Speed limit 30 km/h", "Noise restrictions", "Watch for children"],
    },
    highway: {
      description: "Highway section with speed monitoring",
      activeHours: "24/7",
      restrictions: ["Speed limit 80 km/h", "Minimum speed 40 km/h", "No stopping"],
    },
    construction: {
      description: "Temporary construction zone",
      activeHours: "7:00 AM - 7:00 PM (Mon-Sat)",
      restrictions: ["Speed limit 40 km/h", "Lane restrictions", "Watch for workers"],
    },
    hospital: {
      description: "Hospital zone with noise restrictions",
      activeHours: "24/7",
      restrictions: ["Speed limit 20 km/h", "No honking", "Emergency vehicle priority"],
    },
  }

  // Bangalore specific geofence names
  const geofenceNames = {
    school: ["National Public School", "Delhi Public School", "Bishop Cotton School", "St. Joseph's School"],
    residential: [
      "Koramangala Residential Area",
      "Indiranagar Residential Zone",
      "Whitefield Housing Complex",
      "JP Nagar Residential Area",
    ],
    highway: ["Outer Ring Road", "Nice Road", "Bangalore-Mysore Highway", "Electronic City Expressway"],
    construction: [
      "Metro Construction Zone",
      "Flyover Construction Area",
      "Road Widening Project",
      "Infrastructure Development Zone",
    ],
    hospital: ["Manipal Hospital Zone", "Apollo Hospital Area", "Fortis Hospital Zone", "Narayana Health City"],
  }

  const type = ["school", "residential", "highway", "construction", "hospital"][Math.floor(Math.random() * 5)]
  const name = geofenceNames[type as keyof typeof geofenceNames][Math.floor(Math.random() * 4)]

  // Bangalore coordinates (approximately)
  const baseLat = 12.9716
  const baseLng = 77.5946

  return {
    id: geofenceId,
    name: name,
    type: type,
    speedLimit: type === "highway" ? 80 : type === "construction" ? 40 : type === "hospital" ? 20 : 30,
    coordinates: Array.from({ length: 4 }, () => [
      baseLat + (Math.random() - 0.5) * 0.02,
      baseLng + (Math.random() - 0.5) * 0.02,
    ]),
    ...geofenceTypes[type as keyof typeof geofenceTypes],
    complianceRate: Math.floor(Math.random() * 30) + 70, // 70-100%
    violations: {
      today: Math.floor(Math.random() * 10),
      thisWeek: Math.floor(Math.random() * 50),
      thisMonth: Math.floor(Math.random() * 200),
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  }
}

