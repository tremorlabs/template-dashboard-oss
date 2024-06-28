import { siteConfig } from "@/app/siteConfig"
import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/icons/ArrowAnimated"
import { TremorPlaceholder } from "@/components/ui/icons/TremorPlaceholder"

export default function Example() {
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Details
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <div className="my-40 flex w-full flex-col items-center justify-center">
          <TremorPlaceholder className="size-20 shrink-0" aria-hidden="true" />
          <h2 className="mt-6 text-lg font-semibold sm:text-xl">
            Want to get the full content?
          </h2>
          <p className="mt-3 max-w-md text-center text-gray-500">
            Dashboard template crafted with React, Next.js and Tailwind CSS.
            Ideal for providing analytics to your users.
          </p>
          <Button className="group mt-6" variant="secondary" asChild>
            <a href={siteConfig.externalLink.blocks}>
              Get full template here
              <ArrowAnimated
                className="stroke-gray-900 dark:stroke-gray-50"
                aria-hidden="true"
              />
            </a>
          </Button>
        </div>
      </div>
    </>
  )
}
