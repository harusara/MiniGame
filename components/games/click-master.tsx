"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { GameComponentProps } from "@/components/games/types"
import { cn } from "@/lib/utils"

const DURATION_MS = 10_000

type Phase = "idle" | "playing" | "finished"

function getRankComment(count: number): string {
  if (count >= 90) return "神連打！伝説の指！"
  if (count >= 75) return "神連打！人間業じゃない！"
  if (count >= 60) return "プロ級連打！圧巻！"
  if (count >= 48) return "神速の指！すごい集中力！"
  if (count >= 36) return "連打上手！かなり速い！"
  if (count >= 24) return "なかなかの速さ！もう一息！"
  if (count >= 12) return "いい感じ！リズムをつかめ！"
  if (count > 0) return "はじめの一歩！次はもっと！"
  return "今度は連打に挑戦！"
}

export function ClickMaster({ onResult }: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [timeLeftMs, setTimeLeftMs] = useState(DURATION_MS)
  const [count, setCount] = useState(0)
  const [squash, setSquash] = useState(false)
  const endTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const countRef = useRef(0)
  const gameEndedRef = useRef(false)
  const squashTimerRef = useRef<number | null>(null)

  useEffect(() => {
    countRef.current = count
  }, [count])

  const finishGame = useCallback(
    (finalCount: number) => {
      setPhase("finished")
      onResult({
        score: `${finalCount} 回`,
        message: getRankComment(finalCount),
      })
    },
    [onResult]
  )

  const startGame = () => {
    onResult({})
    gameEndedRef.current = false
    countRef.current = 0
    setCount(0)
    setTimeLeftMs(DURATION_MS)
    endTimeRef.current = performance.now() + DURATION_MS
    setPhase("playing")
  }

  useEffect(() => {
    if (phase !== "playing" || endTimeRef.current === null) return

    const tick = () => {
      const end = endTimeRef.current
      if (end === null) return
      const remaining = Math.max(0, end - performance.now())
      setTimeLeftMs(remaining)
      if (remaining <= 0) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        endTimeRef.current = null
        if (!gameEndedRef.current) {
          gameEndedRef.current = true
          finishGame(countRef.current)
        }
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [phase, finishGame])

  useEffect(() => {
    return () => {
      if (squashTimerRef.current !== null) {
        window.clearTimeout(squashTimerRef.current)
      }
    }
  }, [])

  const triggerSquash = () => {
    if (squashTimerRef.current !== null) {
      window.clearTimeout(squashTimerRef.current)
    }
    setSquash(true)
    squashTimerRef.current = window.setTimeout(() => {
      setSquash(false)
      squashTimerRef.current = null
    }, 90)
  }

  const handleAreaClick = () => {
    if (phase !== "playing") return
    triggerSquash()
    setCount((c) => {
      const next = c + 1
      countRef.current = next
      return next
    })
  }

  const secondsLeft = Math.ceil(timeLeftMs / 1000)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-3 py-2 sm:gap-4">
      {phase === "idle" && (
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground sm:text-base">
            制限時間 10 秒・このエリアをひたすらクリック（タップ可）
          </p>
          <button
            type="button"
            onClick={startGame}
            className="h-12 min-w-44 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            スタート
          </button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
            <span className="rounded-full bg-background/90 px-4 py-1.5 font-medium shadow-sm ring-1 ring-border/60">
              残り{" "}
              <span className="tabular-nums font-bold text-primary">{secondsLeft}</span> 秒
            </span>
            <span className="rounded-full bg-background/90 px-4 py-1.5 font-medium shadow-sm ring-1 ring-border/60">
              <span className="tabular-nums font-bold text-primary">{count}</span> 回
            </span>
          </div>

          <button
            type="button"
            onClick={handleAreaClick}
            className={cn(
              "relative flex h-[min(52vh,22rem)] w-full max-w-2xl touch-manipulation select-none flex-col items-center justify-center gap-2 rounded-3xl border-2 border-primary/25 bg-gradient-to-b from-primary/15 to-primary/5 text-center shadow-inner outline-none ring-offset-background transition-[transform,box-shadow] duration-100 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring",
              squash ? "scale-[0.97] shadow-md" : "scale-100 shadow-sm"
            )}
          >
            <span className="text-5xl font-black tabular-nums text-primary sm:text-6xl">{count}</span>
            <span className="text-base font-semibold text-foreground sm:text-lg">タップして連打！</span>
            <span className="text-xs text-muted-foreground sm:text-sm">（マウス・タッチどちらでも）</span>
          </button>
        </>
      )}

      {phase === "finished" && (
        <div className="flex max-w-md flex-col items-center gap-3 px-2 text-center">
          <p className="text-sm text-muted-foreground">タイムアップ</p>
          <p className="text-4xl font-bold tabular-nums text-primary sm:text-5xl">{count} 回</p>
          <p className="text-lg font-semibold text-foreground">{getRankComment(count)}</p>
          <p className="text-sm text-muted-foreground">もう一度は下の「もう一度プレイ」から</p>
        </div>
      )}
    </div>
  )
}
