"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import LoginInput from "@/components/LoginInput";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login, user, isLoading } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const success = await login(username, password);
      if (!success) {
        setError("ชื่อผู้ใช้หรับรหัสผ่านไม่ถูกต้อง");
      }
      // Redirect will happen automatically via useEffect when user state updates
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If user is authenticated, useEffect will handle redirect
  // Only show login form if user is not authenticated
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[485px] bg-primary-lighter p-[50px] rounded-[16px] shadow-lg">
        <h2 className="header2-bold text-center mb-[26px] text-white">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
          <LoginInput
            prompt="ชื่อผู้ใช้ / Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          <LoginInput
            prompt="รหัสผ่าน / Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100 bg-opacity-20 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="text-white bg-[#3B4B6D] hover:bg-primary-default rounded-[16px] w-full h-[46px] text-center disabled:opacity-50 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="flex flex-col items-center">
            <div className="flex gap-[20px] items-center">
              <p className="text-white">ไม่มีรหัสสมาชิก ?</p>
              <Link
                href="/register"
                className="text-blue-400 underline hover:text-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                สมัครเลย
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}