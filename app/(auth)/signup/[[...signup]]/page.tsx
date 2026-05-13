import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          SecureDoc — start sharing securely
        </p>
      </div>
      <SignUp routing="path" path="/signup" signInUrl="/login" />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
