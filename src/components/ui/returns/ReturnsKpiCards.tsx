import { Card } from "@/components/Card"
import { returnStatuses, type ReturnRequest } from "@/data/returns/data"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
})
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

const sumAmounts = (returns: ReturnRequest[]) =>
  returns.reduce((sum, item) => sum + item.amount, 0)

export function ReturnsKpiCards({ returns }: { returns: ReturnRequest[] }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <dt className="truncate text-sm text-gray-500 dark:text-gray-500">
          Total Returns
        </dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
          {returns.length}
        </dd>
        <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
          {currencyFormatter.format(sumAmounts(returns))} requested
        </dd>
      </Card>
      {returnStatuses.map((status) => {
        const matching = returns.filter((item) => item.status === status.value)

        return (
          <Card key={status.value} className="p-4">
            <dt className="flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-500">
              <span className="truncate">{status.label}</span>
              {returns.length > 0 && (
                <span className="font-medium tabular-nums text-gray-700 dark:text-gray-300">
                  {shareFormatter.format(matching.length / returns.length)}
                </span>
              )}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {matching.length}
            </dd>
            <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
              {currencyFormatter.format(sumAmounts(matching))}
            </dd>
          </Card>
        )
      })}
    </dl>
  )
}
