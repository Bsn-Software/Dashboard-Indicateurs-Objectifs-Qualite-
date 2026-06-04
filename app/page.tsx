"use client"

import { useState, useEffect } from "react"
import { Activity, Zap } from "lucide-react"

import { axesData, kpiSummary, type Axe } from "@/lib/dashboard-data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { AxeCard } from "@/components/dashboard/axe-card"

function mapApiToAxes(apiData: any[]): Axe[] {
  return apiData.map((apiAxe, index) => {
    return {
      id: axesData[index] ? axesData[index].id : `axe-api-${index + 1}`,
      title: apiAxe.title,
      description: axesData[index]?.description ?? axesData[0].description,
      icon: axesData[index]?.icon ?? axesData[0].icon,
      indicators: apiAxe.indicators.map((ind: any, i: number) => {
        let percent = 0
        let status: "success" | "warning" | "danger" = "warning"

        const cibleStr = String(ind.cible || "").trim()
        const resStr = String(ind.resultat || "").trim()

        // Special case: target is 0 (e.g. "0 non-conformités") → 0 result = perfect score
        if (cibleStr === "0" && (resStr === "0" || resStr === "")) {
          percent = 100
          status = "success"
        } else {
          // Try to extract a numeric value from the result
          const resMatch = resStr.match(/(\d+)/)
          if (resMatch) {
            percent = parseInt(resMatch[1], 10)

            // Check if the result looks like a percentage (contains %)
            const isPercentage = resStr.includes("%")

            if (isPercentage) {
              // Standard percentage comparison
              if (percent >= 90) status = "success"
              else if (percent < 85) status = "danger"
              else status = "warning"
            } else {
              // Count-based indicator: compare result vs target threshold (e.g., "≥ 3 / an")
              const targetMatch = cibleStr.match(/(\d+)/)
              if (targetMatch) {
                const targetNum = parseInt(targetMatch[1], 10)
                if (percent >= targetNum) status = "success"
                else if (percent < targetNum * 0.8) status = "danger"
                else status = "warning"
                // Cap display percentage at 100 for the progress bar
                percent = Math.min(Math.round((percent / (targetNum || 1)) * 100), 100)
              } else {
                // Fallback
                if (percent >= 90) status = "success"
                else if (percent < 85) status = "danger"
              }
            }
          }
        }

        return {
          id: `ind-${index}-${i}`,
          objectif: ind.objectif,
          indice: ind.indicateur,
          cible: ind.cible,
          resultats: ind.resultat,
          pourcentage: percent,
          status,
        }
      }),
    }
  })
}

export default function Dashboard() {
  const [liveAxes, setLiveAxes] = useState<Axe[]>(axesData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/indicators")
        const json = await res.json()
        if (json.success && json.data) {
          setLiveAxes(mapApiToAxes(json.data))
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* KPI Summary Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title text-lg font-bold text-foreground">
              <Zap className="h-5 w-5 text-[#00AEEF]" />
              Vue d&apos;ensemble
            </h2>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-[#00AEEF] animate-pulse">
                <div className="h-2 w-2 rounded-full bg-[#00AEEF] animate-live-pulse" />
                Synchronisation...
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kpiSummary.map((kpi, index) => (
              <KPICard key={kpi.id} kpi={kpi} index={index} />
            ))}
          </div>
        </section>

        {/* Axes Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title text-lg font-bold text-foreground">
              <Activity className="h-5 w-5 text-[#00AEEF]" />
              Axes Stratégiques
            </h2>
            <span className="text-xs font-medium text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-full">
              {liveAxes.length} axes •{" "}
              {liveAxes.reduce((sum, a) => sum + a.indicators.length, 0)} indicateurs
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {liveAxes.map((axe, index) => (
              <AxeCard key={axe.id} axe={axe} index={index} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo_carre_bsn.png"
                alt="BSN"
                className="h-6 w-6 object-contain opacity-40"
              />
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} BSN — Tableau de bord Qualité & Performance
              </p>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="status-dot status-dot-success" style={{ width: 6, height: 6 }} />
              Données synchronisées depuis Microsoft SharePoint
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
