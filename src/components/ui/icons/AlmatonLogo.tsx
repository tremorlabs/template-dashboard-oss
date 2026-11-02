import { cx } from "@/lib/utils"
import Image from "next/image"

type LogoProps = {
  className?: string
  alt?: string
  priority?: boolean
}

export const AlmatonIcon = ({ className, alt = "", priority }: LogoProps) => (
  <Image
    src="/images/logo-2.svg"
    alt={alt}
    aria-hidden={alt === "" || undefined}
    width={337}
    height={254}
    priority={priority}
    className={cx("object-contain", className)}
  />
)

export const AlmatonLogo = ({
  className,
  alt = "Almaton",
  priority,
}: LogoProps) => (
  <Image
    src="/images/logo.svg"
    alt={alt}
    width={560}
    height={113}
    priority={priority}
    className={cx("w-auto dark:brightness-0 dark:invert", className)}
  />
)
