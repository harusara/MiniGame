"use client"

import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  gameTitle: string
  score?: string
}

export function ShareButton({ gameTitle, score }: ShareButtonProps) {
  const handleShare = () => {
    // Share function will be implemented later
    console.log("Share:", gameTitle, score)
  }

  return (
    <Button 
      onClick={handleShare}
      className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-current"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      シェア
    </Button>
  )
}
