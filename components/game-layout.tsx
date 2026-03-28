"use client"

import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game-card"
import { ShareButton } from "@/components/share-button"
import type { Game } from "@/lib/games"

interface GameLayoutProps {
  game: Game
  recommendedGames: Game[]
  score?: string
  scoreMessage?: string
  children: React.ReactNode
  onPlayAgain?: () => void
}

export function GameLayout({
  game,
  recommendedGames,
  score,
  scoreMessage,
  children,
  onPlayAgain
}: GameLayoutProps) {
  return (
    <div className="bg-background">
      <section className="h-screen">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 sm:py-5">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-2 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/40">
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
          </Link>

          {/* Game Area */}
          <div className="flex flex-1 flex-col justify-center gap-4 overflow-hidden">
            <h1 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
              {game.title}
            </h1>

            <div className="mx-auto flex h-full max-h-[55vh] w-full max-w-5xl items-center justify-center rounded-2xl border border-border/50 bg-secondary shadow-sm">
              {children}
            </div>

            {/* Score Section */}
            {score && (
              <div className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  {score}
                </div>
                {scoreMessage && (
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {scoreMessage}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onPlayAgain}
              >
                <RotateCcw className="h-4 w-4" />
                もう一度プレイ
              </Button>
              <ShareButton gameTitle={game.title} score={score} />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Games */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8">
          <h2 className="mb-8 text-2xl font-bold text-foreground">
            おすすめのゲーム
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedGames.map((recGame) => (
              <GameCard key={recGame.slug} game={recGame} />
            ))}
          </div>
      </section>
    </div>
  )
}
