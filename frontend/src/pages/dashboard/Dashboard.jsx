import { useNavigate } from "react-router-dom";
import { AlertCircle, FolderKanban, Plus, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { orgsApi, issuesApi } from "@/services/api/apiHandler";
import { QUERY_KEYS } from "@/utils/constants";
import { formatRelativeTime, formatCount } from "@/utils/helpers";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";

export default function Dashboard() {
  const { user, activeOrg } = useAuth();
  const navigate = useNavigate();

  const { data: orgs = [], isLoading: orgsLoading } = useFetch(
    QUERY_KEYS.ORGS,
    () => orgsApi.listMyOrgs(),
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(" ")[0] || "there"} 👋`}
        description="Here's an overview of your organizations and projects."
      />

      {/* ── Organizations ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Your Organizations
          </h2>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-600/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Org
          </button>
        </div>

        {orgsLoading ? (
          <Loader />
        ) : orgs.length === 0 ? (
          <EmptyState
            title="No organizations yet"
            description="Create an organization to start tracking errors across your projects."
            action={
              <button
                onClick={() => navigate("/settings")}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                Create organization
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => navigate(`/orgs/${org.id}/projects`)}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 text-left hover:border-violet-500/30 hover:bg-slate-900/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 text-sm font-bold">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors truncate">
                      {org.name}
                    </p>
                    <p className="text-xs text-slate-500">/{org.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FolderKanban className="h-3.5 w-3.5" />
                  <span>View projects →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Quick stats (if org selected) ────────────────────────────────── */}
      {activeOrg && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Quick Stats — {activeOrg.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active Projects", icon: FolderKanban, color: "violet" },
              { label: "Open Issues", icon: AlertCircle, color: "red" },
              { label: "Resolved Today", icon: TrendingUp, color: "emerald" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-100">—</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600">
            Navigate to a project to see detailed stats.
          </p>
        </section>
      )}
    </div>
  );
}
