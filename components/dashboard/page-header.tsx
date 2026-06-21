import { cn } from "@/lib/utils";

const headingSizes = {
  page: "text-2xl font-semibold tracking-tight",
  section: "text-lg font-semibold tracking-tight",
} as const;

type PageHeadingProps = React.ComponentPropsWithoutRef<"h2"> & {
  size?: keyof typeof headingSizes;
};

export function PageHeading({
  className,
  size = "page",
  ...props
}: PageHeadingProps) {
  return (
    <h2
      className={cn("text-foreground", headingSizes[size], className)}
      {...props}
    />
  );
}

type PageDescriptionProps = React.ComponentPropsWithoutRef<"p">;

export function PageDescription({ className, ...props }: PageDescriptionProps) {
  return (
    <p
      className={cn("max-w-2xl text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  headingSize?: keyof typeof headingSizes;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  headingSize = "page",
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <PageHeading size={headingSize}>{title}</PageHeading>
      {description ? <PageDescription>{description}</PageDescription> : null}
      {children}
    </div>
  );
}
