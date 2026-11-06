"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { RiMore2Fill } from "@remixicon/react"
import * as React from "react"
import { createClient } from "@/utils/supabase/client"

import { DropdownUserProfile } from "./DropdownUserProfile"

export const UserProfileDesktop = () => {
  const [displayName, setDisplayName] = React.useState<string>("Loading...")
  const [initials, setInitials] = React.useState<string>("")

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.display_name ?? user?.email ?? "User"
      setDisplayName(name)

      const initialsText = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      setInitials(initialsText)
    })
  }, [])

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          focusRing,
          "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            {initials}
          </span>
          <span className="truncate text-left">{displayName}</span>
        </span>
        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  )
}

export const UserProfileMobile = () => {
  const [initials, setInitials] = React.useState<string>("")

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.display_name ?? user?.email ?? "User"
      const initialsText = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      setInitials(initialsText)
    })
  }, [])

  return (
    <DropdownUserProfile align="end">
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
        )}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          aria-hidden="true"
        >
          {initials}
        </span>
      </Button>
    </DropdownUserProfile>
  )
}