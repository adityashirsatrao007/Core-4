import { Copy, Plus, Trash2 } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-10 animate-fade-in-up">
      <div>
         <h1 className="text-2xl font-headline font-bold mb-1">Project Settings</h1>
         <p className="text-sm text-on-surface-variant">Manage your project configuration and team members.</p>
      </div>

      <section>
         <h2 className="text-lg font-headline font-semibold mb-4 border-b border-outline-variant/20 pb-2">Client Keys (DSN)</h2>
         <div className="glass-panel p-6 rounded-2xl border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant mb-4">
               Your DSN tells the Tracelify SDK where to send events. Keep this key safe.
            </p>
            <div className="flex items-center gap-2 bg-[#120825] border border-outline-variant/30 rounded-lg p-1 max-w-2xl">
               <input 
                  type="text" 
                  readOnly 
                  value="https://abcd1234@api.tracelify.io:8080/1"
                  className="bg-transparent border-none outline-none text-sm font-mono text-primary px-3 py-2 w-full"
               />
               <button className="p-2 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
                  <Copy className="w-4 h-4" />
               </button>
            </div>
         </div>
      </section>

      <section>
         <div className="flex items-center justify-between mb-4 border-b border-outline-variant/20 pb-2">
            <h2 className="text-lg font-headline font-semibold">Team Members</h2>
            <button className="flex items-center gap-2 text-sm text-primary hover:text-primary-container transition-colors font-medium">
               <Plus className="w-4 h-4" />
               Invite Member
            </button>
         </div>
         <div className="glass-panel rounded-2xl border border-outline-variant/20 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-outline-variant/10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
                     <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=7553ff&color=fff" alt="User" />
                  </div>
                  <div>
                     <div className="text-sm font-medium">Jane Doe (You)</div>
                     <div className="text-xs text-on-surface-variant">jane@example.com</div>
                  </div>
               </div>
               <div className="text-xs font-mono uppercase bg-surface-container px-2 py-1 rounded">Owner</div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden opacity-80">
                     <img src="https://ui-avatars.com/api/?name=Alex+Smith&background=39304e&color=fff" alt="User" />
                  </div>
                  <div>
                     <div className="text-sm font-medium">Alex Smith</div>
                     <div className="text-xs text-on-surface-variant">alex@example.com</div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-xs font-mono uppercase bg-surface-container px-2 py-1 rounded outline outline-1 outline-outline-variant/30">Member</div>
                  <button className="text-error hover:text-error/80 transition-colors p-1.5 rounded hover:bg-error/10">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Danger Zone */}
      <section className="mt-12 pt-8 border-t border-error/20">
         <h2 className="text-lg font-headline font-semibold mb-4 text-error">Danger Zone</h2>
         <div className="border border-error/30 rounded-2xl p-6 bg-error/5">
            <h3 className="font-medium text-on-surface mb-1">Delete Project</h3>
            <p className="text-sm text-on-surface-variant mb-4">Once you delete a project, there is no going back. Please be certain.</p>
            <button className="px-4 py-2 bg-error/10 text-error hover:bg-error/20 border border-error/30 rounded-lg text-sm font-medium transition-colors">
               Delete Project
            </button>
         </div>
      </section>
    </div>
  )
}
