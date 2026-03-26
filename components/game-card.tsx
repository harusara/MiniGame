import Link from "next/link"
import { Gamepad2 } from "lucide-react"
import type { Game } from "@/lib/games"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/15 hover:-translate-y-0.5">
        <div className="aspect-video w-full bg-secondary flex items-center justify-center">
          <Gamepad2 className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {game.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  )
}
