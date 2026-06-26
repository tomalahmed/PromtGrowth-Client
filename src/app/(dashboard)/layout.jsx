"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardShellLayout({ children }) {
  const pathname = usePathname();
  const isCreatorHub = pathname?.startsWith("/creator");
  const isAdminHub = pathname?.startsWith("/admin");
  const isUserHub = pathname?.startsWith("/user");

  if (isCreatorHub || isAdminHub || isUserHub) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col pt-20">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 lg:flex-row lg:px-10">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
