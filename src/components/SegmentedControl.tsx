import { cx } from "@/lib/utils"
import React from "react"

type SegmentedControlProps<T extends string> = {
  items: readonly { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
  "aria-label": string
  className?: string
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={props["aria-label"]}
      className={cx(
        "flex w-full overflow-x-auto rounded-md border border-gray-200 p-0.5 sm:w-fit dark:border-gray-800",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cx(
              "h-7 flex-1 whitespace-nowrap rounded px-3 text-xs font-medium transition sm:flex-none",
              isActive
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-50",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 tabular-nums text-gray-400 dark:text-gray-600">
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
