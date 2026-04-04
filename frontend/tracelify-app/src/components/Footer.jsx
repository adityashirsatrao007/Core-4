import { Button } from "@/components/ui/button"
import { Terminal, ArrowRight, Code2, MessageCircle, Briefcase } from "lucide-react"

const footerLinks = [
  { label: "Documentation", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Security", href: "#" },
  { label: "Status", href: "#" },
  { label: "Privacy", href: "#" },
]

const socialLinks = [
  { icon: <Code2 className="w-4 h-4" />, href: "#", label: "GitHub" },
  { icon: <MessageCircle className="w-4 h-4" />, href: "#", label: "Twitter" },
  { icon: <Briefcase className="w-4 h-4" />, href: "#", label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-[#170e2b] border-t border-[#7553ff]/15">
      {/* CTA Banner */}
      <div className="border-b border-[#7553ff]/10">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            Ready to debug{" "}
            <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
              smarter?
            </span>
          </h2>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
            Join 2,400+ developers who already ship faster with Tracelify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="text-primary font-bold text-xl font-headline">Tracelify</span>
            </div>
            <p className="text-[#c9c3d8]/60 text-sm leading-relaxed font-body">
              The observability platform for developers who demand depth, speed, and precision.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/20"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#c9c3d8]/60 hover:text-secondary transition-colors font-body text-sm uppercase tracking-widest hover:translate-x-1 transition-transform duration-200 inline-block"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#c9c3d8]/40 text-xs font-mono uppercase tracking-tighter">
            © {new Date().getFullYear()} Tracelify. Engineered for the Void.
          </div>
          <div className="flex gap-4 text-xs text-[#c9c3d8]/40">
            <a href="#" className="hover:text-on-surface-variant transition-colors">Terms</a>
            <a href="#" className="hover:text-on-surface-variant transition-colors">Privacy</a>
            <a href="#" className="hover:text-on-surface-variant transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
