"use client";

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useSupabase } from "@/context/supbasecontext";
import Modal from "./modal";
import BoardForm from "./boardform";
import TaskForm from "./taskform";
import logo from "@/assets/icons/logo-dark.svg";
import boardIcon from "@/assets/icons/icon-board.svg";
import lightThemeIcon from "@/assets/icons/icon-light-theme.svg";
import darkThemeIcon from "@/assets/icons/icon-dark-theme.svg";
import hideSidebarIcon from "@/assets/icons/icon-hide-sidebar.svg";

interface SidebarProps {
  showSideBar: () => void;
  onBoardSelect: (boardId: string) => void;
}

export default function Sidebar({ showSideBar, onBoardSelect }: SidebarProps) {
  const {
    boards,
    isBoardModalVisible,
    isTaskModalVisible,
    setBoardModalVisible,
    setTaskModalVisible,
  } = useSupabase();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const handleAddTask = (title: string, description: string) => {
    // Add logic to add a new task using Supabase
    console.log("Adding task:", title, description);
    setTaskModalVisible(false);
  };

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId);
    onBoardSelect(boardId);
  };

  return (
    <main className="bg-white w-80 h-screen p-8">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="" />
      </div>

      <div className="mt-10">
        <div>
          <p className="uppercase font-bold text-xs text-lighterBlue">
            all boards ({boards.length})
          </p>
        </div>

        <div className="space-y-6 mt-8">
          {boards.map((board, index) => (
            <div
              key={index}
              onClick={() => handleBoardSelect(board.id)}
              className={`flex items-center gap-2 cursor-pointer ${
                selectedBoardId === board.id
                  ? "bg-strongBlue p-2 -ml-8 px-8 rounded-full rounded-tl-none rounded-bl-none"
                  : ""
              }`}
            >
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                  fill={`${
                    selectedBoardId === board.id ? "#FFFFFF" : "#828FA3"
                  }`}
                />
              </svg>

              <p
                className={`${
                  selectedBoardId === board.id
                    ? "text-white"
                    : "text-lighterBlue"
                }`}
              >
                {board.name}
              </p>
            </div>
          ))}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setBoardModalVisible(true)}
          >
            <Image src={boardIcon} alt="" />
            <p className="text-strongBlue font-bold">+ Create New Board</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end h-3/5">
        <div className="flex items-center justify-center gap-4 bg-lightPurple rounded-md p-4">
          <Image src={lightThemeIcon} alt="" />
          <Switch />
          <Image src={darkThemeIcon} alt="" />
        </div>

        <div
          className="flex items-center gap-1 mt-4 cursor-pointer"
          onClick={showSideBar}
        >
          <Image src={hideSidebarIcon} alt="" />
          <p className="text-lighterBlue">Hide Sidebar</p>
        </div>
      </div>

      <Modal
        isVisible={isBoardModalVisible}
        onClose={() => setBoardModalVisible(false)}
      >
        <BoardForm />
      </Modal>

      <Modal
        isVisible={isTaskModalVisible}
        onClose={() => setTaskModalVisible(false)}
      >
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </main>
  );
}
