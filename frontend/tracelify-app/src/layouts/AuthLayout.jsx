import { Link, Outlet } from "react-router-dom"
import { Terminal, Copy, Check } from "lucide-react"

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#170e2b] flex overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-float animate-delay-300" />
      </div>

      {/* Left side text / visual */}
      <div className="hidden lg:flex w-1/2 p-12 flex-col justify-between relative z-10">
        <Link className="flex items-center gap-2 group w-max" to="/">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">
            Tracelify
          </span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-4xl font-headline font-bold mb-4 leading-tight">
            Code breaks,<br />
            <span className="text-secondary">fix it faster.</span>
          </h2>
          <p className="text-on-surface-variant mb-8 text-lg">
            Identify root causes of errors in seconds, no logging required. Now in public beta.
          </p>
          
          <div className="glass-panel p-5 rounded-2xl border border-outline-variant/20 mb-8 max-w-[320px]">
            <div className="text-[11px] font-mono text-tertiary mb-2 flex items-center gap-2 opacity-80 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shrink-0" />
              Real-time feed
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-error rounded-full"></div>
                 <div>
                    <div className="text-xs font-mono">ReferenceError: b is not defined</div>
                    <div className="text-[10px] text-on-surface-variant pt-0.5">user_controller.py:126</div>
                 </div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                 <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                 <div>
                    <div className="text-xs font-mono">Database timeout (5000ms)</div>
                    <div className="text-[10px] text-on-surface-variant pt-0.5">db_connection.py:44</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-on-surface-variant/60">
          © {new Date().getFullYear()} Tracelify Inc. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 z-10 relative">
        <div className="w-full max-w-sm glass-panel p-8 sm:p-10 rounded-2xl border border-outline-variant/20 shadow-2xl relative">
          <Link className="flex lg:hidden items-center gap-2 group w-max mx-auto mb-8" to="/">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent font-headline">
              Tracelify
            </span>
          </Link>
          
          <Outlet />

        </div>
      </div>
    </div>
  )
}
