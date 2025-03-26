import { format, parseISO } from "date-fns"

/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "Jan 15, 2023")
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString)
    return format(date, "MMM d, yyyy")
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString // Return original string if parsing fails
  }
}

/**
 * Formats a date string into a short format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "01/15/2023")
 */
export function formatShortDate(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString)
    return format(date, "MM/dd/yyyy")
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString // Return original string if parsing fails
  }
}

// Add a function to safely parse dates to avoid hydration mismatches
export function safeParseDate(dateString: string | Date | null | undefined): Date {
  if (!dateString) return new Date()

  try {
    // If it's already a Date object
    if (dateString instanceof Date) return dateString

    // If it's an ISO string
    if (typeof dateString === "string") {
      const date = new Date(dateString)
      // Check if valid date
      if (isNaN(date.getTime())) return new Date()
      return date
    }

    return new Date()
  } catch (error) {
    console.error("Error parsing date:", error)
    return new Date()
  }
}

