import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import logo from "@/assets/icons/logo-dark.svg";
import boardIcon from "@/assets/icons/icon-board.svg";
import lightThemeIcon from "@/assets/icons/icon-light-theme.svg";
import darkThemeIcon from "@/assets/icons/icon-dark-theme.svg";
import hideSidebarIcon from "@/assets/icons/icon-hide-sidebar.svg";

interface SidebarProps {
  showSideBar: () => void;
}

export default function Sidebar({ showSideBar }: SidebarProps) {
  return (
    <main className="bg-white w-80 h-screen p-8">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="" />
      </div>

      <div className="mt-10">
        <div>
          <p className="uppercase font-bold text-xs text-lighterBlue">
            all boards (0)
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Image src={boardIcon} alt="" />
            <p className="text-sm text-lighterBlue">Platform Launch</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end h-4/5">
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
    </main>
  );
}
