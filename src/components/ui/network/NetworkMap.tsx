"use client"

import { BaseMap } from "@/components/ui/map/BaseMap"
import type { NetworkNode } from "@/data/network/data"
import { cx } from "@/lib/utils"
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps"
import React from "react"

const NETWORK_BOUNDS = {
  north: 34,
  south: 17.5,
  west: -118.5,
  east: -79,
}

const LINE_COLOR = "#4f46e5"

const isLinked = ([from, to]: [string, string], selectedId: string | null) =>
  selectedId === null || from === selectedId || to === selectedId

function Connections({
  nodes,
  connections,
  selectedId,
}: {
  nodes: NetworkNode[]
  connections: [string, string][]
  selectedId: string | null
}) {
  const map = useMap()
  const mapsLibrary = useMapsLibrary("maps")
  const linesRef = React.useRef<
    { setOptions: (options: Record<string, number>) => void }[]
  >([])

  React.useEffect(() => {
    if (!map || !mapsLibrary) return
    const byId = new Map(nodes.map((node) => [node.id, node]))
    const lines = connections.map(([fromId, toId]) => {
      const from = byId.get(fromId)
      const to = byId.get(toId)
      return new mapsLibrary.Polyline({
        map,
        path:
          from && to
            ? [
                { lat: from.lat, lng: from.lng },
                { lat: to.lat, lng: to.lng },
              ]
            : [],
        geodesic: true,
        clickable: false,
        strokeColor: LINE_COLOR,
      })
    })
    linesRef.current = lines
    return () => lines.forEach((line) => line.setMap(null))
  }, [map, mapsLibrary, nodes, connections])

  React.useEffect(() => {
    linesRef.current.forEach((line, index) => {
      const active = isLinked(connections[index], selectedId)
      line.setOptions({
        strokeOpacity: active ? 0.8 : 0.15,
        strokeWeight: active ? 2.5 : 1.5,
      })
    })
  }, [map, mapsLibrary, nodes, connections, selectedId])

  return null
}

function Node({ node, active }: { node: NetworkNode; active: boolean }) {
  const isHub = node.type === "fulfillment"

  return (
    <div
      className={cx(
        "flex items-center gap-1.5 rounded-md bg-white px-1.5 py-1 text-xs font-medium text-gray-900 shadow-md ring-1 ring-black/5 transition-opacity dark:bg-gray-900 dark:text-gray-50 dark:ring-white/10",
        !active && "opacity-40",
      )}
    >
      <span
        className={cx(
          "rounded-full",
          isHub
            ? "size-2.5 bg-indigo-600 ring-2 ring-indigo-600/25"
            : "size-2 border-2 border-indigo-600 bg-white dark:bg-gray-900",
        )}
      />
      {node.name}
    </div>
  )
}

export function NetworkMap({
  nodes,
  connections,
  selectedId,
  onSelect,
}: {
  nodes: NetworkNode[]
  connections: [string, string][]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const activeIds = React.useMemo(() => {
    if (selectedId === null) return null
    const ids = new Set([selectedId])
    connections.forEach((connection) => {
      if (isLinked(connection, selectedId))
        connection.forEach((id) => ids.add(id))
    })
    return ids
  }, [connections, selectedId])

  return (
    <BaseMap bounds={NETWORK_BOUNDS}>
      <Connections
        nodes={nodes}
        connections={connections}
        selectedId={selectedId}
      />
      {nodes.map((node) => (
        <AdvancedMarker
          key={node.id}
          position={{ lat: node.lat, lng: node.lng }}
          anchorPoint={AdvancedMarkerAnchorPoint.LEFT_CENTER}
          zIndex={selectedId === node.id ? 2 : 1}
          title={node.name}
          onClick={() => onSelect(node.id)}
        >
          <Node node={node} active={!activeIds || activeIds.has(node.id)} />
        </AdvancedMarker>
      ))}
    </BaseMap>
  )
}
