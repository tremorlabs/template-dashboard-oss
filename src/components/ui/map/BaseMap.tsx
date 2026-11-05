"use client"

import { APIProvider, ColorScheme, Map } from "@vis.gl/react-google-maps"
import { useTheme } from "next-themes"
import React from "react"

const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? ""
// DEMO_MAP_ID is provided by Google and enables advanced markers without extra setup
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"

export const hasMapsKey = API_KEY !== ""

export const MEXICO_BOUNDS = {
  north: 32.7,
  south: 14.5,
  west: -117.5,
  east: -86.7,
}

export type MapBounds = typeof MEXICO_BOUNDS

export function BaseMap({
  bounds,
  children,
}: {
  bounds: MapBounds
  children?: React.ReactNode
}) {
  const { resolvedTheme } = useTheme()
  const colorScheme =
    resolvedTheme === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT

  if (!hasMapsKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Set GOOGLE_MAPS_API_KEY to show the map.
      </div>
    )
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        // colorScheme is only read on init, so remount when the theme changes
        key={colorScheme}
        mapId={MAP_ID}
        colorScheme={colorScheme}
        defaultBounds={bounds}
        minZoom={3}
        gestureHandling="cooperative"
        disableDefaultUI
        zoomControl
        className="h-full w-full bg-gray-100 dark:bg-gray-900"
      >
        {children}
      </Map>
    </APIProvider>
  )
}
