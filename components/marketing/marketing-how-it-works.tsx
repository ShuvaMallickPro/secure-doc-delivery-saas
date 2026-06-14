const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up with Clerk and open your SecureDoc dashboard.",
  },
  {
    step: "02",
    title: "Upload a document",
    description: "Send files to encrypted S3 storage with one click.",
  },
  {
    step: "03",
    title: "Share a secure link",
    description: "Generate a token-based URL for each recipient email.",
  },
  {
    step: "04",
    title: "Revoke when done",
    description:
      "Cut access instantly from your dashboard—recipients see a dead link.",
  },
];

export function MarketingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-muted/30 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From upload to revoke in four simple steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <li key={item.step} className="relative">
              <span className="text-4xl font-bold text-primary/20">
                {item.step}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
