import { Card } from "@/components/Card"
import { stockStatuses, type InventoryItem } from "@/data/inventory/data"
import {
  getColorClassName,
  type AvailableChartColorsKeys,
} from "@/lib/chartUtils"
import { cx } from "@/lib/utils"
import { RiArrowRightUpLine } from "@remixicon/react"

const statusColors: Record<string, AvailableChartColorsKeys> = {
  in_stock: "emerald",
  low_stock: "amber",
  out_of_stock: "red",
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
})
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

type InventoryKpiCardsProps = {
  items: InventoryItem[]
  activeStatus: string
  onSelectStatus: (status: string) => void
}

export function InventoryKpiCards({
  items,
  activeStatus,
  onSelectStatus,
}: InventoryKpiCardsProps) {
  const totalCost = items.reduce(
    (sum, item) => sum + item.onHand * item.unitCost,
    0,
  )
  const breakdown = stockStatuses.map((status) => {
    const count = items.filter((item) => item.status === status.value).length
    return {
      ...status,
      count,
      share: items.length > 0 ? count / items.length : 0,
      color: statusColors[status.value],
    }
  })

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-500">
            Total Products
          </h3>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {items.length}
            </span>
            <span className="text-sm tabular-nums text-gray-500 dark:text-gray-500">
              {currencyFormatter.format(totalCost)} at cost
            </span>
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-[34rem]">
          {breakdown.map((item) => {
            const isActive = activeStatus === item.value
            return (
              <Card
                key={item.value}
                className={cx(
                  "group px-3 py-2",
                  isActive && "border-gray-300 dark:border-gray-700",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      getColorClassName(item.color, "bg"),
                      "size-2.5 shrink-0 rounded-sm",
                    )}
                    aria-hidden="true"
                  />
                  <dt className="text-sm text-gray-500 dark:text-gray-500">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectStatus(isActive ? "all" : item.value)
                      }
                      aria-pressed={isActive}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.label}
                    </button>
                  </dt>
                </div>
                <dd className="mt-1 text-sm tabular-nums text-gray-900 dark:text-gray-50">
                  <span className="font-semibold">
                    {shareFormatter.format(item.share)}
                  </span>{" "}
                  &#8729; {item.count} products
                </dd>
                <span
                  className="pointer-events-none absolute right-2 top-2 text-gray-400 group-hover:text-gray-600 dark:text-gray-600 group-hover:dark:text-gray-400"
                  aria-hidden="true"
                >
                  <RiArrowRightUpLine className="size-4" />
                </span>
              </Card>
            )
          })}
        </dl>
      </div>
      <div className="mt-4 flex h-1.5 w-full items-center gap-0.5">
        {breakdown
          .filter((item) => item.share > 0)
          .map((item) => (
            <div
              key={item.value}
              className={cx(
                getColorClassName(item.color, "bg"),
                "h-full rounded-full",
              )}
              style={{ width: `${item.share * 100}%` }}
            />
          ))}
      </div>
    </div>
  )
}
