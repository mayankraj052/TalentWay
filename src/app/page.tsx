"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  ArrowRight,
  LayoutDashboard,
  LogIn,
  Code2,
  Video,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-transparent" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-2">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Smart coding interviews, powered by live collaboration
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  TalentWay
                </span>{" "}
                makes hiring developers effortless.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Run structured, real-time coding interviews with built-in video,
                collaborative code editor, and interview recordings – all in one
                place.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Dashboard Button */}
                <SignedIn>
                  <Button size="lg" asChild className="group">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Go to Dashboard
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="lg" className="group flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Go to Dashboard
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignInButton>
                </SignedOut>

                {/* Login Button */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-colors"
                    >
                      <LogIn className="size-4" />
                      Login
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 border-emerald-500/40 text-emerald-500 cursor-default"
                    disabled
                  >
                    <CheckCircle2 className="size-4" />
                    Already logged in
                  </Button>
                </SignedIn>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-card border px-4 py-2 text-sm">
                  <Code2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Live Code Editor</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-card border px-4 py-2 text-sm">
                  <Video className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Video Calls</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-card border px-4 py-2 text-sm">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Smart Scheduling</span>
                </div>
              </div>
            </div>

            {/* Right: Visual Preview Card */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-3xl bg-linear-to-br from-emerald-500/20 via-teal-500/20 to-transparent blur-3xl" />
              <div className="relative rounded-2xl border bg-linear-to-br from-card via-card/95 to-emerald-950/40 p-8 shadow-2xl backdrop-blur-sm">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Upcoming Interview
                    </p>
                    <h3 className="text-2xl font-bold">Senior Frontend Engineer</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    30 min
                  </span>
                </div>

                {/* Card Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Candidate</span>
                    <span className="text-sm font-semibold">Alex Johnson</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="text-sm font-semibold">Today · 4:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Focus Areas</span>
                    <div className="flex gap-1.5">
                      <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        React
                      </span>
                      <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Performance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1" size="sm">
                    Start Interview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need for{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              successful interviews
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your hiring process with powerful tools designed for modern
            technical interviews.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="group relative rounded-xl border bg-card/50 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Coding</h3>
              <p className="text-muted-foreground">
                Built-in collaborative editor for asking real-world coding questions.
                Support for multiple languages with syntax highlighting.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative rounded-xl border bg-card/50 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Feedback</h3>
              <p className="text-muted-foreground">
                Keep all candidate notes and outcomes organized in one place. Share
                insights with your team seamlessly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative rounded-xl border bg-card/50 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recordings</h3>
              <p className="text-muted-foreground">
                Rewatch interviews and share insights with your team. Never miss
                important details from candidate conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-transparent p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform your hiring process?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of companies using TalentWay to conduct better technical
              interviews.
            </p>
            <div className="flex justify-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" asChild className="group">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
