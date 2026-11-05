import { createRandom, weightedPick } from "@/lib/random"
import { addDays, format } from "date-fns"

export type ReportOrderStatus = "shipped" | "pending" | "returned"

export type ReportOrder = {
  number: string
  created: string
  requiredShipping: string
  status: ReportOrderStatus
  state: string
  city: string
  revenue: number
}

export type LocationView = "state" | "city"

export type ReportLocation = {
  id: string
  name: string
  lat: number
  lng: number
  count: number
}

const states = [
  {
    name: "Ciudad de México",
    lat: 19.43,
    lng: -99.13,
    weight: 24,
    cities: [{ name: "Ciudad de México", lat: 19.43, lng: -99.13 }],
  },
  {
    name: "Jalisco",
    lat: 20.6,
    lng: -103.6,
    weight: 14,
    cities: [
      { name: "Guadalajara", lat: 20.67, lng: -103.35 },
      { name: "Puerto Vallarta", lat: 20.65, lng: -105.22 },
    ],
  },
  {
    name: "Nuevo León",
    lat: 25.6,
    lng: -99.9,
    weight: 13,
    cities: [{ name: "Monterrey", lat: 25.69, lng: -100.32 }],
  },
  {
    name: "Puebla",
    lat: 18.9,
    lng: -97.9,
    weight: 6,
    cities: [{ name: "Puebla", lat: 19.04, lng: -98.2 }],
  },
  {
    name: "Guanajuato",
    lat: 21.0,
    lng: -101.6,
    weight: 6,
    cities: [
      { name: "León", lat: 21.12, lng: -101.68 },
      { name: "Celaya", lat: 20.52, lng: -100.81 },
    ],
  },
  {
    name: "Querétaro",
    lat: 21.1,
    lng: -99.6,
    weight: 5,
    cities: [{ name: "Querétaro", lat: 20.59, lng: -100.39 }],
  },
  {
    name: "Baja California",
    lat: 30.8,
    lng: -115.3,
    weight: 6,
    cities: [
      { name: "Tijuana", lat: 32.51, lng: -117.04 },
      { name: "Mexicali", lat: 32.62, lng: -115.45 },
    ],
  },
  {
    name: "Yucatán",
    lat: 20.7,
    lng: -89.0,
    weight: 4,
    cities: [{ name: "Mérida", lat: 20.97, lng: -89.62 }],
  },
  {
    name: "Quintana Roo",
    lat: 19.6,
    lng: -88.0,
    weight: 4,
    cities: [{ name: "Cancún", lat: 21.16, lng: -86.85 }],
  },
  {
    name: "Veracruz",
    lat: 19.2,
    lng: -96.15,
    weight: 5,
    cities: [
      { name: "Veracruz", lat: 19.17, lng: -96.13 },
      { name: "Xalapa", lat: 19.53, lng: -96.92 },
    ],
  },
  {
    name: "Sonora",
    lat: 29.3,
    lng: -110.7,
    weight: 3,
    cities: [{ name: "Hermosillo", lat: 29.07, lng: -110.96 }],
  },
  {
    name: "Chihuahua",
    lat: 28.6,
    lng: -106.1,
    weight: 4,
    cities: [
      { name: "Ciudad Juárez", lat: 31.69, lng: -106.42 },
      { name: "Chihuahua", lat: 28.63, lng: -106.07 },
    ],
  },
  {
    name: "Sinaloa",
    lat: 24.8,
    lng: -107.4,
    weight: 3,
    cities: [
      { name: "Culiacán", lat: 24.81, lng: -107.39 },
      { name: "Mazatlán", lat: 23.25, lng: -106.41 },
    ],
  },
  {
    name: "Oaxaca",
    lat: 17.07,
    lng: -96.72,
    weight: 3,
    cities: [{ name: "Oaxaca", lat: 17.07, lng: -96.72 }],
  },
]

export const reportStart = new Date(2026, 9, 1)
export const reportEnd = new Date(2026, 9, 30)

export const toDateKey = (date: Date) => format(date, "yyyy-MM-dd")

const SPIKE_DAY = 7
const reportDays = 30

const generateOrders = () => {
  const random = createRandom(3467)
  const orders: ReportOrder[] = []

  for (let day = 0; day < reportDays; day++) {
    const count =
      day === SPIKE_DAY
        ? 420
        : Math.round(45 + random() * 20 + Math.sin(day / 3) * 10)

    for (let i = 0; i < count; i++) {
      const state = weightedPick(states, random)
      const city = state.cities[Math.floor(random() * state.cities.length)]
      const statusRoll = random()

      orders.push({
        number: `ORD-${10000 + orders.length}`,
        created: toDateKey(addDays(reportStart, day)),
        requiredShipping: toDateKey(
          addDays(reportStart, day + 2 + Math.floor(random() * 4)),
        ),
        status:
          statusRoll < 0.08
            ? "pending"
            : statusRoll < 0.095
              ? "returned"
              : "shipped",
        state: state.name,
        city: city.name,
        revenue: Math.round(500 + random() * 1500),
      })
    }
  }
  return orders
}

export const reportOrders = generateOrders()

export const filterReportOrders = <T extends ReportOrder>(
  orders: T[],
  from: Date | undefined,
  to: Date | undefined,
) => {
  const fromKey = from && toDateKey(from)
  const toKey = to && toDateKey(to)
  return orders.filter(
    (order) =>
      (!fromKey || order.created >= fromKey) &&
      (!toKey || order.created <= toKey),
  )
}

export const getLateOrders = (orders: ReportOrder[]) => {
  const today = toDateKey(reportEnd)
  return orders
    .filter(
      (order) => order.status === "pending" && order.requiredShipping < today,
    )
    .sort((a, b) => a.requiredShipping.localeCompare(b.requiredShipping))
}

export const getDailyTotals = (orders: ReportOrder[]) => {
  const totals = new Map<string, { revenue: number; orders: number }>()
  orders.forEach((order) => {
    const day = totals.get(order.created) ?? { revenue: 0, orders: 0 }
    day.revenue += order.revenue
    day.orders += 1
    totals.set(order.created, day)
  })
  return Array.from(totals, ([date, day]) => ({ date, ...day })).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

export const getOrdersByLocation = (
  orders: ReportOrder[],
  view: LocationView,
): ReportLocation[] => {
  const locations = new Map<string, ReportLocation>()

  orders.forEach((order) => {
    const id = view === "state" ? order.state : order.city
    const existing = locations.get(id)
    if (existing) {
      existing.count += 1
      return
    }
    const state = states.find(({ name }) => name === order.state)
    const city = state?.cities.find(({ name }) => name === order.city)
    const place = view === "state" ? state : city
    if (!place) return
    locations.set(id, {
      id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      count: 1,
    })
  })

  return Array.from(locations.values()).sort((a, b) => b.count - a.count)
}
