"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface ProximityChartProps {
  data: { id: string; distance: number }[]
}

export default function VehicleProximityChart({ data }: ProximityChartProps) {
  return (
    <ChartContainer
      config={{
        distance: {
          label: "Distance",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, "dataMax"]}
            label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }}
          />
          <YAxis dataKey="id" type="category" tickLine={false} axisLine={false} width={60} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="distance" fill="var(--color-distance)" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

