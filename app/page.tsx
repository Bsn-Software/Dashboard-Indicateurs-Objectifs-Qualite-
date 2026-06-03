"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { useState, useEffect } from "react"
import { axesData, kpiSummary, type Axe, type Indicator, type KPISummary } from "@/lib/dashboard-data"

// Header Component
function DashboardHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo placeholder */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-lg font-bold">QP</span>
            </div>
            <span className="text-sm font-medium hidden sm:inline">Quality & Performance</span>
          </div>
          
          {/* Title and badge */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold text-center">
              Tableau de Bord Performance & Qualité
            </h1>
            <Badge 
              variant="secondary" 
              className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30"
            >
              Données En Direct (SharePoint)
            </Badge>
          </div>
          
          {/* Spacer for alignment */}
          <div className="w-10 sm:w-32" />
        </div>
      </div>
    </header>
  )
}

// KPI Summary Card Component
function KPICard({ kpi }: { kpi: KPISummary }) {
  const Icon = kpi.icon
  
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-success" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-danger" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }
  
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{kpi.title}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            {kpi.trendValue && (
              <span className="flex items-center gap-0.5 text-xs">
                {getTrendIcon()}
                <span className={kpi.trend === "up" ? "text-success" : kpi.trend === "down" ? "text-danger" : "text-muted-foreground"}>
                  {kpi.trendValue}
                </span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
        </div>
      </div>
    </Card>
  )
}

// Progress Bar Component
function ProgressBar({ percentage, status }: { percentage: number; status: "success" | "warning" | "danger" }) {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-success"
      case "warning":
        return "bg-warning"
      case "danger":
        return "bg-danger"
    }
  }
  
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full transition-all duration-500 ${getStatusColor()}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: "success" | "warning" | "danger" }) {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return { label: "Atteint", className: "bg-success/15 text-success border-success/30" }
      case "warning":
        return { label: "En cours", className: "bg-warning/15 text-warning border-warning/30" }
      case "danger":
        return { label: "Alerte", className: "bg-danger/15 text-danger border-danger/30" }
    }
  }
  
  const config = getStatusConfig()
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

// Indicator Table Row Component
function IndicatorRow({ indicator }: { indicator: Indicator }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      <td className="py-4 px-4">
        <div>
          <p className="font-medium text-foreground text-sm">{indicator.objectif}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{indicator.indice}</p>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-sm font-medium text-foreground">{indicator.cible}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{indicator.resultats}</span>
          <div className="w-24">
            <ProgressBar percentage={indicator.pourcentage} status={indicator.status} />
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <StatusBadge status={indicator.status} />
      </td>
    </tr>
  )
}

// Axe Card Component
function AxeCard({ axe }: { axe: Axe }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const Icon = axe.icon
  
  const successCount = axe.indicators.filter(i => i.status === "success").length
  const totalCount = axe.indicators.length
  
  return (
    <Card className="overflow-hidden">
      {/* Axe Header */}
      <div 
        className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{axe.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{axe.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">
                  {successCount}/{totalCount} objectifs atteints
                </span>
                <button 
                  className="text-primary text-xs font-medium flex items-center gap-1 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Placeholder for "Accéder" action
                  }}
                >
                  Accéder <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-2xl font-bold text-primary">
                {Math.round((successCount / totalCount) * 100)}%
              </span>
              <p className="text-xs text-muted-foreground">Conformité</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      
      {/* Indicators Table */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Objectif / Indice
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cible
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Résultats
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {axe.indicators.map((indicator) => (
                  <IndicatorRow key={indicator.id} indicator={indicator} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}

// Main Dashboard Component
export default function Dashboard() {
  const [liveAxes, setLiveAxes] = useState<Axe[]>(axesData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/indicators")
        const json = await res.json()
        if (json.success && json.data) {
          const mappedAxes = json.data.map((apiAxe: any, index: number) => {
            const mockAxe = axesData[index] || axesData[0]
            
            return {
              id: axesData[index] ? axesData[index].id : `axe-api-${index + 1}`,
              title: apiAxe.title,
              description: mockAxe.description,
              icon: mockAxe.icon,
              indicators: apiAxe.indicators.map((ind: any, i: number) => {
                let percent = 0
                let status: "success" | "warning" | "danger" = "warning"
                
                const resStr = String(ind.resultat || "")
                const resMatch = resStr.match(/(\d+)/)
                if (resMatch) {
                  percent = parseInt(resMatch[1], 10)
                  if (percent >= 90) status = "success"
                  else if (percent < 85) status = "danger"
                }

                return {
                  id: `ind-${index}-${i}`,
                  objectif: ind.objectif,
                  indice: ind.indicateur,
                  cible: ind.cible,
                  resultats: ind.resultat,
                  pourcentage: percent,
                  status: status
                }
              })
            }
          })
          setLiveAxes(mappedAxes)
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
      
      <main className="container mx-auto px-4 py-8">
        {/* KPI Summary Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Vue d&apos;ensemble</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiSummary.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>
        
        {/* Axes Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Axes Stratégiques</h2>
            {isLoading && <span className="text-sm text-muted-foreground animate-pulse">Synchronisation...</span>}
          </div>
          <div className="flex flex-col gap-6">
            {liveAxes.map((axe) => (
              <AxeCard key={axe.id} axe={axe} />
            ))}
          </div>
        </section>
        
        {/* Footer Note */}
        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Données synchronisées automatiquement depuis Microsoft SharePoint (Excel).
          </p>
        </footer>
      </main>
    </div>
  )
}
