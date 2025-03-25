"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DollarSign, Edit, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppShell } from "@/components/layout/app-shell"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePicker } from "@/components/ui/date-picker"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { expenseSchema } from "@/lib/validations"

// Sample budget data
const initialBudget = {
  total: 25000,
  spent: 12450,
  remaining: 12550,
  categories: [
    { id: 1, name: "Venue", budget: 10000, spent: 5000, percentage: 40 },
    { id: 2, name: "Catering", budget: 5000, spent: 2500, percentage: 20 },
    { id: 3, name: "Photography", budget: 3000, spent: 1500, percentage: 12 },
    { id: 4, name: "Flowers", budget: 2000, spent: 1000, percentage: 8 },
    { id: 5, name: "Music", budget: 1500, spent: 750, percentage: 6 },
    { id: 6, name: "Attire", budget: 2000, spent: 1000, percentage: 8 },
    { id: 7, name: "Cake", budget: 500, spent: 250, percentage: 2 },
    { id: 8, name: "Invitations", budget: 500, spent: 250, percentage: 2 },
    { id: 9, name: "Decorations", budget: 500, spent: 200, percentage: 2 },
  ],
}

const initialExpenses = [
  {
    id: 1,
    category: "Venue",
    vendor: "Grand Venue",
    description: "Venue deposit",
    amount: 5000,
    date: "2023-05-15",
  },
  {
    id: 2,
    category: "Catering",
    vendor: "Sunset Catering",
    description: "Catering deposit",
    amount: 2500,
    date: "2023-05-20",
  },
  {
    id: 3,
    category: "Photography",
    vendor: "Dreamy Photography",
    description: "Photography package",
    amount: 1500,
    date: "2023-06-01",
  },
  {
    id: 4,
    category: "Flowers",
    vendor: "Elegant Flowers",
    description: "Floral arrangements",
    amount: 1000,
    date: "2023-06-10",
  },
  {
    id: 5,
    category: "Music",
    vendor: "Melody Makers",
    description: "DJ services",
    amount: 750,
    date: "2023-06-15",
  },
  {
    id: 6,
    category: "Attire",
    vendor: "Bridal Boutique",
    description: "Wedding dress",
    amount: 1000,
    date: "2023-07-01",
  },
  {
    id: 7,
    category: "Cake",
    vendor: "Sweet Delights Bakery",
    description: "Wedding cake",
    amount: 250,
    date: "2023-07-10",
  },
  {
    id: 8,
    category: "Invitations",
    vendor: "Paper Co.",
    description: "Wedding invitations",
    amount: 250,
    date: "2023-07-15",
  },
  {
    id: 9,
    category: "Decorations",
    vendor: "Decor Plus",
    description: "Table centerpieces",
    amount: 200,
    date: "2023-07-20",
  },
]

export default function BudgetPage() {
  const [budget, setBudget] = useState(initialBudget)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [editingTotalBudget, setEditingTotalBudget] = useState(false)
  const [newTotalBudget, setNewTotalBudget] = useState(budget.total.toString())
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [editingCategoryBudgets, setEditingCategoryBudgets] = useState(false)
  const [categoryBudgets, setCategoryBudgets] = useState({})
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date())

  // Initialize category budgets
  useEffect(() => {
    const initialCategoryBudgets = {}
    budget.categories.forEach((category) => {
      initialCategoryBudgets[category.id] = category.budget
    })
    setCategoryBudgets(initialCategoryBudgets)
  }, [])

  // Form setup
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      vendor: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  })

  // Update form values when date changes
  useEffect(() => {
    if (expenseDate) {
      form.setValue("date", format(expenseDate, "yyyy-MM-dd"))
    }
  }, [expenseDate, form])

  // Function to recalculate category percentages based on total budget
  const recalculateCategoryPercentages = (newTotal, newCategoryBudgets = null) => {
    const updatedCategories = budget.categories.map((category) => {
      const categoryBudget = newCategoryBudgets ? newCategoryBudgets[category.id] : category.budget

      return {
        ...category,
        budget: categoryBudget,
        percentage: Math.round((categoryBudget / newTotal) * 100),
      }
    })

    return updatedCategories
  }

  const onSubmit = (data) => {
    const amount = Number.parseFloat(data.amount)
    const newExpenseItem = {
      id: expenses.length + 1,
      ...data,
      amount,
    }

    // Update expenses
    setExpenses([newExpenseItem, ...expenses])

    // Update budget
    const categoryIndex = budget.categories.findIndex((cat) => cat.name === data.category)
    if (categoryIndex !== -1) {
      const updatedCategories = [...budget.categories]
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        spent: updatedCategories[categoryIndex].spent + amount,
      }

      const newSpent = budget.spent + amount
      const newRemaining = budget.total - newSpent

      setBudget({
        ...budget,
        spent: newSpent,
        remaining: newRemaining,
        categories: updatedCategories,
      })
    }

    // Reset form
    form.reset({
      category: "",
      vendor: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    })
    setExpenseDate(new Date())

    setShowAddExpense(false)
    toast.success("Expense added successfully", {
      description: `${data.description} for $${amount.toLocaleString()} has been added.`,
    })
  }

  const confirmDeleteExpense = (id) => {
    const expense = expenses.find((e) => e.id === id)
    setExpenseToDelete(expense)
    setShowDeleteAlert(true)
  }

  const deleteExpense = () => {
    if (!expenseToDelete) return

    // Find the expense to delete
    const expenseToDeleteCopy = { ...expenseToDelete }

    // Update expenses
    const newExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id)
    setExpenses(newExpenses)

    // Update budget
    const categoryIndex = budget.categories.findIndex((cat) => cat.name === expenseToDelete.category)
    if (categoryIndex !== -1) {
      const updatedCategories = [...budget.categories]
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        spent: updatedCategories[categoryIndex].spent - expenseToDelete.amount,
      }

      const newSpent = budget.spent - expenseToDelete.amount
      const newRemaining = budget.total - newSpent

      const newBudget = {
        ...budget,
        spent: newSpent,
        remaining: newRemaining,
        categories: updatedCategories,
      }

      setBudget(newBudget)
    }

    setShowDeleteAlert(false)
    setExpenseToDelete(null)

    toast.error("Expense deleted", {
      description: `${expenseToDeleteCopy.description} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          // Restore the expense
          setExpenses([...newExpenses, expenseToDeleteCopy])

          // Update budget
          if (categoryIndex !== -1) {
            const updatedCategories = [...budget.categories]
            updatedCategories[categoryIndex] = {
              ...updatedCategories[categoryIndex],
              spent: updatedCategories[categoryIndex].spent + expenseToDeleteCopy.amount,
            }

            const newSpent = budget.spent + expenseToDeleteCopy.amount
            const newRemaining = budget.total - newSpent

            setBudget({
              ...budget,
              spent: newSpent,
              remaining: newRemaining,
              categories: updatedCategories,
            })
          }

          toast.success("Expense restored")
        },
      },
    })
  }

  const updateTotalBudget = () => {
    const newTotal = Number.parseFloat(newTotalBudget)
    if (!isNaN(newTotal) && newTotal > 0) {
      // Recalculate category budgets based on their percentages
      const updatedCategories = recalculateCategoryPercentages(newTotal)

      setBudget({
        ...budget,
        total: newTotal,
        remaining: newTotal - budget.spent,
        categories: updatedCategories,
      })
      setEditingTotalBudget(false)

      toast.success("Budget updated", {
        description: `Total budget has been updated to $${newTotal.toLocaleString()}.`,
      })
    } else {
      toast.error("Invalid amount", {
        description: "Please enter a valid number for the budget.",
      })
    }
  }

  const updateCategoryBudgets = () => {
    // Calculate new total from category budgets
    const newTotal = Object.values(categoryBudgets).reduce((sum, value) => sum + Number(value), 0)

    // Update category percentages
    const updatedCategories = budget.categories.map((category) => ({
      ...category,
      budget: Number(categoryBudgets[category.id]),
      percentage: Math.round((Number(categoryBudgets[category.id]) / newTotal) * 100),
    }))

    setBudget({
      ...budget,
      total: newTotal,
      remaining: newTotal - budget.spent,
      categories: updatedCategories,
    })

    setEditingCategoryBudgets(false)

    toast.success("Category budgets updated", {
      description: "Your budget allocation has been updated successfully.",
    })
  }

  const handleCategoryBudgetChange = (id, value) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [id]: value,
    })
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage your wedding budget</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditingCategoryBudgets(true)} className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" /> Adjust Categories
            </Button>
            <Button onClick={() => setShowAddExpense(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${budget.total.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${budget.spent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((budget.spent / budget.total) * 100)}% of total budget
              </p>
              <Progress value={(budget.spent / budget.total) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${budget.remaining.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((budget.remaining / budget.total) * 100)}% of total budget
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>Budget allocation by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {budget.categories.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} of ${category.budget.toLocaleString()} (
                          {category.percentage}% of total)
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {Math.round((category.spent / category.budget) * 100)}% used
                      </p>
                    </div>
                    <Progress value={(category.spent / category.budget) * 100} className="mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Track all your wedding expenses</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="hidden md:table-cell">{expense.vendor}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => confirmDeleteExpense(expense.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No expenses found. Add an expense to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Edit Total Budget Dialog */}
        <Dialog
          open={editingTotalBudget}
          onOpenChange={(open) => {
            setEditingTotalBudget(open)
            if (!open) {
              // Reset the input when dialog closes without saving
              setNewTotalBudget(budget.total.toString())
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Total Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Total Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={newTotalBudget}
                    onChange={(e) => setNewTotalBudget(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will proportionally adjust all category budgets based on their current percentages.
                </p>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingTotalBudget(false)
                  setNewTotalBudget(budget.total.toString())
                }}
              >
                Cancel
              </Button>
              <Button onClick={updateTotalBudget} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Budgets Dialog */}
        <Dialog
          open={editingCategoryBudgets}
          onOpenChange={(open) => {
            setEditingCategoryBudgets(open)
            if (!open) {
              // Reset category budgets when dialog closes without saving
              const resetCategoryBudgets = {}
              budget.categories.forEach((category) => {
                resetCategoryBudgets[category.id] = category.budget
              })
              setCategoryBudgets(resetCategoryBudgets)
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adjust Category Budgets</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ScrollArea className="h-[300px] pr-4">
                {budget.categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <label className="text-sm font-medium leading-none mb-2 block">{category.name}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={categoryBudgets[category.id] || category.budget}
                        onChange={(e) => handleCategoryBudgetChange(category.id, e.target.value)}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: ${category.budget.toLocaleString()} ({category.percentage}% of total)
                    </p>
                  </div>
                ))}
              </ScrollArea>
              <div className="pt-2 border-t">
                <p className="text-sm font-medium">
                  New Total: $
                  {Object.values(categoryBudgets)
                    .reduce((sum, value) => sum + Number(value || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Original Total: ${budget.total.toLocaleString()}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setEditingCategoryBudgets(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={updateCategoryBudgets} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog
          open={showAddExpense}
          onOpenChange={(open) => {
            setShowAddExpense(open)
            if (!open) {
              form.reset({
                category: "",
                vendor: "",
                description: "",
                amount: "",
                date: new Date().toISOString().split("T")[0],
              })
              setExpenseDate(new Date())
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budget.categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter vendor name" {...field} />
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
                        <Input placeholder="Enter description" {...field} />
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <DatePicker date={expenseDate} setDate={setExpenseDate} placeholder="Select expense date" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setShowAddExpense(false)
                      form.reset()
                      setExpenseDate(new Date())
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Add Expense
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Expense Alert Dialog */}
        {showDeleteAlert && expenseToDelete && (
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the expense "{expenseToDelete.description}" for $
                  {expenseToDelete.amount.toLocaleString()}. This action can be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <AlertDialogCancel
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setShowDeleteAlert(false)
                    setExpenseToDelete(null)
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteExpense}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </AppShell>
  )
}

