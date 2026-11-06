"use client"

import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { SegmentedControl } from "@/components/SegmentedControl"
import { cx, focusRing } from "@/lib/utils"
import {
  RiAccountCircleLine,
  RiArrowRightSLine,
  RiEraserLine,
  RiFileHistoryLine,
  RiKey2Line,
  RiLayoutLine,
  RiLoginBoxLine,
  RiLoginCircleLine,
  RiMailSendLine,
  RiNotification3Line,
  RiSendPlaneLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiShieldKeyholeLine,
  RiShieldUserLine,
  RiTeamLine,
  RiUserLine,
  type RemixiconComponentType,
} from "@remixicon/react"
import React from "react"

type SettingsPage = {
  name: string
  description: string
  icon: RemixiconComponentType
  href: string
}

const sections: { id: string; label: string; pages: SettingsPage[] }[] = [
  {
    id: "system",
    label: "System",
    pages: [
      {
        name: "Settings",
        description: "Company name, logo and general workspace details.",
        icon: RiSettings3Line,
        href: "#",
      },
      {
        name: "Outgoing Emails",
        description: "Sender address, SMTP server and email templates.",
        icon: RiSendPlaneLine,
        href: "#",
      },
      {
        name: "Custom Login",
        description: "Logo, background and message on the sign-in page.",
        icon: RiLoginCircleLine,
        href: "#",
      },
      {
        name: "User Interface",
        description: "Theme, layout density and display preferences.",
        icon: RiLayoutLine,
        href: "#",
      },
      {
        name: "Authorizations",
        description: "Approval rules for orders, returns and changes.",
        icon: RiShieldCheckLine,
        href: "#",
      },
      {
        name: "Notifications",
        description: "Choose which alerts are sent and through which channel.",
        icon: RiNotification3Line,
        href: "#",
      },
      {
        name: "Erase Cache",
        description: "Clear cached data to load the latest information.",
        icon: RiEraserLine,
        href: "#",
      },
    ],
  },
  {
    id: "users",
    label: "Users & permissions",
    pages: [
      {
        name: "Users",
        description: "Manage people with access to the dashboard.",
        icon: RiUserLine,
        href: "#",
      },
      {
        name: "Login Activity",
        description: "Login history and session information.",
        icon: RiLoginBoxLine,
        href: "#",
      },
      {
        name: "Audit Log",
        description: "History of changes made by each user.",
        icon: RiFileHistoryLine,
        href: "#",
      },
      {
        name: "Roles",
        description: "Define roles and what each one can see or edit.",
        icon: RiShieldUserLine,
        href: "#",
      },
      {
        name: "Teams",
        description: "Group users by area or warehouse.",
        icon: RiTeamLine,
        href: "#",
      },
      {
        name: "Invitations",
        description: "Pending invites and access requests.",
        icon: RiMailSendLine,
        href: "#",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    pages: [
      {
        name: "Profile",
        description: "Your name, display name, email and photo.",
        icon: RiAccountCircleLine,
        href: "#",
      },
      {
        name: "Security",
        description: "Password, two-factor authentication and sessions.",
        icon: RiShieldKeyholeLine,
        href: "#",
      },
      {
        name: "API Keys",
        description: "Create and revoke keys for external access.",
        icon: RiKey2Line,
        href: "#",
      },
    ],
  },
]

const sectionTabs = sections.map(({ id, label }) => ({ value: id, label }))

export default function SettingsPage() {
  const [activeId, setActiveId] = React.useState(sections[0].id)
  const [query, setQuery] = React.useState("")
  const active = sections.find(({ id }) => id === activeId) ?? sections[0]
  const q = query.trim().toLowerCase()
  const pages = active.pages.filter(({ name, description }) =>
    `${name} ${description}`.toLowerCase().includes(q),
  )

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Settings
          </h1>
          <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
            Manage your system, users and account preferences.
          </p>
        </div>
        <Input
          type="search"
          placeholder="Search settings..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full sm:max-w-xs"
        />
      </div>

      <Divider />
      <SegmentedControl
        aria-label="Settings section"
        items={sectionTabs}
        value={activeId}
        onChange={setActiveId}
      />

      {pages.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card
              key={page.name}
              className="group p-4 transition hover:border-gray-300 hover:shadow-md dark:hover:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  <page.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                    <a href={page.href} className={cx("rounded-sm", focusRing)}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {page.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    {page.description}
                  </p>
                </div>
                <RiArrowRightSLine
                  className="size-5 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-gray-500">
          No settings match &quot;{query}&quot;.
        </p>
      )}
    </main>
  )
}
