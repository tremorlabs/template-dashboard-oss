"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  emptyInventoryFilters,
  filterInventory,
  InventoryFilterbar,
  type InventoryFilters,
} from "@/components/ui/inventory/InventoryFilterbar"
import { InventoryKpiCards } from "@/components/ui/inventory/InventoryKpiCards"
import {
  getInventoryId,
  InventoryTable,
} from "@/components/ui/inventory/InventoryTable"
import { TicketDrawer } from "@/components/ui/TicketDrawer"
import {
  inventory as sampleInventory,
  type InventoryItem,
} from "@/data/inventory/data"
import { RiAddLine } from "@remixicon/react"
import React from "react"

export default function InventoryPage() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<InventoryFilters>(
    emptyInventoryFilters,
  )
  const [items, setItems] = React.useState<InventoryItem[]>(sampleInventory)
  const filteredItems = React.useMemo(
    () => filterInventory(items, filters),
    [items, filters],
  )
  const brandItems = React.useMemo(
    () => filterInventory(items, { ...filters, status: "all" }),
    [items, filters],
  )

  const deleteItems = (ids: string[]) => {
    const idSet = new Set(ids)
    setItems((prev) => prev.filter((item) => !idSet.has(getInventoryId(item))))
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Inventory
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Monitor stock levels, committed units and inventory value.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-base sm:text-sm"
        >
          Add Product
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <TicketDrawer open={isOpen} onOpenChange={setIsOpen} />
      </div>
      <Divider />
      <InventoryKpiCards items={brandItems} />
      <div className="mt-6">
        <InventoryFilterbar filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="mt-6">
        <InventoryTable items={filteredItems} onDelete={deleteItems} />
      </div>
    </main>
  )
}
