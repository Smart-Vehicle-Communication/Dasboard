"use client"

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Vehicle } from "@/lib/types"

interface VehicleTableProps {
  vehicles: Vehicle[]
  currentVehicleId: string
}

export default function VehicleTable({ vehicles, currentVehicleId }: VehicleTableProps) {
  const router = useRouter()

  // Sort vehicles by distance from current vehicle
  const sortedVehicles = [...vehicles].sort((a, b) => {
    // Current vehicle always first
    if (a.id === currentVehicleId) return -1
    if (b.id === currentVehicleId) return 1

    // Then sort by distance
    return (a.distanceFromCurrent || 0) - (b.distanceFromCurrent || 0)
  })

  // Handle click on vehicle row
  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`)
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Speed (km/h)</TableHead>
            <TableHead>Distance (km)</TableHead>
            <TableHead>Battery</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              className={`${vehicle.id === currentVehicleId ? "bg-primary/10 font-medium" : ""} cursor-pointer hover:bg-muted/50`}
              onClick={() => handleVehicleClick(vehicle.id)}
            >
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>{vehicle.speed}</TableCell>
              <TableCell>{vehicle.id === currentVehicleId ? "Current" : `${vehicle.distanceFromCurrent} km`}</TableCell>
              <TableCell>{vehicle.battery}%</TableCell>
              <TableCell>{vehicle.speed > 0 ? "Moving" : "Stopped"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

