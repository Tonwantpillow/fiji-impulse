"use client";

import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import LoginInput from "./LoginInput";
import Link from "next/link";

export default function LoginModal() {
  const { login, setShowLoginModal, showLoginModal } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(username, password);
    if (!success) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowLoginModal(false);
    }
  };

  // Don't render anything if modal shouldn't be shown
  if (!showLoginModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-primary-lighter rounded-[16px] w-[485px] max-w-[90%] p-[50px] relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          disabled={isLoading}
        >
          ×
        </button>

        <h2 className="header2-bold text-center mb-[26px] text-white">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
          <LoginInput
            prompt="ชื่อผู้ใช้ / Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <LoginInput
            prompt="รหัสผ่าน / Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="text-white bg-[#3B4B6D] rounded-[16px] w-full h-[46px] text-center disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="flex flex-col items-center">
            <div className="flex gap-[20px]">
              <p>ไม่มีรหัสสมาชิก ?</p>
              <Link href="/register" className="text-white underline">
                สมัครเลย
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
