"use client"

import { useEffect, useRef, useState } from "react"
import type { GameComponentProps } from "@/components/games/types"

type ReactionState = "idle" | "waiting" | "ready" | "result"

function getEvaluation(ms: number): string {
  if (ms <= 180) return "プロ級"
  if (ms <= 280) return "早い"
  return "普通"
}

export function ReactionTest({ onResult }: GameComponentProps) {
  const [state, setState] = useState<ReactionState>("idle")
  const [reactionMs, setReactionMs] = useState<number | null>(null)
  const startRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startRound = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    const delay = Math.floor(Math.random() * 4000) + 1000
    setReactionMs(null)
    setState("waiting")
    onResult({})

    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now()
      setState("ready")
    }, delay)
  }

  const handleAreaClick = () => {
    if (state === "idle" || state === "result") {
      startRound()
      return
    }

    if (state === "waiting") {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      setState("result")
      setReactionMs(null)
      onResult({
        score: "フライング",
        message: "早すぎクリックです。もう一度チャレンジ！",
      })
      return
    }

    if (state === "ready" && startRef.current !== null) {
      const ms = Math.round(performance.now() - startRef.current)
      setReactionMs(ms)
      setState("result")
      onResult({
        score: `${ms} ms`,
        message: `評価: ${getEvaluation(ms)}`,
      })
    }
  }

  const areaStyle =
    state === "ready"
      ? "bg-emerald-500 text-white"
      : state === "waiting"
        ? "bg-amber-500 text-white"
        : "bg-slate-700 text-white"

  return (
    <button
      type="button"
      onClick={handleAreaClick}
      className={`flex h-full w-full flex-col items-center justify-center rounded-2xl px-6 py-6 text-center transition-colors ${areaStyle}`}
    >
      {state === "idle" && (
        <>
          <p className="text-3xl font-bold sm:text-4xl">リアクションテスト</p>
          <p className="mt-3 text-base sm:text-lg">クリックでスタート</p>
        </>
      )}

      {state === "waiting" && (
        <>
          <p className="text-4xl font-bold sm:text-5xl">準備中...</p>
          <p className="mt-3 text-base sm:text-lg">色が変わった瞬間にクリック！</p>
        </>
      )}

      {state === "ready" && (
        <>
          <p className="text-4xl font-bold sm:text-5xl">今だ！クリック！</p>
          <p className="mt-3 text-base sm:text-lg">できるだけ早く！</p>
        </>
      )}

      {state === "result" && (
        <>
          <p className="text-3xl font-bold sm:text-4xl">
            {reactionMs === null ? "フライング！" : `${reactionMs} ms`}
          </p>
          <p className="mt-3 text-base sm:text-lg">もう一度クリックで再挑戦</p>
        </>
      )}
    </button>
  )
}

