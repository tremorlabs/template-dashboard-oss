import { Card } from "@/components/Card"
import { cx, focusRing } from "@/lib/utils"
import { RiFlashlightLine, type RemixiconComponentType } from "@remixicon/react"

const catalog: {
  name: string
  icon: RemixiconComponentType
  color: string
  href: string
}[] = [
  {
    name: "Custom Webhook",
    icon: RiFlashlightLine,
    color: "text-cyan-500 ring-cyan-500",
    href: "#",
  },
]

export function IntegrationCatalog() {
  return (
    <section>
      <h2 className="font-semibold text-gray-900 dark:text-gray-50">
        Available integrations
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        Choose the software you want to connect.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.map((item) => (
          <Card
            key={item.name}
            className="flex items-center gap-3 p-4 transition hover:border-gray-300 hover:shadow-md dark:hover:border-gray-700"
          >
            <span
              className={cx(
                "flex size-10 shrink-0 items-center justify-center rounded-full ring-2 ring-inset",
                item.color,
              )}
            >
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <a
              href={item.href}
              className={cx(
                "truncate rounded-sm font-semibold text-gray-900 dark:text-gray-50",
                focusRing,
              )}
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {item.name}
            </a>
          </Card>
        ))}
      </div>
    </section>
  )
}
