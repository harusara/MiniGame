import { GameCard } from "@/components/game-card"
import { games } from "@/lib/games"
import { Gamepad2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/8 p-5">
              <Gamepad2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground">
            Mini Games
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            シンプルで楽しいミニゲームを遊ぼう
          </p>
        </header>

        {/* Game Grid */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
