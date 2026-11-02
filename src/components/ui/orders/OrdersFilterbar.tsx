"use client"

import { Button } from "@/components/Button"
import { DateRangePicker, type DateRange } from "@/components/DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { priorities, statuses, type Ticket } from "@/data/support/schema"
import { endOfDay } from "date-fns"

export type OrdersFilters = {
  dates: DateRange | undefined
  status: string
  priority: string
}

export const emptyFilters: OrdersFilters = {
  dates: undefined,
  status: "all",
  priority: "all",
}

export const filterTickets = (tickets: Ticket[], filters: OrdersFilters) =>
  tickets.filter((ticket) => {
    const created = new Date(ticket.created)
    const { from, to } = filters.dates ?? {}
    if (from && created < from) return false
    if (to && created > endOfDay(to)) return false
    if (filters.status !== "all" && ticket.status !== filters.status)
      return false
    if (filters.priority !== "all" && ticket.priority !== filters.priority)
      return false
    return true
  })

type OrdersFilterbarProps = {
  filters: OrdersFilters
  onFiltersChange: (filters: OrdersFilters) => void
  minDate?: Date
  maxDate?: Date
}

export function OrdersFilterbar({
  filters,
  onFiltersChange,
  minDate,
  maxDate,
}: OrdersFilterbarProps) {
  const update = (changes: Partial<OrdersFilters>) =>
    onFiltersChange({ ...filters, ...changes })

  const isFiltered =
    filters.dates !== undefined ||
    filters.status !== emptyFilters.status ||
    filters.priority !== emptyFilters.priority

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <DateRangePicker
        value={filters.dates}
        onChange={(dates) => update({ dates })}
        className="h-8 w-full py-0 sm:w-fit sm:text-xs"
        fromDate={minDate}
        toDate={maxDate}
        align="end"
      />
      <Select
        value={filters.status}
        onValueChange={(status) => update({ status })}
      >
        <SelectTrigger className="h-8 w-full py-0 sm:w-40 sm:text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority}
        onValueChange={(priority) => update({ priority })}
      >
        <SelectTrigger className="h-8 w-full py-0 sm:w-40 sm:text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isFiltered && (
        <Button
          variant="ghost"
          className="h-8 w-full py-0 sm:w-fit sm:text-xs"
          onClick={() => onFiltersChange(emptyFilters)}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
