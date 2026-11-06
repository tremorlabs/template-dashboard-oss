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
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { getStockStatus, type InventoryItem } from "@/data/inventory/data"
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
} from "@remixicon/react"
import React from "react"

const PAGE_SIZE = 20

// sticky header/footer
const stickyHeadCell =
  "sticky top-0 z-10 border-b-0 bg-white shadow-[inset_0_-1px_0] shadow-gray-200 dark:bg-gray-950 dark:shadow-gray-800"
const stickyFootCell =
  "sticky bottom-0 z-10 border-b-0 bg-white shadow-[inset_0_1px_0] shadow-gray-200 dark:bg-gray-950 dark:shadow-gray-800"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
})

const costValue = (item: InventoryItem) => item.onHand * item.unitCost

const columns: {
  header: string
  render: (item: InventoryItem) => React.ReactNode
  sortValue: (item: InventoryItem) => string | number
}[] = [
  {
    header: "Product",
    render: (i) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-50">
          {i.product}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{i.brand}</p>
      </div>
    ),
    sortValue: (i) => `${i.brand} ${i.product}`,
  },
  {
    header: "Variant",
    render: (i) => i.variant,
    sortValue: (i) => i.variant,
  },
  {
    header: "Status",
    render: (i) => {
      const status = getStockStatus(i.status)
      return (
        <Badge variant={status?.variant ?? "neutral"}>
          {status?.label ?? i.status}
        </Badge>
      )
    },
    sortValue: (i) => i.status,
  },
  {
    header: "SKU",
    render: (i) => <span className="font-mono text-xs">{i.sku}</span>,
    sortValue: (i) => i.sku,
  },
  {
    header: "On hand",
    render: (i) => <span className="tabular-nums">{i.onHand}</span>,
    sortValue: (i) => i.onHand,
  },
  {
    header: "Committed",
    render: (i) => <span className="tabular-nums">{i.committed}</span>,
    sortValue: (i) => i.committed,
  },
  {
    header: "Cost value",
    render: (i) => (
      <span className="tabular-nums">
        {currencyFormatter.format(costValue(i))}
      </span>
    ),
    sortValue: (i) => costValue(i),
  },
]

const DEFAULT_SORT_COLUMN = columns.findIndex((c) => c.header === "Product")

export const getInventoryId = (item: InventoryItem) => item.sku

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

type InventoryTableProps = {
  items: InventoryItem[]
  onDelete: (ids: string[]) => void
}

export function InventoryTable({ items, onDelete }: InventoryTableProps) {
  const [sorting, setSorting] = React.useState({
    column: DEFAULT_SORT_COLUMN,
    desc: false,
  })
  const [pageIndex, setPageIndex] = React.useState(0)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const sectionRef = React.useRef<HTMLElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const maxHeight = useFitHeight(sectionRef, scrollRef)

  React.useEffect(() => {
    scrollRef.current?.firstElementChild?.scrollTo({ top: 0 })
  }, [pageIndex, sorting])

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

  React.useEffect(() => {
    setPageIndex((prev) => Math.min(prev, pageCount - 1))
    setSelected(new Set())
  }, [items, pageCount])

  const sorted = React.useMemo(() => {
    const { sortValue } = columns[sorting.column]
    const sign = sorting.desc ? -1 : 1
    return [...items].sort(
      (a, b) => (sortValue(a) > sortValue(b) ? 1 : -1) * sign,
    )
  }, [items, sorting])

  const rows = sorted.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

  const allIds = items.map(getInventoryId)
  const pageIds = rows.map(getInventoryId)
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
                  aria-label={`Select all products`}
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
            {rows.map((item) => {
              const id = getInventoryId(item)
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
                      aria-label={`Select ${item.product} ${item.variant}`}
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleIds([id], !isSelected)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.header}>
                      {column.render(item)}
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
                  aria-label={`Select products on this page`}
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
                Delete product
                {plural}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Delete {selected.size} product
                  {plural}?
                </DialogTitle>
                <DialogDescription className="text-sm">
                  This permanently removes the selected product
                  {plural} and can&apos;t be undone.
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
                    Delete product
                    {plural}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
