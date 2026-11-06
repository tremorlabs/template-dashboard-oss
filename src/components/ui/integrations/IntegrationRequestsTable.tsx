"use client"

import { Badge } from "@/components/Badge"
import { SegmentedControl } from "@/components/SegmentedControl"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import {
  requestStatusFilters,
  requestTimeFormatter,
  type Integration,
  type IntegrationRequest,
} from "@/data/integrations/data"
import { cx } from "@/lib/utils"
import React from "react"

const headers = [
  "Integration",
  "Operation",
  "Endpoint",
  "Status",
  "Message",
  "Date",
  "Duration",
]

export function IntegrationRequestsTable({
  integrations,
  requests,
}: {
  integrations: Integration[]
  requests: IntegrationRequest[]
}) {
  const [filter, setFilter] =
    React.useState<(typeof requestStatusFilters)[number]["value"]>("all")
  const byId = React.useMemo(
    () => new Map(integrations.map((item) => [item.id, item])),
    [integrations],
  )
  const scoped = React.useMemo(
    () => requests.filter(({ integrationId }) => byId.has(integrationId)),
    [requests, byId],
  )
  const tabs = React.useMemo(() => {
    const success = scoped.filter(({ status }) => status === "success").length
    const counts = {
      all: scoped.length,
      success,
      error: scoped.length - success,
    }
    return requestStatusFilters.map((item) => ({
      ...item,
      count: counts[item.value],
    }))
  }, [scoped])
  const visible =
    filter === "all" ? scoped : scoped.filter(({ status }) => status === filter)

  return (
    <section>
      <SegmentedControl
        aria-label="Request status"
        items={tabs}
        value={filter}
        onChange={setFilter}
      />
      <TableRoot className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeaderCell key={header} scope="col">
                  {header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((request) => {
              const integration = byId.get(request.integrationId)
              const isError = request.status === "error"
              return (
                <TableRow key={request.id}>
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {integration?.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {integration?.label}
                    </span>
                  </TableCell>
                  <TableCell>{request.operation}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {request.method} {request.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isError ? "error" : "success"}>
                      {isError ? "Error" : "Success"} {request.httpCode}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cx(isError && "text-red-600 dark:text-red-500")}
                  >
                    {request.message}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {requestTimeFormatter.format(new Date(request.timestamp))}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {request.durationMs} ms
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>
      {visible.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          No requests to show.
        </p>
      )}
    </section>
  )
}
