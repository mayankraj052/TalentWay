"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";

export default function Home() {
  const router = useRouter();

  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);

  const [showModel, setShowModel] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModel(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModel(true);
        break;
      default:
        router.push(`/${title.toLocaleLowerCase()}`);
    }
  };

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome section */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          {" "}
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidate effectively"
            : "Access your upcoming interviews and preperations"}
        </p>
      </div>
      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action, index) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>
          <MeetingModal
            isOpen={showModel}
            onClose={() => setShowModel(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType==="join"}
          />
        </>
      ) : (
        <>
          <div className=""> candidate view go here</div>
        </>
      )}
    </div>
  );
}
