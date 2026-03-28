export interface Game {
  title: string
  slug: string
  description: string
  /** `public/games/` 配下のファイルを `/games/ファイル名` で指定。未設定・404時はプレースホルダ表示 */
  image?: string
  /** false のときは PC タグのみ（スマホ向きでない）。true のときは PC + スマホの両タグ */
  playableOnMobile: boolean
}

export const games: Game[] = [
  {
    title: "10秒チャレンジ",
    slug: "stopwatch",
    description: "ぴったり10秒で止めろ！",
    image: "/games/stopwatch.png",
    playableOnMobile: true,
  },
  {
    title: "リアクションテスト",
    slug: "reaction",
    description: "反射神経を試そう！",
    image: "/games/reaction.png",
    playableOnMobile: true,
  },
  {
    title: "記憶力ゲーム",
    slug: "memory",
    description: "数字を覚えて入力しよう！",
    image: "/games/memory.png",
    playableOnMobile: true,
  },
  {
    title: "タイピングチャレンジ",
    slug: "typing",
    description: "素早くタイピングしよう！",
    image: "/games/typing.png",
    playableOnMobile: false,
  },
  {
    title: "クリックマスター",
    slug: "click",
    description: "10秒間で何回クリックできる？",
    image: "/games/click.png",
    playableOnMobile: true,
  }
]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find(game => game.slug === slug)
}

export function getRecommendedGames(currentSlug: string, count: number = 3): Game[] {
  return games.filter(game => game.slug !== currentSlug).slice(0, count)
}
