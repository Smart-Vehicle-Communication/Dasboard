"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface MainNavProps {
  vehicleId: string
}

export default function MainNav({ vehicleId }: MainNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-primary/10 text-primary">
          {pathname.includes("dashboard")
            ? "Dashboard"
            : pathname.includes("fleet-management")
              ? "Fleet Management"
              : "V2V Connect"}
        </div>
      </div>

      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 bg-white shadow-lg rounded-b-lg p-4 border-t">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                {pathname.includes("dashboard")
                  ? "Dashboard"
                  : pathname.includes("fleet-management")
                    ? "Fleet Management"
                    : "V2V Connect"}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

