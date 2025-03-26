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

