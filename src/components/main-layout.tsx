import { SidebarNav } from "./sidebar-nav"

interface MainLayoutProps {
  children: React.ReactNode
  collapseSidebar?: boolean
  fullWidth?: boolean
}

export function MainLayout({ children, collapseSidebar = false, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav collapsed={collapseSidebar} />
      <main className="flex-1 overflow-auto">
        {fullWidth ? (
          children
        ) : (
          <div className="container mx-auto p-6">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}