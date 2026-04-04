import { Link } from "react-router-dom"
import { Terminal, Code, Layout, Settings, BookOpen, ChevronRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-24 pb-16 flex flex-col md:flex-row gap-12 mt-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 space-y-8 animate-slide-in-left">
           <div>
              <h4 className="text-xs font-mono text-on-surface-variant/50 uppercase tracking-widest mb-3 px-2">Getting Started</h4>
              <div className="flex flex-col gap-1">
                 <a href="#quick-start" className="px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg flex items-center justify-between">
                    Quick Start
                    <ChevronRight className="w-4 h-4" />
                 </a>
                 <a href="#components" className="px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                    Components
                 </a>
              </div>
           </div>
           
           <div>
              <h4 className="text-xs font-mono text-on-surface-variant/50 uppercase tracking-widest mb-3 px-2">Reference</h4>
              <div className="flex flex-col gap-1">
                 <a href="#configuration" className="px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                    Configuration
                 </a>
                 <a href="#contributing" className="px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                    Contributing
                 </a>
              </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl animate-fade-in-up">
           <div className="mb-12">
              <h1 className="text-4xl font-headline font-bold mb-4">Tracelify Python SDK</h1>
              <p className="text-xl text-on-surface-variant">Effortless Error Tracking and Performance Monitoring for your Python applications.</p>
              
              <div className="flex gap-2 mt-6">
                 <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-surface-container border border-outline-variant/20">v1.2.0</span>
                 <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-surface-container border border-outline-variant/20">Python 3.8+</span>
                 <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-surface-container border border-outline-variant/20">MIT License</span>
              </div>
           </div>

           <div className="space-y-16">
              <section id="quick-start" className="scroll-mt-32">
                 <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-2">
                    <Code className="w-6 h-6 text-primary" /> Quick Start
                 </h2>

                 <div className="space-y-8">
                    <div>
                       <h3 className="text-lg font-medium mb-3">1. Install</h3>
                       <div className="bg-[#120825] border border-outline-variant/30 rounded-lg p-4 font-mono text-sm text-[#cabeff]">
                          pip install tracelify
                       </div>
                    </div>

                    <div>
                       <h3 className="text-lg font-medium mb-3">2. Initialize</h3>
                       <p className="text-on-surface-variant mb-3 text-sm">Initialize the client with your DSN early in your application's entry point:</p>
                       <div className="bg-[#120825] border border-outline-variant/30 rounded-lg p-4 overflow-x-auto">
<pre className="font-mono text-sm leading-relaxed">
  <code className="text-[#ffafd3]">from</code> <span className="text-on-surface">tracelify</span> <code className="text-[#ffafd3]">import</code> <span className="text-[#c5f251]">Client</span>
  <br/><br/>
  <span className="text-[#938ea1] italic"># Initialize the client (automatically captures unhandled exceptions)</span><br/>
  <span className="text-on-surface">client = Client(</span><span className="text-tertiary">"https://your-key@tracelify.io/project-id"</span><span className="text-on-surface">)</span>
</pre>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-lg font-medium mb-3">3. Capture Exceptions Manually</h3>
                       <div className="bg-[#120825] border border-outline-variant/30 rounded-lg p-4 overflow-x-auto">
<pre className="font-mono text-sm leading-relaxed">
  <code className="text-[#ffafd3]">try</code><span className="text-on-surface">:</span><br/>
  {"    "}<span className="text-secondary">1</span> <span className="text-on-surface">/</span> <span className="text-secondary">0</span><br/>
  <code className="text-[#ffafd3]">except</code> <span className="text-[#c5f251]">Exception</span> <code className="text-[#ffafd3]">as</code> <span className="text-on-surface">e:</span><br/>
  {"    "}<span className="text-on-surface">client.capture_exception(e)</span>
</pre>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-lg font-medium mb-3">4. Enrich context</h3>
                       <div className="bg-[#120825] border border-outline-variant/30 rounded-lg p-4 overflow-x-auto">
<pre className="font-mono text-sm leading-relaxed">
  <span className="text-[#938ea1] italic"># Set user context</span><br/>
  <span className="text-on-surface">client.set_user(</span>{"{"}<span className="text-tertiary">"id"</span><span className="text-on-surface">: </span><span className="text-tertiary">"123"</span><span className="text-on-surface">, </span><span className="text-tertiary">"email"</span><span className="text-on-surface">: </span><span className="text-tertiary">"user@example.com"</span>{"}"}<span className="text-on-surface">)</span><br/><br/>
  <span className="text-[#938ea1] italic"># Set custom tags</span><br/>
  <span className="text-on-surface">client.set_tag(</span><span className="text-tertiary">"environment"</span><span className="text-on-surface">, </span><span className="text-tertiary">"production"</span><span className="text-on-surface">)</span><br/><br/>
  <span className="text-[#938ea1] italic"># Add breadcrumbs for debugging</span><br/>
  <span className="text-on-surface">client.add_breadcrumb(</span><span className="text-tertiary">"User clicked 'Submit' button"</span><span className="text-on-surface">)</span>
</pre>
                       </div>
                    </div>
                 </div>
              </section>

              <section id="components" className="scroll-mt-32">
                 <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-2">
                    <Layout className="w-6 h-6 text-primary" /> Components
                 </h2>
                 <ul className="space-y-4">
                    <li className="flex gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2"></span>
                       <div><strong className="text-primary font-mono text-sm">Client:</strong> Main interface to the SDK.</div>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2"></span>
                       <div><strong className="text-primary font-mono text-sm">Config:</strong> Configuration and DSN parsing.</div>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2"></span>
                       <div><strong className="text-primary font-mono text-sm">Scope:</strong> Manages user context, tags, and breadcrumbs.</div>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2"></span>
                       <div><strong className="text-primary font-mono text-sm">Transport:</strong> Sends events asynchronously to the Tracelify server with automatic retries and exponential backoff.</div>
                    </li>
                    <li className="flex gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2"></span>
                       <div><strong className="text-primary font-mono text-sm">Handlers:</strong> Automatic global exception capture for unhandled errors.</div>
                    </li>
                 </ul>
              </section>

              <section id="configuration" className="scroll-mt-32">
                 <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-2">
                    <Settings className="w-6 h-6 text-primary" /> Configuration
                 </h2>
                 <p className="mb-4">The Tracelify SDK is designed to work with minimal configuration. Simply provide a valid DSN:</p>
                 
                 <div className="border border-outline-variant/20 rounded-xl overflow-hidden mt-6">
                    <table className="w-full text-left text-sm">
                       <thead>
                          <tr className="bg-surface-container border-b border-outline-variant/20 font-mono text-on-surface-variant">
                             <th className="px-4 py-3">DSN Part</th>
                             <th className="px-4 py-3">Description</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-outline-variant/10">
                          <tr className="hover:bg-primary/5 transition-colors">
                             <td className="px-4 py-3 font-mono text-tertiary">protocol</td>
                             <td className="px-4 py-3">http or https</td>
                          </tr>
                          <tr className="hover:bg-primary/5 transition-colors">
                             <td className="px-4 py-3 font-mono text-tertiary">key</td>
                             <td className="px-4 py-3">Your public authentication key</td>
                          </tr>
                          <tr className="hover:bg-primary/5 transition-colors">
                             <td className="px-4 py-3 font-mono text-tertiary">host</td>
                             <td className="px-4 py-3">Tracelify server hostname</td>
                          </tr>
                          <tr className="hover:bg-primary/5 transition-colors">
                             <td className="px-4 py-3 font-mono text-tertiary">port</td>
                             <td className="px-4 py-3">Server port (optional)</td>
                          </tr>
                          <tr className="hover:bg-primary/5 transition-colors">
                             <td className="px-4 py-3 font-mono text-tertiary">project_id</td>
                             <td className="px-4 py-3">Your project ID</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>

                 <div className="mt-8 glass-panel p-5 rounded-xl border border-outline-variant/20 inline-flex items-center gap-4 text-sm font-mono flex-wrap">
                    <span className="text-on-surface-variant uppercase tracking-widest text-xs">Example DSN:</span>
                    <span className="text-secondary break-all">https://abcd1234@api.tracelify.io:8080/1</span>
                 </div>
              </section>

           </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
