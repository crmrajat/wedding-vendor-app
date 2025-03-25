import { z } from "zod"

// Vendor validation schema
export const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required").max(50, "Name must be less than 50 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

// Budget validation schema
export const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  vendor: z.string().min(1, "Vendor is required").max(50, "Vendor name must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "Amount must be a positive number"),
  date: z.string().min(1, "Date is required"),
})

// Contract validation schema
export const contractSchema = z
  .object({
    vendor: z.string().min(1, "Vendor name is required").max(50, "Name must be less than 50 characters"),
    type: z.string().min(1, "Type is required"),
    signedDate: z.string().min(1, "Signed date is required"),
    expirationDate: z.string().min(1, "Expiration date is required"),
    fileName: z.string().min(1, "File name is required"),
  })
  .refine(
    (data) => {
      // Only validate dates if both are provided
      if (!data.signedDate || !data.expirationDate) {
        return true
      }

      // Compare the dates
      const signedDate = new Date(data.signedDate)
      const expirationDate = new Date(data.expirationDate)
      return expirationDate >= signedDate
    },
    {
      message: "Expiration date must be after signed date",
      path: ["expirationDate"], // This targets the error to the expirationDate field
    },
  )

// Appointment validation schema
export const appointmentSchema = z.object({
  vendor: z.string().min(1, "Vendor name is required").max(50, "Name must be less than 50 characters"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().max(200, "Notes must be less than 200 characters").optional(),
})

// Payment validation schema
export const paymentSchema = z.object({
  vendor: z.string().min(1, "Vendor name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, "Amount must be a positive number"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
})

