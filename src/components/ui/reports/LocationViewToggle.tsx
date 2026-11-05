import {
  getOrdersByLocation,
  type LocationView,
  type ReportOrder,
} from "@/data/reports/data"
import { cx, focusRing } from "@/lib/utils"
import React from "react"

export function useLocationSelection(
  orders: ReportOrder[],
  defaultView: LocationView,
) {
  const [view, setView] = React.useState(defaultView)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const locations = React.useMemo(
    () => getOrdersByLocation(orders, view),
    [orders, view],
  )

  const changeView = (nextView: LocationView) => {
    setView(nextView)
    setSelectedId(null)
  }
  const toggleLocation = (id: string) =>
    setSelectedId((current) => (current === id ? null : id))

  return {
    view,
    changeView,
    locations,
    selectedId,
    setSelectedId,
    toggleLocation,
  }
}

const views: { value: LocationView; label: string }[] = [
  { value: "state", label: "State" },
  { value: "city", label: "City" },
]

export function LocationViewToggle({
  value,
  onChange,
}: {
  value: LocationView
  onChange: (view: LocationView) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <h2 className="font-semibold text-gray-900 dark:text-gray-50">
        Orders by
      </h2>
      <div
        role="group"
        aria-label="Group orders by"
        className="inline-flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-900"
      >
        {views.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={value === item.value}
            onClick={() => onChange(item.value)}
            className={cx(
              "rounded px-2.5 py-1 text-xs font-medium transition",
              value === item.value
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              focusRing,
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
