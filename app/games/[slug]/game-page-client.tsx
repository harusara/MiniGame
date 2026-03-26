"use client"

import { useState } from "react"
import { GameLayout } from "@/components/game-layout"
import type { Game } from "@/lib/games"
import { Timer } from "lucide-react"

interface GamePageClientProps {
  game: Game
  recommendedGames: Game[]
}

export function GamePageClient({ game, recommendedGames }: GamePageClientProps) {
  const [score, setScore] = useState<string | undefined>("9.87 秒")
  const [scoreMessage, setScoreMessage] = useState<string | undefined>(
    "惜しい！あと 0.13 秒！"
  )

  const handlePlayAgain = () => {
    // Play again logic will be implemented later
    setScore(undefined)
    setScoreMessage(undefined)
  }

  return (
    <GameLayout
      game={game}
      recommendedGames={recommendedGames}
      score={score}
      scoreMessage={scoreMessage}
      onPlayAgain={handlePlayAgain}
    >
      {/* Game Area Placeholder */}
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Timer className="h-16 w-16" />
        <span className="text-lg font-medium">ゲームエリア</span>
        <span className="text-sm">ここにゲームが表示されます</span>
      </div>
    </GameLayout>
  )
}
