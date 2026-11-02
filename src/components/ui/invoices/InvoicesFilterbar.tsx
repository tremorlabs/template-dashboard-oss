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
import { invoiceStatuses, type Invoice } from "@/data/invoices/data"
import { endOfDay } from "date-fns"

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

  const isFiltered =
    filters.dates !== undefined || filters.status !== emptyInvoicesFilters.status

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
          {invoiceStatuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isFiltered && (
        <Button
          variant="ghost"
          className="h-8 w-full py-0 sm:w-fit sm:text-xs"
          onClick={() => onFiltersChange(emptyInvoicesFilters)}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
