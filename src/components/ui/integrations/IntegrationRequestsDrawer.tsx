"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { SegmentedControl } from "@/components/SegmentedControl"
import {
  requestStatusFilters,
  requestTimeFormatter,
  type Integration,
  type IntegrationRequest,
} from "@/data/integrations/data"
import { cx } from "@/lib/utils"
import React from "react"

// Mounted only while open, so the filter resets each time
function RequestsBody({ requests }: { requests: IntegrationRequest[] }) {
  const [filter, setFilter] =
    React.useState<(typeof requestStatusFilters)[number]["value"]>("all")
  const visible =
    filter === "all"
      ? requests
      : requests.filter(({ status }) => status === filter)
  const successCount = requests.filter((r) => r.status === "success").length
  const errorCount = requests.length - successCount

  const stats = [
    { label: "Requests", value: requests.length, danger: false },
    { label: "Success", value: successCount, danger: false },
    { label: "Error", value: errorCount, danger: errorCount > 0 },
  ]

  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-gray-200 p-3 dark:border-gray-800"
          >
            <dt className="text-xs text-gray-500 dark:text-gray-500">
              {stat.label}
            </dt>
            <dd
              className={cx(
                "mt-0.5 text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-50",
                stat.danger && "text-red-600 dark:text-red-500",
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <SegmentedControl
        aria-label="Request status"
        items={requestStatusFilters}
        value={filter}
        onChange={setFilter}
        className="mt-4"
      />

      {visible.length > 0 ? (
        <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {visible.map((request) => {
            const isError = request.status === "error"
            return (
              <li key={request.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                      {request.operation}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-gray-500">
                      {request.method} {request.endpoint}
                    </p>
                  </div>
                  <Badge
                    variant={isError ? "error" : "success"}
                    className="shrink-0"
                  >
                    {isError ? "Error" : "Success"} {request.httpCode}
                  </Badge>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3 text-xs">
                  <p
                    className={cx(
                      "min-w-0 truncate",
                      isError
                        ? "text-red-600 dark:text-red-500"
                        : "text-gray-500",
                    )}
                  >
                    {request.message}
                  </p>
                  <p className="shrink-0 tabular-nums text-gray-500">
                    {requestTimeFormatter.format(new Date(request.timestamp))} ·{" "}
                    {request.durationMs} ms
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-8 text-center text-sm text-gray-500">
          No requests to show.
        </p>
      )}
    </>
  )
}

export function IntegrationRequestsDrawer({
  integration,
  requests,
  open,
  onOpenChange,
}: {
  integration: Integration
  requests: IntegrationRequest[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const scoped = React.useMemo(
    () => requests.filter((r) => r.integrationId === integration.id),
    [requests, integration.id],
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Request status</DrawerTitle>
          <DrawerDescription className="text-sm">
            {integration.name} · {integration.label}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="-mx-6 overflow-y-auto px-6">
          <RequestsBody requests={scoped} />
        </DrawerBody>
        <DrawerFooter className="-mx-6 -mb-2 px-6">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full sm:w-fit">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
