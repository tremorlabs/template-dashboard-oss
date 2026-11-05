"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { LazyReportsMap as ReportsMap } from "@/components/ui/map/LazyMaps"
import {
  LocationViewToggle,
  useLocationSelection,
} from "@/components/ui/reports/LocationViewToggle"
import type { ReportOrder } from "@/data/reports/data"
import { cx, focusRing } from "@/lib/utils"
import { RiArrowDownSLine } from "@remixicon/react"

const ALL = "all"

export function ControlTowerMapCard({
  orders,
  className,
}: {
  orders: ReportOrder[]
  className?: string
}) {
  const {
    view,
    changeView,
    locations,
    selectedId,
    setSelectedId,
    toggleLocation,
  } = useLocationSelection(orders, "city")
  const selected = locations.find(({ id }) => id === selectedId)
  const allLabel = view === "city" ? "All cities" : "All states"

  const renderPicker = (container: HTMLElement | null) => (
    <div className="absolute left-2 top-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cx(
              "flex max-w-56 items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 shadow-md ring-1 ring-black/5 transition hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-50 dark:ring-white/10 hover:dark:bg-gray-800",
              focusRing,
            )}
          >
            <span className="truncate">{selected?.name ?? allLabel}</span>
            {selected && (
              <Badge variant="success" className="tabular-nums">
                {selected.count}
              </Badge>
            )}
            <RiArrowDownSLine
              className="-mr-1 size-4 shrink-0 text-gray-500"
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          container={container}
          align="start"
          className="max-h-72 min-w-56 overflow-y-auto"
        >
          <DropdownMenuRadioGroup
            value={selectedId ?? ALL}
            onValueChange={(value) =>
              setSelectedId(value === ALL ? null : value)
            }
          >
            <DropdownMenuRadioItem value={ALL} hint={String(orders.length)}>
              {allLabel}
            </DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            {locations.map((location) => (
              <DropdownMenuRadioItem
                key={location.id}
                value={location.id}
                hint={String(location.count)}
              >
                {location.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <Card className={cx("flex min-h-0 flex-col p-0", className)}>
      <LocationViewToggle value={view} onChange={changeView} />
      <div className="h-80 min-w-0 overflow-hidden rounded-b-lg border-t border-gray-200 md:h-96 xl:h-auto xl:min-h-0 xl:flex-1 dark:border-gray-800">
        <ReportsMap
          locations={locations}
          selectedId={selectedId}
          onSelect={toggleLocation}
          controls={renderPicker}
        />
      </div>
    </Card>
  )
}
