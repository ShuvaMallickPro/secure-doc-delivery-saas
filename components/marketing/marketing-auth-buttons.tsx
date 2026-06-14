import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingAuthButtons({
  signedIn,
  size = "default",
}: {
  signedIn: boolean;
  size?: "default" | "lg";
}) {
  if (signedIn) {
    return (
      <Button asChild size={size}>
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size={size}>
        <Link href="/login">Sign in</Link>
      </Button>
      <Button asChild size={size}>
        <Link href="/signup">Get started</Link>
      </Button>
    </>
  );
}
