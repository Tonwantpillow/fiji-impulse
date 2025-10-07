"use client";

import AddedProduct from "@/interface/components/AddedProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WareHouse() {
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [cfState, setCfState] = useState<"cf" | "rj">();
  
  useEffect(() => {
    dialogRef.current?.close();
  }, []);
  
  return (
    <div className="p-[10px]">
      <dialog ref={dialogRef} className="px-[200px] py-[50px] rounded-[5px] bg-primary-lighter backdrop:bg-black/50"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      open={false}
      >
        <div className="w-[300px] h-[150px]">
          {cfState === "cf" ? (
            <p className="header3-bold text-center text-white">ยืนยันการอนุมัติหรือไม่</p>
          ) : cfState === "rj" ? (
            <p className="header3-bold text-center text-white">ยืนยันการปฏิเสธหรือไม่</p>
          ) : null}
              <div className="flex justify-center items-center gap-[10px] px-[16px] py-[9px]">
                {
                  cfState === "cf" ? (
                    <button className="rounded-[5px] bg-[#84EF5A] w-[100px] p-[10px] flex justify-center items-center text-[#498830]">ยืนยัน</button>
                  ) : cfState === "rj" ? (
                    <button className="rounded-[5px] bg-[#EF5A84] w-[100px] p-[10px] text-white flex justify-center items-center">ปฏิเสธ</button>
                  ) : null
                }
                <button className="rounded-[5px] bg-white w-[100px] p-[10px] flex justify-center items-center"
                  onClick={(e) => {
                    dialogRef.current?.close();
                  }}
                >
                  ยกเลิก
                </button>
              </div>
        </div>
      </dialog>
      <div className="flex p-[10px] gap-[50px] items-center">
        <button className="flex justify-center items-center">
          <ChevronLeft className="size-[30px]" />
        </button>
        <div className="flex gap-[10px]">
          <p className="header3-bold">รายละเอียดคำสั่งซื้อ</p>
          <div className="flex items-center justify-center">
            <ChevronRight />
          </div>
          <p className="header3-bold">000-000-000</p>
        </div>
      </div>
      <div className="flex gap-[10px]">
        <div className="flex flex-col w-full h-screen overflow-scroll">
          {Array.from({ length: 10 }).map((_, index) => (
            <AddedProduct key={index} />
          ))}
        </div>
        <div className="flex flex-col gap-[10px] p-[27px] w-full items-center">
          <div className="flex gap-[10px]">
            <p className="header3-bold">ราคารวม</p>
            <p className="header3-bold text-primary-default">100000.00</p>
            <p className="header3-bold">บาท</p>
          </div>
          <div className="size-[500px] border-[1px]">{/* สลิป */}</div>
          <div className="flex w-full gap-[10px] justify-center items-center">
            <button
              className="w-[100px] rounded-[5px] bg-[#EF5A84] text-white body-regular flex items-center justify-center p-[10px] cursor-pointer"
              onClick={() => {
                setCfState("rj");
                dialogRef.current?.showModal();
              }}
            >
              ปฏิเสธ
            </button>
            <button
              className="w-[100px] rounded-[5px] bg-[#84EF5A] text-[#498830] body-regular flex items-center justify-center p-[10px] cursor-pointer"
              onClick={() => {
                setCfState("cf");
                dialogRef.current?.showModal();
              }}
            >
              อนุมัติ
            </button>
          </div>
        </div>
      </div>
      {isApprove ? (
        <div className="pt-[67px] px-[10px]">
          <div className="pl-[100px] py-[10px]">
            <p className="header3-bold">ตรวจสอบสินค้าและวัสดุ</p>
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-[10px] p-[10px]">
              <div className="flex flex-col gap-[10px] border-[1px] rounded-[5px] p-[10px] w-full">
                <p className="header3-bold text-center">สินค้าที่ต้องใช้</p>
                <div>
                  <AddedProduct />
                  <AddedProduct />
                </div>
              </div>
              <div className="flex flex-col gap-[10px] border-[1px] rounded-[5px] p-[10px] w-full">
                <p className="header3-bold text-center">ส่วนประกอบที่ต้องใช้</p>
                <div>
                  <AddedProduct />
                  <AddedProduct />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button className="px-50 py-[20px] bg-[#498830] rounded-[5px] text-white cursor-pointer">
                ยืนยันการตรวจสอบและเริ่มผลิต
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
