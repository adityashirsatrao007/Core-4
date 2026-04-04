import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Terminal, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
  { label: "Security", href: "#security" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("Features")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[#170e2b]/85 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(23,14,43,0.4)] border-b border-outline-variant/10"
          : "bg-[#170e2b]/70 backdrop-blur-xl"
      )}
    >
      <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">
            Tracelify
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 font-headline text-sm tracking-tight">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveLink(link.label)}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200",
                activeLink === link.label
                  ? "text-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-headline">
            Sign in
          </a>
          <Button size="default" className="text-sm px-5 py-2">
            Launch Console
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-outline-variant/10",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-1 bg-[#170e2b]/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => { setActiveLink(link.label); setMobileOpen(false) }}
              className="px-4 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-headline text-sm"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-outline-variant/10 flex flex-col gap-2">
            <a href="#" className="px-4 py-3 text-sm text-on-surface-variant font-headline">Sign in</a>
            <Button size="default" className="w-full">Launch Console</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
