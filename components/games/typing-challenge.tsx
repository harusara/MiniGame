"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import type { GameComponentProps } from "@/components/games/types"

const TIME_LIMIT_SEC = 30

const ENGLISH_WORDS = [
  "game",
  "type",
  "fast",
  "word",
  "play",
  "skill",
  "quick",
  "happy",
  "challenge",
  "keyboard",
  "reaction",
  "memory",
  "score",
  "level",
  "focus",
  "input",
  "random",
  "simple",
  "bright",
  "coding",
]

const JAPANESE_WORDS = [
  "タイピング",
  "チャレンジ",
  "ゲーム",
  "正解",
  "制限時間",
  "英単語",
  "日本語",
  "練習",
  "スコア",
  "反射神経",
  "記憶力",
  "ミニゲーム",
  "楽しい",
  "がんばれ",
  "次の問題",
  "入力",
  "完了",
  "スタート",
  "フィニッシュ",
]

type Phase = "idle" | "playing" | "finished"

function pickRandomWord(): string {
  const useJa = Math.random() < 0.45
  const pool = useJa ? JAPANESE_WORDS : ENGLISH_WORDS
  return pool[Math.floor(Math.random() * pool.length)]!
}

function matchesTarget(target: string, rawInput: string): boolean {
  const t = target.normalize("NFC").trim()
  const v = rawInput.normalize("NFC").trim()
  if (/^[a-zA-Z]+$/.test(t)) {
    return t.toLowerCase() === v.toLowerCase()
  }
  return t === v
}

function getTypingRankComment(count: number): string {
  if (count >= 27) return "評価: 神速タイピング！達人級！"
  if (count >= 21) return "評価: プロ級のスピード！"
  if (count >= 15) return "評価: タイピング上手！"
  if (count >= 10) return "評価: いいリズム！伸びしろ十分！"
  if (count >= 5) return "評価: なかなかのペース！"
  if (count >= 1) return "評価: ここからさらに加速！"
  return "評価: 次は流れに乗ってタイプしよう！"
}

export function TypingChallenge({ onResult }: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_SEC * 1000)
  const [currentWord, setCurrentWord] = useState("")
  const [input, setInput] = useState("")
  const [correctCount, setCorrectCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const endTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const correctCountRef = useRef(0)
  const gameEndedRef = useRef(false)

  useEffect(() => {
    correctCountRef.current = correctCount
  }, [correctCount])

  const finishGame = useCallback(
    (finalCount: number) => {
      setPhase("finished")
      const rank = getTypingRankComment(finalCount)
      onResult({
        score: `${finalCount} 問正解`,
        message: `30秒で ${finalCount} 問正解しました。${rank}`,
      })
    },
    [onResult]
  )

  const startGame = () => {
    onResult({})
    gameEndedRef.current = false
    correctCountRef.current = 0
    setCorrectCount(0)
    setInput("")
    setCurrentWord(pickRandomWord())
    setTimeLeftMs(TIME_LIMIT_SEC * 1000)
    endTimeRef.current = performance.now() + TIME_LIMIT_SEC * 1000
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
          finishGame(correctCountRef.current)
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
    if (phase === "playing") {
      inputRef.current?.focus()
    }
  }, [phase, currentWord])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (phase !== "playing" || !currentWord) {
      setInput(v)
      return
    }
    if (matchesTarget(currentWord, v)) {
      setCorrectCount((c) => c + 1)
      setInput("")
      setCurrentWord(pickRandomWord())
      return
    }
    setInput(v)
  }

  const secondsLeft = Math.ceil(timeLeftMs / 1000)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-3 sm:gap-5">
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground sm:text-base">
            制限時間 {TIME_LIMIT_SEC} 秒・英単語と日本語がランダム出題
          </p>
          <p className="text-lg font-semibold text-foreground">表示された文を入力して次へ</p>
          <button
            type="button"
            onClick={startGame}
            className="h-12 min-w-40 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            スタート
          </button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-4 text-sm sm:text-base">
            <span className="rounded-full bg-background/80 px-4 py-1.5 font-medium text-foreground shadow-sm ring-1 ring-border/60">
              残り <span className="tabular-nums font-bold text-primary">{secondsLeft}</span> 秒
            </span>
            <span className="rounded-full bg-background/80 px-4 py-1.5 font-medium text-foreground shadow-sm ring-1 ring-border/60">
              正解 <span className="tabular-nums font-bold text-primary">{correctCount}</span> 問
            </span>
          </div>

          <p className="max-w-full break-all px-2 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {currentWord}
          </p>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full max-w-md rounded-xl border-2 border-border bg-background px-4 py-3 text-center text-lg outline-none ring-primary focus:border-primary focus:ring-2 sm:text-xl"
            placeholder="ここに入力"
            aria-label="タイピング入力"
          />
        </>
      )}

      {phase === "finished" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">タイムアップ</p>
          <p className="text-4xl font-bold text-primary sm:text-5xl">{correctCount} 問正解</p>
          <p className="text-base font-semibold text-foreground">{getTypingRankComment(correctCount)}</p>
          <p className="text-base text-muted-foreground">もう一度は下の「もう一度プレイ」から</p>
        </div>
      )}
    </div>
  )
}
