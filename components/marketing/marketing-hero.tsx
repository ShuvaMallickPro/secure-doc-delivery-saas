import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MarketingHero({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-liner-to-b from-primary/5 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 border border-primary/20 bg-primary/5 px-3 py-1 text-primary"
          >
            <ShieldCheck className="size-3.5" />
            Revocable access control
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Send documents securely.
            <span className="block text-primary">Revoke access anytime.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            SecureDoc lets professionals share sensitive files with token-based
            links—and cut off access instantly, even after the link was sent.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {signedIn ? (
              <Button asChild size="lg" className="h-11 px-8">
                <Link href="/dashboard">
                  Go to dashboard
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="h-11 px-8">
                  <Link href="/signup">
                    Start free
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-8"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No recipient account required · Private S3 storage · Per-link revoke
          </p>
        </div>
      </div>
    </section>
  );
}
