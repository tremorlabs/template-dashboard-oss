"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { integrationStatuses, type Integration } from "@/data/integrations/data"
import { cx } from "@/lib/utils"
import React from "react"

const columns: {
  header: string
  render: (integration: Integration) => React.ReactNode
}[] = [
  {
    header: "Integration",
    render: (i) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {i.name}
      </span>
    ),
  },
  { header: "Label", render: (i) => i.label },
  { header: "Type", render: (i) => i.type },
  { header: "Reseller", render: (i) => i.reseller },
  {
    header: "Status",
    render: (i) => {
      const status = integrationStatuses[i.status]
      return <Badge variant={status.variant}>{status.label}</Badge>
    },
  },
]

const actions = ["Action 1", "Action 2", "Action 3", "Action 4"]

export function IntegrationsTable({
  integrations,
}: {
  integrations: Integration[]
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const selected = integrations.find(({ id }) => id === selectedId)

  const toggleRow = (id: string) =>
    setSelectedId((current) => (current === id ? null : id))

  return (
    <section>
      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell key={column.header} scope="col">
                  {column.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {integrations.map((integration) => {
              const isSelected = integration.id === selectedId
              return (
                <TableRow
                  key={integration.id}
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => toggleRow(integration.id)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && toggleRow(integration.id)
                  }
                  className={cx(
                    "cursor-pointer select-none outline-none hover:bg-gray-50 focus-visible:bg-gray-50 hover:dark:bg-gray-900 focus-visible:dark:bg-gray-900",
                    isSelected && "bg-gray-50 dark:bg-gray-900",
                  )}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.header}
                      className={cx(index === 0 && "relative")}
                    >
                      {index === 0 && isSelected && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-indigo-500" />
                      )}
                      {column.render(integration)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>
      {selected && (
        <div className="fixed inset-x-4 bottom-6 z-20 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <p className="select-none truncate px-1 text-sm font-medium text-gray-900 dark:text-gray-50">
            {selected.name}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <Button key={action} variant="secondary" className="px-2 py-1.5">
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
