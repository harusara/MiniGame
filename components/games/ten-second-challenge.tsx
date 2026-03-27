"use client"

import { useEffect, useRef, useState } from "react"
import type { GameComponentProps } from "@/components/games/types"

type GameState = "idle" | "running" | "stopped"

const TARGET_MS = 10000

function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(3)
}

function getEvaluation(diffMs: number): string {
  if (diffMs <= 10) return "神！ほぼ完璧！"
  if (diffMs <= 50) return "すごい！かなり正確！"
  if (diffMs <= 150) return "惜しい！あと少し！"
  if (diffMs <= 300) return "なかなか良い！"
  return "もう一回チャレンジ！"
}

export function TenSecondChallenge({ onResult }: GameComponentProps) {
  const [gameState, setGameState] = useState<GameState>("idle")
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (gameState !== "running") return

    const tick = () => {
      if (startTimeRef.current !== null) {
        setElapsedMs(performance.now() - startTimeRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [gameState])

  const handleStart = () => {
    startTimeRef.current = performance.now()
    setElapsedMs(0)
    setGameState("running")
    onResult({})
  }

  const handleStop = () => {
    if (startTimeRef.current === null) return
    const finalMs = performance.now() - startTimeRef.current
    const diffMs = Math.abs(finalMs - TARGET_MS)

    setElapsedMs(finalMs)
    setGameState("stopped")
    onResult({
      score: `${formatSeconds(finalMs)} 秒`,
      message: `${getEvaluation(diffMs)}（誤差 ${formatSeconds(diffMs)} 秒）`,
    })
  }

  const isRunning = gameState === "running"

  return (
    <div className="w-full px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-background/70 p-6 shadow-sm">
        <p className="mb-3 text-center text-sm text-muted-foreground">経過時間</p>
        <p className="text-center font-mono text-5xl font-bold text-primary sm:text-7xl">
          {formatSeconds(elapsedMs)}s
        </p>
        <div className="mt-6 flex justify-center">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="h-14 min-w-40 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              スタート
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="h-14 min-w-40 rounded-xl bg-red-500 px-8 text-lg font-semibold text-white transition hover:bg-red-600"
            >
              ストップ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

