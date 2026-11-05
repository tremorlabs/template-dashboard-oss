export type NetworkNodeType = "fulfillment" | "cross-dock"

export type NetworkNode = {
  id: string
  name: string
  state: string
  type: NetworkNodeType
  lat: number
  lng: number
}

export const nodeTypes: Record<NetworkNodeType, string> = {
  fulfillment: "Fulfillment center",
  "cross-dock": "Cross-dock",
}

export const networkNodes: NetworkNode[] = [
  {
    id: "cdmx",
    name: "Ciudad de México",
    state: "CDMX, México",
    type: "fulfillment",
    lat: 19.43,
    lng: -99.13,
  },
  {
    id: "mty",
    name: "Monterrey",
    state: "Nuevo León, México",
    type: "fulfillment",
    lat: 25.69,
    lng: -100.32,
  },
  {
    id: "tij",
    name: "Tijuana",
    state: "Baja California, México",
    type: "cross-dock",
    lat: 32.51,
    lng: -117.04,
  },
  {
    id: "mia",
    name: "Miami",
    state: "Florida, USA",
    type: "cross-dock",
    lat: 25.76,
    lng: -80.19,
  },
]

export const networkConnections: [string, string][] = [
  ["cdmx", "mty"],
  ["cdmx", "tij"],
  ["mty", "tij"],
  ["cdmx", "mia"],
  ["mty", "mia"],
]
