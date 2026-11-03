export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export type InventoryItem = {
  sku: string
  product: string
  brand: string
  variant: string
  status: StockStatus
  onHand: number
  committed: number
  unitCost: number
}

export const stockStatuses: {
  value: StockStatus
  label: string
  variant: "success" | "warning" | "error"
}[] = [
  { value: "in_stock", label: "In Stock", variant: "success" },
  { value: "low_stock", label: "Low Stock", variant: "warning" },
  { value: "out_of_stock", label: "Out of Stock", variant: "error" },
]

export const getStockStatus = (value: string) =>
  stockStatuses.find((status) => status.value === value)

export const LOW_STOCK_THRESHOLD = 10

const sneakers = [
  {
    product: "Strato Low",
    brand: "Vantor",
    code: "VT-STL",
    cost: 1450,
    colors: ["White", "Black"],
  },
  {
    product: "Aerox 90",
    brand: "Vantor",
    code: "VT-AX90",
    cost: 1780,
    colors: ["Ember", "Triple White"],
  },
  {
    product: "Skyline Mid",
    brand: "Kairo",
    code: "KR-SKM",
    cost: 1990,
    colors: ["Crimson", "Black Toe"],
  },
  {
    product: "Ritmo OG",
    brand: "Pulso",
    code: "PL-RTM",
    cost: 1350,
    colors: ["Cloud White", "Core Black"],
  },
  {
    product: "Gacela",
    brand: "Pulso",
    code: "PL-GCL",
    cost: 1250,
    colors: ["Forest Green", "Scarlet"],
  },
  {
    product: "Courtline 550",
    brand: "Northline",
    code: "NL-550",
    cost: 1620,
    colors: ["White Green", "Sea Salt"],
  },
  {
    product: "Trailhaus 906",
    brand: "Northline",
    code: "NL-906",
    cost: 2150,
    colors: ["Rain Cloud", "Mushroom"],
  },
  {
    product: "Canvas 70 Hi",
    brand: "Mareo",
    code: "MR-C70",
    cost: 980,
    colors: ["Parchment", "Black"],
  },
  {
    product: "Skate Classic",
    brand: "Mareo",
    code: "MR-SKC",
    cost: 890,
    colors: ["Black White", "Navy"],
  },
  {
    product: "Velvet Suede",
    brand: "Ardent",
    code: "AR-VSD",
    cost: 860,
    colors: ["Peacoat", "Red"],
  },
  {
    product: "Gelo Runner 14",
    brand: "Tezca",
    code: "TZ-GR14",
    cost: 2050,
    colors: ["Cream Silver", "Black Silver"],
  },
  {
    product: "Club Retro 85",
    brand: "Tezca",
    code: "TZ-CR85",
    cost: 920,
    colors: ["Chalk Green", "White"],
  },
]

export const inventoryBrands = Array.from(
  new Set(sneakers.map((item) => item.brand)),
)

const sizes = [24, 25, 26, 27, 28]

const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const getStockStatusFor = (onHand: number): StockStatus =>
  onHand === 0
    ? "out_of_stock"
    : onHand <= LOW_STOCK_THRESHOLD
      ? "low_stock"
      : "in_stock"

const colorCode = (color: string) =>
  color
    .split(" ")
    .map((word) => word.slice(0, 3))
    .join("")
    .toUpperCase()

const generateInventory = () => {
  const random = createRandom(2741)
  const items: InventoryItem[] = []

  for (const sneaker of sneakers) {
    for (const color of sneaker.colors) {
      for (const size of sizes) {
        const roll = random()
        const onHand =
          roll < 0.1
            ? 0
            : roll < 0.28
              ? 1 + Math.floor(random() * LOW_STOCK_THRESHOLD)
              : 11 + Math.floor(random() * 70)

        items.push({
          sku: `${sneaker.code}-${colorCode(color)}-${size}`,
          product: sneaker.product,
          brand: sneaker.brand,
          variant: `${color} / ${size} MX`,
          status: getStockStatusFor(onHand),
          onHand,
          committed: Math.floor(random() * Math.min(onHand, 12)),
          unitCost: sneaker.cost,
        })
      }
    }
  }
  return items
}

export const inventory = generateInventory()
