import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const stats = [
  { label: "Total Events", value: "1.2M", change: "+12%", trend: "up", icon: Activity, color: "text-primary" },
  { label: "Errors Logged", value: "482", change: "-5%", trend: "down", icon: AlertTriangle, color: "text-error" },
  { label: "Avg Latency", value: "42ms", change: "+2ms", trend: "up", icon: Clock, color: "text-tertiary" },
  { label: "Uptime", value: "99.99%", change: "0%", trend: "neutral", icon: CheckCircle, color: "text-secondary" },
]

const recentIssues = [
  { id: "ERR-892", message: "Timeout waiting for connection from pool", location: "src/db/connection.py:102", count: 145, time: "2 min ago", severity: "high" },
  { id: "ERR-891", message: "Invalid JSON payload received", location: "src/api/webhook.py:44", count: 12, time: "15 min ago", severity: "medium" },
  { id: "ERR-890", message: "Cannot read property 'id' of undefined", location: "src/services/user.py:210", count: 89, time: "1 hour ago", severity: "high" },
  { id: "ERR-889", message: "Rate limit exceeded for endpoint /api/v1/sync", location: "src/middleware/rate_limit.py:30", count: 420, time: "3 hours ago", severity: "medium" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-headline font-bold">Overview</h1>
            <p className="text-sm text-on-surface-variant">Here&apos;s what&apos;s happening with your projects today.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-outline-variant/20 hover:border-outline-variant/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-on-surface-variant">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-surface-container ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-headline font-bold">{stat.value}</h2>
              <span className={`text-xs font-medium ${
                stat.trend === "down" && stat.label === "Errors Logged" ? "text-tertiary" : 
                stat.trend === "up" && stat.label === "Errors Logged" ? "text-error" : 
                stat.trend === "up" ? "text-tertiary" : 
                stat.trend === "down" ? "text-error" : "text-on-surface-variant"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4 h-8 flex items-end gap-1 opacity-50">
               {[...Array(20)].map((_, j) => (
                 <div key={j} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary/50" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-headline font-semibold">Unresolved Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant font-mono">
                <th className="px-6 py-4 font-medium">Issue</th>
                <th className="px-6 py-4 font-medium">Events</th>
                <th className="px-6 py-4 font-medium">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm">
              {recentIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-primary/5 hover:cursor-pointer transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${issue.severity === "high" ? "bg-error animate-pulse" : "bg-secondary"}`} />
                      <div>
                        <div className="font-medium text-on-surface group-hover:text-primary transition-colors">{issue.message}</div>
                        <div className="text-xs text-on-surface-variant mt-1 font-mono">{issue.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-surface-container">
                      {issue.count}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                    {issue.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
