import { Search, Filter, AlertTriangle } from "lucide-react"

const issues = [
  { id: "ERR-892", message: "Timeout waiting for connection from pool", location: "src/db/connection.py:102", count: 145, users: 12, time: "2 min ago", severity: "high", status: "unresolved" },
  { id: "ERR-891", message: "Invalid JSON payload received", location: "src/api/webhook.py:44", count: 12, users: 4, time: "15 min ago", severity: "medium", status: "unresolved" },
  { id: "ERR-890", message: "Cannot read property 'id' of undefined", location: "src/services/user.py:210", count: 89, users: 43, time: "1 hour ago", severity: "high", status: "unresolved" },
  { id: "ERR-889", message: "Rate limit exceeded for endpoint /api/v1/sync", location: "src/middleware/rate_limit.py:30", count: 420, users: 1, time: "3 hours ago", severity: "medium", status: "unresolved" },
  { id: "ERR-888", message: "Failed to load external font resource", location: "src/assets/loader.ts:15", count: 5, users: 2, time: "5 hours ago", severity: "low", status: "resolved" },
]

export default function IssuesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-headline font-bold mb-1">Issues</h1>
            <p className="text-sm text-on-surface-variant">Track, assign, and resolve application errors.</p>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search issues (e.g., 'is:unresolved error:timeout')" 
              className="w-full bg-[#1f1633] border border-outline-variant/30 text-on-surface rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
            />
         </div>
         <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container border border-outline-variant/30 rounded-lg text-sm font-medium hover:bg-surface-bright transition-colors shrink-0">
            <Filter className="w-4 h-4" />
            Filters
         </button>
      </div>

      <div className="glass-panel rounded-2xl border border-outline-variant/20 overflow-hidden text-sm">
         {issues.map((issue, index) => (
            <div key={issue.id} className={`p-4 md:p-6 flex items-start gap-4 hover:bg-primary/5 hover:cursor-pointer transition-colors group ${index !== issues.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
               <div className={`mt-1 shrink-0 p-1.5 rounded-md ${
                  issue.severity === 'high' ? 'bg-error/20 text-error' : 
                  issue.severity === 'medium' ? 'bg-secondary/20 text-secondary' : 
                  'bg-tertiary/20 text-tertiary'
               }`}>
                  <AlertTriangle className="w-4 h-4" />
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                     <div>
                        <h3 className="font-medium text-on-surface group-hover:text-primary transition-colors pr-4">{issue.message}</h3>
                        <div className="text-xs text-on-surface-variant mt-1.5 font-mono">{issue.location}</div>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant shrink-0">
                        <div className="flex flex-col items-end">
                           <span className="text-on-surface">{issue.count}</span>
                           <span className="opacity-60">events</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-on-surface">{issue.users}</span>
                           <span className="opacity-60">users</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3 text-xs">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                        issue.status === 'resolved' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container text-on-surface-variant'
                     }`}>
                        {issue.status}
                     </span>
                     <span className="text-on-surface-variant/60">{issue.time}</span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
