"use client"

import type { GameComponentProps } from "@/components/games/types"

interface PlaceholderGameProps extends GameComponentProps {
  title: string
}

export function PlaceholderGame({ title, onResult }: PlaceholderGameProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground">
      <p className="text-lg font-semibold">{title} は準備中です</p>
      <p className="text-sm">この枠にゲーム本体を追加できます。</p>
      <button
        type="button"
        onClick={() =>
          onResult({
            score: undefined,
            message: "このゲームは未実装です。別ゲームを選ぶか、実装を追加してください。",
          })
        }
        className="mt-2 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-muted"
      >
        状態を表示
      </button>
    </div>
  )
}

