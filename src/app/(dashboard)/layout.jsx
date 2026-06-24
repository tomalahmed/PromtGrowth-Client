import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function DashboardShellLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col pt-20">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
