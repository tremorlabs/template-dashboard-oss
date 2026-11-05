export const siteConfig = {
  name: "Almaton Dashboard",
  url: "https://app.almaton.mx/",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    login: "/login",
    overview: "/overview",
    orders: "/orders",
    inventory: "/inventory",
    shipments: "/shipments",
    returns: "/returns",
    network: "/network",
    reports: "/reports",
    invoices: "/invoices",
    controlTower: "/control-tower",
    integrations: "/integrations",
    settings: "/settings",
  },
  externalLink: {
    blocks: "https://blocks.tremor.so/templates#dashboard",
  },
}

export type siteConfig = typeof siteConfig
