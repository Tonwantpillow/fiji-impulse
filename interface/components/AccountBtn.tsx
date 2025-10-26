"use client";

import { CircleUser } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export default function AccountBtn() {
  const { user, setShowLoginModal } = useSession();

  const handleClick = () => {
    if (user) {
      // User is logged in - navigate to account page
      window.location.href = '/account';
    } else {
      // Show login modal for unauthenticated users
      setShowLoginModal(true);
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