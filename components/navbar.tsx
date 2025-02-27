import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supbasecontext";
import listIcon from "@/assets/icons/icon-vertical-ellipsis.svg";
import addIcon from "@/assets/icons/icon-add-task-mobile.svg";

export default function Navbar() {
  const { setTaskModalVisible } = useSupabase();

  return (
    <div className="flex items-center justify-between bg-white p-8">
      <h1 className="text-darkGrey font-bold text-2xl">Platform Launch</h1>
      <div className="flex items-center gap-2">
        <Button
          className="rounded-full bg-strongBlue p-2"
          onClick={() => setTaskModalVisible(true)}
        >
          <Image src={addIcon} alt="" />
          Add New Task
        </Button>
        <Image src={listIcon} alt="" />
      </div>
    </div>
  );
}
