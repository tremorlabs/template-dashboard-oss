"use client"

import { Card } from "@/components/Card"
import {
  channels,
  countByChannel,
  type Channel,
  type ControlTowerOrder,
} from "@/data/control-tower/data"
import { cx } from "@/lib/utils"
import React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const countFormatter = new Intl.NumberFormat("en-US")
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

const channelStyles: Record<Channel, { marker: string; slice: string }> = {
  "mercado-libre": { marker: "bg-cyan-500", slice: "fill-cyan-500" },
  amazon: { marker: "bg-blue-500", slice: "fill-blue-500" },
  shopify: { marker: "bg-indigo-500", slice: "fill-indigo-500" },
  walmart: { marker: "bg-violet-500", slice: "fill-violet-500" },
}

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

  return (
    <Card className={cx("flex min-h-0 flex-col p-4", className)}>
      <h2 className="font-semibold text-gray-900 dark:text-gray-50">
        Orders by Channel
      </h2>
      <div className="relative mt-6 h-48 w-full shrink-0 xl:h-auto xl:min-h-40 xl:flex-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius="75%"
              outerRadius="100%"
              stroke=""
              className="stroke-white dark:stroke-[#090E1A]"
              isAnimationActive={false}
            >
              {data.map((channel) => (
                <Cell
                  key={channel.value}
                  fill=""
                  className={cx(
                    "outline-none",
                    channelStyles[channel.value].slice,
                  )}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
            {countFormatter.format(orders.length)}
          </span>
          <span className="text-xs text-gray-500">Orders</span>
        </div>
      </div>
      <p className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <span>Channel</span>
        <span>Orders / Share</span>
      </p>
      <ul
        role="list"
        className="mt-2 divide-y divide-gray-200 dark:divide-gray-800"
      >
        {data.map((channel) => (
          <li
            key={channel.value}
            className="flex items-center justify-between gap-6 py-2 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cx(
                  "size-2.5 shrink-0 rounded-sm",
                  channelStyles[channel.value].marker,
                )}
              />
              <span className="truncate text-gray-700 dark:text-gray-300">
                {channel.label}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="font-medium tabular-nums text-gray-900 dark:text-gray-50">
                {countFormatter.format(channel.count)}
              </span>
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {shareFormatter.format(
                  orders.length ? channel.count / orders.length : 0,
                )}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
