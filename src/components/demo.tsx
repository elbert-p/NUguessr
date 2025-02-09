"use client"

import React from "react"
import Timer from "./timer"
import { Button } from "./ui/button"
import { useState } from "react"

export default function TimerDemo() {
  const [showMessage, setShowMessage] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Timer seconds={99} onComplete={() => setShowMessage(true)} />
      {showMessage && <p className="text-green-500 font-medium">Timer complete!</p>}
      <Button onClick={() => setShowMessage(false)} variant="outline">
        Reset
      </Button>
    </div>
  )
}

