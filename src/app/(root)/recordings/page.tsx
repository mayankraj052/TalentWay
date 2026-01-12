"use client";
import LoaderUi from "@/components/LoaderUi";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const RecordingPage = () => {
  const { calls, isLoading } = useGetCalls();

  const [recording, setRecording] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        //get recording for each call
        const callData = await Promise.all(
          calls.map((call) => call.queryRecordings())
        );
        const allRecordings = callData.flatMap((call) => call.recordings);

        setRecording(allRecordings);
      } catch (error) {
        console.error("Error Fetching recording:", error);
      }
    };
    fetchRecordings();
  }, [calls]);

  if (isLoading) return <LoaderUi />;
  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Header section */}
      <h1 className="text-3xl font-bold">Recordings</h1>
      <p className="text-muted-foreground my-1">
        {recording.length}
        {recording.length === 1 ? "recording" : "recordings"} available
      </p>

      {/* Recording Grid */}
      <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
        {recording.length > 0 ? (
          <div className="">
            {recording.map((r) => (
              <RecordingCard key={r.end_time} recording={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-100 gap-4">
            <p className="text-xl font=medium text-muted-foreground">
              No Recording available
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecordingPage;
