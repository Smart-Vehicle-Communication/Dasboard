"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SpeedChartProps {
  data: { time: string; speed: number }[]
}

export default function VehicleSpeedChart({ data }: SpeedChartProps) {
  return (
    <ChartContainer
      config={{
        speed: {
          label: "Speed",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
          <YAxis
            label={{ value: "km/h", angle: -90, position: "insideLeft", offset: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="var(--color-speed)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

