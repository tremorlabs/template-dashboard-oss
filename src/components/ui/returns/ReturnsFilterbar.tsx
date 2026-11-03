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
import {
  returnReasons,
  returnStatuses,
  type ReturnRequest,
} from "@/data/returns/data"
import { cx } from "@/lib/utils"
import { endOfDay } from "date-fns"

const statusTabs = [
  { value: "all", label: "All" },
  ...returnStatuses.map(({ value, label }) => ({ value, label })),
]

export type ReturnsFilters = {
  dates: DateRange | undefined
  status: string
  reason: string
}

export const emptyReturnsFilters: ReturnsFilters = {
  dates: undefined,
  status: "all",
  reason: "all",
}

export const filterReturns = (
  returns: ReturnRequest[],
  filters: ReturnsFilters,
) =>
  returns.filter((item) => {
    const created = new Date(`${item.created}T00:00:00`)
    const { from, to } = filters.dates ?? {}
    if (from && created < from) return false
    if (to && created > endOfDay(to)) return false
    if (filters.status !== "all" && item.status !== filters.status)
      return false
    if (filters.reason !== "all" && item.reason !== filters.reason)
      return false
    return true
  })

type ReturnsFilterbarProps = {
  filters: ReturnsFilters
  onFiltersChange: (filters: ReturnsFilters) => void
  minDate?: Date
  maxDate?: Date
}

export function ReturnsFilterbar({
  filters,
  onFiltersChange,
  minDate,
  maxDate,
}: ReturnsFilterbarProps) {
  const update = (changes: Partial<ReturnsFilters>) =>
    onFiltersChange({ ...filters, ...changes })

  const isFiltered =
    filters.dates !== undefined ||
    filters.reason !== emptyReturnsFilters.reason

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Return status"
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
          value={filters.reason}
          onValueChange={(reason) => update({ reason })}
        >
          <SelectTrigger className="h-8 w-full py-0 sm:w-40 sm:text-xs">
            <SelectValue placeholder="Reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reasons</SelectItem>
            {returnReasons.map((reason) => (
              <SelectItem key={reason} value={reason}>
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="ghost"
            className="h-8 w-full py-0 sm:w-fit sm:text-xs"
            onClick={() =>
              onFiltersChange({
                ...emptyReturnsFilters,
                status: filters.status,
              })
            }
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
