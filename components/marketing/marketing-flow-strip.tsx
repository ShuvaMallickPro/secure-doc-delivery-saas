import { Link2, ShieldOff, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    label: "Upload",
    description: "Add PDFs or files to secure storage",
  },
  {
    icon: Link2,
    label: "Share",
    description: "Generate a unique link per recipient",
  },
  {
    icon: ShieldOff,
    label: "Revoke",
    description: "Disable any link instantly",
  },
];

export function MarketingFlowStrip() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6 md:py-14">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className="relative flex flex-col items-center text-center "
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {step.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
