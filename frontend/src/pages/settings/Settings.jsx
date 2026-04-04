import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Building2, Users, Plus, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { orgsApi } from "@/services/api/apiHandler";
import { QUERY_KEYS, MEMBER_ROLES } from "@/utils/constants";
import { formatDate, getInitials, slugify } from "@/utils/helpers";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";

export default function Settings() {
  const { user, activeOrg, setActiveOrg } = useAuth();
  const queryClient = useQueryClient();

  const [showNewOrg, setShowNewOrg] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [orgForm, setOrgForm] = useState({ name: "", slug: "" });
  const [memberForm, setMemberForm] = useState({ email: "", role: "member" });
  const [orgError, setOrgError] = useState("");
  const [memberError, setMemberError] = useState("");

  const { data: orgs = [], isLoading: orgsLoading } = useFetch(
    QUERY_KEYS.ORGS,
    () => orgsApi.listMyOrgs(),
  );

  const { data: members = [], isLoading: membersLoading } = useFetch(
    QUERY_KEYS.ORG_MEMBERS(activeOrg?.id),
    () => orgsApi.listMembers(activeOrg?.id),
    { enabled: !!activeOrg?.id },
  );

  const createOrgMutation = useMutation({
    mutationFn: (data) => orgsApi.createOrg(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORGS });
      setActiveOrg(data);
      setShowNewOrg(false);
      setOrgForm({ name: "", slug: "" });
    },
    onError: (err) => setOrgError(err.response?.data?.detail || "Failed to create organization."),
  });

  const addMemberMutation = useMutation({
    mutationFn: (data) => orgsApi.addMember(activeOrg?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORG_MEMBERS(activeOrg?.id) });
      setShowAddMember(false);
      setMemberForm({ email: "", role: "member" });
    },
    onError: (err) => setMemberError(err.response?.data?.detail || "Failed to add member."),
  });

  const handleCreateOrg = (e) => {
    e.preventDefault();
    setOrgError("");
    if (!orgForm.name || !orgForm.slug) { setOrgError("Name and slug are required."); return; }
    createOrgMutation.mutate(orgForm);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    setMemberError("");
    if (!memberForm.email) { setMemberError("Email is required."); return; }
    addMemberMutation.mutate(memberForm);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <PageHeader title="Settings" description="Manage your profile, organizations, and team members." />

      {/* Profile */}
      <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <User className="h-4 w-4 text-violet-400" />
          Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/30 text-violet-300 text-xl font-bold">
            {getInitials(user?.name || user?.email || "?")}
          </div>
          <div>
            <p className="font-semibold text-slate-100">{user?.name || "—"}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <p className="text-xs text-slate-600 mt-0.5">Member since {formatDate(user?.created_at)}</p>
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Building2 className="h-4 w-4 text-violet-400" />
            Organizations
          </h2>
          <button
            onClick={() => setShowNewOrg(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Org
          </button>
        </div>

        {showNewOrg && (
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Create Organization</p>
              <button onClick={() => setShowNewOrg(false)} className="text-slate-500 hover:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrg} className="space-y-3">
              {orgError && <p className="text-xs text-red-400">{orgError}</p>}
              <input
                type="text"
                placeholder="Organization name"
                value={orgForm.name}
                onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500/50 focus:ring-2 ring-violet-500/50"
              />
              <input
                type="text"
                placeholder="slug"
                value={orgForm.slug}
                onChange={(e) => setOrgForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 font-mono outline-none focus:border-violet-500/50 focus:ring-2 ring-violet-500/50"
              />
              <button
                type="submit"
                disabled={createOrgMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors disabled:opacity-60"
              >
                {createOrgMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create
              </button>
            </form>
          </div>
        )}

        {orgsLoading ? <Loader /> : (
          <div className="space-y-2">
            {orgs.map((org) => (
              <div
                key={org.id}
                onClick={() => setActiveOrg(org)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                  activeOrg?.id === org.id
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-slate-800/60 bg-slate-900/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400 text-xs font-bold">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{org.name}</p>
                    <p className="text-xs text-slate-500">/{org.slug}</p>
                  </div>
                </div>
                {activeOrg?.id === org.id && (
                  <span className="text-xs text-violet-400 font-medium">Active</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team Members */}
      {activeOrg && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Users className="h-4 w-4 text-violet-400" />
              Team — {activeOrg.name}
            </h2>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member
            </button>
          </div>

          {showAddMember && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-300">Invite Member</p>
                <button onClick={() => setShowAddMember(false)} className="text-slate-500 hover:text-slate-300"><X className="h-4 w-4" /></button>
              </div>
              <form onSubmit={handleAddMember} className="flex gap-2 flex-wrap">
                {memberError && <p className="w-full text-xs text-red-400">{memberError}</p>}
                <input
                  type="email"
                  placeholder="member@example.com"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))}
                  className="flex-1 min-w-0 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500/50"
                />
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none"
                >
                  {Object.entries(MEMBER_ROLES).map(([k, v]) => (
                    <option key={v} value={v}>{k.charAt(0) + k.slice(1).toLowerCase()}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={addMemberMutation.isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors disabled:opacity-60"
                >
                  {addMemberMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Invite
                </button>
              </form>
            </div>
          )}

          {membersLoading ? <Loader /> : (
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">
                      {getInitials(m.user_id)}
                    </div>
                    <span className="text-sm text-slate-300 font-mono">{m.user_id}</span>
                  </div>
                  <span className="text-xs rounded-full px-2 py-0.5 border border-slate-700 text-slate-400 capitalize">{m.role}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
