"use client"

import { Divider } from "@/components/Divider"
import {
  emptyInvoicesFilters,
  filterInvoices,
  InvoicesFilterbar,
  type InvoicesFilters,
} from "@/components/ui/invoices/InvoicesFilterbar"
import { InvoicesKpiCards } from "@/components/ui/invoices/InvoicesKpiCards"
import {
  getInvoiceId,
  InvoicesTable,
} from "@/components/ui/invoices/InvoicesTable"
import {
  invoices as sampleInvoices,
  type Invoice,
  type InvoiceStatus,
} from "@/data/invoices/data"
import React from "react"

const createdDates = sampleInvoices.map((invoice) =>
  new Date(`${invoice.created}T00:00:00`).getTime(),
)
const minDate = new Date(Math.min(...createdDates))
const maxDate = new Date(Math.max(...createdDates))

export default function InvoicesPage() {
  const [filters, setFilters] =
    React.useState<InvoicesFilters>(emptyInvoicesFilters)
  const [invoices, setInvoices] = React.useState<Invoice[]>(sampleInvoices)
  const filteredInvoices = React.useMemo(
    () => filterInvoices(invoices, filters),
    [invoices, filters],
  )

  const updateStatus = (ids: string[], status: string) => {
    const idSet = new Set(ids)
    setInvoices((prev) =>
      prev.map((invoice) =>
        idSet.has(getInvoiceId(invoice))
          ? { ...invoice, status: status as InvoiceStatus }
          : invoice,
      ),
    )
  }

  const deleteInvoices = (ids: string[]) => {
    const idSet = new Set(ids)
    setInvoices((prev) =>
      prev.filter((invoice) => !idSet.has(getInvoiceId(invoice))),
    )
  }

  return (
    <main>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Invoices
        </h1>
        <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
          Track what has been billed, collected and is still outstanding.
        </p>
      </div>
      <Divider />
      <InvoicesKpiCards invoices={filteredInvoices} />
      <div className="mt-6">
        <InvoicesFilterbar
          filters={filters}
          onFiltersChange={setFilters}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div className="mt-6">
        <InvoicesTable
          invoices={filteredInvoices}
          onStatusChange={updateStatus}
          onDelete={deleteInvoices}
        />
      </div>
    </main>
  )
}
