"use client";

import { CircleUser } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export default function AccountBtn() {
  const { user, logout, setShowLoginModal } = useSession();

  const handleClick = () => {
    if (user) {
      // User is logged in - you could show a dropdown menu here
      // For now, just logout on click
      logout();
    } else {
      // Navigate to login page instead of showing modal
      window.location.href = '/login';
    }
  };

  return (
    <button
      className="flex flex-row items-center gap-x-[10px] cursor-pointer"
      onClick={handleClick}
    >
      <CircleUser className="text-primary-subtle size-[35px]" />
      <p className="text-primary-subtle body-regular">
        {user ? user.username : "เข้าสู่ระบบ"}
      </p>
    </button>
  );
}