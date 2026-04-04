import { cn } from "@/lib/utils"

const Card = ({ className, ...props }) => (
  <div
    className={cn("rounded-3xl border border-outline-variant/10 bg-surface-container-low text-on-surface shadow-sm bento-inner-glow", className)}
    {...props}
  />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-8", className)} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-headline font-bold text-2xl leading-none tracking-tight", className)} {...props} />
)

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-on-surface-variant leading-relaxed", className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-8 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-8 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
