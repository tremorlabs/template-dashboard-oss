"use client"

import type { ReportLocation } from "@/data/reports/data"
import { cx, focusRing } from "@/lib/utils"
import { RiFullscreenExitLine, RiFullscreenLine } from "@remixicon/react"
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  ColorScheme,
  Map,
  useMap,
} from "@vis.gl/react-google-maps"
import { useTheme } from "next-themes"
import React from "react"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""
// DEMO_MAP_ID is provided by Google and enables advanced markers without extra setup
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"

const MEXICO_BOUNDS = {
  north: 32.7,
  south: 14.5,
  west: -117.5,
  east: -86.7,
}
const SELECTED_ZOOM = 7

function Pin({ count }: Pick<ReportLocation, "count">) {
  return (
    <div className="flex w-max items-center gap-1.5 rounded-md bg-white px-1.5 py-1 text-xs font-semibold tabular-nums text-gray-900 shadow-md ring-1 ring-black/5 dark:bg-gray-900 dark:text-gray-50 dark:ring-white/10">
      <span className="size-2 rounded-full bg-emerald-600" />
      {count}
    </div>
  )
}

function FlyToSelection({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap()

  React.useEffect(() => {
    if (!map) return
    if (lat !== undefined && lng !== undefined) {
      map.panTo({ lat, lng })
      map.setZoom(SELECTED_ZOOM)
    } else {
      map.fitBounds(MEXICO_BOUNDS)
    }
  }, [map, lat, lng])

  return null
}

type ReportsMapProps = {
  locations: ReportLocation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ReportsMap({
  locations,
  selectedId,
  onSelect,
}: ReportsMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const { resolvedTheme } = useTheme()
  const colorScheme =
    resolvedTheme === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT

  React.useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen()
    }
  }

  if (!API_KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to show the map.
      </div>
    )
  }

  const FullscreenIcon = isFullscreen ? RiFullscreenExitLine : RiFullscreenLine
  const selected = locations.find(({ id }) => id === selectedId)

  return (
    <div ref={containerRef} className="relative isolate h-full w-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          // colorScheme is only read on init, so remount when the theme changes
          key={colorScheme}
          mapId={MAP_ID}
          colorScheme={colorScheme}
          defaultBounds={MEXICO_BOUNDS}
          minZoom={3}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
          className="h-full w-full bg-gray-100 dark:bg-gray-900"
        >
          {locations.map((location, index) => (
            <AdvancedMarker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
              zIndex={locations.length - index}
              title={location.name}
              onClick={() => onSelect(location.id)}
            >
              <Pin count={location.count} />
            </AdvancedMarker>
          ))}
          <FlyToSelection lat={selected?.lat} lng={selected?.lng} />
        </Map>
      </APIProvider>
      <button
        type="button"
        aria-label={isFullscreen ? "Exit fullscreen" : "View map fullscreen"}
        onClick={toggleFullscreen}
        className={cx(
          "absolute right-2 top-2 z-[1000] rounded-md bg-white p-1.5 text-gray-700 shadow-md ring-1 ring-black/5 transition hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:ring-white/10 dark:hover:text-gray-50",
          focusRing,
        )}
      >
        <FullscreenIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
