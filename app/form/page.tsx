"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, Clock, Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/time-picker"

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.date({
    required_error: "Please select a time",
  }),
  amount: z.coerce.number().min(1, "Amount must be at least 1").max(1000, "Amount must be less than 1000"),
})

type FormValues = z.infer<typeof formSchema>

// Define the entry type
type Entry = FormValues & { id: string }

export default function FormPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  // Get current date and time for defaults
  const now = new Date()

  // Initialize the form with proper default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: now,
      time: now,
      amount: 1, // Initialize with a valid number instead of undefined
    },
  })

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      if (currentEntry) {
        // Update existing entry
        const updatedEntries = entries.map((entry) =>
          entry.id === currentEntry.id ? { ...values, id: entry.id } : entry,
        )
        setEntries(updatedEntries)
        toast.success("Entry updated successfully")
      } else {
        // Add new entry
        const newEntry = { ...values, id: Date.now().toString() }
        setEntries([...entries, newEntry])
        toast.success("Entry added successfully")
      }

      setIsDialogOpen(false)
      form.reset({
        title: "",
        description: "",
        date: now,
        time: now,
        amount: 1,
      })
      setCurrentEntry(null)
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = (id: string) => {
    setEntryToDelete(id)
    setIsAlertOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (!entryToDelete) return

    const entryToRemove = entries.find((entry) => entry.id === entryToDelete)
    const newEntries = entries.filter((entry) => entry.id !== entryToDelete)
    setEntries(newEntries)

    const toastId = toast.success("Entry deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          if (entryToRemove) {
            setEntries((prev) => [...prev, entryToRemove])
            toast.dismiss(toastId)
            toast.success("Delete undone")
          }
        },
      },
    })

    setEntryToDelete(null)
    setIsAlertOpen(false)
  }

  // Open dialog for editing
  const handleEdit = (entry: Entry) => {
    setCurrentEntry(entry)
    form.reset({
      title: entry.title,
      description: entry.description || "",
      date: entry.date,
      time: entry.time,
      amount: entry.amount,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for adding
  const handleAdd = () => {
    setCurrentEntry(null)
    form.reset({
      title: "",
      description: "",
      date: now,
      time: now,
      amount: 1,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Form Entries</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add your first entry to get started.</p>
          <Button onClick={handleAdd} className="mt-4">
            Add Entry
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <ScrollArea className="h-[500px]">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{entry.description || "-"}</TableCell>
                      <TableCell>{format(entry.date, "d MMM, yyyy")}</TableCell>
                      <TableCell>{format(entry.time, "h:mm a")}</TableCell>
                      <TableCell>{entry.amount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentEntry ? "Edit Entry" : "Add New Entry"}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {currentEntry ? "update the" : "create a new"} entry.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" maxLength={50} {...field} />
                    </FormControl>
                    <FormDescription>The title of your entry (max 50 characters)</FormDescription>
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
                      <Textarea
                        placeholder="Enter description"
                        maxLength={500}
                        className="resize-none"
                        {...field}
                        value={field.value || ""} // Ensure value is never undefined
                      />
                    </FormControl>
                    <FormDescription>Optional description (max 500 characters)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "d MMM, yyyy") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date || now)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "h:mm a") : <span>Pick a time</span>}
                              <Clock className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <TimePicker setDate={field.onChange} date={field.value || now} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        min={1}
                        max={1000}
                        {...field}
                        value={field.value || 1} // Ensure value is never undefined
                      />
                    </FormControl>
                    <FormDescription>Enter a value between 1 and 1000</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentEntry ? "Update" : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

