export const siteConfig = {
  name: "Almaton Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    orders: "/orders",
    inventory: "/inventory",
    shipments: "/shipments",
    returns: "/returns",
    network: "/network",
    reports: "/reports",
    invoices: "/invoices",
    details: "/details",
    integrations: "/integrations",
    settings: "/settings",
  },
  externalLink: {
    blocks: "https://blocks.tremor.so/templates#dashboard",
  },
}

export type siteConfig = typeof siteConfig
