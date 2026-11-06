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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import {
  getStatus,
  priorities,
  statuses,
  type Ticket,
} from "@/data/support/schema"
import { useFitHeight } from "@/lib/useFitHeight"
import { cx } from "@/lib/utils"
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiDeleteBin6Line,
  RiPencilLine,
} from "@remixicon/react"
import { format } from "date-fns"
import React from "react"

const PAGE_SIZE = 20

// sticky header/footer
const stickyHeadCell =
  "sticky top-0 z-10 border-b-0 bg-white shadow-[inset_0_-1px_0] shadow-gray-200 dark:bg-gray-950 dark:shadow-gray-800"
const stickyFootCell =
  "sticky bottom-0 z-10 border-b-0 bg-white shadow-[inset_0_1px_0] shadow-gray-200 dark:bg-gray-950 dark:shadow-gray-800"

const columns: {
  header: string
  render: (ticket: Ticket) => React.ReactNode
  sortValue: (ticket: Ticket) => string | number
}[] = [
  {
    header: "Order No.",
    render: (t) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {t.policyNumber}
      </span>
    ),
    sortValue: (t) => t.policyNumber,
  },
  {
    header: "Description",
    render: (t) => t.description,
    sortValue: (t) => t.description,
  },
  {
    header: "Status",
    render: (t) => {
      const status = getStatus(t.status)
      return (
        <Badge variant={status?.variant ?? "neutral"}>
          {status?.label ?? t.status}
        </Badge>
      )
    },
    sortValue: (t) => t.status,
  },
  {
    header: "Date",
    render: (t) => format(new Date(t.created), "dd/MM/yyyy HH:mm"),
    sortValue: (t) => t.created,
  },
  {
    header: "Priority",
    render: (t) => priorities.find((p) => p.value === t.priority)?.label,
    sortValue: (t) => priorities.findIndex((p) => p.value === t.priority),
  },
]

// newest orders first by default
const DEFAULT_SORT_COLUMN = columns.findIndex((c) => c.header === "Date")

export const getTicketId = (ticket: Ticket) =>
  `${ticket.policyNumber}-${ticket.created}`

function IndeterminateCheckbox({
  indeterminate,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !props.checked && Boolean(indeterminate)
    }
  }, [indeterminate, props.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cx(
        "size-4 -translate-y-px cursor-pointer rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-200",
        "dark:border-gray-800 dark:bg-gray-950 dark:text-indigo-500 dark:focus:ring-indigo-700/30",
      )}
      {...props}
    />
  )
}

type OrdersTableProps = {
  tickets: Ticket[]
  onStatusChange: (ids: string[], status: string) => void
  onDelete: (ids: string[]) => void
}

export function OrdersTable({
  tickets,
  onStatusChange,
  onDelete,
}: OrdersTableProps) {
  const [sorting, setSorting] = React.useState({
    column: DEFAULT_SORT_COLUMN,
    desc: true,
  })
  const [pageIndex, setPageIndex] = React.useState(0)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const sectionRef = React.useRef<HTMLElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const maxHeight = useFitHeight(sectionRef, scrollRef)

  // reset scroll on page change
  React.useEffect(() => {
    scrollRef.current?.firstElementChild?.scrollTo({ top: 0 })
  }, [pageIndex, sorting])

  const pageCount = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE))

  // clear the selection and keep the page in range when the tickets change
  React.useEffect(() => {
    setPageIndex((prev) => Math.min(prev, pageCount - 1))
    setSelected(new Set())
  }, [tickets, pageCount])

  const sorted = React.useMemo(() => {
    const { sortValue } = columns[sorting.column]
    const sign = sorting.desc ? -1 : 1
    return [...tickets].sort(
      (a, b) => (sortValue(a) > sortValue(b) ? 1 : -1) * sign,
    )
  }, [tickets, sorting])

  const rows = sorted.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

  const allIds = tickets.map(getTicketId)
  const pageIds = rows.map(getTicketId)
  const pageSelectedCount = pageIds.filter((id) => selected.has(id)).length
  const plural = selected.size > 1 ? "s" : ""

  const toggleIds = (ids: string[], checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
      return next
    })

  const toggleSorting = (column: number) => {
    setSorting((prev) => ({
      column,
      desc: prev.column === column && !prev.desc,
    }))
    setPageIndex(0)
  }

  const paginationButtons = [
    { icon: RiArrowLeftDoubleLine, page: 0, srText: "First page" },
    { icon: RiArrowLeftSLine, page: pageIndex - 1, srText: "Previous page" },
    { icon: RiArrowRightSLine, page: pageIndex + 1, srText: "Next page" },
    {
      icon: RiArrowRightDoubleLine,
      page: pageCount - 1,
      srText: "Last page",
    },
  ]

  return (
    <section ref={sectionRef}>
      <TableRoot ref={scrollRef} style={{ maxHeight }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell
                scope="col"
                className={cx("w-0", stickyHeadCell)}
              >
                <IndeterminateCheckbox
                  aria-label="Select all orders"
                  checked={allIds.length > 0 && selected.size === allIds.length}
                  indeterminate={selected.size > 0}
                  onChange={(event) => toggleIds(allIds, event.target.checked)}
                />
              </TableHeaderCell>
              {columns.map((column, index) => {
                const isSorted = sorting.column === index
                return (
                  <TableHeaderCell
                    key={column.header}
                    scope="col"
                    className={cx("cursor-pointer select-none", stickyHeadCell)}
                    onClick={() => toggleSorting(index)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && toggleSorting(index)
                    }
                    tabIndex={0}
                    aria-sort={
                      isSorted
                        ? sorting.desc
                          ? "descending"
                          : "ascending"
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      <div className="-space-y-2.5">
                        {[RiArrowUpSFill, RiArrowDownSFill].map((Icon, i) => (
                          <Icon
                            key={i}
                            className={cx(
                              "size-4 text-gray-500",
                              (!isSorted || sorting.desc === !i) &&
                                "opacity-30",
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </TableHeaderCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((ticket) => {
              const id = getTicketId(ticket)
              const isSelected = selected.has(id)
              return (
                <TableRow
                  key={id}
                  onClick={() => toggleIds([id], !isSelected)}
                  className={cx(
                    "cursor-pointer select-none hover:bg-gray-50 hover:dark:bg-gray-900",
                    isSelected && "bg-gray-50 dark:bg-gray-900",
                  )}
                >
                  <TableCell className="relative">
                    {isSelected && (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-indigo-500" />
                    )}
                    <IndeterminateCheckbox
                      aria-label={`Select order ${ticket.policyNumber}`}
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleIds([id], !isSelected)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.header}>
                      {column.render(ticket)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
          <TableFoot>
            <TableRow>
              <TableHeaderCell className={stickyFootCell}>
                <IndeterminateCheckbox
                  aria-label="Select orders on this page"
                  checked={
                    pageIds.length > 0 && pageSelectedCount === pageIds.length
                  }
                  indeterminate={pageSelectedCount > 0}
                  onChange={(event) => toggleIds(pageIds, event.target.checked)}
                />
              </TableHeaderCell>
              <TableHeaderCell
                colSpan={columns.length}
                className={cx("font-normal tabular-nums", stickyFootCell)}
              >
                {pageSelectedCount} of {pageIds.length} page row(s) selected
              </TableHeaderCell>
            </TableRow>
          </TableFoot>
        </Table>
      </TableRoot>
      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-20 mx-auto flex w-fit items-center gap-10 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <p className="select-none text-sm">
            <span className="rounded bg-indigo-50 px-2 py-1.5 font-medium tabular-nums text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400">
              {selected.size}
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">
              selected
            </span>
          </p>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5 px-2 py-1.5">
                  <RiPencilLine
                    className="-ml-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  Edit order{plural}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuLabel>Change status to</DropdownMenuLabel>
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() =>
                      onStatusChange(Array.from(selected), status.value)
                    }
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                  Delete order{plural}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Delete {selected.size} order{plural}?
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    This permanently removes the selected order{plural} and
                    can&apos;t be undone.
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
                      onClick={() => onDelete(Array.from(selected))}
                    >
                      Delete order{plural}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm tabular-nums text-gray-500 dark:text-gray-500">
          Page{" "}
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {pageCount}
          </span>
        </p>
        <div className="flex items-center gap-1.5">
          {paginationButtons.map((button) => (
            <Button
              key={button.srText}
              variant="secondary"
              className="p-2"
              onClick={() => setPageIndex(button.page)}
              disabled={
                button.page < 0 ||
                button.page >= pageCount ||
                button.page === pageIndex
              }
            >
              <span className="sr-only">{button.srText}</span>
              <button.icon className="size-5" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
