"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-[#00AEEF] text-white animate-fade-in-down">
      <div className="container mx-auto px-4 sm:px-6 py-5 relative z-10">
        <div className="flex items-center justify-between">
          {/* BSN Logo + Title */}
          <div className="flex items-center gap-4">
            <img
              src="/logo_carre_bsn.png"
              alt="BSN Logo"
              className="h-10 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-tight">
                Tableau de Bord Performance & Qualité
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge
                  variant="secondary"
                  className="live-badge bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 text-xs"
                >
                  Données En Direct
                </Badge>
                {currentTime && (
                  <span className="flex items-center gap-1.5 text-white/70 text-xs">
                    <Clock className="h-3 w-3" />
                    {currentTime}
                  </span>
                )}

                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Synchronisé · SharePoint
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
