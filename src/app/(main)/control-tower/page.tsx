"use client"

import { DateRangePicker, type DateRange } from "@/components/DatePicker"
import { Divider } from "@/components/Divider"
import { ControlTowerKpiCards } from "@/components/ui/control-tower/ControlTowerKpiCards"
import { OrdersByChannelCard } from "@/components/ui/control-tower/OrdersByChannelCard"
import { ControlTowerMapCard } from "@/components/ui/control-tower/ControlTowerMapCard"
import { controlTowerOrders } from "@/data/control-tower/data"
import { filterReportOrders, reportEnd, reportStart } from "@/data/reports/data"
import React from "react"

export default function ControlTower() {
  const [dates, setDates] = React.useState<DateRange | undefined>({
    from: reportStart,
    to: reportEnd,
  })
  const orders = React.useMemo(
    () => filterReportOrders(controlTowerOrders, dates?.from, dates?.to),
    [dates],
  )

  return (
    <main className="flex flex-col xl:-mb-6 xl:h-[calc(100dvh-2.75rem)] xl:min-h-[36rem]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Control Tower
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Live view of orders, fulfillment and exceptions.
          </p>
        </div>
        <DateRangePicker
          aria-label="Control tower period"
          value={dates}
          onChange={setDates}
          className="w-full sm:w-fit"
          fromDate={reportStart}
          toDate={reportEnd}
          align="end"
        />
      </div>
      <Divider className="my-4" />
      <ControlTowerKpiCards orders={orders} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-3">
        <ControlTowerMapCard orders={orders} className="xl:col-span-2" />
        <OrdersByChannelCard orders={orders} />
      </div>
    </main>
  )
}
