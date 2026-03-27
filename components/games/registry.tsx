"use client"

import type { Game } from "@/lib/games"
import type { GameComponentProps } from "@/components/games/types"
import { TenSecondChallenge } from "@/components/games/ten-second-challenge"
import { ReactionTest } from "@/components/games/reaction-test"
import { MemoryGame } from "@/components/games/memory-game"
import { PlaceholderGame } from "@/components/games/placeholder-game"

type GameRenderer = (props: GameComponentProps) => React.ReactNode

const gameRegistry: Record<string, GameRenderer> = {
  stopwatch: (props) => <TenSecondChallenge {...props} />,
  reaction: (props) => <ReactionTest {...props} />,
  memory: (props) => <MemoryGame {...props} />,
}

export function renderGameBySlug(game: Game, props: GameComponentProps): React.ReactNode {
  const renderer = gameRegistry[game.slug]
  if (renderer) return renderer(props)
  return <PlaceholderGame title={game.title} {...props} />
}

