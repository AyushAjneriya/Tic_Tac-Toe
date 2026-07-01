import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'neonCyan' | 'neonPurple' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          // Variants
          variant === 'default' && "bg-slate-100 text-slate-900 hover:bg-slate-200",
          variant === 'destructive' && "bg-red-500 text-slate-50 hover:bg-red-600",
          variant === 'outline' && "border border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white",
          variant === 'secondary' && "bg-slate-800 text-slate-100 hover:bg-slate-700",
          variant === 'ghost' && "hover:bg-slate-800 hover:text-slate-100",
          variant === 'neonCyan' && "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]",
          variant === 'neonPurple' && "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-50 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
          variant === 'link' && "text-slate-100 underline-offset-4 hover:underline",
          // Sizes
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-9 rounded-md px-3",
          size === 'lg' && "h-11 rounded-md px-8",
          size === 'icon' && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
