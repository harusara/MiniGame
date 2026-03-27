"use client"

import { useState } from "react"
import { GameLayout } from "@/components/game-layout"
import type { Game } from "@/lib/games"
import { renderGameBySlug } from "@/components/games/registry"
import type { GameResult } from "@/components/games/types"

interface GamePageClientProps {
  game: Game
  recommendedGames: Game[]
}

export function GamePageClient({ game, recommendedGames }: GamePageClientProps) {
  const [score, setScore] = useState<string | undefined>(undefined)
  const [scoreMessage, setScoreMessage] = useState<string | undefined>(undefined)
  const [gameInstanceKey, setGameInstanceKey] = useState(0)

  const handleResult = (result: GameResult) => {
    setScore(result.score)
    setScoreMessage(result.message)
  }

  const handlePlayAgain = () => {
    // Force remount to reset internal game state.
    setGameInstanceKey((prev) => prev + 1)
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
      <div key={gameInstanceKey} className="w-full">
        {renderGameBySlug(game, { onResult: handleResult })}
      </div>
    </GameLayout>
  )
}
