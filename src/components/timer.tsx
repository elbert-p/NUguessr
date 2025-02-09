"use client"

import React from "react"
import { useEffect, useState } from "react"
import { cn } from "../lib/utils"

interface TimerProps {
  seconds: number
  onComplete?: () => void
  className?: string
}

export default function Timer({ seconds, onComplete, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const remainingSeconds = timeLeft % 60

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`

  return (
  <div
    className={cn(
      "bg-black/90 text-white px-6 py-2 rounded-full text-2xl font-mono tracking-wider",
      "shadow-[0_0_40px_rgba(220,38,38,0.5)] border-2 border-red-600",
      className,
    )}
  >
    {formattedTime}
  </div>
  )
}

