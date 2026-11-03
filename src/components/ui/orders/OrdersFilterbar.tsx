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
import { cx } from "@/lib/utils"
import { endOfDay } from "date-fns"

const statusTabs = [
  { value: "all", label: "All" },
  ...statuses.map(({ value, label }) => ({ value, label })),
]

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
    filters.dates !== undefined || filters.priority !== emptyFilters.priority

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Order status"
        className="flex w-full overflow-x-auto rounded-md border border-gray-200 p-0.5 sm:w-fit dark:border-gray-800"
      >
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => update({ status: tab.value })}
              className={cx(
                "h-7 flex-1 whitespace-nowrap rounded px-3 text-xs font-medium transition sm:flex-none",
                isActive
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-50",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DateRangePicker
          value={filters.dates}
          onChange={(dates) => update({ dates })}
          className="h-8 w-full py-0 sm:w-fit sm:text-xs"
          fromDate={minDate}
          toDate={maxDate}
          align="end"
        />
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
            onClick={() =>
              onFiltersChange({ ...emptyFilters, status: filters.status })
            }
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
