'use client'

import Link from "next/link";
import AccountBtn from "./AccountBtn";
import CartBtn from "./CartBtn";
import LogoBtn from "./LogoBtn";

export default function Navbar() {
    return (
        <nav className="w-full bg-primary-default  p-4 flex justify-between">
            <LogoBtn/>
            <div className="w-200 flex justify-evenly items-center">
                <Link href={"/order-status"} className="body-regular text-white">รายการสินค้า</Link>
                <p className="body-regular text-white">ติดตามคำสั่งซื้อ</p>
                <p className="body-regular text-white">บริการช่วยเหลือ</p>
                <p className="body-regular text-white">เกี่ยวกับเรา</p>
            </div>
            <div className="flex items-center gap-x-[10px]">
                <CartBtn/>
                <AccountBtn/>
            </div>
            
        </nav>
        
    )
}