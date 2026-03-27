"use client"

export interface GameResult {
  score?: string
  message?: string
}

export interface GameComponentProps {
  onResult: (result: GameResult) => void
}

