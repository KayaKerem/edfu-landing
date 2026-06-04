'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#a855f7', '#16a34a', '#2563eb', '#0891b2', '#a16207', '#dc2626']

interface OnboardingConfettiProps {
  trigger: number
}

export function OnboardingConfetti({ trigger }: OnboardingConfettiProps) {
  const [dots, setDots] = useState<
    { id: string; left: number; delay: number; color: string; size: number }[]
  >([])

  useEffect(() => {
    if (!trigger) return
    setDots(
      Array.from({ length: 22 }, (_, i) => ({
        id: `${trigger}-${i}`,
        left: 30 + Math.random() * 40,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
        size: 4 + Math.random() * 4,
      })),
    )
    const t = setTimeout(() => setDots([]), 1800)
    return () => clearTimeout(t)
  }, [trigger])

  if (!dots.length) return null
  return (
    <div className="ob-confetti">
      {dots.map(d => (
        <span
          key={d.id}
          className="ob-confetti-dot"
          style={{
            left: `${d.left}%`,
            background: d.color,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
