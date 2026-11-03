import { Card } from "@/components/Card"
import { type InventoryItem } from "@/data/inventory/data"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
})
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

const sumCost = (items: InventoryItem[]) =>
  items.reduce((sum, item) => sum + item.onHand * item.unitCost, 0)

export function InventoryKpiCards({ items }: { items: InventoryItem[] }) {
  const productCount = new Set(items.map((item) => item.product)).size
  const lowStock = items.filter((item) => item.status === "low_stock")
  const outOfStock = items.filter((item) => item.status === "out_of_stock")

  const statusCards = [
    {
      label: "Low Stock",
      matching: lowStock,
      detail: `${lowStock.reduce((sum, item) => sum + item.onHand, 0)} units left`,
    },
    {
      label: "Out of Stock",
      matching: outOfStock,
      detail: `${new Set(outOfStock.map((item) => item.product)).size} products affected`,
    },
  ]

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4">
        <dt className="truncate text-sm text-gray-500 dark:text-gray-500">
          Total Products
        </dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
          {productCount}
        </dd>
        <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
          {items.length} variants · {currencyFormatter.format(sumCost(items))}
        </dd>
      </Card>
      {statusCards.map((card) => (
        <Card key={card.label} className="p-4">
          <dt className="flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-500">
            <span className="truncate">{card.label}</span>
            {items.length > 0 && (
              <span className="font-medium tabular-nums text-gray-700 dark:text-gray-300">
                {shareFormatter.format(card.matching.length / items.length)}
              </span>
            )}
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
            {card.matching.length}
          </dd>
          <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
            {card.detail}
          </dd>
        </Card>
      ))}
    </dl>
  )
}
