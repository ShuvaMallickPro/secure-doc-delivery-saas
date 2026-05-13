import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          SecureDoc — access your dashboard
        </p>
      </div>
      <SignIn routing="path" path="/login" signUpUrl="/signup" />
      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
