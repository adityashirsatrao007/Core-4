import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* ─── tiny helpers ─────────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ─── 3-D tilt card ─────────────────────────────────────────────── */
function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = clamp(((e.clientX - left) / width - 0.5) * 28, -14, 14);
    const y = clamp(((e.clientY - top) / height - 0.5) * -28, -14, 14);
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.18s ease-out", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ─── animated counter ──────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = to / 60;
      const id = setInterval(() => {
        start += step;
        if (start >= to) { setVal(to); clearInterval(id); }
        else setVal(Math.floor(start));
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── floating orb ──────────────────────────────────────────────── */
function Orb({ style }) {
  return (
    <div
      className="absolute rounded-full blur-[120px] opacity-30 pointer-events-none"
      style={style}
    />
  );
}

/* ─── SDK code snippet ──────────────────────────────────────────── */
const PY_CODE = `from tracelify.client import Tracelify

sdk = Tracelify(dsn="http://<key>@host/api/<project>/events")
sdk.set_user({"id": "user_42", "email": "alice@acme.com"})
sdk.add_breadcrumb("Checkout started")

try:
    process_payment(order)          # 💥 crashes here
except Exception as e:
    sdk.capture_exception(e)        # ✅ captured instantly`;

const JAVA_CODE = `Tracelify sdk = new Tracelify(
    "http://<key>@host/api/<project>/events", "1.0.0");
sdk.setUser(Map.of("id", "user_42"));
sdk.addBreadcrumb("Checkout started");

try { processPayment(order); }
catch (Exception e) { sdk.captureException(e); }`;

const CPP_CODE = `tracelify::Tracelify sdk(
    "http://<key>@host/api/<project>/events", "1.0.0");
sdk.set_user({{"id", "user_42"}});
sdk.add_breadcrumb("Checkout started");
try { process_payment(order); }
catch (std::exception& e) { sdk.capture_exception(e); }`;

const TABS = [
  { label: "Python", code: PY_CODE, color: "#4f8ef7" },
  { label: "Java",   code: JAVA_CODE, color: "#f7894f" },
  { label: "C++",    code: CPP_CODE, color: "#a855f7" },
];

function CodeBlock() {
  const [active, setActive] = useState(0);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d14]">
      {/* tab bar */}
      <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/10">
        {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
          <span key={i} className="w-3 h-3 rounded-full" style={{background:c}} />
        ))}
        <div className="ml-4 flex gap-1">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                active === i ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
              style={active === i ? { background: t.color + "33", color: t.color } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* code */}
      <pre className="p-5 text-[13px] leading-6 text-green-300 font-mono overflow-x-auto min-h-[200px]">
        <code>{TABS[active].code}</code>
      </pre>
    </div>
  );
}

/* ─── feature card ──────────────────────────────────────────────── */
const FEATURES = [
  { icon: "⚡", title: "Async Non-Blocking SDKs", desc: "Background thread pools + batching queues. Zero impact on your app's performance." },
  { icon: "🌍", title: "3 Native SDKs", desc: "Python, Java, C++ — each compiled for peak performance in their ecosystem." },
  { icon: "🔐", title: "RBAC & Multi-Tenant", desc: "Fine-grained roles: Global Admin, Project Manager, Developer. Data never bleeds across teams." },
  { icon: "🗄️", title: "Postgres Full-Text Search", desc: "GIN-indexed stack traces + fingerprint grouping. Sub-millisecond query latency at scale." },
  { icon: "📦", title: "Published Packages", desc: "pip install tracelify-sdk · Maven GitHub Packages · CMake FetchContent." },
  { icon: "🔔", title: "Smart Alerts", desc: "Email & webhook triggers on new issues or volume spikes. Never miss a FATAL crash." },
];

/* ─── main component ─────────────────────────────────────────────── */
export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#05050f] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Outfit', system-ui, sans-serif" }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      {/* ── dynamic cursor glow ───────────────────────── */}
      <div
        className="fixed pointer-events-none z-0 rounded-full blur-[140px] opacity-20 transition-all duration-300"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, #7c3aed, #3b82f6)",
          left: mousePos.x - 250, top: mousePos.y - 250,
        }}
      />

      {/* ── background orbs ───────────────────────────── */}
      <Orb style={{ width: 600, height: 600, background: "#7c3aed", top: -200, left: -200 }} />
      <Orb style={{ width: 500, height: 500, background: "#3b82f6", top: 200, right: -150 }} />
      <Orb style={{ width: 400, height: 400, background: "#a855f7", bottom: 100, left: "40%" }} />

      {/* ── grid overlay ──────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md bg-[#05050f]/80 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold shadow-lg">⚡</div>
          <span style={{ fontFamily: "'Outfit', sans-serif" }} className="text-lg font-bold tracking-tight text-white">Tracelify</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#sdks" className="hover:text-white transition-colors">SDKs</a>
          <a href="#stats" className="hover:text-white transition-colors">Scale</a>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">Sign in</Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-20">
        {/* badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Production-Grade Error Tracking — v1.0.0 Live
        </div>

        {/* headline */}
        <h1
          style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.04em", lineHeight: 1.08 }}
          className="text-6xl md:text-8xl font-black mb-6 max-w-5xl"
        >
          <span className="text-white">Catch Every</span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Crash
          </span>
          <br />
          <span className="text-white">Before Users Do</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
          Centralized log aggregation & crash analytics across <strong className="text-white/80 font-medium">Python, Java, and C++</strong> — with async SDKs, RBAC, full-text search, and real-time alerting.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link
            to="/signup"
            className="group px-8 py-4 rounded-2xl text-base font-bold text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
          >
            Start Tracking Free
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </Link>
          <a
            href="#sdks"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-white/80 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            View SDKs
          </a>
        </div>

        {/* ── 3D hero card ───────────────────── */}
        <div className="w-full max-w-3xl">
          <TiltCard className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1f] to-[#080810] shadow-2xl shadow-violet-950/50 overflow-hidden">
            {/* terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-white/30 font-mono">tracelify dashboard — live events</span>
            </div>
            {/* mock event */}
            <div className="p-5 space-y-3 font-mono text-xs md:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 font-bold mt-0.5">●</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-red-300 font-semibold">ZeroDivisionError</span>
                    <span className="text-white/30 text-xs">just now</span>
                  </div>
                  <div className="text-white/50 mt-1 truncate">division by zero — checkout.py:42</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px]">user_42</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">Production</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px]">tracelify.python</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-70">
                <span className="text-yellow-400 font-bold mt-0.5">●</span>
                <div>
                  <span className="text-yellow-300 font-semibold">ArithmeticException</span>
                  <div className="text-white/40 mt-1">/ by zero — Order.java:108</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-40">
                <span className="text-blue-400 font-bold mt-0.5">●</span>
                <div>
                  <span className="text-blue-300 font-semibold">std::runtime_error</span>
                  <div className="text-white/40 mt-1">payment.cpp:67</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section id="stats" className="relative z-10 py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { val: 99, suffix: ".9%", label: "Uptime SLA" },
            { val: 3, suffix: " SDKs", label: "Native Languages" },
            { val: 50, suffix: "ms", label: "Ingest Latency" },
            { val: 1000000, suffix: "+", label: "Events / day" },
          ].map(({ val, suffix, label }) => (
            <div key={label}>
              <div
                style={{ fontFamily: "'Outfit', sans-serif", background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                className="text-4xl md:text-5xl font-black mb-1"
              >
                <Counter to={val} suffix={suffix} />
              </div>
              <div className="text-white/40 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }} className="text-4xl md:text-5xl font-black text-white mb-4">
              Built for Engineering Teams
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Everything a distributed team needs to ship with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <TiltCard key={f.title} className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm overflow-hidden group hover:border-violet-500/40 transition-colors">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 70%)" }} />
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SDK CODE ═══════════════ */}
      <section id="sdks" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }} className="text-4xl md:text-5xl font-black text-white mb-4">
              5 Lines. Any Language.
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Drop our SDK in and your app is crash-monitored. Async, non-blocking, battle-tested.</p>
          </div>
          <TiltCard>
            <CodeBlock />
          </TiltCard>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-sm font-mono">pip install tracelify-sdk</span>
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-sm font-mono">&lt;artifactId&gt;tracelify-sdk&lt;/artifactId&gt;</span>
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-sm font-mono">FetchContent_Declare(tracelify_sdk)</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ ARCHITECTURE ═══════════════ */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }} className="text-4xl md:text-5xl font-black text-white mb-4">
            Engineered to Scale
          </h2>
          <p className="text-white/40 text-lg mb-16 max-w-xl mx-auto">FastAPI + PostgreSQL (GIN indexed) + Redis pub-sub + async background workers.</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm">
            {["SDK (Python/Java/C++)", "→", "POST /api/{project}/events", "→", "Redis Queue", "→", "Worker", "→", "PostgreSQL", "→", "Dashboard"].map((item, i) => (
              item === "→" ? (
                <span key={i} className="text-violet-500 text-xl hidden md:block">→</span>
              ) : (
                <div key={i} className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 font-mono text-xs whitespace-nowrap">
                  {item}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative z-10 py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl border border-violet-500/20 p-16"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2), rgba(5,5,15,0.9))" }}
          >
            <h2 style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }} className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Ship Fearlessly?
            </h2>
            <p className="text-white/40 text-lg mb-10">Join teams catching crashes before users do.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold text-white shadow-2xl shadow-violet-500/40 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-white/25 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px]">⚡</div>
          <span style={{ fontFamily: "'Outfit', sans-serif" }} className="font-semibold text-white/40">Tracelify</span>
        </div>
        Built for the 36-hour Hackathon · Python · Java · C++ · FastAPI · PostgreSQL · Redis
      </footer>
    </div>
  );
}
