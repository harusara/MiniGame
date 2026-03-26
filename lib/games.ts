export interface Game {
  title: string
  slug: string
  description: string
  image: string
}

export const games: Game[] = [
  {
    title: "10秒チャレンジ",
    slug: "stopwatch",
    description: "ぴったり10秒で止めろ！",
    image: "/games/stopwatch.png"
  },
  {
    title: "リアクションテスト",
    slug: "reaction",
    description: "反射神経を試そう！",
    image: "/games/reaction.png"
  },
  {
    title: "記憶力ゲーム",
    slug: "memory",
    description: "数字を覚えて入力しよう！",
    image: "/games/memory.png"
  },
  {
    title: "タイピングチャレンジ",
    slug: "typing",
    description: "素早くタイピングしよう！",
    image: "/games/typing.png"
  },
  {
    title: "クリックマスター",
    slug: "click",
    description: "10秒間で何回クリックできる？",
    image: "/games/click.png"
  }
]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find(game => game.slug === slug)
}

export function getRecommendedGames(currentSlug: string, count: number = 3): Game[] {
  return games.filter(game => game.slug !== currentSlug).slice(0, count)
}
