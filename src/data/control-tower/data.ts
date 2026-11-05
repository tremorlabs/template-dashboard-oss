import { reportOrders, toDateKey, type ReportOrder } from "@/data/reports/data"
import { createRandom, weightedPick } from "@/lib/random"
import { addDays, parseISO } from "date-fns"

export const channels = [
  { value: "mercado-libre", label: "Mercado Libre", weight: 38 },
  { value: "amazon", label: "Amazon", weight: 27 },
  { value: "shopify", label: "Shopify", weight: 22 },
  { value: "walmart", label: "Walmart", weight: 13 },
] as const

export type Channel = (typeof channels)[number]["value"]

export type ControlTowerOrder = ReportOrder & {
  channel: Channel
  unitsOrdered: number
  unitsShipped: number
  shippedOn: string | null
  exception: boolean
}

const generateOrders = (): ControlTowerOrder[] => {
  const random = createRandom(9137)

  return reportOrders.map((order) => {
    const channel = weightedPick(channels, random)
    const unitsOrdered = 1 + Math.floor(random() * 4)
    const shortShipped = order.status === "shipped" && random() < 0.06
    const unitsShipped =
      order.status === "pending" ? 0 : unitsOrdered - (shortShipped ? 1 : 0)
    const daysToShip =
      random() < 0.9 ? Math.floor(random() * 2) : 2 + Math.floor(random() * 4)
    const shippedOn =
      order.status === "pending"
        ? null
        : toDateKey(addDays(parseISO(order.created), daysToShip))
    const late = shippedOn !== null && shippedOn > order.requiredShipping
    const exception =
      late || shortShipped || order.status === "returned" || random() < 0.01

    return {
      ...order,
      channel: channel.value,
      unitsOrdered,
      unitsShipped,
      shippedOn,
      exception,
    }
  })
}

export const controlTowerOrders = generateOrders()

export const summarizeOrders = (orders: ControlTowerOrder[]) => {
  let unitsOrdered = 0
  let unitsShipped = 0
  let shipped = 0
  let onTime = 0
  let exceptions = 0
  for (const order of orders) {
    unitsOrdered += order.unitsOrdered
    unitsShipped += order.unitsShipped
    if (order.shippedOn !== null) {
      shipped += 1
      if (order.shippedOn <= order.requiredShipping) onTime += 1
    }
    if (order.exception) exceptions += 1
  }
  return {
    orders: orders.length,
    fillRate: unitsOrdered ? unitsShipped / unitsOrdered : 0,
    sla: shipped ? onTime / shipped : 0,
    exceptions,
  }
}

export const countByChannel = (orders: ControlTowerOrder[]) => {
  const counts = Object.fromEntries(
    channels.map(({ value }) => [value, 0]),
  ) as Record<Channel, number>
  for (const order of orders) counts[order.channel] += 1
  return counts
}
