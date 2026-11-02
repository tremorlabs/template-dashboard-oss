import { addDays, format } from "date-fns"

export type InvoiceStatus = "paid" | "pending" | "overdue"

export type Invoice = {
  number: string
  customer: string
  created: string
  dueDate: string
  amount: number
  status: InvoiceStatus
}

// single source for how an invoice status is named and colored across the UI
export const invoiceStatuses: {
  value: InvoiceStatus
  label: string
  variant: "success" | "warning" | "error"
}[] = [
  { value: "paid", label: "Paid", variant: "success" },
  { value: "pending", label: "Pending", variant: "warning" },
  { value: "overdue", label: "Overdue", variant: "error" },
]

export const getInvoiceStatus = (value: string) =>
  invoiceStatuses.find((status) => status.value === value)

const customers = [
  "Abarrotes La Esperanza",
  "Distribuidora del Bajío",
  "Ferretería Monterrey",
  "Farmacias San Ángel",
  "Comercializadora Azteca",
  "Papelería El Estudiante",
  "Tiendas Mérida Centro",
  "Grupo Textil Puebla",
  "Refaccionaria Jalisco",
  "Mueblería Querétaro",
  "Café Veracruz",
  "Electrónica Tijuana",
]

export const invoicesStart = new Date(2026, 7, 1)
// date the sample data is "as of"; decides which unpaid invoices are overdue
export const invoicesAsOf = new Date(2026, 10, 2)

const PAYMENT_TERM_DAYS = 30
const invoiceDays = 90

const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const generateInvoices = () => {
  const random = createRandom(2026)
  const invoices: Invoice[] = []

  for (let day = 0; day < invoiceDays; day++) {
    const count = Math.floor(random() * 3)

    for (let i = 0; i < count; i++) {
      const created = addDays(invoicesStart, day)
      const dueDate = addDays(created, PAYMENT_TERM_DAYS)
      // older invoices are more likely to be paid already
      const isPaid = random() < (dueDate < invoicesAsOf ? 0.8 : 0.35)

      invoices.push({
        number: `INV-${String(invoices.length + 1).padStart(5, "0")}`,
        customer: customers[Math.floor(random() * customers.length)],
        created: format(created, "yyyy-MM-dd"),
        dueDate: format(dueDate, "yyyy-MM-dd"),
        amount: Math.round(2000 + random() * 48000),
        status: isPaid
          ? "paid"
          : dueDate < invoicesAsOf
            ? "overdue"
            : "pending",
      })
    }
  }
  return invoices
}

export const invoices = generateInvoices()
