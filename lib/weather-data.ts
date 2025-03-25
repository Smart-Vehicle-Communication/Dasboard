// Generate mock weather data
export function generateMockWeather(position: { lat: number; lng: number }) {
  // Bangalore-specific weather conditions (more likely to be sunny or rainy depending on season)
  const conditions = ["Sunny", "Partly Cloudy", "Rainy"]
  const forecasts = [
    "Clear skies throughout the day",
    "Light rain expected in the afternoon",
    "Partly cloudy with occasional showers",
    "Pleasant weather with moderate temperatures",
  ]

  // Bangalore typically has moderate temperatures (20-30°C)
  return {
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
    wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    forecast: forecasts[Math.floor(Math.random() * forecasts.length)],
    position: {
      lat: position.lat,
      lng: position.lng,
    },
  }
}

// Generate detailed weather forecast
export function generateDetailedWeatherForecast(position: { lat: number; lng: number }) {
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"]
  const hourlyForecast = []
  const dailyForecast = []

  // Generate hourly forecast for next 24 hours
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000)
    hourlyForecast.push({
      time: forecastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C for Bangalore
      precipitation: Math.floor(Math.random() * 50), // 0-50%
      wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    })
  }

  // Generate daily forecast for next 7 days
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    dailyForecast.push({
      date: forecastDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      highTemp: Math.floor(Math.random() * 5) + 25, // 25-30°C high for Bangalore
      lowTemp: Math.floor(Math.random() * 5) + 18, // 18-23°C low for Bangalore
      precipitation: Math.floor(Math.random() * 50), // 0-50%
      wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    })
  }

  return {
    current: {
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
      feelsLike: Math.floor(Math.random() * 10) + 20, // 20-30°C
      wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      pressure: Math.floor(Math.random() * 10) + 1010, // 1010-1020 hPa
      uvIndex: Math.floor(Math.random() * 5) + 6, // 6-11 (higher UV in Bangalore)
    },
    hourly: hourlyForecast,
    daily: dailyForecast,
    alerts:
      Math.random() > 0.8
        ? [
            {
              type: ["Heavy Rain", "Thunderstorm", "Flash Flood"][Math.floor(Math.random() * 3)],
              severity: ["Minor", "Moderate", "Severe"][Math.floor(Math.random() * 3)],
              timeStart: new Date(now.getTime() + Math.floor(Math.random() * 12) * 60 * 60 * 1000).toLocaleTimeString(),
              timeEnd: new Date(
                now.getTime() + (12 + Math.floor(Math.random() * 12)) * 60 * 60 * 1000,
              ).toLocaleTimeString(),
              description: "Weather alert issued for Bangalore. Take necessary precautions.",
            },
          ]
        : [],
  }
}

