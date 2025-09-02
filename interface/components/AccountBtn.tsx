import { CircleUser } from "lucide-react";

export default function AccountBtn() {
  return (
    <button className="flex flex-row items-center gap-x-[10px] cursor-pointer" onClick={() => {}}>
      <CircleUser className="text-primary-subtle size-[35px]" />
      <p className="text-primary-subtle body-regular">Username</p>
    </button>
  );
}