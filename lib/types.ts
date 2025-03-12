export interface Vehicle {
  id: string
  speed: number
  position: {
    lat: number
    lng: number
  }
  battery: number
  distanceFromCurrent?: number
  lastUpdated?: number
}

