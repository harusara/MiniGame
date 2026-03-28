"use client"

import type { Game } from "@/lib/games"
import type { GameComponentProps } from "@/components/games/types"
import { TenSecondChallenge } from "@/components/games/ten-second-challenge"
import { ReactionTest } from "@/components/games/reaction-test"
import { MemoryGame } from "@/components/games/memory-game"
import { PlaceholderGame } from "@/components/games/placeholder-game"
import { TypingChallenge } from "@/components/games/typing-challenge"
import { ClickMaster } from "@/components/games/click-master"

type GameRenderer = (props: GameComponentProps) => React.ReactNode

const gameRegistry: Record<string, GameRenderer> = {
  stopwatch: (props) => <TenSecondChallenge {...props} />,
  reaction: (props) => <ReactionTest {...props} />,
  memory: (props) => <MemoryGame {...props} />,
  typing: (props) => <TypingChallenge {...props} />,
  click: (props) => <ClickMaster {...props} />,
}

export function renderGameBySlug(game: Game, props: GameComponentProps): React.ReactNode {
  const renderer = gameRegistry[game.slug]
  if (renderer) return renderer(props)
  return <PlaceholderGame title={game.title} {...props} />
}

