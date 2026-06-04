"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: string
  suffix?: string
}

export function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
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
