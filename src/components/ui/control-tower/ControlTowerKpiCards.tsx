import { Card } from "@/components/Card"
import {
  summarizeOrders,
  type ControlTowerOrder,
} from "@/data/control-tower/data"
import { toDateKey } from "@/data/reports/data"
import { cx } from "@/lib/utils"
import { parseISO, subDays } from "date-fns"
import React from "react"

const WINDOW_DAYS = 7

const countFormatter = new Intl.NumberFormat("en-US")
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})
const changeFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})
const pointsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

type Summary = ReturnType<typeof summarizeOrders>

const relativeChange = (current: number, previous: number) =>
  previous ? changeFormatter.format((current - previous) / previous) : null

const pointsChange = (current: number, previous: number) =>
  `${pointsFormatter.format((current - previous) * 100)} pt`

const summarizeWeeks = (orders: ControlTowerOrder[]) => {
  if (!orders.length) return null
  let first = orders[0].created
  let last = first
  for (const { created } of orders) {
    if (created < first) first = created
    if (created > last) last = created
  }
  const end = parseISO(last)
  const currentStart = toDateKey(subDays(end, WINDOW_DAYS - 1))
  const previousStart = toDateKey(subDays(end, WINDOW_DAYS * 2 - 1))
  if (first > previousStart) return null
  return {
    current: summarizeOrders(
      orders.filter((order) => order.created >= currentStart),
    ),
    previous: summarizeOrders(
      orders.filter(
        (order) =>
          order.created >= previousStart && order.created < currentStart,
      ),
    ),
  }
}

const kpis: {
  label: string
  key: keyof Summary
  format: (value: number) => string
  change: (current: number, previous: number) => string | null
  higherIsBetter: boolean
}[] = [
  {
    label: "Orders",
    key: "orders",
    format: countFormatter.format,
    change: relativeChange,
    higherIsBetter: true,
  },
  {
    label: "Fill Rate",
    key: "fillRate",
    format: percentFormatter.format,
    change: pointsChange,
    higherIsBetter: true,
  },
  {
    label: "SLA",
    key: "sla",
    format: percentFormatter.format,
    change: pointsChange,
    higherIsBetter: true,
  },
  {
    label: "Exceptions",
    key: "exceptions",
    format: countFormatter.format,
    change: relativeChange,
    higherIsBetter: false,
  },
]

export function ControlTowerKpiCards({
  orders,
}: {
  orders: ControlTowerOrder[]
}) {
  const { summary, weeks } = React.useMemo(
    () => ({ summary: summarizeOrders(orders), weeks: summarizeWeeks(orders) }),
    [orders],
  )

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const current = weeks?.current[kpi.key] ?? 0
        const previous = weeks?.previous[kpi.key] ?? 0
        const change = weeks ? kpi.change(current, previous) : null
        const direction = Math.sign(current - previous)
        const isGood = direction === 0 || direction > 0 === kpi.higherIsBetter
        return (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-500">
                {kpi.label}
              </dt>
              {change && (
                <span
                  title={`Last ${WINDOW_DAYS} days vs. previous ${WINDOW_DAYS} days`}
                  className={cx(
                    "inline-flex items-center rounded px-2 py-1 text-xs font-medium tabular-nums ring-1 ring-inset",
                    isGood
                      ? "bg-emerald-100 text-emerald-800 ring-emerald-600/10 dark:bg-emerald-400/10 dark:text-emerald-500 dark:ring-emerald-400/20"
                      : "bg-red-100 text-red-800 ring-red-600/10 dark:bg-red-400/10 dark:text-red-500 dark:ring-red-400/20",
                  )}
                >
                  {change}
                </span>
              )}
            </div>
            <dd className="mt-1 text-3xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {kpi.format(summary[kpi.key])}
            </dd>
          </Card>
        )
      })}
    </dl>
  )
}
