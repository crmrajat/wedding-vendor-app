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

  return (
    <AppShell>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
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

      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-amber-800 dark:text-amber-300">
                  {todayReminders.length > 0 ? "Today's Reminders" : "Upcoming Reminders"}
                </CardTitle>
              </div>
              <div className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                {reminders.length} total
              </div>
            </div>
            <CardDescription className="text-amber-700 dark:text-amber-400">
              {todayReminders.length > 0
                ? `You have ${todayReminders.length} tasks for today`
                : "Important dates and deadlines for your wedding planning"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              {reminders.length > 0 ? (
                <div className="space-y-3 pr-4">
                  {/* Show today's reminders first if any */}
                  {todayReminders.length > 0 && (
                    <>
                      <div className="mb-2 font-medium text-amber-800 dark:text-amber-300">Today</div>
                      {todayReminders.map((reminder) => (
                        <div
                          key={reminder.id}
                          className="flex items-start gap-3 rounded-md bg-amber-100 p-3 dark:bg-amber-900/50 group"
                        >
                          {reminder.type === "payment" ? (
                            <CreditCard className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Calendar className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-amber-800 dark:text-amber-300">{reminder.title}</p>
                            <div className="flex flex-wrap items-center gap-x-2 text-sm">
                              <span className="text-amber-700 dark:text-amber-400">{reminder.vendor}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={reminder.type === "payment" ? "/payments" : "/contracts"}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-300 bg-amber-200 text-amber-800 hover:bg-amber-300 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-200 dark:hover:bg-amber-700"
                              >
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-amber-700 hover:bg-amber-200 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-900 dark:hover:text-amber-200"
                              onClick={() => removeReminder(reminder.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Show upcoming header if there are other reminders */}
                      {sortedReminders.filter((r) => r.date !== formattedToday).length > 0 && (
                        <div className="mb-2 mt-4 font-medium text-amber-800 dark:text-amber-300">Upcoming</div>
                      )}
                    </>
                  )}

                  {/* Show other reminders */}
                  {sortedReminders
                    .filter((reminder) => reminder.date !== formattedToday)
                    .map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-start gap-3 rounded-md bg-amber-100 p-3 dark:bg-amber-900/50 group"
                      >
                        {reminder.type === "payment" ? (
                          <CreditCard className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Calendar className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-amber-800 dark:text-amber-300">{reminder.title}</p>
                          <div className="flex flex-wrap items-center gap-x-2 text-sm">
                            <span className="text-amber-700 dark:text-amber-400">{reminder.vendor}</span>
                            <span className="text-amber-600 dark:text-amber-500">•</span>
                            <span className="text-amber-700 dark:text-amber-400">
                              {new Date(reminder.date).toISOString().split("T")[0].split("-").reverse().join("/")}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={reminder.type === "payment" ? "/payments" : "/contracts"}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-300 bg-amber-200 text-amber-800 hover:bg-amber-300 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-200 dark:hover:bg-amber-700"
                            >
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-700 hover:bg-amber-200 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-900 dark:hover:text-amber-200"
                            onClick={() => removeReminder(reminder.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CheckCircle2 className="h-8 w-8 text-amber-600 dark:text-amber-400" />}
                  title="All caught up!"
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className="py-6 px-4 sm:px-6 lg:px-8">
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

