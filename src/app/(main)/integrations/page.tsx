"use client"

import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import {
  IntegrationDetailsDrawer,
  type IntegrationDrawerMode,
} from "@/components/ui/integrations/IntegrationDetailsDrawer"
import { IntegrationCatalog } from "@/components/ui/integrations/IntegrationCatalog"
import { IntegrationRequestsDrawer } from "@/components/ui/integrations/IntegrationRequestsDrawer"
import { IntegrationRequestsTable } from "@/components/ui/integrations/IntegrationRequestsTable"
import {
  IntegrationsTable,
  type IntegrationAction,
} from "@/components/ui/integrations/IntegrationsTable"
import {
  integrationRequests,
  integrations as sampleIntegrations,
  type Integration,
} from "@/data/integrations/data"
import { RiAddLine, RiFileList3Line, RiPlugLine } from "@remixicon/react"
import React from "react"

export default function IntegrationsPage() {
  const [integrations, setIntegrations] =
    React.useState<Integration[]>(sampleIntegrations)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [detailsMode, setDetailsMode] =
    React.useState<IntegrationDrawerMode>("view")
  const [drawer, setDrawer] = React.useState<"details" | "requests" | null>(
    null,
  )
  const [view, setView] = React.useState<"list" | "requests" | "new">("list")
  const active = integrations.find(({ id }) => id === activeId)
  const toggleView = (next: "requests" | "new") =>
    setView((current) => (current === next ? "list" : next))

  const handleAction = (action: IntegrationAction, item: Integration) => {
    setActiveId(item.id)
    if (action === "requests") return setDrawer("requests")
    setDetailsMode(action)
    setDrawer("details")
  }

  const closeOn = (open: boolean) => !open && setDrawer(null)

  const saveIntegration = (updated: Integration) =>
    setIntegrations((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    )

  const deleteIntegration = (id: string) =>
    setIntegrations((prev) => prev.filter((item) => item.id !== id))

  return (
    <main>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Integrations
        </h1>
        <p className="text-gray-500 sm:text-sm/6 dark:text-gray-500">
          Software connected to your operation.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="gap-2 text-base sm:text-sm"
          onClick={() => toggleView("new")}
        >
          {view === "new" ? (
            <>
              <RiPlugLine
                className="-ml-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
              Back to integrations
            </>
          ) : (
            <>
              New integration
              <RiAddLine
                className="-mr-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          className="gap-2 text-base sm:text-sm"
          onClick={() => toggleView("requests")}
        >
          {view === "requests" ? (
            <RiPlugLine
              className="-ml-0.5 size-5 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <RiFileList3Line
              className="-ml-0.5 size-5 shrink-0"
              aria-hidden="true"
            />
          )}
          {view === "requests"
            ? "Back to integrations"
            : "Integration request status"}
        </Button>
      </div>
      <Divider />
      {view === "new" && <IntegrationCatalog />}
      {view === "requests" && (
        <IntegrationRequestsTable
          integrations={integrations}
          requests={integrationRequests}
        />
      )}
      {view === "list" && (
        <IntegrationsTable
          integrations={integrations}
          onAction={handleAction}
          onDelete={deleteIntegration}
        />
      )}
      <IntegrationDetailsDrawer
        integration={active}
        mode={detailsMode}
        open={drawer === "details"}
        onOpenChange={closeOn}
        onSave={saveIntegration}
      />
      {active && (
        <IntegrationRequestsDrawer
          integration={active}
          requests={integrationRequests}
          open={drawer === "requests"}
          onOpenChange={closeOn}
        />
      )}
    </main>
  )
}
