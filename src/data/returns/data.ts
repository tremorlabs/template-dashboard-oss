import { addDays, format } from "date-fns"

export type ReturnStatus = "pending" | "refunded" | "rejected"

export type ReturnRequest = {
  number: string
  orderNumber: string
  customer: string
  reason: string
  created: string
  amount: number
  status: ReturnStatus
}


export const returnStatuses: {
  value: ReturnStatus
  label: string
  variant: "success" | "warning" | "error"
}[] = [
  { value: "pending", label: "Pending Review", variant: "warning" },
  { value: "refunded", label: "Refunded", variant: "success" },
  { value: "rejected", label: "Rejected", variant: "error" },
]

export const getReturnStatus = (value: string) =>
  returnStatuses.find((status) => status.value === value)

export const returnReasons = [
  "Damaged item",
  "Wrong item sent",
  "Not as described",
  "Size or fit",
  "Changed mind",
  "Late delivery",
]

const customers = [
  "María González",
  "José Hernández",
  "Guadalupe López",
  "Juan Martínez",
  "Fernanda Ramírez",
  "Luis Torres",
  "Ana Sánchez",
  "Carlos Flores",
  "Sofía Cruz",
  "Diego Morales",
  "Valeria Ortiz",
  "Miguel Reyes",
]

export const returnsStart = new Date(2026, 8, 1)
export const returnsAsOf = new Date(2026, 10, 2)

const REVIEW_DAYS = 7
const returnDays = 62

const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const generateReturns = () => {
  const random = createRandom(3467)
  const returns: ReturnRequest[] = []

  for (let day = 0; day < returnDays; day++) {
    const count = Math.floor(random() * 4)

    for (let i = 0; i < count; i++) {
      const created = addDays(returnsStart, day)
      const isReviewed = addDays(created, REVIEW_DAYS) < returnsAsOf

      returns.push({
        number: `RET-${String(returns.length + 1).padStart(5, "0")}`,
        orderNumber: `ORD-${10000 + Math.floor(random() * 1800)}`,
        customer: customers[Math.floor(random() * customers.length)],
        reason: returnReasons[Math.floor(random() * returnReasons.length)],
        created: format(created, "yyyy-MM-dd"),
        amount: Math.round(300 + random() * 2200),
        status: !isReviewed
          ? "pending"
          : random() < 0.82
            ? "refunded"
            : "rejected",
      })
    }
  }
  return returns
}

export const returns = generateReturns()
