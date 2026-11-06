"use client"

import { Card } from "@/components/Card"
import { ProgressBar } from "@/components/ProgressBar"
import {
  channels,
  countByChannel,
  summarizeOrders,
  summarizeWeeks,
  WINDOW_DAYS,
  type ControlTowerOrder,
} from "@/data/control-tower/data"
import { cx } from "@/lib/utils"
import React from "react"

type Stat = { label: string; value: string; tone?: "good" | "bad" }

const countFormatter = new Intl.NumberFormat("en-US")
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})
const changeFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})

export function OrdersByChannelCard({
  orders,
  className,
}: {
  orders: ControlTowerOrder[]
  className?: string
}) {
  const data = React.useMemo(() => {
    const counts = countByChannel(orders)
    return channels
      .map((channel) => ({ ...channel, count: counts[channel.value] }))
      .sort((a, b) => b.count - a.count)
  }, [orders])
  const total = orders.length
  const top = data[0]

  const topStats = React.useMemo((): Stat[] | null => {
    if (!top?.count) return null
    const topOrders = orders.filter((order) => order.channel === top.value)
    const summary = summarizeOrders(topOrders)
    const weeks = summarizeWeeks(topOrders)
    const change = weeks?.previous.orders
      ? (weeks.current.orders - weeks.previous.orders) / weeks.previous.orders
      : null
    return [
      {
        label: `vs prev. ${WINDOW_DAYS}d`,
        value: change === null ? "–" : changeFormatter.format(change),
        tone: change ? (change > 0 ? "good" : "bad") : undefined,
      },
      { label: "SLA", value: shareFormatter.format(summary.sla) },
      {
        label: "Exceptions",
        value: countFormatter.format(summary.exceptions),
        tone: summary.exceptions > 0 ? "bad" : undefined,
      },
    ]
  }, [orders, top])

  const fulfillment = React.useMemo(() => {
    const { shipped, onTime } = summarizeOrders(orders)
    return [
      { label: "On time", count: onTime, color: "bg-emerald-500" },
      { label: "Late", count: shipped - onTime, color: "bg-amber-500" },
      {
        label: "Pending",
        count: orders.length - shipped,
        color: "bg-gray-300 dark:bg-gray-700",
      },
    ]
  }, [orders])

  return (
    <Card className={cx("flex min-h-0 flex-col p-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          Orders by Channel
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-50">
            {countFormatter.format(total)}
          </span>{" "}
          orders
        </p>
      </div>
      <ul role="list" className="mt-6 flex flex-col gap-4">
        {data.map((channel) => {
          const share = total ? channel.count / total : 0
          return (
            <li key={channel.value}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                  {channel.label}
                </span>
                <span className="flex shrink-0 items-center gap-2 tabular-nums">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {countFormatter.format(channel.count)}
                  </span>
                  <span className="w-12 text-right text-xs text-gray-500">
                    {shareFormatter.format(share)}
                  </span>
                </span>
              </div>
              <ProgressBar
                value={channel.count}
                max={top?.count}
                className="mt-2"
              />
            </li>
          )
        })}
      </ul>
      {total > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Fulfillment status
          </p>
          <div
            className="mt-3 flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
            aria-hidden="true"
          >
            {fulfillment.map(
              (item) =>
                item.count > 0 && (
                  <div
                    key={item.label}
                    className={cx("h-full", item.color)}
                    style={{ width: `${(item.count / total) * 100}%` }}
                  />
                ),
            )}
          </div>
          <ul role="list" className="mt-3 grid grid-cols-3 gap-2 text-xs">
            {fulfillment.map((item) => (
              <li key={item.label} className="min-w-0">
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                  <span
                    aria-hidden="true"
                    className={cx("size-2 shrink-0 rounded-sm", item.color)}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="mt-0.5 block font-medium tabular-nums text-gray-900 dark:text-gray-50">
                  {countFormatter.format(item.count)}{" "}
                  <span className="font-normal text-gray-500">
                    {shareFormatter.format(item.count / total)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {topStats && (
        <div className="mt-6 border-t border-gray-200 pt-4 xl:mt-auto dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Top channel ·{" "}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {top.label}
            </span>
          </p>
          <dl className="mt-3 grid grid-cols-3 gap-2">
            {topStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md bg-gray-50 px-2.5 py-2 dark:bg-gray-900"
              >
                <dt className="truncate text-xs text-gray-500 dark:text-gray-500">
                  {stat.label}
                </dt>
                <dd
                  className={cx(
                    "mt-0.5 text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-50",
                    stat.tone === "good" &&
                      "text-emerald-600 dark:text-emerald-500",
                    stat.tone === "bad" && "text-red-600 dark:text-red-500",
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Card>
  )
}
