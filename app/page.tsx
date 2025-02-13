"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import addIcon from "@/assets/icons/icon-add-task-mobile.svg";
import logo from "@/assets/icons/logo-dark.svg";
import openSidebar from "@/assets/icons/icon-show-sidebar.svg";

export default function Home() {
  const [sideBar, setSideBar] = useState(false);

  const showSideBar = () => {
    setSideBar(!sideBar);
  };

  return (
    <main className="bg-lightPurple flex h-screen">
      {sideBar && <Sidebar showSideBar={showSideBar} />}

      {!sideBar && (
        <div className="flex flex-col justify-between h-4/5">
          <div className="bg-white p-9">
            <Image src={logo} alt="" />
          </div>
          <div
            className="bg-strongBlue rounded-full w-fit p-3 rounded-tl-none rounded-bl-none cursor-pointer"
            onClick={showSideBar}
          >
            <Image src={openSidebar} alt="" />
          </div>
        </div>
      )}

      <div className="w-full">
        <Navbar />

        <div className="mx-auto w-fit items-center flex flex-col h-4/5 justify-center">
          <p className="text-lighterBlue font-bold text-lg">
            This board is empty. Create a new column to get started.
          </p>
          <Button className="rounded-full bg-strongBlue p-2 mx-auto">
            <Image src={addIcon} alt="" />
            Add New Column
          </Button>
        </div>
      </div>
    </main>
  );
}
