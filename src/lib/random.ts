export const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const weightedPick = <T extends { weight: number }>(
  items: readonly T[],
  random: () => number,
) => {
  const total = items.reduce((sum, item) => sum + item.weight, 0)
  let pick = random() * total
  return items.find((item) => (pick -= item.weight) < 0) ?? items[0]
}
