"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface EnergyChartProps {
  data: { time: string; consumption: number; regeneration: number }[]
}

export default function VehicleEnergyChart({ data }: EnergyChartProps) {
  return (
    <ChartContainer
      config={{
        consumption: {
          label: "Consumption (kWh)",
          color: "hsl(var(--chart-1))",
        },
        regeneration: {
          label: "Regeneration (kWh)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
          <YAxis
            label={{ value: "kWh", angle: -90, position: "insideLeft", offset: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          <Bar
            dataKey="consumption"
            fill="var(--color-consumption)"
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="Consumption"
          />
          <Bar
            dataKey="regeneration"
            fill="var(--color-regeneration)"
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="Regeneration"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

