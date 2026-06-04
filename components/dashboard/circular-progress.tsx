"use client"

import { useState, useEffect } from "react"

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ percentage, size = 64, strokeWidth = 5 }: CircularProgressProps) {
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
