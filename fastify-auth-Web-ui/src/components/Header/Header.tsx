"use client";

import Link from "next/link";
import ThemeToggleButton from "../ui/ThemeToggleButton";
import LogoutBtn from "./LogoutBtn";
import { usePathname } from "next/navigation";

const Header = ({ appName }: { appName: string }) => {
  const pathName = usePathname();

  if (pathName === "/auth/login" || pathName === "/auth/register") {
    return <></>;
  }

  return (
    <header
      className="fixed w-full border-b shadow"
      aria-label="app-header"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <h1
          className="text-2xl font-semibold"
          aria-label="App Name"
        >
          {appName}
        </h1>

        <nav className="flex items-center gap-4">
          <Link href={"/"}>Home</Link>

          <LogoutBtn />

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
