"use client";

import { useSession } from "@/contexts/SessionContext";

export default function WarehousePage() {
  const { user } = useSession();

  // Redirect non-admin users
  if (user && user.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-white mb-6">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">คลังสินค้า</h1>

      <div className="bg-primary-lighter rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">จัดการคลังสินค้า</h2>
        <p className="text-gray-300">
          หน้านี้สำหรับจัดการสินค้าในคลัง - สามารถเพิ่ม/แก้ไข/ลบสินค้า, ตรวจสอบสต็อก, และจัดการคำสั่งซื้อได้
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">สต็อกสินค้า</h3>
            <p className="text-gray-300 mb-4">จัดการปริมาณสินค้าในคลัง</p>
            <button className="bg-primary-default hover:bg-primary-darker text-white px-4 py-2 rounded transition-colors">
              จัดการสต็อก
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">เพิ่มสินค้า</h3>
            <p className="text-gray-300 mb-4">เพิ่มสินค้าใหม่เข้าสู่ระบบ</p>
            <button className="bg-primary-default hover:bg-primary-darker text-white px-4 py-2 rounded transition-colors">
              เพิ่มสินค้า
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">รายงาน</h3>
            <p className="text-gray-300 mb-4">ดูรายงานการขายและสต็อก</p>
            <button className="bg-primary-default hover:bg-primary-darker text-white px-4 py-2 rounded transition-colors">
              ดูรายงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
