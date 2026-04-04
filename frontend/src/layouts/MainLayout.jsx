import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  AlertCircle,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { orgsApi } from "@/services/api/apiHandler";
import { QUERY_KEYS } from "@/utils/constants";
import { cn, getInitials } from "@/utils/helpers";
import Loader from "@/components/common/Loader";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
];

export default function MainLayout() {
  const { user, activeOrg, setActiveOrg, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const { data: orgs = [], isLoading: orgsLoading } = useFetch(
    QUERY_KEYS.ORGS,
    () => orgsApi.listMyOrgs(),
  );

  // Auto-select first org if none is active
  if (!activeOrg && orgs.length > 0 && !orgsLoading) {
    setActiveOrg(orgs[0]);
  }

  const orgNavItems = activeOrg
    ? [
        {
          label: "Projects",
          icon: FolderKanban,
          to: `/orgs/${activeOrg.id}/projects`,
        },
      ]
    : [];

  const allNavItems = [...NAV_ITEMS, ...orgNavItems, {
    label: "Settings",
    icon: Settings,
    to: "/settings",
  }];

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(224_71.4%_4.1%)]">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "relative flex flex-col border-r border-slate-800/60 bg-[hsl(224_71.4%_5%)] transition-all duration-300",
          sidebarOpen ? "w-60" : "w-16",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-800/60 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-slate-100 text-sm tracking-wide">
              Tracelify
            </span>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Org switcher */}
        {sidebarOpen && (
          <div className="relative px-3 pt-3">
            <button
              onClick={() => setOrgDropdownOpen((v) => !v)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-violet-600/30 text-violet-300 text-[10px] font-bold">
                {activeOrg ? getInitials(activeOrg.name) : "?"}
              </span>
              <span className="flex-1 truncate font-medium">
                {activeOrg ? activeOrg.name : "Select org…"}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-slate-500 transition-transform", orgDropdownOpen && "rotate-180")} />
            </button>

            {orgDropdownOpen && orgs.length > 0 && (
              <div className="absolute left-3 right-3 top-full z-50 mt-1 rounded-lg border border-slate-700/60 bg-slate-900 shadow-xl py-1">
                {orgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => { setActiveOrg(org); setOrgDropdownOpen(false); navigate(`/orgs/${org.id}/projects`); }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-800 transition-colors",
                      activeOrg?.id === org.id ? "text-violet-300" : "text-slate-300",
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-violet-600/30 text-violet-300 text-[9px] font-bold">
                      {getInitials(org.name)}
                    </span>
                    <span className="truncate">{org.name}</span>
                  </button>
                ))}
                <div className="border-t border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => { setOrgDropdownOpen(false); navigate("/settings"); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Organization
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 px-2 pt-4 overflow-y-auto">
          {allNavItems.map((item) => (
            <NavLink
              key={`${item.label}-${item.to}`}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                  sidebarOpen ? "" : "justify-center",
                  isActive
                    ? "bg-violet-600/20 text-violet-300 font-medium"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                )
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-800/60 p-3">
          <div className={cn("flex items-center gap-2", !sidebarOpen && "justify-center")}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/40 text-violet-300 text-xs font-semibold">
              {getInitials(user?.name || user?.email || "?")}
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{user?.name || user?.email}</p>
                  {user?.name && <p className="text-[10px] text-slate-500 truncate">{user.email}</p>}
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full p-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
