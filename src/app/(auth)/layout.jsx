import AuthBackButton from "@/components/auth/AuthBackButton";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-background via-surface to-primary-container/5 p-4 antialiased md:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <AuthBackButton />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
