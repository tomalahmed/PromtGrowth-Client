"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import CreatorSidebar from "@/components/dashboard/creator/CreatorSidebar";
import { motion } from "framer-motion";

export default function CreatorHubShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f9f0] via-surface-container-low/50 to-white pt-20">
      <Navbar />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8 lg:py-10">
        <CreatorSidebar />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
