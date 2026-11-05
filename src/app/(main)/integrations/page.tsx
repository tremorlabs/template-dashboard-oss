import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { IntegrationsTable } from "@/components/ui/integrations/IntegrationsTable"
import { integrations } from "@/data/integrations/data"
import { RiAddLine, RiFileList3Line } from "@remixicon/react"

export default function IntegrationsPage() {
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
        <Button className="flex items-center gap-2 text-base sm:text-sm">
          New integration
          <RiAddLine className="-mr-0.5 size-5 shrink-0" aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          className="flex items-center gap-2 text-base sm:text-sm"
        >
          <RiFileList3Line
            className="-ml-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          Integration request status
        </Button>
      </div>
      <Divider />
      <IntegrationsTable integrations={integrations} />
    </main>
  )
}
