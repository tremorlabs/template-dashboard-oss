"use client"

import { BaseMap, hasMapsKey, MEXICO_BOUNDS } from "@/components/ui/map/BaseMap"
import type { ReportLocation } from "@/data/reports/data"
import { cx, focusRing } from "@/lib/utils"
import { RiFullscreenExitLine, RiFullscreenLine } from "@remixicon/react"
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useMap,
} from "@vis.gl/react-google-maps"
import React from "react"

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
  // rendered inside the map so it stays visible in fullscreen
  controls?: (container: HTMLElement | null) => React.ReactNode
}

export function ReportsMap({
  locations,
  selectedId,
  onSelect,
  controls,
}: ReportsMapProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    const onChange = () =>
      setIsFullscreen(
        container !== null && document.fullscreenElement === container,
      )
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [container])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container?.requestFullscreen()
    }
  }

  const FullscreenIcon = isFullscreen ? RiFullscreenExitLine : RiFullscreenLine
  const selected = locations.find(({ id }) => id === selectedId)

  return (
    <div ref={setContainer} className="relative isolate h-full w-full">
      <BaseMap bounds={MEXICO_BOUNDS}>
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
      </BaseMap>
      {hasMapsKey && (
        <>
          {controls?.(container)}
          <button
            type="button"
            aria-label={
              isFullscreen ? "Exit fullscreen" : "View map fullscreen"
            }
            onClick={toggleFullscreen}
            className={cx(
              "absolute right-2 top-2 z-[1000] rounded-md bg-white p-1.5 text-gray-700 shadow-md ring-1 ring-black/5 transition hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:ring-white/10 dark:hover:text-gray-50",
              focusRing,
            )}
          >
            <FullscreenIcon className="size-4" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )
}
