import type React from "react"

interface AppShellProps {
  children: React.ReactNode
}

// Update the padding to be minimal on mobile and increase on larger screens
export function AppShell({ children }: AppShellProps) {
  return (
    <table className="container mx-auto px-1 sm:px-2 md:px-4 py-1 sm:py-2 md:py-4 w-full">
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  )
}

