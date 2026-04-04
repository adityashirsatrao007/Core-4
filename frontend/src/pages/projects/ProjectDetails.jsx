import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Copy, Check, Plus, Loader2, Key, RefreshCw } from "lucide-react";
import { projectsApi } from "@/services/api/apiHandler";
import { useFetch } from "@/hooks/useFetch";
import { QUERY_KEYS } from "@/utils/constants";
import { formatDate, copyToClipboard } from "@/utils/helpers";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";

export default function ProjectDetails() {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copiedKey, setCopiedKey] = useState(null);

  const { data: project, isLoading: projectLoading } = useFetch(
    QUERY_KEYS.PROJECT(projectId),
    () => projectsApi.getProject(projectId),
    { enabled: !!projectId },
  );

  const { data: dsnKeys = [], isLoading: dsnLoading } = useFetch(
    QUERY_KEYS.PROJECT_DSN(projectId),
    () => projectsApi.listDsnKeys(projectId),
    { enabled: !!projectId },
  );

  const rotateMutation = useMutation({
    mutationFn: (label) => projectsApi.createDsnKey(projectId, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT_DSN(projectId) });
    },
  });

  const handleCopy = async (text, id) => {
    await copyToClipboard(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (projectLoading) return <Loader />;
  if (!project) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={project.name}
        description={`Platform: ${project.platform} · Created ${formatDate(project.created_at)}`}
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Projects", to: `/orgs/${orgId}/projects` },
          { label: project.name },
        ]}
        actions={
          <button
            onClick={() => navigate(`/orgs/${orgId}/projects/${projectId}/issues`)}
            className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20"
          >
            <AlertCircle className="h-4 w-4" />
            View Issues
          </button>
        }
      />

      {/* Project info card */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Project Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Project ID", value: project.id, mono: true },
            { label: "Slug", value: project.slug, mono: true },
            { label: "Platform", value: project.platform },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-sm text-slate-200 ${item.mono ? "font-mono" : ""} break-all`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DSN Keys */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-100">DSN Keys</h2>
            <p className="text-xs text-slate-500 mt-0.5">Use these keys in your Tracelify SDK integration.</p>
          </div>
          <button
            id="btn-new-dsn"
            onClick={() => rotateMutation.mutate(`Key ${dsnKeys.length + 1}`)}
            disabled={rotateMutation.isPending}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {rotateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            New Key
          </button>
        </div>

        {dsnLoading ? (
          <Loader />
        ) : dsnKeys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
            No DSN keys found.
          </div>
        ) : (
          <div className="space-y-3">
            {dsnKeys.map((key) => (
              <div
                key={key.id}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium text-slate-200">{key.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${key.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                      {key.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(key.created_at)}</span>
                </div>

                {/* DSN string */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 border border-slate-800/60 px-4 py-3">
                  <code className="flex-1 text-xs text-slate-300 font-mono break-all leading-relaxed">
                    {key.dsn}
                  </code>
                  <button
                    onClick={() => handleCopy(key.dsn, key.id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    title="Copy DSN"
                  >
                    {copiedKey === key.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Public key */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Public key:</span>
                  <code className="text-slate-400 font-mono">{key.public_key}</code>
                  <button
                    onClick={() => handleCopy(key.public_key, `pk-${key.id}`)}
                    className="text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {copiedKey === `pk-${key.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
