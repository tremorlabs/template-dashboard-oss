import * as React from "react"

const BOTTOM_GAP = 16

export const useFitHeight = (
  sectionRef: React.RefObject<HTMLElement>,
  scrollRef: React.RefObject<HTMLElement>,
  { min = 240 } = {},
) => {
  const [height, setHeight] = React.useState<number>()

  React.useEffect(() => {
    const measure = () => {
      const section = sectionRef.current
      const scroll = scrollRef.current
      if (!section || !scroll) return

      const chrome = section.offsetHeight - scroll.offsetHeight
      const top = section.getBoundingClientRect().top + window.scrollY
      const next = Math.max(
        min,
        Math.floor(window.innerHeight - top - chrome - BOTTOM_GAP),
      )

      setHeight((prev) => (prev === next ? prev : next))
    }

    // re-measure on any layout change
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [sectionRef, scrollRef, min])

  return height
}
