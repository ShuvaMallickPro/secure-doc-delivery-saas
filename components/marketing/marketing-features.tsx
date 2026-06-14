import { Brain, Eye, Link2Off, Lock, type LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Link2Off,
    title: "Revocable share links",
    description:
      "Each recipient gets a unique link. Revoke one link without affecting others—or restore access when needed.",
  },
  {
    icon: Lock,
    title: "Private cloud storage",
    description:
      "Files stay in your AWS S3 bucket with presigned URLs. No public buckets required.",
  },
  {
    icon: Eye,
    title: "Recipient view page",
    description:
      "Clean, login-free experience with watermark, preview, and secure download.",
  },
  {
    icon: Brain,
    title: "AI document summary",
    description:
      "Optional AI-generated bullet summary so recipients know what they are opening.",
  },
];

export function MarketingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Built for sensitive document delivery
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to share files with confidence—and stay in
            control after send.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base mt-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm ">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
