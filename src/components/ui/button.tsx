import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 dark:focus-visible:ring-zinc-300/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#1877f2] text-white shadow-sm hover:bg-[#166fe5] dark:bg-[#1877f2] dark:hover:bg-[#166fe5] active:scale-[0.98] font-semibold",
        destructive:
          "bg-[#e41e3f] text-white shadow-sm hover:bg-[#c91834] active:scale-[0.98] font-semibold",
        success:
          "bg-[#42b72a] text-white shadow-sm hover:bg-[#36a420] active:scale-[0.98] font-semibold",
        outline:
          "border border-[#ced0d4] bg-white text-[#050505] hover:bg-[#f0f2f5] dark:border-[#3a3b3c] dark:bg-[#242526] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]",
        secondary:
          "bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:hover:bg-[#4e4f50] font-semibold",
        ghost:
          "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]",
        link: "text-[#1877f2] dark:text-[#2d88ff] underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
