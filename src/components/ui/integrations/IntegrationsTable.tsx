"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
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
import {
  RiDeleteBin6Line,
  RiEyeLine,
  RiFileList3Line,
  RiPencilLine,
  type RemixiconComponentType,
} from "@remixicon/react"
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

export type IntegrationAction = "view" | "requests" | "edit"

const actions: {
  value: IntegrationAction
  label: string
  icon: RemixiconComponentType
}[] = [
  { value: "view", label: "View integration", icon: RiEyeLine },
  { value: "requests", label: "Request status", icon: RiFileList3Line },
  { value: "edit", label: "Edit integration", icon: RiPencilLine },
]

export function IntegrationsTable({
  integrations,
  onAction,
  onDelete,
}: {
  integrations: Integration[]
  onAction: (action: IntegrationAction, integration: Integration) => void
  onDelete: (id: string) => void
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
              <Button
                key={action.value}
                variant="secondary"
                className="gap-1.5 px-2 py-1.5"
                onClick={() => onAction(action.value, selected)}
              >
                <action.icon
                  className="-ml-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                {action.label}
              </Button>
            ))}
            <span
              className="h-5 w-px bg-gray-200 dark:bg-gray-800"
              aria-hidden="true"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructiveSecondary"
                  className="gap-1.5 px-2 py-1.5"
                >
                  <RiDeleteBin6Line
                    className="-ml-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  Delete integration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete {selected.name}?</DialogTitle>
                  <DialogDescription className="text-sm">
                    This removes the {selected.name} ({selected.label})
                    integration and stops all its requests. This can&apos;t be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      className="mt-2 w-full sm:mt-0 sm:w-fit"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-fit"
                      onClick={() => {
                        onDelete(selected.id)
                        setSelectedId(null)
                      }}
                    >
                      Delete integration
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </section>
  )
}
