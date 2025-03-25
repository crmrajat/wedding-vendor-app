import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Wedding Vendor Management System",
  description: "Manage your wedding vendors, budget, contracts, and payments",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full`} suppressHydrationWarning>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'