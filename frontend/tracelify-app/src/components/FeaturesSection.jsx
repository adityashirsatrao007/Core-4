import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ERROR_VIZ = "https://lh3.googleusercontent.com/aida-public/AB6AXuDcFN0mXtzudtzE22nbUyjvKuPK5JII_lhjQQjOtS-FEeZe2V1OLIVcgti_yt9vx8fuIrBTWx-9-ngamwIDCoao4Hxkj1dPvllpJrO1xvM-gDR5Re3Th5Y6kZIFdsph4Vq8BlYWnCwQyWXlyFffZ6JfSL5G7gPT7rL4U5sUbjsjieLo-iLQyaliyR2OixF6aM4t5SlsxRwsqFCEaA7s9rGPwfepjnUYEKimdplnIGk24yx6IQjdwnjC2KHpD0w2a2rKytvfhOtHOi2c"

const features = [
  {
    id: "error-tracking",
    colSpan: "md:col-span-8",
    icon: "troubleshoot",
    iconColor: "text-primary",
    title: "Real-time Error Tracking",
    description: "Aggregate events across your entire stack. Identify patterns and fix issues before they impact your users.",
    badge: { label: "Core Feature", variant: "default" },
    hasImage: true,
    bg: "bg-surface-container-low",
  },
  {
    id: "performance",
    colSpan: "md:col-span-4",
    icon: "speed",
    iconColor: "text-secondary",
    title: "Performance",
    description: "Trace every request and pinpoint bottlenecks with sub-millisecond precision.",
    badge: { label: "Tracing", variant: "secondary" },
    hasChart: true,
    chartColor: "secondary",
    bg: "bg-surface-container-low",
  },
  {
    id: "session-replay",
    colSpan: "md:col-span-4",
    icon: "videocam",
    iconColor: "text-tertiary",
    title: "Session Replay",
    description: "Watch exactly what happened from the user's perspective. No more \"I can't reproduce it.\"",
    badge: { label: "Replay", variant: "tertiary" },
    bg: "bg-surface-container-low",
  },
  {
    id: "ai-analysis",
    colSpan: "md:col-span-8",
    icon: "psychology",
    iconColor: "text-primary-fixed-dim",
    title: "AI Root Cause Analysis",
    description: "Our engine correlates logs, traces, and metrics to suggest the exact line of code responsible for the failure.",
    badge: { label: "AI Powered", variant: "tertiary" },
    hasAIPanel: true,
    bg: "bg-surface-container-high",
  },
]

function PerformanceChart({ color }) {
  const bars = [
    { height: "h-10", opacity: "/10" },
    { height: "h-14", opacity: "/10" },
    { height: "h-16", opacity: "" },
  ]
  return (
    <div className="absolute bottom-6 right-6 flex gap-1 items-end h-16 w-32">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn(`w-full rounded-sm`, bar.height, `bg-${color}${bar.opacity}`)}
        />
      ))}
    </div>
  )
}

function AIPanel() {
  return (
    <div className="flex-1 glass-panel p-5 rounded-xl border border-outline-variant/20">
      <div className="font-mono text-xs text-on-surface-variant mb-2">// AI Analysis</div>
      <div className="text-tertiary text-sm font-mono mb-4 leading-relaxed">
        "Probable cause: Database connection timeout in{" "}
        <span className="text-secondary">'user_repository.go'</span> line 128 due to
        unoptimized JOIN."
      </div>
      <div className="space-y-2">
        <div className="h-1 bg-surface-variant w-full rounded-full">
          <div className="h-full bg-tertiary rounded-full" style={{ width: "94%" }} />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Confidence</span>
          <span className="text-[10px] text-tertiary font-bold">94%</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2 flex-wrap">
        {["line 128", "JOIN query", "conn pool"].map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface-dim">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4">Platform</Badge>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-balance">
            Precision Engineering for the Void
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Sophisticated toolsets for complex distributed systems.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              className={cn(
                f.colSpan,
                f.bg,
                "rounded-3xl p-10 border border-outline-variant/10 relative overflow-hidden bento-inner-glow group transition-transform duration-300 hover:-translate-y-1"
              )}
            >
              {/* Content */}
              <div className={cn("relative z-10", f.hasAIPanel ? "flex flex-col md:flex-row gap-10 items-start md:items-center" : "")}>
                <div className="flex-1">
                  <div className="mb-2">
                    <Badge variant={f.badge.variant}>{f.badge.label}</Badge>
                  </div>
                  <span className={cn("material-symbols-outlined text-4xl mb-4 block", f.iconColor)}>
                    {f.icon}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-headline font-bold mb-3">{f.title}</h3>
                  <p className="text-on-surface-variant max-w-md leading-relaxed">{f.description}</p>
                </div>
                {f.hasAIPanel && <AIPanel />}
              </div>

              {/* Background image for error card */}
              {f.hasImage && (
                <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-40 translate-x-10 translate-y-20 group-hover:translate-y-16 transition-transform duration-500 pointer-events-none">
                  <img
                    alt="Real-time error visualization"
                    src={ERROR_VIZ}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Performance chart */}
              {f.hasChart && <PerformanceChart color={f.chartColor} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
