"use client"

import { useEffect, useRef, useState } from "react"
import type { GameComponentProps } from "@/components/games/types"

type Phase = "show" | "input" | "result"

function generateNumberString(digits: number): string {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  const value = Math.floor(Math.random() * (max - min + 1)) + min
  return String(value)
}

export function MemoryGame({ onResult }: GameComponentProps) {
  const [digits, setDigits] = useState(3) // 3〜8桁
  const [phase, setPhase] = useState<Phase>("show")
  const [target, setTarget] = useState<string>(generateNumberString(3))
  const [answer, setAnswer] = useState<string>("")
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const startRound = (nextDigits?: number) => {
    const d = Math.min(8, Math.max(3, nextDigits ?? digits))
    const next = generateNumberString(d)
    setDigits(d)
    setTarget(next)
    setAnswer("")
    setLastCorrect(null)
    onResult({})
    setPhase("show")
  }

  useEffect(() => {
    if (phase !== "show") return
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setPhase("input")
    }, 3000)
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [phase])

  useEffect(() => {
    // 初回開始
    startRound(3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = () => {
    const correct = answer.trim() === target
    setLastCorrect(correct)
    setPhase("result")
    onResult({
      score: correct ? `正解 (${digits}桁)` : `不正解 (${digits}桁)`,
      message: correct ? "ナイス！次は1桁増えます" : `正解は ${target}`,
    })
  }

  const nextLevel = () => {
    const next = Math.min(8, digits + 1)
    startRound(next)
  }

  const retrySame = () => {
    startRound(digits)
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit()
    }
  }

  return (
    <div className="w-full px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-background/70 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>レベル: {digits}桁</span>
          <span>3秒表示 → 記憶して入力</span>
        </div>

        {phase === "show" && (
          <div className="flex h-40 items-center justify-center rounded-xl bg-secondary">
            <p className="font-mono text-5xl font-bold tracking-widest text-foreground sm:text-6xl">
              {target}
            </p>
          </div>
        )}

        {phase === "input" && (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="h-40 w-full rounded-xl bg-secondary text-center leading-[10rem] text-3xl font-semibold text-muted-foreground">
              ？？？
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
              onKeyDown={onInputKeyDown}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-lg outline-none ring-primary focus:ring-2"
              placeholder={`${digits}桁の数字を入力`}
              autoFocus
            />
            <button
              type="button"
              onClick={submit}
              className="h-12 w-full rounded-xl bg-primary text-lg font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-40"
            >
              判定
            </button>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`h-40 w-full rounded-xl text-center leading-[10rem] text-4xl font-extrabold ${
                lastCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {lastCorrect ? "正解！" : "不正解"}
            </div>
            {!lastCorrect && (
              <p className="text-center text-sm text-muted-foreground">
                正解: <span className="font-mono font-semibold text-foreground">{target}</span>
              </p>
            )}
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={retrySame}
                className="h-12 flex-1 rounded-xl border border-border bg-secondary text-lg font-semibold text-secondary-foreground transition hover:opacity-90"
              >
                同じ桁で再挑戦
              </button>
              <button
                type="button"
                onClick={nextLevel}
                className="h-12 flex-1 rounded-xl bg-primary text-lg font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                disabled={digits >= 8}
              >
                {digits >= 8 ? "最大桁に到達" : "次のレベルへ（+1桁）"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

