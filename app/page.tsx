import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();

  return (
    <>
      <div className=" border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto max-w-7xl flex justify-between items-center p-4 ">
          <h2 className="text-2xl font-bold text-primary">SecureDoc</h2>
          <nav className="flex gap-8 text-primary text-base  font-semibold ">
            <Link href="/" className="">
              Home
            </Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {userId ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-medium text-primary">SecureDoc</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Secure document delivery
          </h1>
          <p className="mt-4 text-muted-foreground">
            Share files with revocable links. Sign in to open your dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {userId ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
