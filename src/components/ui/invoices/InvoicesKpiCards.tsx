import { Card } from "@/components/Card"
import { invoiceStatuses, type Invoice } from "@/data/invoices/data"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
})
const shareFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

const sumAmounts = (invoices: Invoice[]) =>
  invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

export function InvoicesKpiCards({ invoices }: { invoices: Invoice[] }) {
  const total = sumAmounts(invoices)

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <dt className="truncate text-sm text-gray-500 dark:text-gray-500">
          Total Invoiced
        </dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
          {currencyFormatter.format(total)}
        </dd>
        <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
          {invoices.length} invoices
        </dd>
      </Card>
      {invoiceStatuses.map((status) => {
        const matching = invoices.filter(
          (invoice) => invoice.status === status.value,
        )
        const amount = sumAmounts(matching)

        return (
          <Card key={status.value} className="p-4">
            <dt className="flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-500">
              <span className="truncate">{status.label}</span>
              {total > 0 && (
                <span className="font-medium tabular-nums text-gray-700 dark:text-gray-300">
                  {shareFormatter.format(amount / total)}
                </span>
              )}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {currencyFormatter.format(amount)}
            </dd>
            <dd className="mt-1 text-sm tabular-nums text-gray-500 dark:text-gray-500">
              {matching.length} invoices
            </dd>
          </Card>
        )
      })}
    </dl>
  )
}
