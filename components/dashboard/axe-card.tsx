"use client"

import { useState } from "react"
import { ChevronUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type Axe, type Indicator } from "@/lib/dashboard-data"
import { CircularProgress } from "./circular-progress"

// ===== PROGRESS BAR =====
function ProgressBar({
  percentage,
  status,
}: {
  percentage: number
  status: "success" | "warning" | "danger"
}) {
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
          dot: "status-dot-success",
        }
      case "warning":
        return {
          label: "En cours",
          className: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
          dot: "status-dot-warning",
        }
      case "danger":
        return {
          label: "Alerte",
          className: "bg-red-50 text-red-700 border-red-200 shadow-red-100",
          dot: "status-dot-danger",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge
      variant="outline"
      className={`${config.className} shadow-sm font-semibold text-xs px-3 py-1 gap-1.5`}
    >
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
const AXE_COLORS = [
  { bg: "bg-[#00AEEF]/8", iconColor: "text-[#00AEEF]" },
  { bg: "bg-emerald-500/8", iconColor: "text-emerald-500" },
  { bg: "bg-violet-500/8", iconColor: "text-violet-500" },
  { bg: "bg-orange-500/8", iconColor: "text-orange-500" },
]

interface AxeCardProps {
  axe: Axe
  index: number
}

export function AxeCard({ axe, index }: AxeCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const Icon = axe.icon

  const successCount = axe.indicators.filter((i) => i.status === "success").length
  const totalCount = axe.indicators.length
  const conformity = Math.round((successCount / totalCount) * 100)
  const colors = AXE_COLORS[index % AXE_COLORS.length]

  return (
    <div className={`axe-card bg-white animate-fade-in-up delay-${index + 2}`}>
      {/* Axe Header */}
      <div
        className="axe-header p-6 cursor-pointer hover:bg-slate-50/50 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`h-14 w-14 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110`}
            >
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
                          ind.status === "success"
                            ? "bg-emerald-400"
                            : ind.status === "warning"
                            ? "bg-amber-400"
                            : "bg-red-400"
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
                  onClick={(e) => e.stopPropagation()}
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
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isExpanded ? "bg-[#00AEEF]/10 rotate-0" : "bg-slate-100 rotate-180"
              }`}
            >
              <ChevronUp
                className={`h-4 w-4 ${
                  isExpanded ? "text-[#00AEEF]" : "text-slate-400"
                } transition-transform duration-300`}
              />
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
