import { cn } from "@/lib/utils"

function Button({ className, variant = "default", size = "default", asChild = false, children, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-headline font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  
  const variants = {
    default: "bg-gradient-to-br from-primary to-primary-container text-on-primary-container hover:translate-y-[-2px] hover:shadow-lg neon-glow-primary",
    ghost: "glass-panel border border-outline-variant/30 text-primary hover:bg-surface-bright/50",
    outline: "border border-outline-variant text-on-surface hover:bg-surface-container",
    secondary: "bg-secondary text-on-secondary hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    link: "text-primary underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-6 py-2.5",
    sm: "h-8 px-4 text-xs",
    lg: "h-12 px-10 text-base",
    xl: "h-14 px-10 text-lg",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
