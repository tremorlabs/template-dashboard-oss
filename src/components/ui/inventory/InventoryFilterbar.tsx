"use client"

import { Button } from "@/components/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  inventoryBrands,
  stockStatuses,
  type InventoryItem,
} from "@/data/inventory/data"
import { cx } from "@/lib/utils"

const statusTabs = [
  { value: "all", label: "All" },
  ...stockStatuses.map(({ value, label }) => ({ value, label })),
]

export type InventoryFilters = {
  status: string
  brand: string
}

export const emptyInventoryFilters: InventoryFilters = {
  status: "all",
  brand: "all",
}

export const filterInventory = (
  items: InventoryItem[],
  filters: InventoryFilters,
) =>
  items.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) return false
    if (filters.brand !== "all" && item.brand !== filters.brand) return false
    return true
  })

type InventoryFilterbarProps = {
  filters: InventoryFilters
  onFiltersChange: (filters: InventoryFilters) => void
}

export function InventoryFilterbar({
  filters,
  onFiltersChange,
}: InventoryFilterbarProps) {
  const update = (changes: Partial<InventoryFilters>) =>
    onFiltersChange({ ...filters, ...changes })

  const isFiltered = filters.brand !== emptyInventoryFilters.brand

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Stock status"
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
        <Select
          value={filters.brand}
          onValueChange={(brand) => update({ brand })}
        >
          <SelectTrigger className="h-8 w-full py-0 sm:w-40 sm:text-xs">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {inventoryBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
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
                ...emptyInventoryFilters,
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
