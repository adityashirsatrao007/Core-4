import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqTcSEkPtSFtr4eWSKDe3TfqkN_l8uMnQIcK5CV1oKHYGP1Klv122TOjkCko4ejL4JbbMCi2G_gL_PEXxr4KqcSPxTa4z2OUPBSNbf2kIhHiXIyKtQusm1c1QsK-E1ErYGfrEhnioqfnFGLEzFKxC-GHl34gpYq7SoS8NvqtV8mGKplfDmTMzjl7HCxdqWk8VfmpeDqAN3wzWu8oVsCYSDd-lJaUp-b0TRdDI0DBU52er05E7A0vx_nEbsf934FWdDNcYgc1YYaZEj",
    name: "Sarah Chen",
    role: "CTO at VelocityIO",
    roleColor: "text-primary",
    borderColor: "border-primary",
    quote: "Tracelify saved our production launch. We found a race condition in minutes that we'd been hunting for weeks.",
    stars: 5,
  },
  {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAYoFCLF13AC2N_PEeopNitwYsZmIyZUwl9tdOUj_jotK0J_PtEVZQIgARkWn-rvnWfbx7nMwiGL1WG2ZV78h-DlfIjOvWqOxX0Vjq714uQbyIxhjYlUwTR73S3IrDOWNnOaZRIh5gEpFLah7DcwJP1u0Kajd0hSMULTDeY3LZlfchgbzF5xPjkkrEKlIg_BPRD7xiS42IOkhCT6kE6nd_JwxYNvTMSEfRBfdRKIPpVCspsVtQ_OKSYW1IM5tAQWyaDVj4V_fwS0Eb",
    name: "Marcus Thorne",
    role: "Senior Dev at CloudScale",
    roleColor: "text-secondary",
    borderColor: "border-secondary",
    quote: "The UI is a breath of fresh air. It feels like a high-end dashboard rather than just another boring SaaS tool.",
    stars: 5,
  },
  {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuABrCYmCGfFX_HNE4_N0E0y6d8_uPAU7wZ-YlyAFU0Og5I7wstiJnS8CsZAGlYaBIEkua5UXuti4k8gH5bgvX0EWnorpb6cZ_-899ilv_nG_OqV-Xf-vNw80-dXdQiG04wcd98EOEXCcKsaSz_qXZ4TRwqkkt8-8qcsR_KJ6xfruN2VHuU3sl3xEt-nuz_NNoHAComqRkPRox86BqfK5IV68undTGfyJhfJ61fiaMQMqbjR6hiwgfqRjqzxe2jeCALMjrDYhV8mDlhN",
    name: "Elena Rodriguez",
    role: "SRE at GlobalStack",
    roleColor: "text-tertiary",
    borderColor: "border-tertiary",
    quote: "The AI root cause analysis is scarily accurate. It's like having a senior engineer looking over your shoulder 24/7.",
    stars: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-container-low/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Social Proof</Badge>
          <h2 className="text-3xl md:text-4xl font-headline font-bold uppercase tracking-widest text-primary-container">
            Loved by developers worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-panel p-8 rounded-3xl border border-outline-variant/10 relative group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-tertiary fill-tertiary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-on-surface-variant italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  alt={`Avatar of ${t.name}`}
                  src={t.avatar}
                  className={cn("w-11 h-11 rounded-full border-2 object-cover shrink-0", t.borderColor)}
                />
                <div>
                  <h4 className="font-bold text-on-surface">{t.name}</h4>
                  <p className={cn("text-xs uppercase tracking-wider", t.roleColor)}>
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Decorative quote mark */}
              <div className="absolute top-4 right-6 text-6xl text-primary/5 font-serif leading-none select-none pointer-events-none">
                "
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "2,400+", label: "Developers" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<50ms", label: "Avg latency" },
            { value: "4.9 ★", label: "Rating" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
