"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Gamepad2 } from "lucide-react"
import type { Game } from "@/lib/games"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const imageSrc = game.image?.trim() ?? ""
  const [useFallback, setUseFallback] = useState(!imageSrc)

  return (
    <Link href={`/games/${game.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/15 hover:-translate-y-0.5">
        <div className="relative aspect-video w-full bg-secondary">
          {!useFallback && imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${game.title}のサムネイル`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setUseFallback(true)}
            />
          ) : null}
          {useFallback ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Gamepad2 className="h-12 w-12 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
            </div>
          ) : null}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
            {game.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  )
}
