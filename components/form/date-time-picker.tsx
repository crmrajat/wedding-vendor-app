"use client"

import { useState, useEffect } from "react"
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
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [fieldValue, setFieldValue] = useState<string | undefined>(undefined)
  const [innerValue, setInnerValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (fieldValue && typeof fieldValue === "string") {
      setDate(new Date(fieldValue))
    }
  }, [fieldValue])

  useEffect(() => {
    if (innerValue !== fieldValue) {
      setFieldValue(innerValue)
    }
  }, [innerValue, fieldValue])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        useEffect(() => {
          if (field.value !== innerValue) {
            setInnerValue(field.value)
          }
        }, [field.value, innerValue])

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
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      const currentDate = date || new Date()
                      newDate.setHours(currentDate.getHours())
                      newDate.setMinutes(currentDate.getMinutes())
                      newDate.setSeconds(0)
                    }
                    setDate(newDate)
                    field.onChange(newDate ? newDate.toISOString() : "")
                  }}
                  initialFocus
                />
                {showTimePicker && date && (
                  <TimePicker
                    date={date}
                    setDate={(newDate) => {
                      setDate(newDate)
                      field.onChange(newDate.toISOString())
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

