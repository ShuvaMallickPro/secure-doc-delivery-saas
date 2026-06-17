import { auth } from "@clerk/nextjs/server";
import { MarketingCta } from "@/components/marketing/marketing-cta";

export const dynamic = "force-dynamic";
import { MarketingFeatures } from "@/components/marketing/marketing-features";
import { MarketingFlowStrip } from "@/components/marketing/marketing-flow-strip";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingHowItWorks } from "@/components/marketing/marketing-how-it-works";

export default async function Home() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingHeader signedIn={signedIn} />
      <main className="flex-1">
        <MarketingHero signedIn={signedIn} />
        <MarketingFlowStrip />
        <MarketingFeatures />
        <MarketingHowItWorks />
        <MarketingCta signedIn={signedIn} />
      </main>
      <MarketingFooter />
    </div>
  );
}
