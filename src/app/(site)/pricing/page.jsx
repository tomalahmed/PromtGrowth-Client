import { Suspense } from "react";
import PricingPageContent from "@/components/pricing/PricingPageContent";
import Spinner from "@/components/ui/Spinner";

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading pricing..." />
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  );
}
