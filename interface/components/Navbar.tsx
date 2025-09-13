"use client";

import Link from "next/link";
import AccountBtn from "./AccountBtn";
import CartBtn from "./CartBtn";
import LogoBtn from "./LogoBtn";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const pages: Record<string, string> = {
    "/": "รายการสินค้า",
    "/order-status": "ติดตามคำสั่งซื้อ",
    "/about": "เกี่ยวกับเรา",
  };

  return (
    <nav className="w-full bg-primary-default p-4 flex justify-between">
      <LogoBtn />

      <div className="flex gap-8 items-center">
        {Object.entries(pages).map(([path, label]) => (
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
        <CartBtn />
        <AccountBtn />
      </div>
    </nav>
  );
}
