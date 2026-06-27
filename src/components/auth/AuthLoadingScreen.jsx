import Spinner from "@/components/ui/Spinner";

export default function AuthLoadingScreen({
  title = "PromptGrowth",
  message = "Loading your session...",
}) {
  return (
    <main className="auth-fade-in mx-auto flex w-full max-w-[440px] flex-col items-center justify-center py-16 text-center">
      <p className="mb-2 text-[28px] font-bold tracking-tight text-primary">{title}</p>
      <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
        {message}
      </p>
      <Spinner size="lg" label="" />
      <p className="mt-6 text-[13px] text-outline">{message}</p>
    </main>
  );
}
