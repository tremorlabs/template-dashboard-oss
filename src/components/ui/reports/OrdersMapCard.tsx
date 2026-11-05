"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { LazyReportsMap as ReportsMap } from "@/components/ui/map/LazyMaps"
import {
  LocationViewToggle,
  useLocationSelection,
} from "@/components/ui/reports/LocationViewToggle"
import type { ReportOrder } from "@/data/reports/data"
import { cx, focusRing } from "@/lib/utils"

export function OrdersMapCard({
  orders,
  className,
}: {
  orders: ReportOrder[]
  className?: string
}) {
  const { view, changeView, locations, selectedId, toggleLocation } =
    useLocationSelection(orders, "state")

  return (
    <Card className={cx("flex min-h-0 flex-col p-0", className)}>
      <LocationViewToggle value={view} onChange={changeView} />
      <div className="flex flex-col border-t border-gray-200 md:h-96 md:flex-row xl:h-auto xl:min-h-0 xl:flex-1 dark:border-gray-800">
        <ul
          role="list"
          className="max-h-60 shrink-0 space-y-0.5 overflow-y-auto p-2 md:max-h-none md:w-56"
        >
          {locations.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                aria-pressed={selectedId === location.id}
                onClick={() => toggleLocation(location.id)}
                className={cx(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-900",
                  selectedId === location.id &&
                    "bg-gray-100 font-medium text-gray-900 dark:bg-gray-900 dark:text-gray-50",
                  focusRing,
                )}
              >
                <span className="w-11 shrink-0">
                  <Badge variant="success" className="tabular-nums">
                    {location.count}
                  </Badge>
                </span>
                <span className="truncate">{location.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="h-80 min-w-0 overflow-hidden rounded-b-lg border-t border-gray-200 md:h-auto md:flex-1 md:rounded-bl-none md:border-l md:border-t-0 dark:border-gray-800">
          <ReportsMap
            locations={locations}
            selectedId={selectedId}
            onSelect={toggleLocation}
          />
        </div>
      </div>
    </Card>
  )
}
