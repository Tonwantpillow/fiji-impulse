import TextFieldForm from "@/interface/components/TextFieldForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
      <div className="w-[485px] h-[560px] bg-primary-lighter flex flex-col py-[30px] px-[50px] gap-[26px] rounded-[16px]">
        <h2 className="header2-bold text-white text-center">เข้าสู่ระบบ</h2>
        <div className="flex flex-col gap-[22px]">
          <TextFieldForm prompt="ชื่อผู้ใช้ / Username"/>
          <TextFieldForm prompt="รหัสผ่าน / Password"/>
        </div>
        <div>
          <button className="text-white bg-[#3B4B6D] rounded-[16px] w-full h-[46px] text-center">
            เข้าสู่ระบบ
          </button>
        </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-[20px]">
              <p className="text-white">ไม่มีรหัสสมาชิก ?</p>
              <Link href="/register" className="text-blue-400 underline">
                สมัครเลย
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}