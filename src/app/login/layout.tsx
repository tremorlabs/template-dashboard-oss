export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen w-full bg-tremor-background dark:bg-dark-tremor-background">
      {children}
    </div>
  )
}