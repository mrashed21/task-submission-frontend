import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950/20",
  {
    variants: {
      variant: {
        default:
          "bg-[#1877f2] text-white border-transparent font-semibold shadow-xs",
        secondary:
          "bg-[#e7f3ff] text-[#1877f2] border-[#cbe4fc] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] dark:border-[#1877f2]/30",
        success:
          "bg-[#e7f8ea] text-[#1f7a1f] border-[#c2eec7] dark:bg-[#42b72a]/20 dark:text-[#42b72a] dark:border-[#42b72a]/30",
        warning:
          "bg-[#fff8e5] text-[#b28900] border-[#ffe8a3] dark:bg-[#f7b125]/20 dark:text-[#f7b125] dark:border-[#f7b125]/30",
        destructive:
          "bg-[#fde8e8] text-[#c81e1e] border-[#f8b4b4] dark:bg-[#e41e3f]/20 dark:text-[#e41e3f] dark:border-[#e41e3f]/30",
        outline:
          "bg-transparent text-[#050505] border-[#ced0d4] dark:text-[#e4e6eb] dark:border-[#3a3b3c]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
