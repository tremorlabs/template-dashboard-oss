export type IntegrationStatus = "active" | "pending" | "error" | "disabled"

export type Integration = {
  id: string
  name: string
  label: string
  type: string
  reseller: string
  status: IntegrationStatus
}

export const integrationStatuses: Record<
  IntegrationStatus,
  { label: string; variant: "success" | "warning" | "error" | "neutral" }
> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  error: { label: "Error", variant: "error" },
  disabled: { label: "Disabled", variant: "neutral" },
}

export const integrations: Integration[] = [
  {
    id: "int-001",
    name: "Shopify",
    label: "Almaton Store MX",
    type: "E-commerce",
    reseller: "Direct",
    status: "active",
  },
  {
    id: "int-002",
    name: "Mercado Libre",
    label: "Official Store",
    type: "Marketplace",
    reseller: "Direct",
    status: "active",
  },
  {
    id: "int-003",
    name: "Amazon",
    label: "Seller Central MX",
    type: "Marketplace",
    reseller: "Conecta Partners",
    status: "active",
  },
  {
    id: "int-004",
    name: "Walmart",
    label: "Marketplace MX",
    type: "Marketplace",
    reseller: "Conecta Partners",
    status: "pending",
  },
  {
    id: "int-006",
    name: "SAP Business One",
    label: "Main ERP",
    type: "ERP",
    reseller: "Nexo Systems",
    status: "active",
  },
  {
    id: "int-008",
    name: "DHL Express",
    label: "International",
    type: "Carrier",
    reseller: "Direct",
    status: "active",
  },
  {
    id: "int-009",
    name: "FedEx",
    label: "National",
    type: "Carrier",
    reseller: "LogiHub",
    status: "active",
  },
  {
    id: "int-012",
    name: "Stripe",
    label: "Card payments",
    type: "Payments",
    reseller: "Direct",
    status: "active",
  },
]
