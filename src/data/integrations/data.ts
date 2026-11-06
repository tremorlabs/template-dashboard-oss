export type IntegrationStatus = "active" | "pending" | "error" | "disabled"
export type IntegrationEnvironment = "production" | "sandbox"
export type IntegrationAuthType = "api_key" | "oauth2" | "basic"
export type IntegrationSyncFrequency = "realtime" | "15m" | "hourly" | "daily"

export type Integration = {
  id: string
  name: string
  label: string
  type: string
  reseller: string
  status: IntegrationStatus
  description: string
  environment: IntegrationEnvironment
  baseUrl: string
  authType: IntegrationAuthType
  syncFrequency: IntegrationSyncFrequency
  contactEmail: string
  createdAt: string
  lastSync: string
}

export type IntegrationRequestStatus = "success" | "error"

export type IntegrationRequest = {
  id: string
  integrationId: string
  operation: string
  method: "GET" | "POST" | "PUT"
  endpoint: string
  status: IntegrationRequestStatus
  httpCode: number
  message: string
  timestamp: string
  durationMs: number
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

export const integrationTypes = [
  "E-commerce",
  "Marketplace",
  "ERP",
  "Carrier",
  "Payments",
]

export const integrationEnvironments: Record<IntegrationEnvironment, string> = {
  production: "Production",
  sandbox: "Sandbox",
}

export const integrationAuthTypes: Record<IntegrationAuthType, string> = {
  api_key: "API key",
  oauth2: "OAuth 2.0",
  basic: "Basic auth",
}

export const integrationSyncFrequencies: Record<
  IntegrationSyncFrequency,
  string
> = {
  realtime: "Real time (webhooks)",
  "15m": "Every 15 minutes",
  hourly: "Every hour",
  daily: "Once a day",
}

export const integrations: Integration[] = [
  {
    id: "int-001",
    name: "Shopify",
    label: "Almaton Store MX",
    type: "E-commerce",
    reseller: "Direct",
    status: "active",
    description: "Imports online store orders and pushes stock levels.",
    environment: "production",
    baseUrl: "https://almaton-mx.myshopify.com/admin/api/2024-10",
    authType: "api_key",
    syncFrequency: "realtime",
    contactEmail: "ecommerce@almaton.mx",
    createdAt: "2025-03-12",
    lastSync: "2026-11-06T09:42:00",
  },
  {
    id: "int-002",
    name: "Mercado Libre",
    label: "Official Store",
    type: "Marketplace",
    reseller: "Direct",
    status: "active",
    description: "Syncs marketplace listings, orders and shipping labels.",
    environment: "production",
    baseUrl: "https://api.mercadolibre.com",
    authType: "oauth2",
    syncFrequency: "15m",
    contactEmail: "marketplaces@almaton.mx",
    createdAt: "2025-04-02",
    lastSync: "2026-11-06T09:30:00",
  },
  {
    id: "int-003",
    name: "Amazon",
    label: "Seller Central MX",
    type: "Marketplace",
    reseller: "Conecta Partners",
    status: "active",
    description: "Receives Amazon orders and updates fulfillment status.",
    environment: "production",
    baseUrl: "https://sellingpartnerapi-na.amazon.com",
    authType: "oauth2",
    syncFrequency: "15m",
    contactEmail: "soporte@conectapartners.com",
    createdAt: "2025-05-20",
    lastSync: "2026-11-06T09:15:00",
  },
  {
    id: "int-004",
    name: "Walmart",
    label: "Marketplace MX",
    type: "Marketplace",
    reseller: "Conecta Partners",
    status: "pending",
    description: "Pending approval to publish catalog and receive orders.",
    environment: "sandbox",
    baseUrl: "https://sandbox.walmartapis.com/v3",
    authType: "oauth2",
    syncFrequency: "hourly",
    contactEmail: "soporte@conectapartners.com",
    createdAt: "2026-10-28",
    lastSync: "2026-11-05T18:00:00",
  },
  {
    id: "int-006",
    name: "SAP Business One",
    label: "Main ERP",
    type: "ERP",
    reseller: "Nexo Systems",
    status: "active",
    description: "Sends invoices and receives product and price master data.",
    environment: "production",
    baseUrl: "https://erp.almaton.mx:50000/b1s/v1",
    authType: "basic",
    syncFrequency: "hourly",
    contactEmail: "erp@nexosystems.mx",
    createdAt: "2024-11-08",
    lastSync: "2026-11-06T09:00:00",
  },
  {
    id: "int-008",
    name: "DHL Express",
    label: "International",
    type: "Carrier",
    reseller: "Direct",
    status: "active",
    description: "Creates international shipments and tracks deliveries.",
    environment: "production",
    baseUrl: "https://express.api.dhl.com/mydhlapi",
    authType: "basic",
    syncFrequency: "realtime",
    contactEmail: "logistica@almaton.mx",
    createdAt: "2025-01-15",
    lastSync: "2026-11-06T09:40:00",
  },
  {
    id: "int-009",
    name: "FedEx",
    label: "National",
    type: "Carrier",
    reseller: "LogiHub",
    status: "active",
    description: "Generates national shipping labels and tracking numbers.",
    environment: "production",
    baseUrl: "https://apis.fedex.com",
    authType: "oauth2",
    syncFrequency: "realtime",
    contactEmail: "soporte@logihub.mx",
    createdAt: "2025-02-03",
    lastSync: "2026-11-06T09:38:00",
  },
  {
    id: "int-012",
    name: "Stripe",
    label: "Card payments",
    type: "Payments",
    reseller: "Direct",
    status: "active",
    description: "Processes card payments and reports payouts.",
    environment: "production",
    baseUrl: "https://api.stripe.com/v1",
    authType: "api_key",
    syncFrequency: "daily",
    contactEmail: "finanzas@almaton.mx",
    createdAt: "2025-06-10",
    lastSync: "2026-11-06T06:00:00",
  },
]

const operations: {
  operation: string
  method: IntegrationRequest["method"]
  endpoint: string
}[] = [
  { operation: "Sync orders", method: "GET", endpoint: "/orders" },
  { operation: "Update stock", method: "PUT", endpoint: "/inventory" },
  { operation: "Create shipment", method: "POST", endpoint: "/shipments" },
  { operation: "Fetch products", method: "GET", endpoint: "/products" },
  { operation: "Send invoice", method: "POST", endpoint: "/invoices" },
]

const errors = [
  { httpCode: 401, message: "Unauthorized: credentials expired." },
  { httpCode: 429, message: "Rate limit exceeded, retry later." },
  { httpCode: 500, message: "Remote server error." },
  { httpCode: 422, message: "Invalid payload: missing SKU." },
]

// Deterministic sample log
export const integrationRequests: IntegrationRequest[] = integrations
  .flatMap((integration, i) =>
    Array.from({ length: 6 }, (_, j): IntegrationRequest => {
      const op = operations[(i + j) % operations.length]
      const failed =
        integration.status === "pending" ? j % 2 === 0 : (i * 7 + j) % 5 === 0
      const error = errors[(i + j) % errors.length]
      const time = new Date(Date.UTC(2026, 10, 6, 15 - j * 2, 50 - i * 5))
      return {
        id: `req-${integration.id.slice(4)}-${j + 1}`,
        integrationId: integration.id,
        operation: op.operation,
        method: op.method,
        endpoint: op.endpoint,
        status: failed ? "error" : "success",
        httpCode: failed ? error.httpCode : op.method === "POST" ? 201 : 200,
        message: failed ? error.message : "Completed successfully.",
        timestamp: time.toISOString(),
        durationMs: 120 + ((i * 13 + j * 37) % 900),
      }
    }),
  )
  .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

export const requestStatusFilters: {
  value: "all" | IntegrationRequestStatus
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
]

export const requestTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})
