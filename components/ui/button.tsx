import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "rounded-lg border border-transparent bg-clip-padding",
    "text-sm font-medium tracking-tight whitespace-nowrap",
    "outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out",
    "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:not-aria-[haspopup]:scale-[0.98]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm shadow-primary/20",
          "hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25",
          "active:shadow-sm",
          "dark:shadow-primary/10 dark:hover:shadow-primary/15",
        ].join(" "),
        outline: [
          "border-border/80 bg-background text-foreground",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
          "hover:border-border hover:bg-muted/60 hover:shadow-sm",
          "dark:border-input dark:bg-background/80 dark:shadow-none dark:hover:bg-muted/40",
        ].join(" "),
        secondary: [
          "border border-transparent bg-secondary text-secondary-foreground",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
          "hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_4%)] hover:shadow-sm",
          "dark:shadow-none",
        ].join(" "),
        ghost: [
          "text-foreground/80",
          "hover:bg-muted/70 hover:text-foreground",
          "dark:hover:bg-muted/50",
        ].join(" "),
        destructive: [
          "border border-destructive/15 bg-destructive/10 text-destructive",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] shadow-destructive/10",
          "hover:border-destructive/25 hover:bg-destructive/15 hover:shadow-sm",
          "focus-visible:ring-destructive/25",
          "dark:border-destructive/25 dark:bg-destructive/15 dark:hover:bg-destructive/25",
        ].join(" "),
        link: [
          "h-auto p-0 text-primary underline-offset-4",
          "shadow-none hover:underline active:scale-100",
        ].join(" "),
      },
      size: {
        default:
          "h-9 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3.5 text-[0.8125rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 rounded-lg px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
