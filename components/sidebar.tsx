"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import Modal from "./modal";
import BoardForm from "./boardform";
import TaskForm from "./taskform";
import logo from "@/assets/icons/logo-dark.svg";
import boardIcon from "@/assets/icons/icon-board.svg";
import lightThemeIcon from "@/assets/icons/icon-light-theme.svg";
import darkThemeIcon from "@/assets/icons/icon-dark-theme.svg";
import hideSidebarIcon from "@/assets/icons/icon-hide-sidebar.svg";
import { useSupabase } from "@/context/supbasecontext";

interface SidebarProps {
  showSideBar: () => void;
  onBoardSelect: (boardId: string) => void;
}

export default function Sidebar({ showSideBar, onBoardSelect }: SidebarProps) {
  const { supabase } = useSupabase();
  const [isBoardModalVisible, setBoardModalVisible] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const { data, error } = await supabase.from("boards").select("*");
    if (error) {
      console.error("Error fetching boards:", error);
    } else {
      setBoards(data);
    }
  };

  const handleCreateBoard = async (name: string, columns: string[]) => {
    const { data, error } = await supabase
      .from("boards")
      .insert([{ name, columns }]);
    if (error) {
      console.error("Error creating board:", error);
    } else {
      setBoards([...boards, { name, columns }]);
      setBoardModalVisible(false);
    }
  };

  const handleAddTask = (title: string, description: string) => {
    // Add logic to add a new task using Supabase
    console.log("Adding task:", title, description);
    setTaskModalVisible(false);
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
              onClick={() => onBoardSelect(board.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image src={boardIcon} alt="" />
              <p className="text-lighterBlue">{board.name}</p>
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
        <BoardForm onSubmit={handleCreateBoard} />
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
