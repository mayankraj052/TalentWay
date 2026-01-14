"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CodeIcon } from "lucide-react";
import Link from "next/link";
import DashboardBtn from "./DashboardBtn";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Left side logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font:mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            TalentWay
          </span>
        </Link>
        {/* Right side action */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <DashboardBtn />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
        {isLandingPage && (
          <SignedOut>
            <div className="flex items-center space-x-4 ml-auto">
              <ModeToggle />
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
