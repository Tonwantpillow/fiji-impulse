"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginInput from "@/components/LoginInput";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8081/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.status === 200 && response.data === "Register Successfully") {
        setSuccess(true);
        // Store user data and redirect after successful registration
        const userData: User = {
          id: response.data.user?.id || response.data.id,
          username: response.data.user?.username || response.data.username,
          email: response.data.user?.email || response.data.email,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError("การสมัครสมาชิกล้มเหลว กรุณาลองใหม่");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 409) {
          setError("ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว");
        } else if (status === 400) {
          setError(data.message || "ข้อมูลไม่ถูกต้อง");
        } else if (status === 500) {
          setError("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง");
        } else {
          setError("การสมัครสมาชิกล้มเหลว กรุณาลองใหม่");
        }
      } else if (error.request) {
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ");
      } else {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[485px] h-[400px] bg-primary-lighter rounded-[16px] p-[50px] flex flex-col items-center justify-center">
          <h2 className="header2-bold text-white text-center mb-4">สมัครสมาชิกสำเร็จ!</h2>
          <p className="text-white text-center mb-4">ยินดีต้อนรับ {formData.username}</p>
          <p className="text-white text-center">กำลังนำท่านไปยังหน้าหลัก...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[485px] h-[600px] bg-primary-lighter rounded-[16px] p-[50px] flex flex-col gap-[26px]">
        <h2 className="header2-bold text-white text-center">สมัครสมาชิก</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
          <LoginInput
            prompt="ชื่อผู้ใช้ / Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <LoginInput
            prompt="อีเมล / Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <LoginInput
            prompt="รหัสผ่าน / Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <LoginInput
            prompt="ยืนยันรหัสผ่าน / Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-20 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="text-white bg-[#3B4B6D] rounded-[16px] w-full h-[46px] text-center disabled:opacity-50 hover:bg-[#2C3A52] transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>

          <div className="flex flex-col items-center">
            <div className="flex gap-[20px]">
              <p className="text-white">มีรหัสสมาชิกอยู่แล้ว ?</p>
              <Link href="/login" className="text-blue-400 underline hover:text-blue-300 transition-colors">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}