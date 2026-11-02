"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  emptyFilters,
  filterTickets,
  OrdersFilterbar,
  type OrdersFilters,
} from "@/components/ui/orders/OrdersFilterbar"
import { OrdersKpiCards } from "@/components/ui/orders/OrdersKpiCards"
import { getTicketId, OrdersTable } from "@/components/ui/orders/OrdersTable"
import { TicketDrawer } from "@/components/ui/TicketDrawer"
import type { Ticket } from "@/data/support/schema"
import { tickets } from "@/data/support/tickets"
import { RiAddLine } from "@remixicon/react"
import React from "react"

const createdDates = tickets.map((ticket) => new Date(ticket.created).getTime())
const minDate = new Date(Math.min(...createdDates))
const maxDate = new Date(Math.max(...createdDates))

export default function SupportDashboard() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<OrdersFilters>(emptyFilters)
  const [orders, setOrders] = React.useState<Ticket[]>(tickets)
  const filteredOrders = React.useMemo(
    () => filterTickets(orders, filters),
    [orders, filters],
  )

  const updateStatus = (ids: string[], status: string) => {
    const idSet = new Set(ids)
    setOrders((prev) =>
      prev.map((order) =>
        idSet.has(getTicketId(order)) ? { ...order, status } : order,
      ),
    )
  }

  const deleteOrders = (ids: string[]) => {
    const idSet = new Set(ids)
    setOrders((prev) => prev.filter((order) => !idSet.has(getTicketId(order))))
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Orders
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Real-time monitoring your orders and their status.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-base sm:text-sm"
        >
          Create Order
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <TicketDrawer open={isOpen} onOpenChange={setIsOpen} />
      </div>
      <Divider />
      <OrdersKpiCards tickets={filteredOrders} />
      <div className="mt-6">
        <OrdersFilterbar
          filters={filters}
          onFiltersChange={setFilters}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div className="mt-6">
        <OrdersTable
          tickets={filteredOrders}
          onStatusChange={updateStatus}
          onDelete={deleteOrders}
        />
      </div>
    </main>
  )
}
