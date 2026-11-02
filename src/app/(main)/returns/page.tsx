"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  emptyReturnsFilters,
  filterReturns,
  ReturnsFilterbar,
  type ReturnsFilters,
} from "@/components/ui/returns/ReturnsFilterbar"
import { ReturnsKpiCards } from "@/components/ui/returns/ReturnsKpiCards"
import { getReturnId, ReturnsTable } from "@/components/ui/returns/ReturnsTable"
import { TicketDrawer } from "@/components/ui/TicketDrawer"
import {
  returns as sampleReturns,
  type ReturnRequest,
  type ReturnStatus,
} from "@/data/returns/data"
import { RiAddLine } from "@remixicon/react"
import React from "react"

const createdDates = sampleReturns.map((item) =>
  new Date(`${item.created}T00:00:00`).getTime(),
)
const minDate = new Date(Math.min(...createdDates))
const maxDate = new Date(Math.max(...createdDates))

export default function ReturnsPage() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filters, setFilters] =
    React.useState<ReturnsFilters>(emptyReturnsFilters)
  const [returns, setReturns] = React.useState<ReturnRequest[]>(sampleReturns)
  const filteredReturns = React.useMemo(
    () => filterReturns(returns, filters),
    [returns, filters],
  )

  const updateStatus = (ids: string[], status: string) => {
    const idSet = new Set(ids)
    setReturns((prev) =>
      prev.map((item) =>
        idSet.has(getReturnId(item))
          ? { ...item, status: status as ReturnStatus }
          : item,
      ),
    )
  }

  const deleteReturns = (ids: string[]) => {
    const idSet = new Set(ids)
    setReturns((prev) => prev.filter((item) => !idSet.has(getReturnId(item))))
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Returns
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Review return requests, refunds and why customers send items back.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-base sm:text-sm"
        >
          Create Return
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <TicketDrawer open={isOpen} onOpenChange={setIsOpen} />
      </div>
      <Divider />
      <ReturnsKpiCards returns={filteredReturns} />
      <div className="mt-6">
        <ReturnsFilterbar
          filters={filters}
          onFiltersChange={setFilters}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div className="mt-6">
        <ReturnsTable
          returns={filteredReturns}
          onStatusChange={updateStatus}
          onDelete={deleteReturns}
        />
      </div>
    </main>
  )
}
