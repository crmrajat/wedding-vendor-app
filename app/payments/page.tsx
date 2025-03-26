"use client"

import { useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check, CreditCard, Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/layout/app-shell"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { paymentSchema } from "@/lib/validations"
import { EmptyState } from "@/components/empty-state"

// Sample payment data
const initialPayments = [
  {
    id: 1,
    vendor: "Grand Venue",
    description: "Venue deposit",
    amount: 5000,
    dueDate: "2023-05-15",
    status: "Paid",
    paymentDate: "2023-05-10",
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    vendor: "Grand Venue",
    description: "Venue final payment",
    amount: 5000,
    dueDate: "2023-12-15",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 3,
    vendor: "Sunset Catering",
    description: "Catering deposit",
    amount: 2500,
    dueDate: "2023-05-20",
    status: "Paid",
    paymentDate: "2023-05-18",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    vendor: "Sunset Catering",
    description: "Catering final payment",
    amount: 2500,
    dueDate: "2023-12-01",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 5,
    vendor: "Dreamy Photography",
    description: "Photography package",
    amount: 3000,
    dueDate: "2023-06-01",
    status: "Paid",
    paymentDate: "2023-05-30",
    paymentMethod: "Credit Card",
  },
  {
    id: 6,
    vendor: "Elegant Flowers",
    description: "Floral arrangements deposit",
    amount: 1000,
    dueDate: "2023-06-10",
    status: "Paid",
    paymentDate: "2023-06-08",
    paymentMethod: "Credit Card",
  },
  {
    id: 7,
    vendor: "Elegant Flowers",
    description: "Floral arrangements final payment",
    amount: 1000,
    dueDate: "2023-11-10",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
  },
  {
    id: 8,
    vendor: "Melody Makers",
    description: "DJ services",
    amount: 1500,
    dueDate: "2023-07-15",
    status: "Pending",
    paymentDate: null,
    paymentMethod: null,
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [editingTotalPayments, setEditingTotalPayments] = useState(false)
  const [totalPaymentsOverride, setTotalPaymentsOverride] = useState("")
  const [customTotalPayments, setCustomTotalPayments] = useState(null)

  // Calculate totals
  const calculatedTotalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalAmount = customTotalPayments !== null ? customTotalPayments : calculatedTotalAmount

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = totalAmount - paidAmount

  // Filter payments
  const paidPayments = payments.filter((payment) => payment.status === "Paid")
  const pendingPayments = payments.filter((payment) => payment.status === "Pending")

  // Sort pending payments by due date
  const sortedPendingPayments = [...pendingPayments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  // Get upcoming payments (due in the next 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const upcomingPayments = sortedPendingPayments.filter((payment) => {
    const dueDate = new Date(payment.dueDate)
    return dueDate <= thirtyDaysFromNow && dueDate >= today
  })

  // Form setup
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      vendor: "",
      description: "",
      amount: "",
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      paymentDate: "",
      paymentMethod: "",
    },
    mode: "onSubmit",
  })

  const onSubmit = useCallback(
    (data) => {
      const newPaymentItem = {
        id: payments.length + 1,
        ...data,
        amount: Number.parseFloat(data.amount),
        paymentDate: data.status === "Paid" ? data.paymentDate : null,
        paymentMethod: data.status === "Paid" ? data.paymentMethod : null,
      }

      const newPayments = [...payments, newPaymentItem]
      setPayments(newPayments)
      setShowAddPayment(false)
      form.reset({
        vendor: "",
        description: "",
        amount: "",
        dueDate: new Date().toISOString().split("T")[0],
        status: "Pending",
        paymentDate: "",
        paymentMethod: "",
      })

      toast.success("Payment added successfully", {
        description: `${data.description} for ${data.vendor} has been added.`,
      })
    },
    [form, payments],
  )

  const markAsPaid = useCallback(
    (id) => {
      const paymentToUpdate = payments.find((p) => p.id === id)
      const newPayments = payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
              paymentMethod: "Credit Card", // Default for demo
            }
          : payment,
      )

      setPayments(newPayments)

      toast.success("Payment marked as paid", {
        description: `${paymentToUpdate.description} for ${paymentToUpdate.vendor} has been marked as paid.`,
      })
    },
    [payments],
  )

  const updateTotalPayments = useCallback(() => {
    const newTotal = Number.parseFloat(totalPaymentsOverride)
    if (!isNaN(newTotal) && newTotal >= 0) {
      setCustomTotalPayments(newTotal)
      setEditingTotalPayments(false)
      toast.success("Total payments updated", {
        description: `Total payments amount has been updated to $${newTotal.toLocaleString()}.`,
      })
    } else {
      toast.error("Invalid amount", {
        description: "Please enter a valid number for the total payments.",
      })
    }
  }, [totalPaymentsOverride])

  // Format date to "1 Jan, 2025" format
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return format(new Date(dateString), "d MMM, yyyy")
  }

  return (
    <AppShell>
      <main className="flex-1">
        <div className="container py-3 sm:py-4 md:py-6">
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Tracking</h1>
              <p className="text-muted-foreground">Track and manage vendor payments</p>
            </div>
            <Button onClick={() => setShowAddPayment(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Payment
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
                {customTotalPayments !== null && calculatedTotalAmount !== customTotalPayments && (
                  <p className="text-xs text-muted-foreground">Calculated: ${calculatedTotalAmount.toLocaleString()}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="text-2xl font-bold">${paidAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((paidAmount / totalAmount) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2 sm:pt-4">
                <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((pendingAmount / totalAmount) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {upcomingPayments.length > 0 ? (
            <Card className="mt-6 sm:mt-8 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-300">Upcoming Payments</CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-400">
                  The following payments are due in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.vendor}</TableCell>
                            <TableCell>{payment.description}</TableCell>
                            <TableCell>${payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{formatDate(payment.dueDate)}</TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => markAsPaid(payment.id)}>
                                Mark as Paid
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={<Check className="h-12 w-12 text-muted-foreground" />}
              title="No upcoming payments"
              description="You don't have any payments due in the next 30 days"
              className="mt-6 sm:mt-8"
            />
          )}

          <Tabs defaultValue="all" className="mt-6 sm:mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="min-w-[800px]">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Vendor</TableHead>
                            <TableHead className="w-[200px]">Description</TableHead>
                            <TableHead className="w-[100px]">Amount</TableHead>
                            <TableHead className="w-[120px]">Due Date</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[120px]">Payment Date</TableHead>
                            <TableHead className="w-[120px]">Method</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.length > 0 ? (
                            payments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium py-2 px-2 sm:px-4">{payment.vendor}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{payment.description}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">${payment.amount.toLocaleString()}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{formatDate(payment.dueDate)}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      payment.status === "Paid"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{formatDate(payment.paymentDate)}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{payment.paymentMethod || "-"}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4 text-right">
                                  {payment.status === "Pending" && (
                                    <Button size="sm" onClick={() => markAsPaid(payment.id)}>
                                      Mark as Paid
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="h-24 text-center">
                                No payments found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="min-w-[600px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Vendor</TableHead>
                            <TableHead className="w-[200px]">Description</TableHead>
                            <TableHead className="w-[100px]">Amount</TableHead>
                            <TableHead className="w-[120px]">Due Date</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingPayments.length > 0 ? (
                            sortedPendingPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium py-2 px-2 sm:px-4">{payment.vendor}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{payment.description}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">${payment.amount.toLocaleString()}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{formatDate(payment.dueDate)}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4 text-right">
                                  <Button size="sm" onClick={() => markAsPaid(payment.id)}>
                                    Mark as Paid
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                No pending payments
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="paid">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="min-w-[700px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Vendor</TableHead>
                            <TableHead className="w-[200px]">Description</TableHead>
                            <TableHead className="w-[100px]">Amount</TableHead>
                            <TableHead className="w-[120px]">Due Date</TableHead>
                            <TableHead className="w-[120px]">Payment Date</TableHead>
                            <TableHead>Payment Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paidPayments.length > 0 ? (
                            paidPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium py-2 px-2 sm:px-4">{payment.vendor}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{payment.description}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">${payment.amount.toLocaleString()}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{formatDate(payment.dueDate)}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{formatDate(payment.paymentDate)}</TableCell>
                                <TableCell className="py-2 px-2 sm:px-4">{payment.paymentMethod}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No paid payments
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Total Payments Dialog */}
          <Dialog
            open={editingTotalPayments}
            onOpenChange={(open) => {
              setEditingTotalPayments(open)
              if (!open) {
                // Reset the input when dialog closes without saving
                setTotalPaymentsOverride(totalAmount.toString())
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Total Payments</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Total Payments Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={totalPaymentsOverride}
                      onChange={(e) => setTotalPaymentsOverride(e.target.value)}
                      className="pl-7"
                      placeholder={totalAmount.toString()}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculated total from all payments: ${calculatedTotalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setEditingTotalPayments(false)
                    setTotalPaymentsOverride(totalAmount.toString())
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={updateTotalPayments} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Payment Dialog */}
          <Dialog
            open={showAddPayment}
            onOpenChange={(open) => {
              setShowAddPayment(open)
              if (!open) {
                form.reset({
                  vendor: "",
                  description: "",
                  amount: "",
                  dueDate: new Date().toISOString().split("T")[0],
                  status: "Pending",
                  paymentDate: "",
                  paymentMethod: "",
                })
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payment</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vendor name" maxLength={50} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" maxLength={100} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("status") === "Paid" && (
                    <>
                      <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setShowAddPayment(false)
                        form.reset()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                      Add Payment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </AppShell>
  )
}

