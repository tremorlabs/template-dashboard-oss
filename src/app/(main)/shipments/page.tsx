"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  emptyShipmentsFilters,
  filterShipments,
  ShipmentsFilterbar,
  type ShipmentsFilters,
} from "@/components/ui/shipments/ShipmentsFilterbar"
import {
  getShipmentId,
  ShipmentsTable,
} from "@/components/ui/shipments/ShipmentsTable"
import { TicketDrawer } from "@/components/ui/TicketDrawer"
import {
  shipments as sampleShipments,
  type Shipment,
  type ShipmentStatus,
} from "@/data/shipments/data"
import { RiAddLine } from "@remixicon/react"
import React from "react"

const createdDates = sampleShipments.map((item) =>
  new Date(`${item.created}T00:00:00`).getTime(),
)
const minDate = new Date(Math.min(...createdDates))
const maxDate = new Date(Math.max(...createdDates))

export default function ShipmentsPage() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<ShipmentsFilters>(
    emptyShipmentsFilters,
  )
  const [shipments, setShipments] =
    React.useState<Shipment[]>(sampleShipments)
  const filteredShipments = React.useMemo(
    () => filterShipments(shipments, filters),
    [shipments, filters],
  )

  const updateStatus = (ids: string[], status: string) => {
    const idSet = new Set(ids)
    setShipments((prev) =>
      prev.map((item) =>
        idSet.has(getShipmentId(item))
          ? { ...item, status: status as ShipmentStatus }
          : item,
      ),
    )
  }

  const deleteShipments = (ids: string[]) => {
    const idSet = new Set(ids)
    setShipments((prev) =>
      prev.filter((item) => !idSet.has(getShipmentId(item))),
    )
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Shipments
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Track outgoing shipments, carriers and delivery status.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-base sm:text-sm"
        >
          Create Shipment
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <TicketDrawer open={isOpen} onOpenChange={setIsOpen} />
      </div>
      <Divider />
      <div className="mt-6">
        <ShipmentsFilterbar
          filters={filters}
          onFiltersChange={setFilters}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div className="mt-6">
        <ShipmentsTable
          shipments={filteredShipments}
          onStatusChange={updateStatus}
          onDelete={deleteShipments}
        />
      </div>
    </main>
  )
}
