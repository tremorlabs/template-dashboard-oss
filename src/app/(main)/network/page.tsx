"use client"

import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { LazyNetworkMap as NetworkMap } from "@/components/ui/map/LazyMaps"
import {
  networkConnections,
  networkNodes,
  nodeTypes,
} from "@/data/network/data"
import { cx, focusRing } from "@/lib/utils"
import React from "react"

export default function Network() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const toggleNode = (id: string) =>
    setSelectedId((current) => (current === id ? null : id))

  const hubs = networkNodes.filter((node) => node.type === "fulfillment")
  const stats = [
    { label: "Locations", value: networkNodes.length },
    { label: "Hubs", value: hubs.length },
    { label: "Routes", value: networkConnections.length },
  ]

  return (
    <main className="flex flex-col xl:-mb-6 xl:h-[calc(100dvh-2.75rem)] xl:min-h-[36rem]">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Network
        </h1>
        <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
          Where we store, sort and ship from.
        </p>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:min-h-0 xl:flex-1">
        <section className="flex min-h-0 flex-col">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Strategic locations
          </h2>
          <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-400">
            Fulfillment centers in Mexico City and Monterrey serve Mexico&apos;s
            largest demand zones. Cross-docks in Tijuana and Miami connect the
            network to the United States, so stock can move across the border
            wherever orders come from.
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm text-gray-500 dark:text-gray-500">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <ul
            role="list"
            className="mt-6 space-y-0.5 border-t border-gray-200 pt-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto dark:border-gray-800"
          >
            {networkNodes.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  aria-pressed={selectedId === node.id}
                  onClick={() => toggleNode(node.id)}
                  className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-gray-100 hover:dark:bg-gray-900",
                    selectedId === node.id && "bg-gray-100 dark:bg-gray-900",
                    focusRing,
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-gray-900 dark:text-gray-50">
                      {node.name}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {node.state}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-500">
                    {nodeTypes[node.type]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <Card className="h-[28rem] overflow-hidden p-0 lg:col-span-2 lg:h-auto lg:min-h-[28rem] xl:min-h-0">
          <NetworkMap
            nodes={networkNodes}
            connections={networkConnections}
            selectedId={selectedId}
            onSelect={toggleNode}
          />
        </Card>
      </div>
    </main>
  )
}
