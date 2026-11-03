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
  shipmentCarriers,
  shipmentStatuses,
  type Shipment,
} from "@/data/shipments/data"
import { cx } from "@/lib/utils"
import { endOfDay } from "date-fns"

const statusTabs = [
  { value: "all", label: "All" },
  ...shipmentStatuses.map(({ value, label }) => ({ value, label })),
]

export type ShipmentsFilters = {
  dates: DateRange | undefined
  status: string
  carrier: string
}

export const emptyShipmentsFilters: ShipmentsFilters = {
  dates: undefined,
  status: "all",
  carrier: "all",
}

export const filterShipments = (
  shipments: Shipment[],
  filters: ShipmentsFilters,
) =>
  shipments.filter((item) => {
    const created = new Date(`${item.created}T00:00:00`)
    const { from, to } = filters.dates ?? {}
    if (from && created < from) return false
    if (to && created > endOfDay(to)) return false
    if (filters.status !== "all" && item.status !== filters.status) return false
    if (filters.carrier !== "all" && item.carrier !== filters.carrier)
      return false
    return true
  })

type ShipmentsFilterbarProps = {
  filters: ShipmentsFilters
  onFiltersChange: (filters: ShipmentsFilters) => void
  minDate?: Date
  maxDate?: Date
}

export function ShipmentsFilterbar({
  filters,
  onFiltersChange,
  minDate,
  maxDate,
}: ShipmentsFilterbarProps) {
  const update = (changes: Partial<ShipmentsFilters>) =>
    onFiltersChange({ ...filters, ...changes })

  const isFiltered =
    filters.dates !== undefined ||
    filters.carrier !== emptyShipmentsFilters.carrier

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Shipment state"
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
          value={filters.carrier}
          onValueChange={(carrier) => update({ carrier })}
        >
          <SelectTrigger className="h-8 w-full py-0 sm:w-40 sm:text-xs">
            <SelectValue placeholder="Carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All carriers</SelectItem>
            {shipmentCarriers.map((carrier) => (
              <SelectItem key={carrier} value={carrier}>
                {carrier}
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
                ...emptyShipmentsFilters,
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
