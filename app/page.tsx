"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Bell, Calendar, CheckCircle2, CreditCard, DollarSign, FileText, Users, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppShell } from "@/components/layout/app-shell"
import { EmptyState } from "@/components/empty-state"

export default function Home() {
  // Get current date for comparison
  const today = new Date()
  const formattedToday = today.toISOString().split("T")[0]

  // Sample upcoming reminders with some today's date items
  const initialReminders = [
    {
      id: 1,
      title: "Venue final payment due",
      date: "2023-12-15",
      vendor: "Grand Venue",
      type: "payment",
    },
    {
      id: 2,
      title: "Catering tasting appointment",
      date: formattedToday,
      vendor: "Sunset Catering",
      type: "appointment",
    },
    {
      id: 3,
      title: "Floral arrangements final payment due",
      date: "2023-11-10",
      vendor: "Elegant Flowers",
      type: "payment",
    },
    {
      id: 4,
      title: "Cake tasting appointment",
      date: "2023-07-15",
      vendor: "Sweet Delights Bakery",
      type: "appointment",
    },
    {
      id: 5,
      title: "Call wedding planner",
      date: formattedToday,
      vendor: "Wedding Planners Inc.",
      type: "appointment",
    },
    {
      id: 6,
      title: "Review DJ playlist",
      date: formattedToday,
      vendor: "Melody Makers",
      type: "appointment",
    },
    {
      id: 7,
      title: "Confirm guest count",
      date: formattedToday,
      vendor: "Grand Venue",
      type: "appointment",
    },
  ]

  const [reminders, setReminders] = useState(initialReminders)
  const [removedReminders, setRemovedReminders] = useState([])

  // Sort reminders by date
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get today's reminders
  const todayReminders = reminders.filter((reminder) => reminder.date === formattedToday)

  // Function to remove a reminder
  const removeReminder = (id) => {
    const reminderToRemove = reminders.find((r) => r.id === id)
    if (reminderToRemove) {
      const newReminders = reminders.filter((reminder) => reminder.id !== id)
      setReminders(newReminders)
      setRemovedReminders([...removedReminders, reminderToRemove])

      toast.error("Reminder removed", {
        description: `"${reminderToRemove.title}" has been removed`,
        action: {
          label: "Undo",
          onClick: () => {
            setReminders([...newReminders, reminderToRemove])
            setRemovedReminders(removedReminders.filter((r) => r.id !== reminderToRemove.id))
            toast.success("Reminder restored")
          },
        },
      })
    }
  }

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  }

  return (
    <AppShell>
      <section className="py-2 sm:py-4 md:py-6 px-0 sm:px-2 md:px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 new vendors this month</p>
            </CardContent>
            <CardFooter>
              <Link href="/vendors" className="text-sm text-primary hover:underline">
                View all vendors
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">68% of total budget</p>
            </CardContent>
            <CardFooter>
              <Link href="/budget" className="text-sm text-primary hover:underline">
                View budget details
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Venue visit on June 15</p>
            </CardContent>
            <CardFooter>
              <Link href="/contracts" className="text-sm text-primary hover:underline">
                View all appointments
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="py-2 sm:py-4 px-0 sm:px-2 md:px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 dark:bg-amber-950 dark:border-amber-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300">Today's Reminders</h2>
            </div>
            <div className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-medium">
              {reminders.length} total
            </div>
          </div>

          <p className="text-amber-700 dark:text-amber-400 mb-6">You have {todayReminders.length} tasks for today</p>

          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {reminders.length > 0 ? (
                <>
                  {sortedReminders.map((reminder) => (
                    <div key={reminder.id} className="bg-amber-100 dark:bg-amber-900/50 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          {reminder.type === "payment" ? (
                            <CreditCard className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          ) : (
                            <Calendar className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          )}
                          <h3 className="text-amber-800 dark:text-amber-300 font-medium">{reminder.title}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row text-sm text-amber-700 dark:text-amber-400 ml-8">
                          <span>{reminder.vendor}</span>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="mt-1 sm:mt-0">{formatDate(reminder.date)}</span>
                        </div>
                      </div>

                      <div className="flex mt-2">
                        <Link href={reminder.type === "payment" ? "/payments" : "/contracts"} className="flex-1">
                          <button className="w-full py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 transition-colors dark:bg-amber-800 dark:text-amber-200 dark:hover:bg-amber-700 text-center">
                            View
                          </button>
                        </Link>
                        <button
                          onClick={() => removeReminder(reminder.id)}
                          className="py-2 px-4 bg-amber-200 hover:bg-amber-300 text-amber-800 transition-colors dark:bg-amber-800 dark:text-amber-200 dark:hover:bg-amber-700 border-l border-amber-300 dark:border-amber-700"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <EmptyState
                  icon={<CheckCircle2 className="h-8 w-8 text-amber-600 dark:text-amber-400" />}
                  title="All caught up!"
                  description="You have no reminders for today"
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </section>

      <section className="py-2 sm:py-4 px-0 sm:px-2 md:px-4">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Quick Actions</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/vendors">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <Users className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Manage Vendors</CardTitle>
                <CardDescription>View, rate, and manage your wedding vendors</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Vendors <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/budget">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Track Budget</CardTitle>
                <CardDescription>Monitor expenses and manage your wedding budget</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Budget <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/contracts">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Manage Contracts</CardTitle>
                <CardDescription>Upload and track vendor contracts and appointments</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Contracts <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/payments">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Track Payments</CardTitle>
                <CardDescription>Monitor payment status and upcoming due dates</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Payments <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>
    </AppShell>
  )
}

