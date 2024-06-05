import { Badge } from "@/components/Badge"
import { ProgressBar } from "@/components/ProgressBar"

import { KpiEntry } from "@/app/(main)/overview/page"

export type CardProps = {
  title: string
  change: string
  value: string
  valueDescription: string
  ctaDescription: string
  ctaText: string
  ctaLink: string
  data: KpiEntry[]
}

export function ProgressBarCard({
  title,
  change,
  value,
  valueDescription,
  ctaDescription,
  ctaText,
  ctaLink,
  data,
}: CardProps) {
  return (
    <>
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <dt className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">
              {title}
            </dt>
            <Badge variant="neutral">{change}</Badge>
          </div>
          <dd className="mt-2 flex items-baseline gap-2">
            <span className="text-xl text-gray-900 dark:text-gray-50">
              {value}
            </span>
            <span className="text-sm text-gray-500">{valueDescription}</span>
          </dd>
          <ul role="list" className="mt-4 space-y-5">
            {data.map((item) => (
              <li key={item.title}>
                <p className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {item.title}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {item.current}
                    <span className="font-normal text-gray-500">
                      /{item.allowed}
                      {item.unit}
                    </span>
                  </span>
                </p>
                <ProgressBar
                  value={item.percentage}
                  className="mt-2 [&>*]:h-1.5"
                />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mt-6 text-xs text-gray-500">
            {ctaDescription}{" "}
            <a href={ctaLink} className="text-indigo-600 dark:text-indigo-400">
              {ctaText}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
