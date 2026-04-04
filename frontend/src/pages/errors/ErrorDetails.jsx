import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, User, Hash, Layers } from "lucide-react";
import { issuesApi } from "@/services/api/apiHandler";
import { useFetch } from "@/hooks/useFetch";
import { QUERY_KEYS } from "@/utils/constants";
import { formatDate, formatRelativeTime } from "@/utils/helpers";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";

export default function ErrorDetails() {
  const { orgId, projectId, issueId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: issue, isLoading: issueLoading } = useFetch(
    QUERY_KEYS.ISSUE(projectId, issueId),
    () => issuesApi.getIssue(projectId, issueId),
    { enabled: !!projectId && !!issueId },
  );

  const { data: events = [], isLoading: eventsLoading } = useFetch(
    QUERY_KEYS.ISSUE_EVENTS(projectId, issueId),
    () => issuesApi.listIssueEvents(projectId, issueId),
    { enabled: !!projectId && !!issueId },
  );

  const updateMutation = useMutation({
    mutationFn: (status) => issuesApi.updateIssue(projectId, issueId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ISSUE(projectId, issueId) });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "issues"] });
    },
  });

  if (issueLoading) return <Loader />;
  if (!issue) return <EmptyState title="Issue not found" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <PageHeader
        title={issue.title}
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Projects", to: `/orgs/${orgId}/projects` },
          { label: "Issues", to: `/orgs/${orgId}/projects/${projectId}/issues` },
          { label: "Detail" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge level={issue.level} />
            <StatusBadge status={issue.status} />
            <select
              value={issue.status}
              onChange={(e) => updateMutation.mutate(e.target.value)}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-violet-500/50 disabled:opacity-60"
            >
              <option value="open">Mark open</option>
              <option value="resolved">Mark resolved</option>
              <option value="ignored">Mark ignored</option>
            </select>
          </div>
        }
      />

      {/* Meta grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Hash, label: "Event count", value: issue.event_count.toLocaleString() },
          { icon: User, label: "Affected users", value: issue.user_count.toLocaleString() },
          { icon: Clock, label: "First seen", value: formatDate(issue.first_seen) },
          { icon: Clock, label: "Last seen", value: formatRelativeTime(issue.last_seen) },
        ].map((meta) => (
          <div
            key={meta.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
              <meta.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{meta.label}</p>
              <p className="text-sm font-semibold text-slate-200">{meta.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fingerprint */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fingerprint</p>
        <code className="block text-sm font-mono text-slate-300 break-all">{issue.fingerprint}</code>
      </div>

      {/* Events timeline */}
      <div className="space-y-4">
        <h2 className="font-semibold text-slate-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-400" />
          Event Timeline
          <span className="text-xs text-slate-500 font-normal">({events.length} events)</span>
        </h2>

        {eventsLoading ? (
          <Loader />
        ) : events.length === 0 ? (
          <EmptyState title="No events found" description="Events will appear here as they are ingested by the SDK." />
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <div
                key={event.id}
                className="group relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-slate-800"
              >
                <div className="absolute left-0 top-3 h-4 w-4 rounded-full border-2 border-slate-700 bg-slate-900 group-first:border-violet-500" />
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">#{i + 1}</span>
                      <span className="text-xs text-slate-400">{event.environment || "production"}</span>
                    </div>
                    <span className="text-xs text-slate-500">{formatRelativeTime(event.received_at)}</span>
                  </div>
                  {event.message && (
                    <p className="text-sm text-slate-300 font-mono break-all">{event.message}</p>
                  )}
                  {event.exception && (
                    <pre className="text-xs text-red-300 bg-red-500/5 rounded-lg p-3 overflow-x-auto">
                      {typeof event.exception === "string" ? event.exception : JSON.stringify(event.exception, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
