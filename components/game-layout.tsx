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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/40">
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
        </Link>

        {/* Game Title */}
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground">
          {game.title}
        </h1>

        {/* Game Container */}
        <div className="w-full mx-auto aspect-video bg-secondary flex items-center justify-center rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
          {children}
        </div>

        {/* Score Section */}
        {score && (
          <div className="mt-10 text-center">
            <div className="text-5xl font-bold text-primary">
              {score}
            </div>
            {scoreMessage && (
              <p className="mt-3 text-base text-muted-foreground">
                {scoreMessage}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onPlayAgain}
          >
            <RotateCcw className="h-4 w-4" />
            もう一度プレイ
          </Button>
          <ShareButton gameTitle={game.title} score={score} />
        </div>

        {/* Recommended Games */}
        <section className="mt-16">
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
    </div>
  )
}
