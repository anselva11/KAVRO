import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-500 shadow-sm active:bg-primary-700 focus-visible:ring-primary-500",
      secondary:
        "bg-navy-800 text-slate-200 hover:bg-navy-700 hover:text-white border border-slate-700/60 focus-visible:ring-slate-500",
      outline:
        "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-white focus-visible:ring-slate-400",
      ghost:
        "bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white focus-visible:ring-slate-400",
      danger:
        "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-9 px-4 text-sm rounded-lg",
      lg: "h-11 px-6 text-base rounded-lg",
      icon: "h-9 w-9 p-0 flex items-center justify-center rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
