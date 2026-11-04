import { Sidebar } from "@/components/ui/navigation/sidebar"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="p-4 sm:px-6 sm:pb-4 sm:pt-10 lg:px-6 lg:pt-7">
          {children}
        </div>
      </main>
    </div>
  )
}