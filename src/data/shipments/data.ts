import { addDays, format } from "date-fns"

export type ShipmentStatus = "created" | "purchased" | "delivered" | "cancelled"

export type Shipment = {
  number: string
  carrier: string
  service: string
  recipient: string
  created: string
  status: ShipmentStatus
}

export const shipmentStatuses: {
  value: ShipmentStatus
  label: string
  variant: "default" | "neutral" | "success" | "error"
}[] = [
  { value: "created", label: "Created", variant: "neutral" },
  { value: "purchased", label: "Purchased", variant: "default" },
  { value: "delivered", label: "Delivered", variant: "success" },
  { value: "cancelled", label: "Cancelled", variant: "error" },
]

export const getShipmentStatus = (value: string) =>
  shipmentStatuses.find((status) => status.value === value)

export const shipmentCarriers = [
  "DHL",
  "FedEx",
  "Estafeta",
  "Paquetexpress",
  "UPS",
  "Redpack",
]

export const shipmentServices = ["Standard", "Express", "Next Day", "Economy"]

const recipients = [
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

export const shipmentsStart = new Date(2026, 8, 1)
export const shipmentsAsOf = new Date(2026, 10, 2)

const TRANSIT_DAYS = 5
const shipmentDays = 62

const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const generateShipments = () => {
  const random = createRandom(5821)
  const shipments: Shipment[] = []

  for (let day = 0; day < shipmentDays; day++) {
    const count = 2 + Math.floor(random() * 5)

    for (let i = 0; i < count; i++) {
      const created = addDays(shipmentsStart, day)
      const daysOut = (shipmentsAsOf.getTime() - created.getTime()) / 864e5

      shipments.push({
        number: `SHP-${String(shipments.length + 1).padStart(5, "0")}`,
        carrier:
          shipmentCarriers[Math.floor(random() * shipmentCarriers.length)],
        service:
          shipmentServices[Math.floor(random() * shipmentServices.length)],
        recipient: recipients[Math.floor(random() * recipients.length)],
        created: format(created, "yyyy-MM-dd"),
        status:
          daysOut < TRANSIT_DAYS
            ? random() < 0.4
              ? "created"
              : "purchased"
            : random() < 0.9
              ? "delivered"
              : "cancelled",
      })
    }
  }
  return shipments
}

export const shipments = generateShipments()
