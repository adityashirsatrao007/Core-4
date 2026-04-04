import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Zap } from "lucide-react"

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUbaNTE7mro5b7JYiqWpp-7V1tAmUGU6jbA-ieaNo1nwyePJ4Tu59zZ6BckoJjZ00u0ENXEO-npTFDHOGzqA8tE27j_H7s8GwlbkpvSMguxORk-6_aljbm9kQI-daDj2h_y1Gnis9BR9MaEWTviT7LDdMYbdQWxsqusMqQ9HZxlHabukzMGrnTtV-sR8RTudWVRCmIa7sr0c3uvIhctFavQMK0Wuk5KFaFAbXunhPNTpyH7-Dz-tgpHC4c5_OSs8oHixgZIzrNizuW"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[120px] animate-float animate-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[150px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(202,190,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(202,190,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Text block */}
        <div className="flex-1 text-center lg:text-left animate-fade-in-up">
          <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            Now in public beta
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold leading-[1.05] tracking-tighter mb-6 text-balance">
            Code breaks,{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-secondary to-secondary-container bg-clip-text text-transparent">
              fix it faster
            </span>
          </h1>

          <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
            Real-time observability and AI-powered root cause analysis for modern
            developer stacks. Eliminate the guesswork of debugging.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button size="xl" className="w-full sm:w-auto group">
              Start Debugging Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" size="xl" className="w-full sm:w-auto group gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                <Play className="w-3 h-3 text-primary fill-primary" />
              </div>
              View Live Demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBqTcSEkPtSFtr4eWSKDe3TfqkN_l8uMnQIcK5CV1oKHYGP1Klv122TOjkCko4ejL4JbbMCi2G_gL_PEXxr4KqcSPxTa4z2OUPBSNbf2kIhHiXIyKtQusm1c1QsK-E1ErYGfrEhnioqfnFGLEzFKxC-GHl34gpYq7SoS8NvqtV8mGKplfDmTMzjl7HCxdqWk8VfmpeDqAN3wzWu8oVsCYSDd-lJaUp-b0TRdDI0DBU52er05E7A0vx_nEbsf934FWdDNcYgc1YYaZEj",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDAYoFCLF13AC2N_PEeopNitwYsZmIyZUwl9tdOUj_jotK0J_PtEVZQIgARkWn-rvnWfbx7nMwiGL1WG2ZV78h-DlfIjOvWqOxX0Vjq714uQbyIxhjYlUwTR73S3IrDOWNnOaZRIh5gEpFLah7DcwJP1u0Kajd0hSMULTDeY3LZlfchgbzF5xPjkkrEKlIg_BPRD7xiS42IOkhCT6kE6nd_JwxYNvTMSEfRBfdRKIPpVCspsVtQ_OKSYW1IM5tAQWyaDVj4V_fwS0Eb",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuABrCYmCGfFX_HNE4_N0E0y6d8_uPAU7wZ-YlyAFU0Og5I7wstiJnS8CsZAGlYaBIEkua5UXuti4k8gH5bgvX0EWnorpb6cZ_-899ilv_nG_OqV-Xf-vNw80-dXdQiG04wcd98EOEXCcKsaSz_qXZ4TRwqkkt8-8qcsR_KJ6xfruN2VHuU3sl3xEt-nuz_NNoHAComqRkPRox86BqfK5IV68undTGfyJhfJ61fiaMQMqbjR6hiwgfqRjqzxe2jeCALMjrDYhV8mDlhN"
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-on-surface-variant">
              <span className="text-on-surface font-semibold">2,400+</span> developers trust Tracelify
            </p>
          </div>
        </div>

        {/* Visual half */}
        <div className="flex-1 relative w-full max-w-[560px] aspect-square animate-fade-in-up animate-delay-200">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Core Glow */}
            <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-glow" />

            {/* Floating — Critical Error panel */}
            <div className="absolute top-0 right-0 glass-panel p-5 rounded-2xl border border-outline-variant/20 shadow-2xl transform rotate-3 -translate-y-8 translate-x-6 max-w-[220px] animate-float animate-delay-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
                <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">Critical Error</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden mb-2">
                <div className="h-full w-4/5 bg-secondary rounded-full" />
              </div>
              <div className="text-[10px] font-mono text-on-surface-variant">
                NullPointerException in AuthService.ts:42
              </div>
            </div>

            {/* Floating — Latency panel */}
            <div className="absolute bottom-10 left-0 glass-panel p-5 rounded-2xl border border-outline-variant/20 shadow-2xl transform -rotate-6 translate-y-8 -translate-x-4 max-w-[260px] animate-float animate-delay-300">
              <div className="text-[10px] font-mono text-tertiary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">query_stats</span>
                Latency Optimization
              </div>
              <div className="flex items-end gap-1 h-10">
                {[40, 65, 100, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-sm transition-all duration-300 ${i === 2 ? "bg-tertiary" : "bg-tertiary/20"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-[10px] font-mono text-tertiary">p95: 42ms ↓ 18%</div>
            </div>

            {/* Central 3D image */}
            <div className="relative z-10 w-full h-full rounded-full border border-primary/10 p-10">
              <img
                alt="3D Digital Core — Tracelify observability platform"
                src={HERO_IMAGE}
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(117,83,255,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface-variant/40 animate-bounce">
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-on-surface-variant/40 to-transparent" />
      </div>
    </section>
  )
}
