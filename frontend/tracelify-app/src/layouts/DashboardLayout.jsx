import { Outlet, Link, useLocation } from "react-router-dom"
import { Terminal, LayoutDashboard, AlertCircle, Settings, LogOut, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Issues", icon: AlertCircle, href: "/dashboard/issues" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export default function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#170e2b] text-on-surface flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant/20 bg-surface flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">
              Tracelify
            </span>
          </Link>
        </div>
        
        <div className="px-4 py-6 flex-1">
          <div className="text-xs font-mono text-on-surface-variant/50 uppercase tracking-widest mb-4 px-2">Project</div>
          <div className="mb-6 flex items-center gap-3 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant/10 cursor-pointer hover:border-outline-variant/30 transition-colors">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">main-api-service</div>
              <div className="text-xs text-on-surface-variant truncate">Production</div>
            </div>
          </div>
          
          <div className="text-xs font-mono text-on-surface-variant/50 uppercase tracking-widest mb-2 px-2">Menu</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary-container/20 text-on-surface border border-primary/10" 
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-on-surface-variant")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-outline-variant/20">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex justify-end items-center px-8 border-b border-outline-variant/20 bg-[#170e2b]/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondary rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=User&background=7553ff&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
