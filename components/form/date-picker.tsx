"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormDatePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  className?: string
}

export function FormDatePicker({ name, control, label, placeholder, className }: FormDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [fieldValue, setFieldValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (fieldValue && typeof fieldValue === "string") {
      setDate(new Date(fieldValue))
    }
  }, [fieldValue])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        useEffect(() => {
          if (field.value !== fieldValue) {
            setFieldValue(field.value)
          }
        }, [field.value, fieldValue])

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
                    {field.value ? format(new Date(field.value), "PPP") : <span>{placeholder || "Pick a date"}</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate)
                    field.onChange(newDate ? newDate.toISOString().split("T")[0] : "")
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

