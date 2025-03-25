"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface BatteryGaugeProps {
  value: number
}

export default function VehicleBatteryGauge({ value }: BatteryGaugeProps) {
  // Determine color based on battery level
  let color = "hsl(var(--chart-1))"
  if (value < 20) {
    color = "hsl(var(--destructive))"
  } else if (value < 50) {
    color = "hsl(var(--warning))"
  }

  const data = [
    {
      name: "Battery",
      value: value,
      fill: color,
    },
  ]

  return (
    <ChartContainer
      config={{
        battery: {
          label: "Battery",
          color: color,
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          innerRadius="60%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="50%"
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background clockWise dataKey="value" cornerRadius={10} fill={color} />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-bold text-3xl"
          >
            {value}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

