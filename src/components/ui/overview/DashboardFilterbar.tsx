"use client"

import { DateRangePicker } from "@/components/DatePicker"
import { subYears } from "date-fns"
import { DateRange } from "react-day-picker"

export const getPeriod = (
  dateRange: DateRange | undefined,
): DateRange | undefined => {
  if (!dateRange) return undefined
  const from = dateRange.from
  const to = dateRange.to
  let lastYearFrom
  let lastYearTo
  if (from) {
    lastYearFrom = subYears(from, 1)
  }
  if (to) {
    lastYearTo = subYears(to, 1)
  }
  return { from: lastYearFrom, to: lastYearTo }
}

type FilterbarProps = {
  maxDate?: Date
  minDate?: Date
  selectedDates: DateRange | undefined
  onDatesChange: (dates: DateRange | undefined) => void
}

export function Filterbar({
  maxDate,
  minDate,
  selectedDates,
  onDatesChange,
}: FilterbarProps) {
  return (
    <div className="w-full sm:flex sm:items-center sm:gap-2">
      <DateRangePicker
        value={selectedDates}
        onChange={onDatesChange}
        className="w-full sm:w-fit"
        toDate={maxDate}
        fromDate={minDate}
        align="start"
      />
    </div>
  )
}
