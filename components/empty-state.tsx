"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, actionIcon, onAction }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6">
      <div className="rounded-full bg-muted p-3 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionIcon && <span className="mr-2">{actionIcon}</span>}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

