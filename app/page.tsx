"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  Clock,
  LayoutDashboard
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { axesData, kpiSummary, type Axe, type Indicator, type KPISummary } from "@/lib/dashboard-data"

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const numericMatch = value.match(/^([\d.]+)(.*)$/)
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numericMatch) return
    const target = parseFloat(numericMatch[1])
    const duration = 1200
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayValue(Math.round(eased * target * 10) / 10)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])

  if (!numericMatch) return <span>{value}{suffix}</span>
  
  const rest = numericMatch[2] || ""
  return (
    <span ref={ref}>
      {Number.isInteger(parseFloat(numericMatch[1])) 
        ? Math.round(displayValue) 
        : displayValue.toFixed(1)}
      {rest}{suffix}
    </span>
  )
}

// ===== CIRCULAR PROGRESS =====
function CircularProgress({ percentage, size = 64, strokeWidth = 5 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage, circumference])

  const getColor = () => {
    if (percentage >= 90) return "#10b981"
    if (percentage >= 75) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 174, 239, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${getColor()}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: getColor() }}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

// ===== HEADER COMPONENT =====
function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }))
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
            <img src="/logo_carre_bsn.png" alt="BSN Logo" className="h-10 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ===== KPI CARD =====
function KPICard({ kpi, index }: { kpi: KPISummary; index: number }) {
  const Icon = kpi.icon
  
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case "up":
        return <TrendingUp className="h-3.5 w-3.5" />
      case "down":
        return <TrendingDown className="h-3.5 w-3.5" />
      default:
        return <Minus className="h-3.5 w-3.5" />
    }
  }

  const getTrendColor = () => {
    switch (kpi.trend) {
      case "up": return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" }
      case "down": return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
      default: return { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200" }
    }
  }

  const trendColors = getTrendColor()
  
  return (
    <div 
      className={`card-premium kpi-card p-6 animate-fade-in-up delay-${index + 1}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`kpi-icon-wrap h-12 w-12 rounded-xl bg-gradient-to-br from-[#00AEEF]/15 to-[#0077b6]/10 flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-[#00AEEF]" />
        </div>
        {kpi.trendValue && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trendColors.bg} ${trendColors.text} border ${trendColors.border}`}>
            {getTrendIcon()}
            {kpi.trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
        <p className="text-3xl font-extrabold text-foreground tracking-tight">
          <AnimatedCounter value={kpi.value} />
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-[#00AEEF]/60" />
          {kpi.description}
        </p>
      </div>
    </div>
  )
}

// ===== PROGRESS BAR =====
function ProgressBar({ percentage, status }: { percentage: number; status: "success" | "warning" | "danger" }) {
  const getGradient = () => {
    switch (status) {
      case "success":
        return "bg-gradient-to-r from-emerald-400 to-emerald-500"
      case "warning":
        return "bg-gradient-to-r from-amber-400 to-amber-500"
      case "danger":
        return "bg-gradient-to-r from-red-400 to-red-500"
    }
  }
  
  return (
    <div className="progress-bar-animated w-full bg-slate-100 h-2 rounded-full">
      <div 
        className={`progress-fill h-2 rounded-full ${getGradient()}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

// ===== STATUS BADGE =====
function StatusBadge({ status }: { status: "success" | "warning" | "danger" }) {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return { 
          label: "Atteint", 
          className: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100",
          dot: "status-dot-success"
        }
      case "warning":
        return { 
          label: "En cours", 
          className: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
          dot: "status-dot-warning"
        }
      case "danger":
        return { 
          label: "Alerte", 
          className: "bg-red-50 text-red-700 border-red-200 shadow-red-100",
          dot: "status-dot-danger"
        }
    }
  }
  
  const config = getStatusConfig()
  
  return (
    <Badge variant="outline" className={`${config.className} shadow-sm font-semibold text-xs px-3 py-1 gap-1.5`}>
      <span className={`status-dot ${config.dot}`} />
      {config.label}
    </Badge>
  )
}

// ===== INDICATOR ROW =====
function IndicatorRow({ indicator, index }: { indicator: Indicator; index: number }) {
  return (
    <tr 
      className="border-b border-slate-100 last:border-0 hover:bg-[#00AEEF]/[0.02] transition-all duration-200 group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <td className="py-4 px-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#00AEEF]/40 shrink-0 group-hover:bg-[#00AEEF] transition-colors" />
          <div>
            <p className="font-semibold text-foreground text-sm leading-snug">{indicator.objectif}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{indicator.indice}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-center">
        <span className="text-sm font-semibold text-foreground bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
          {indicator.cible}
        </span>
      </td>
      <td className="py-4 px-5">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-foreground">{indicator.resultats}</span>
          <div className="w-28">
            <ProgressBar percentage={indicator.pourcentage} status={indicator.status} />
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-center">
        <StatusBadge status={indicator.status} />
      </td>
    </tr>
  )
}

// ===== AXE CARD =====
function AxeCard({ axe, index }: { axe: Axe; index: number }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const Icon = axe.icon
  
  const successCount = axe.indicators.filter(i => i.status === "success").length
  const totalCount = axe.indicators.length
  const conformity = Math.round((successCount / totalCount) * 100)

  // Color palette per axe index
  const axeColors = [
    { gradient: "from-[#00AEEF] to-[#0077b6]", bg: "bg-[#00AEEF]/8", iconColor: "text-[#00AEEF]" },
    { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/8", iconColor: "text-emerald-500" },
    { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-500/8", iconColor: "text-violet-500" },
  ]
  const colors = axeColors[index % axeColors.length]
  
  return (
    <div className={`axe-card bg-white animate-fade-in-up delay-${index + 2}`}>
      {/* Axe Header */}
      <div 
        className="axe-header p-6 cursor-pointer hover:bg-slate-50/50 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`h-14 w-14 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110`}>
              <Icon className={`h-7 w-7 ${colors.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground truncate">{axe.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{axe.description}</p>
              <div className="flex items-center gap-4 mt-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {axe.indicators.map((ind, i) => (
                      <div 
                        key={ind.id}
                        className={`w-3 h-3 rounded-full border-2 border-white ${
                          ind.status === "success" ? "bg-emerald-400" : 
                          ind.status === "warning" ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ zIndex: axe.indicators.length - i }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {successCount}/{totalCount} atteints
                  </span>
                </div>
                <button 
                  className="text-[#00AEEF] text-xs font-semibold flex items-center gap-1 hover:text-[#0077b6] transition-colors group/link"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  Accéder 
                  <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <CircularProgress percentage={conformity} />
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-[#00AEEF]/10 rotate-0" : "bg-slate-100 rotate-180"}`}>
              <ChevronUp className={`h-4 w-4 ${isExpanded ? "text-[#00AEEF]" : "text-slate-400"} transition-transform duration-300`} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicators Table */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="table-premium w-full">
              <thead>
                <tr>
                  <th className="py-3.5 px-5 text-left text-xs font-bold text-[#00AEEF]/70 uppercase tracking-wider">
                    Objectif / Indice
                  </th>
                  <th className="py-3.5 px-5 text-center text-xs font-bold text-[#00AEEF]/70 uppercase tracking-wider">
                    Cible
                  </th>
                  <th className="py-3.5 px-5 text-center text-xs font-bold text-[#00AEEF]/70 uppercase tracking-wider">
                    Résultats
                  </th>
                  <th className="py-3.5 px-5 text-center text-xs font-bold text-[#00AEEF]/70 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {axe.indicators.map((indicator, i) => (
                  <IndicatorRow key={indicator.id} indicator={indicator} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== MAIN DASHBOARD =====
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
              {liveAxes.length} axes • {liveAxes.reduce((sum, a) => sum + a.indicators.length, 0)} indicateurs
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
              <img src="/logo_carre_bsn.png" alt="BSN" className="h-6 w-6 object-contain opacity-40" />
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
