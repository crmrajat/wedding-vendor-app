"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FileText, Plus, Upload } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppShell } from "@/components/layout/app-shell"
import { DatePicker } from "@/components/ui/date-picker"
import { contractSchema, appointmentSchema } from "@/lib/validations"

// Sample contract data
const initialContracts = [
  {
    id: 1,
    vendor: "Grand Venue",
    type: "Venue",
    signedDate: "2023-05-15",
    expirationDate: "2024-06-30",
    fileName: "grand_venue_contract.pdf",
  },
  {
    id: 2,
    vendor: "Sunset Catering",
    type: "Catering",
    signedDate: "2023-05-20",
    expirationDate: "2024-06-15",
    fileName: "sunset_catering_contract.pdf",
  },
  {
    id: 3,
    vendor: "Dreamy Photography",
    type: "Photography",
    signedDate: "2023-06-01",
    expirationDate: "2024-06-20",
    fileName: "dreamy_photography_contract.pdf",
  },
  {
    id: 4,
    vendor: "Elegant Flowers",
    type: "Florist",
    signedDate: "2023-06-10",
    expirationDate: "2024-06-10",
    fileName: "elegant_flowers_contract.pdf",
  },
  {
    id: 5,
    vendor: "Melody Makers",
    type: "Music",
    signedDate: "2023-06-15",
    expirationDate: "2024-06-25",
    fileName: "melody_makers_contract.pdf",
  },
]

// Sample appointment data
const initialAppointments = [
  {
    id: 1,
    vendor: "Grand Venue",
    type: "Venue Visit",
    date: "2023-06-15",
    time: "10:00 AM",
    notes: "Final walkthrough of the venue",
  },
  {
    id: 2,
    vendor: "Sunset Catering",
    type: "Food Tasting",
    date: "2023-07-10",
    time: "2:00 PM",
    notes: "Tasting for main course options",
  },
  {
    id: 3,
    vendor: "Sweet Delights Bakery",
    type: "Cake Tasting",
    date: "2023-07-15",
    time: "11:00 AM",
    notes: "Tasting for wedding cake flavors",
  },
  {
    id: 4,
    vendor: "Elegant Flowers",
    type: "Floral Consultation",
    date: "2023-07-20",
    time: "3:00 PM",
    notes: "Discuss centerpiece and bouquet options",
  },
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [showAddContract, setShowAddContract] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Date states for the calendar
  const [signedDate, setSignedDate] = useState<Date | undefined>(new Date())
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date())

  // Contract form
  const contractForm = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      vendor: "",
      type: "",
      signedDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
      fileName: "",
    },
    mode: "onChange",
  })

  // Appointment form
  const appointmentForm = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      vendor: "",
      type: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      notes: "",
    },
    mode: "onChange",
  })

  // Update form values when dates change
  useEffect(() => {
    if (signedDate) {
      contractForm.setValue("signedDate", format(signedDate, "yyyy-MM-dd"))
    }
  }, [signedDate, contractForm])

  useEffect(() => {
    if (expirationDate) {
      contractForm.setValue("expirationDate", format(expirationDate, "yyyy-MM-dd"))
    }
  }, [expirationDate, contractForm])

  useEffect(() => {
    if (appointmentDate) {
      appointmentForm.setValue("date", format(appointmentDate, "yyyy-MM-dd"))
    }
  }, [appointmentDate, appointmentForm])

  // Reset form submitted state when dialog closes
  useEffect(() => {
    if (!showAddContract) {
      setFormSubmitted(false)
    }
  }, [showAddContract])

  const onContractSubmit = (data) => {
    setFormSubmitted(true)

    // Form validation is handled by Zod resolver
    const fileName = selectedFile ? selectedFile.name : data.fileName

    const newContractItem = {
      id: contracts.length + 1,
      ...data,
      fileName: fileName,
    }

    setContracts([...contracts, newContractItem])
    setSelectedFile(null)
    setShowAddContract(false)
    contractForm.reset({
      vendor: "",
      type: "",
      signedDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
      fileName: "",
    })
    setSignedDate(new Date())
    setExpirationDate(undefined)

    toast.success("Contract added", {
      description: `Contract for ${data.vendor} has been added successfully.`,
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      // Update the form value
      contractForm.setValue("fileName", e.target.files[0].name)
    }
  }

  const onAppointmentSubmit = (data) => {
    const newAppointmentItem = {
      id: appointments.length + 1,
      ...data,
    }

    setAppointments([...appointments, newAppointmentItem])
    setShowAddAppointment(false)
    appointmentForm.reset({
      vendor: "",
      type: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      notes: "",
    })
    setAppointmentDate(new Date())

    toast.success("Appointment added", {
      description: `Appointment with ${data.vendor} has been scheduled.`,
    })
  }

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })

  // Get upcoming appointments (future dates)
  const upcomingAppointments = sortedAppointments.filter(
    (appointment) => new Date(appointment.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
  )

  // Get contracts expiring in the next 30 days
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const expiringContracts = contracts.filter((contract) => {
    const expirationDate = new Date(contract.expirationDate)
    return expirationDate <= thirtyDaysFromNow && expirationDate >= today
  })

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contract Management</h1>
            <p className="text-muted-foreground mt-1">Manage contracts and appointments with vendors</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {expiringContracts.length > 0 && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-800 dark:text-amber-300">Contract Expiration Reminders</CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-400">
                  The following contracts are expiring in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <ul className="space-y-2">
                    {expiringContracts.map((contract) => (
                      <li key={contract.id} className="rounded-md bg-amber-100 p-3 dark:bg-amber-900">
                        <div className="font-medium text-amber-800 dark:text-amber-300">{contract.vendor}</div>
                        <div className="text-sm text-amber-700 dark:text-amber-400">
                          Expires on {new Date(contract.expirationDate).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {upcomingAppointments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your next scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <ul className="space-y-2">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <li key={appointment.id} className="rounded-md bg-muted p-3">
                        <div className="font-medium">{appointment.vendor}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <div className="text-sm">{appointment.type}</div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
              {upcomingAppointments.length > 3 && (
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById("appointments-tab").click()}
                  >
                    View all appointments
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>

        <Tabs defaultValue="contracts">
          <TabsList className="mb-6">
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="appointments" id="appointments-tab">
              Appointments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contracts">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddContract(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Contract
              </Button>
            </div>
            <Card>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Signed Date</TableHead>
                      <TableHead>Expiration Date</TableHead>
                      <TableHead>Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.vendor}</TableCell>
                        <TableCell className="hidden md:table-cell">{contract.type}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(contract.signedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{new Date(contract.expirationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">{contract.fileName}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appointments">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddAppointment(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Appointment
              </Button>
            </div>
            <Card>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.vendor}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                          {appointment.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Contract Dialog */}
        <Dialog
          open={showAddContract}
          onOpenChange={(open) => {
            setShowAddContract(open)
            if (!open) {
              contractForm.reset({
                vendor: "",
                type: "",
                signedDate: new Date().toISOString().split("T")[0],
                expirationDate: "",
                fileName: "",
              })
              setSelectedFile(null)
              setFormSubmitted(false)
              setSignedDate(new Date())
              setExpirationDate(undefined)
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contract</DialogTitle>
            </DialogHeader>
            <Form {...contractForm}>
              <form onSubmit={contractForm.handleSubmit(onContractSubmit)} className="space-y-4">
                <FormField
                  control={contractForm.control}
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
                  control={contractForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Venue">Venue</SelectItem>
                          <SelectItem value="Catering">Catering</SelectItem>
                          <SelectItem value="Photography">Photography</SelectItem>
                          <SelectItem value="Florist">Florist</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Cake">Cake</SelectItem>
                          <SelectItem value="Attire">Attire</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contractForm.control}
                  name="signedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Signed Date</FormLabel>
                      <DatePicker date={signedDate} setDate={setSignedDate} placeholder="Select signed date" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contractForm.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date</FormLabel>
                      <DatePicker
                        date={expirationDate}
                        setDate={setExpirationDate}
                        placeholder="Select expiration date"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={contractForm.control}
                  name="fileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Contract</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input type="file" id="contract-file" className="hidden" onChange={handleFileChange} />
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={selectedFile ? selectedFile.name : "Select file"}
                            value={selectedFile ? selectedFile.name : field.value}
                            onChange={(e) => !selectedFile && field.onChange(e.target.value)}
                            className="flex-1"
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => document.getElementById("contract-file").click()}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload</span>
                        </Button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {selectedFile
                          ? `File selected: ${selectedFile.name}`
                          : "For demo purposes, you can also just enter a filename"}
                      </p>
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
                      setShowAddContract(false)
                      contractForm.reset()
                      setSelectedFile(null)
                      setSignedDate(new Date())
                      setExpirationDate(undefined)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={formSubmitted && !contractForm.formState.isValid}
                  >
                    Add Contract
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Add Appointment Dialog */}
        <Dialog
          open={showAddAppointment}
          onOpenChange={(open) => {
            setShowAddAppointment(open)
            if (!open) {
              appointmentForm.reset({
                vendor: "",
                type: "",
                date: new Date().toISOString().split("T")[0],
                time: "10:00",
                notes: "",
              })
              setAppointmentDate(new Date())
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
            </DialogHeader>
            <Form {...appointmentForm}>
              <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-4">
                <FormField
                  control={appointmentForm.control}
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
                  control={appointmentForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Venue Visit">Venue Visit</SelectItem>
                          <SelectItem value="Food Tasting">Food Tasting</SelectItem>
                          <SelectItem value="Cake Tasting">Cake Tasting</SelectItem>
                          <SelectItem value="Floral Consultation">Floral Consultation</SelectItem>
                          <SelectItem value="Dress Fitting">Dress Fitting</SelectItem>
                          <SelectItem value="Planning Meeting">Planning Meeting</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={appointmentForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <DatePicker
                        date={appointmentDate}
                        setDate={setAppointmentDate}
                        placeholder="Select appointment date"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={appointmentForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={appointmentForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter any notes" {...field} />
                      </FormControl>
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
                      setShowAddAppointment(false)
                      appointmentForm.reset()
                      setAppointmentDate(new Date())
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Add Appointment
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}

