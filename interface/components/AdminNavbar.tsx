"use client";

import Link from "next/link";
import AccountBtn from "./AccountBtn";
import LogoBtn from "./LogoBtn";
import { usePathname } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

export default function AdminNavbar() {
  const pathname = usePathname();
  const { user } = useSession();

  const adminPages: Record<string, string> = {
    "/order-list": "รายการคำสั่งซื้อ",
  };

  // Only show admin navbar if user is admin
  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <nav className="w-full bg-primary-default p-4 flex justify-between">
      <LogoBtn />

      <div className="flex gap-8 items-center">
        {Object.entries(adminPages).map(([path, label]) => (
          <Link
            key={path}
            href={path}
            className={
              pathname === path
                ? "body-bold text-white"
                : "body-regular text-white"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-x-[10px]">
        {/* Admin navbar doesn't have cart - only account button */}
        <AccountBtn />
      </div>
    </nav>
  );
}