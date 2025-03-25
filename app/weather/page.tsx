"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CloudSun, CloudRain, Wind, Thermometer, Droplets, Sun, AlertTriangle } from "lucide-react"
import MainNav from "@/components/main-nav"
import { generateMockVehicles } from "@/lib/mock-data"
import { generateDetailedWeatherForecast } from "@/lib/weather-data"

export default function WeatherPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vehicleId = searchParams.get("vehicleId") || ""
  const [currentVehicle, setCurrentVehicle] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("current")

  useEffect(() => {
    if (!vehicleId) {
      router.push("/")
      return
    }

    // Generate mock data
    const allVehicles = generateMockVehicles(10, vehicleId)
    const current = allVehicles.find((v) => v.id === vehicleId)

    if (current) {
      setCurrentVehicle(current)

      // Generate mock weather data
      const weatherData = generateDetailedWeatherForecast(current.position)
      setWeather(weatherData)
    }
  }, [vehicleId, router])

  const getWeatherIcon = (condition: string, size = 5) => {
    switch (condition) {
      case "Sunny":
        return <Sun className={`h-${size} w-${size} text-yellow-500`} />
      case "Partly Cloudy":
        return <CloudSun className={`h-${size} w-${size} text-blue-400`} />
      case "Cloudy":
        return <CloudSun className={`h-${size} w-${size} text-gray-500`} />
      case "Rainy":
        return <CloudRain className={`h-${size} w-${size} text-blue-500`} />
      case "Windy":
        return <Wind className={`h-${size} w-${size} text-gray-500`} />
      case "Stormy":
        return <AlertTriangle className={`h-${size} w-${size} text-amber-500`} />
      default:
        return <CloudSun className={`h-${size} w-${size} text-blue-400`} />
    }
  }

  if (!currentVehicle || !weather) {
    return <div className="flex min-h-screen items-center justify-center">Loading weather data...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 w-full bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="p-0" onClick={() => router.push("/")}>
                <span className="flex items-center font-bold text-xl">
                  <span className="text-primary">V2V</span>
                  <span className="text-muted-foreground">Connect</span>
                </span>
              </Button>
            </div>

            <MainNav vehicleId={vehicleId} />

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard?vehicleId=${vehicleId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <CloudSun className="mr-2 h-6 w-6 text-blue-500" />
                Weather Conditions
              </h1>
              <p className="text-muted-foreground">Current and forecasted weather for your vehicle's location</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="daily">7-Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="current" className="mt-0 space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center mb-4">
                      {getWeatherIcon(weather.current.condition, 16)}
                      <div className="ml-4">
                        <h2 className="text-4xl font-bold">{weather.current.temperature}°C</h2>
                        <p className="text-lg text-muted-foreground">{weather.current.condition}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">Feels like {weather.current.feelsLike}°C</p>

                    {weather.alerts && weather.alerts.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 w-full mt-2">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">{weather.alerts[0].type} Alert</p>
                            <p className="text-sm text-amber-700">{weather.alerts[0].description}</p>
                            <p className="text-xs text-amber-600 mt-1">
                              {weather.alerts[0].timeStart} - {weather.alerts[0].timeEnd}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/70">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Wind className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-muted-foreground">Wind</p>
                            <p className="font-medium">{weather.current.wind} km/h</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/70">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                            <p className="font-medium">{weather.current.humidity}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/70">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                          <div>
                            <p className="text-sm text-muted-foreground">UV Index</p>
                            <p className="font-medium">{weather.current.uvIndex}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/70">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pressure</p>
                            <p className="font-medium">{weather.current.pressure} hPa</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Driving Conditions</CardTitle>
                <CardDescription>Weather impact on driving conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Wind className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Road Visibility</h3>
                          <p className="text-sm text-muted-foreground">{weather.current.visibility} km</p>
                          <p className="text-sm mt-1">
                            {weather.current.visibility > 5 ? "Good visibility" : "Reduced visibility"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <CloudRain className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Road Conditions</h3>
                          <p className="text-sm text-muted-foreground">
                            {weather.current.condition === "Rainy" || weather.current.condition === "Stormy"
                              ? "Wet roads"
                              : "Dry roads"}
                          </p>
                          <p className="text-sm mt-1">
                            {weather.current.condition === "Rainy" || weather.current.condition === "Stormy"
                              ? "Reduce speed"
                              : "Normal driving conditions"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <AlertTriangle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Recommended Action</h3>
                          <p className="text-sm text-muted-foreground">
                            {weather.current.condition === "Stormy"
                              ? "Extreme caution"
                              : weather.current.condition === "Rainy" || weather.current.condition === "Windy"
                                ? "Drive with caution"
                                : "Normal driving"}
                          </p>
                          <p className="text-sm mt-1">
                            {weather.current.condition === "Stormy"
                              ? "Consider delaying travel"
                              : weather.current.condition === "Rainy"
                                ? "Increase following distance"
                                : "Maintain safe driving practices"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hourly" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Hourly Forecast</CardTitle>
                <CardDescription>Weather forecast for the next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-flex space-x-4 pb-4 min-w-full">
                    {weather.hourly.map((hour: any, index: number) => (
                      <Card key={index} className="w-[120px] flex-shrink-0">
                        <CardContent className="p-3 text-center">
                          <p className="text-sm font-medium mb-2">{hour.time}</p>
                          <div className="flex justify-center mb-2">{getWeatherIcon(hour.condition)}</div>
                          <p className="text-lg font-bold">{hour.temperature}°C</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>Wind: {hour.wind} km/h</p>
                            <p>Precip: {hour.precipitation}%</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>7-Day Forecast</CardTitle>
                <CardDescription>Extended weather forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weather.daily.map((day: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="p-4 md:w-1/4 flex items-center justify-center bg-muted/30">
                            <div className="text-center">
                              <p className="font-bold">{day.date}</p>
                              <div className="flex justify-center my-2">{getWeatherIcon(day.condition, 8)}</div>
                              <p className="text-sm">{day.condition}</p>
                            </div>
                          </div>

                          <div className="p-4 md:w-3/4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Temperature</p>
                                <p className="font-medium">
                                  {day.highTemp}° / {day.lowTemp}°
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Precipitation</p>
                                <p className="font-medium">{day.precipitation}%</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Wind</p>
                                <p className="font-medium">{day.wind} km/h</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Driving Conditions</p>
                                <p className="font-medium">
                                  {day.condition === "Sunny" || day.condition === "Partly Cloudy"
                                    ? "Excellent"
                                    : day.condition === "Cloudy"
                                      ? "Good"
                                      : day.condition === "Rainy" || day.condition === "Windy"
                                        ? "Fair"
                                        : "Poor"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  )
}

