"use client";

import { useSession } from "@/contexts/SessionContext";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, logout, setShowLoginModal, isLoading } = useSession();

  // Redirect to login modal if user is not authenticated (only after loading is complete)
  useEffect(() => {
    // Only redirect if we've finished loading and user is not authenticated
    if (!isLoading && !user) {
      setShowLoginModal(true);
      // Redirect to home page after showing modal
      setTimeout(() => {
        window.location.href = '/';
      }, 2000); // Give user time to see the modal
    }
  }, [user, isLoading, setShowLoginModal]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กำลังตรวจสอบสถานะ...</div>
      </div>
    );
  }

  // Don't render account page if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กรุณาเข้าสู่ระบบ...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col px-[10px] gap-[10px]">
      <div className="py-[10px]">
        <h1 className="header1-bold">บัญชีผู้ใช้</h1>
      </div>
      <div className="flex gap-[10px]">
        <p className="header4-regular text-primary-default">ชื่อผู้ใข้ / Username : </p>
        <p className="header4-regular">{user.username}</p>
      </div>
      <div className="flex gap-[10px]">
        <p className="header4-regular text-primary-default">อีเมล / Email : </p>
        <p className="header4-regular">{user.email}</p>
      </div>
      <div className="flex gap-[10px]">
        <p className="header4-regular text-primary-default">ตำแหน่ง / Role :</p>
        <p className="header4-regular">{user.role}</p>
      </div>
      <div>
        <button className="bg-[#EF5A84] px-[17px] py-[10px] flex justify-center items-center rounded-[8px] cursor-pointer"
          onClick={()=>{
            handleLogout();
          }}
        >
          <p className="text-white header4-bold">Logout</p>
        </button>
      </div>
    </div>
  );
}