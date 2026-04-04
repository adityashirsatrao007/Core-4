import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderKanban, Loader2, X } from "lucide-react";
import { projectsApi } from "@/services/api/apiHandler";
import { useFetch } from "@/hooks/useFetch";
import { QUERY_KEYS, PLATFORMS } from "@/utils/constants";
import { formatRelativeTime, slugify } from "@/utils/helpers";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";

export default function Projects() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", platform: "python" });
  const [formError, setFormError] = useState("");

  const { data: projects = [], isLoading } = useFetch(
    QUERY_KEYS.PROJECTS(orgId),
    () => projectsApi.listProjects(orgId),
    { enabled: !!orgId },
  );

  const createMutation = useMutation({
    mutationFn: (data) => projectsApi.createProject(orgId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS(orgId) });
      setShowCreate(false);
      setForm({ name: "", slug: "", platform: "python" });
      navigate(`/orgs/${orgId}/projects/${data.project.id}`);
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || "Failed to create project.");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.slug) {
      setFormError("Name and slug are required.");
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Projects"
        description="Manage your projects and their error tracking configurations."
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Projects" }]}
        actions={
          <button
            id="btn-new-project"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        }
      />

      {/* Create project modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-100">Create Project</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Project name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="My Backend Service"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-violet-500/50 transition focus:border-violet-500/50 focus:ring-2"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="my-backend-service"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-violet-500/50 transition focus:border-violet-500/50 focus:ring-2 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none ring-violet-500/50 transition focus:border-violet-500/50 focus:ring-2"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors disabled:opacity-60"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project and get your DSN to start capturing errors."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Create project
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/orgs/${orgId}/projects/${project.id}`)}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 text-left hover:border-violet-500/30 hover:bg-slate-900/80 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">{project.slug}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="rounded-md bg-slate-800/60 px-2 py-0.5 font-mono">
                  {project.platform}
                </span>
                <span>{formatRelativeTime(project.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
