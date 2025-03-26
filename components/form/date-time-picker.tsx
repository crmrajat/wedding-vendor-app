"use client"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/time-picker"

interface FormDateTimePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  className?: string
  showTimePicker?: boolean
}

export function FormDateTimePicker({
  name,
  control,
  label,
  placeholder,
  className,
  showTimePicker = false,
}: FormDateTimePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert the string date from the form to a Date object for the Calendar
        const selectedDate = field.value ? new Date(field.value) : undefined

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? (
                      format(new Date(field.value), showTimePicker ? "PPP p" : "PPP")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <div className="ml-auto flex items-center">
                      {showTimePicker && <Clock className="mr-2 h-4 w-4 opacity-50" />}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve the time from the existing date or use current time
                      const currentTime = selectedDate || new Date()

                      // Create a new date with the correct day, preserving time
                      const newDate = new Date(date)
                      newDate.setHours(currentTime.getHours())
                      newDate.setMinutes(currentTime.getMinutes())
                      newDate.setSeconds(0)

                      // Create an ISO string but ensure we're using the local date
                      const year = newDate.getFullYear()
                      const month = String(newDate.getMonth() + 1).padStart(2, "0")
                      const day = String(newDate.getDate()).padStart(2, "0")
                      const hours = String(newDate.getHours()).padStart(2, "0")
                      const minutes = String(newDate.getMinutes()).padStart(2, "0")

                      // Format as ISO-like string but preserving the actual selected date
                      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
                      field.onChange(dateTimeString)
                    } else {
                      field.onChange("")
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
                {showTimePicker && selectedDate && (
                  <TimePicker
                    date={selectedDate}
                    setDate={(date) => {
                      // Ensure we preserve the correct day when updating time
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, "0")
                      const day = String(date.getDate()).padStart(2, "0")
                      const hours = String(date.getHours()).padStart(2, "0")
                      const minutes = String(date.getMinutes()).padStart(2, "0")

                      // Format as ISO-like string but preserving the actual selected date
                      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
                      field.onChange(dateTimeString)
                    }}
                  />
                )}
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

