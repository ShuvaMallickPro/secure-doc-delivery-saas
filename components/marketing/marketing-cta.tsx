import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingCta({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to share documents on your terms?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join professionals who need post-send control—not just another file
            link.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {signedIn ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get started free
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
