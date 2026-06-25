import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-[14px] font-semibold uppercase tracking-wider text-primary-container">
        404
      </p>
      <h1 className="mb-3 text-[32px] font-bold text-primary">Page not found</h1>
      <p className="mb-8 max-w-md text-on-surface-variant">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
