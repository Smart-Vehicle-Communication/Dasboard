"use client"

import { CloudSun, CloudRain, Wind, Thermometer } from "lucide-react"

interface WeatherWidgetProps {
  weather: {
    condition: string
    temperature: number
    wind: number
    visibility: number
    forecast: string
  }
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Sunny":
        return (
          <div className="bg-yellow-100 rounded-full p-2">
            <CloudSun className="h-8 w-8 text-yellow-500" />
          </div>
        )
      case "Rainy":
        return (
          <div className="bg-blue-100 rounded-full p-2">
            <CloudRain className="h-8 w-8 text-blue-500" />
          </div>
        )
      case "Windy":
        return (
          <div className="bg-gray-100 rounded-full p-2">
            <Wind className="h-8 w-8 text-gray-500" />
          </div>
        )
      case "Partly Cloudy":
        return (
          <div className="bg-purple-100 rounded-full p-2">
            <CloudSun className="h-8 w-8 text-purple-500" />
          </div>
        )
      default:
        return (
          <div className="bg-blue-100 rounded-full p-2">
            <CloudSun className="h-8 w-8 text-blue-500" />
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {getWeatherIcon(weather.condition)}
        <div className="ml-3">
          <h3 className="font-medium">{weather.condition}</h3>
          <p className="text-sm text-muted-foreground">{weather.forecast}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end">
          <Thermometer className="h-4 w-4 mr-1 text-red-500" />
          <span className="font-medium">{weather.temperature}°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Wind: {weather.wind} km/h • Visibility: {weather.visibility} km
        </p>
      </div>
    </div>
  )
}

