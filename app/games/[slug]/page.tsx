import { notFound } from "next/navigation"
import { getGameBySlug, getRecommendedGames } from "@/lib/games"
import { GamePageClient } from "./game-page-client"

interface GamePageProps {
  params: Promise<{ slug: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params
  const game = getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const recommendedGames = getRecommendedGames(slug, 3)

  return (
    <GamePageClient game={game} recommendedGames={recommendedGames} />
  )
}
