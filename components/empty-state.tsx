import type React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 text-center", className)}>
      {icon && <div className="mb-2 sm:mb-4">{icon}</div>}
      <h3 className="mt-2 sm:mt-4 text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2 sm:mt-4">{action}</div>}
    </div>
  )
}

