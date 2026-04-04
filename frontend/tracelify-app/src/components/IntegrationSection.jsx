import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Cloud, ArrowRight } from "lucide-react"

const CHAR_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDNILjdJaXgnLVhLvuRpEunTxrRubxeEWApeUzGpk1mgL66ijspn6M48E2J4zk620yuDzUd0LvWvJyWQBLXeOOLN_G3jC6A1OQ3eQY7q2Z6MygQyWHqhyPi1nHx9EvjuKEy7JftIAsLaBPJJ-MHn-CusRInjJmB0khRRwxsdfGcRuFEpGMZdp08ZQyhASqUVnHk-tpobpfvglOEUlDnGoE4gn55ipeyRgC6oUIgCSyInYmCh1FRY87eTQqVKg7PuRHAD_yc8dGTXVKb"

const codeLines = [
  { num: null, type: "cmd", content: ["npm install ", "@tracelify/node"] },
  { num: 1, type: "code", parts: [
    { text: "import", cls: "text-[#7553ff]" },
    { text: " * as ", cls: "text-[#aad636]" },
    { text: "Tracelify ", cls: "text-on-surface" },
    { text: "from", cls: "text-[#7553ff]" },
    { text: " '@tracelify/node'", cls: "text-[#ffafd3]" },
    { text: ";", cls: "text-on-surface-variant" },
  ]},
  { num: 2, type: "empty" },
  { num: 3, type: "code", parts: [
    { text: "Tracelify.", cls: "text-on-surface" },
    { text: "init", cls: "text-[#cabeff]" },
    { text: "({", cls: "text-on-surface" },
  ]},
  { num: 4, type: "code", parts: [
    { text: "  dsn: ", cls: "text-on-surface-variant" },
    { text: "'https://key@tracelify.io/42'", cls: "text-[#ffafd3]" },
    { text: ",", cls: "text-on-surface-variant" },
  ]},
  { num: 5, type: "code", parts: [
    { text: "  tracesSampleRate: ", cls: "text-on-surface-variant" },
    { text: "1.0", cls: "text-[#ffafd3]" },
  ]},
  { num: 6, type: "code", parts: [{ text: "});", cls: "text-on-surface" }] },
]

const features = [
  {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-primary/10 text-primary",
    title: "Auto-Instrumentation",
    desc: "We automatically hook into Express, Fastify, Prisma, and more.",
  },
  {
    icon: <Cloud className="w-4 h-4" />,
    color: "bg-secondary/10 text-secondary",
    title: "Cloud Native",
    desc: "Built for the modern serverless and edge compute era.",
  },
]

export default function IntegrationSection() {
  return (
    <section className="py-24 bg-surface relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* Terminal window */}
          <div className="flex-1 order-2 lg:order-1 relative">
            <div className="bg-[#0b041a] rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden bento-inner-glow relative z-10">
              {/* Window chrome */}
              <div className="bg-surface-container-low px-4 py-3 flex items-center gap-2 border-b border-outline-variant/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/40 hover:bg-error/70 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-tertiary/40 hover:bg-tertiary/70 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-primary/40 hover:bg-primary/70 transition-colors cursor-pointer" />
                </div>
                <div className="mx-auto text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
                  Terminal — Tracelify Init
                </div>
              </div>

              {/* Code content */}
              <div className="p-8 font-mono text-sm leading-relaxed">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex gap-4 mb-2">
                    {line.type === "cmd" && (
                      <>
                        <span className="text-primary">$</span>
                        <span className="text-on-surface">
                          {line.content[0]}
                          <span className="text-secondary">{line.content[1]}</span>
                        </span>
                      </>
                    )}
                    {line.type === "code" && (
                      <>
                        <span className="text-primary-fixed-dim w-4 shrink-0">{line.num}</span>
                        <span>
                          {line.parts.map((p, j) => (
                            <span key={j} className={p.cls}>{p.text}</span>
                          ))}
                        </span>
                      </>
                    )}
                    {line.type === "empty" && (
                      <>
                        <span className="text-primary-fixed-dim w-4 shrink-0">{line.num}</span>
                        <span>&nbsp;</span>
                      </>
                    )}
                  </div>
                ))}
                {/* Cursor blink */}
                <div className="flex gap-4 mt-2">
                  <span className="text-primary">$</span>
                  <span className="w-2 h-4 bg-primary/70 animate-pulse inline-block" />
                </div>
              </div>
            </div>

            {/* Pop-out character */}
            <div className="absolute -top-10 -right-10 w-44 h-44 z-20 pointer-events-none">
              <img
                alt="Developer character"
                src={CHAR_IMAGE}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Ambient glow */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Text block */}
          <div className="flex-1 order-1 lg:order-2">
            <Badge variant="outline" className="mb-4">Quick Start</Badge>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 leading-tight">
              Get started in{" "}
              <br />
              <span className="text-primary">minutes</span>
            </h2>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
              Five lines of code. That's it. Whether you're running serverless on Vercel
              or a complex Kubernetes cluster, integration is seamless.
            </p>

            <div className="space-y-6 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface mb-1">{f.title}</h4>
                    <p className="text-sm text-on-surface-variant">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="group">
              Read the Docs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
