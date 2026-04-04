import { cn } from "@/lib/utils"

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20",
    destructive: "bg-error/10 text-error border-error/20",
    outline: "border-outline-variant text-on-surface-variant",
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
