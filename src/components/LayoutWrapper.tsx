"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Navbar from "./Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const isLandingPage = pathname === "/";

  // If user is on landing page and already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn && isLandingPage) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, isLandingPage, router]);

  // Landing page is public - no auth required
  if (isLandingPage) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
    );
  }

  // All other routes require authentication
  return (
    <>
      <SignedIn>
        <div className="min-h-screen">
          <Navbar />
          <main className="px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn afterSignInUrl="/dashboard" />
      </SignedOut>
    </>
  );
}
