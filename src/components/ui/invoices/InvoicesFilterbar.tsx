"use client"

import { Button } from "@/components/Button"
import { DateRangePicker, type DateRange } from "@/components/DatePicker"
import { invoiceStatuses, type Invoice } from "@/data/invoices/data"
import { cx } from "@/lib/utils"
import { endOfDay } from "date-fns"

const statusTabs = [
  { value: "all", label: "All" },
  ...invoiceStatuses.map(({ value, label }) => ({ value, label })),
]

export type InvoicesFilters = {
  dates: DateRange | undefined
  status: string
}

export const emptyInvoicesFilters: InvoicesFilters = {
  dates: undefined,
  status: "all",
}

export const filterInvoices = (
  invoices: Invoice[],
  filters: InvoicesFilters,
) =>
  invoices.filter((invoice) => {
    const created = new Date(`${invoice.created}T00:00:00`)
    const { from, to } = filters.dates ?? {}
    if (from && created < from) return false
    if (to && created > endOfDay(to)) return false
    if (filters.status !== "all" && invoice.status !== filters.status)
      return false
    return true
  })

type InvoicesFilterbarProps = {
  filters: InvoicesFilters
  onFiltersChange: (filters: InvoicesFilters) => void
  minDate?: Date
  maxDate?: Date
}

export function InvoicesFilterbar({
  filters,
  onFiltersChange,
  minDate,
  maxDate,
}: InvoicesFilterbarProps) {
  const update = (changes: Partial<InvoicesFilters>) =>
    onFiltersChange({ ...filters, ...changes })

  const isFiltered = filters.dates !== undefined

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Invoice status"
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
        {isFiltered && (
          <Button
            variant="ghost"
            className="h-8 w-full py-0 sm:w-fit sm:text-xs"
            onClick={() => update({ dates: undefined })}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
