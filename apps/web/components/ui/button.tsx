import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-full bg-primary-container text-on-primary-container border-b-4 border-primary-dark shadow-lg shadow-primary-container/20 hover:animate-pulse hover:brightness-105 active:translate-y-1 active:border-b-0",
        secondary:
          "rounded-full bg-transparent text-navy border-2 border-navy/20 hover:bg-navy/5 active:translate-y-0.5",
        destructive:
          "rounded-full bg-red-500 text-white border-b-4 border-red-700 shadow-lg active:translate-y-1 active:border-b-0",
        ghost:
          "rounded-full text-navy hover:bg-navy/5",
      },
      size: {
        default: "px-8 py-3 text-base",
        sm: "px-5 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
