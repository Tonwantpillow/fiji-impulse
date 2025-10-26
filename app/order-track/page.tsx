import FilterHeader from "@/interface/components/FilterHeader";
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react";

export default function OrderList() {
  return (
    <div className="flex flex-col m-10 gap-[10px]">
      {/* search bar + title */}
      <div className="flex gap-[20px]">
        <div className="bg-gray-300 p-[10px] w-[400px] h-[50px] rounded-xl flex gap-[5px] justify-center items-center">
          <SearchIcon />
          <div className="w-full">ค้นหา...</div>
        </div>
        <div className="w-full flex items-center">
          <h4 className="header4-bold">รายการคำสั่งซื้อ</h4>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <FilterHeader
          title="ออร์เดอร์ทั้งหมด"
          qnty={10}
          textcolor="primary-default"
          boxcolor="primary-lighter"
        />
        <FilterHeader
          title="กำลังเตรียมสินค้า"
          qnty={4}
          textcolor="#8B7131"
          boxcolor="#FADCA3"
        />
        <FilterHeader
          title="กำลังจัดส่ง"
          qnty={99}
          textcolor="primary-darker"
          boxcolor="primary-default"
        />
        <FilterHeader
          title="สำเร็จแล้ว"
          qnty={5}
          textcolor="#498830"
          boxcolor="#84EF5A"
        />
        <button className="p-[10px] rounded-[5px] bg-[#EFC55A] text-white w-[130px]">
          สถานะก่อนหน้า
        </button>
        <button className="p-[10px] rounded-[5px] bg-[#498830] text-white w-[130px]">
          สถานะถัดไป
        </button>
      </div>
      <div className="w-full h-full flex flex-col">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-center rounded-l-xl">
                เลขออร์เดอร์
              </th>
              <th className="px-4 py-2 text-center">ชื่อสินค้า</th>
              <th className="px-4 py-2 text-center">ชื่อผู้สั่ง</th>
              <th className="px-4 py-2 text-center rounded-r-xl">สถานะ</th>
            </tr>
          </thead>
          <tbody className="h-full bg-red-500">
            <tr className="h-full">
              <td colSpan={4} className="text-center text-white">
                ไม่มีข้อมูล
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full border-t-gray-300 border-t-[1px] flex items-center justify-center gap-[10px] p-[20px]">
        <button className="w-[30px] h-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          <ChevronLeft/>
        </button>
        <button className="size-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center"></button>
        <button className="w-[30px] h-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          <ChevronRight/>
        </button>
      </div>
    </div>
  );
}
