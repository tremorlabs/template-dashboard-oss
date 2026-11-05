"use client"

import dynamic from "next/dynamic"

function MapSkeleton() {
  return (
    <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-900" />
  )
}

export const LazyReportsMap = dynamic(
  () =>
    import("@/components/ui/reports/ReportsMap").then(
      (module) => module.ReportsMap,
    ),
  { ssr: false, loading: MapSkeleton },
)

export const LazyNetworkMap = dynamic(
  () =>
    import("@/components/ui/network/NetworkMap").then(
      (module) => module.NetworkMap,
    ),
  { ssr: false, loading: MapSkeleton },
)
