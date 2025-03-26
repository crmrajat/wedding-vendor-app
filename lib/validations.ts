import { z } from "zod"

// Validation schema for contract form
export const contractSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  type: z.string().min(1, "Type is required"),
  signedDate: z.string().min(1, "Signed date is required"),
  expirationDate: z.string().optional(),
  fileName: z.string().min(1, "File name is required"),
})

// Validation schema for appointment form
export const appointmentSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
})

// Validation schema for payment form
export const paymentSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num > 0
      },
      {
        message: "Amount must be a positive number",
      },
    ),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["Pending", "Paid"]),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
})

// Validation schema for expense form
export const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  vendor: z.string().min(1, "Vendor is required"),
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num > 0
      },
      {
        message: "Amount must be a positive number",
      },
    ),
  date: z.string().min(1, "Date is required"),
})

// Validation schema for vendor form
export const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  notes: z.string().optional(),
})

