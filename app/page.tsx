"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Building2, Users } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  const handleUserClick = () => {
    router.push('/users')
  }

  const handleProductionClick = () => {
    router.push('/production')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">V2V Connect</h1>
            </div>
            <div className="text-sm text-muted-foreground">Autonomous Vehicle Network</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary tracking-tight mb-4">
              Welcome to V2V Connect
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your access type to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              className="bg-white/70 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={handleUserClick}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Users</CardTitle>
                <CardDescription className="text-center">
                  Access vehicle monitoring and tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">Continue as User</Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/70 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={handleProductionClick}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Production</CardTitle>
                <CardDescription className="text-center">
                  Access fleet management dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">Continue as Admin</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="w-full bg-white/80 backdrop-blur-sm py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 V2V Connect | Autonomous Vehicle Network
          </div>
        </div>
      </footer>
    </div>
  )
}

