"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Add suppressHydrationWarning to the html element
    const html = document.documentElement
    html.setAttribute("suppressHydrationWarning", "true")
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

