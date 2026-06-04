"use client"

import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react"
import { type KPISummary } from "@/lib/dashboard-data"
import { AnimatedCounter } from "./animated-counter"

interface KPICardProps {
  kpi: KPISummary
  index: number
}

export function KPICard({ kpi, index }: KPICardProps) {
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
      case "up":
        return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" }
      case "down":
        return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
      default:
        return { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200" }
    }
  }

  const trendColors = getTrendColor()

  return (
    <div className={`card-premium kpi-card p-6 animate-fade-in-up delay-${index + 1}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="kpi-icon-wrap h-12 w-12 rounded-xl bg-gradient-to-br from-[#00AEEF]/15 to-[#0077b6]/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-[#00AEEF]" />
        </div>
        {kpi.trendValue && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trendColors.bg} ${trendColors.text} border ${trendColors.border}`}
          >
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
