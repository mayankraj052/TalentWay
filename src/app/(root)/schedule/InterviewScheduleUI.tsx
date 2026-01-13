import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import toast from "react-hot-toast";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

const InterviewScheduleUI = () => {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00 AM",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const getAvailableTimeSlots = () => {
    return TIME_SLOTS;
  };

  const handleTimeSelect = (selectedTime: string) => {
    // Check if selected time is valid for today
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();

    if (isToday) {
      const time24h = convertTo24Hour(selectedTime);
      const [hours, minutes] = time24h.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      const now = new Date();

      if (slotTime <= now) {
        toast.error("This time slot is not available. Please select a future time.");
        return;
      }
    }

    setFormData({ ...formData, time: selectedTime });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setFormData({ ...formData, date });

    // Check if today is selected and no slots available
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();

    if (isToday) {
      const availableSlots = TIME_SLOTS.filter((slot) => {
        const time24h = convertTo24Hour(slot);
        const [hours, minutes] = time24h.split(":").map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime > new Date();
      });

      if (availableSlots.length === 0) {
        toast.error("No available slots for today. Please select next day.");
      }
    }
  };

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and  at least one interviewer");
      return;
    }

    // Validate that the selected date and time is in the future
    const time24h = convertTo24Hour(formData.time);
    const [hours, minutes] = time24h.split(":").map(Number);
    const meetingDateTime = new Date(formData.date);
    meetingDateTime.setHours(hours, minutes, 0, 0);
    const now = new Date();

    if (meetingDateTime <= now) {
      toast.error("Please select a future date and time for the meeting");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const time24h = convertTo24Hour(time);
      const [hours, minutes] = time24h.split(":").map(Number);
      const meetingDate = new Date(date);
      meetingDate.setHours(hours, minutes, 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00 AM",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewer = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewer = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* Header info */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews
          </p>
        </div>
        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Schedule Interviews</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-125 h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interviews</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Interview Title */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium
                "
                >
                  Title
                </label>
                <Input
                  placeholder="Interview Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* interviewer description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Interview description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Candidate */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(candidateId) =>
                    setFormData({ ...formData, candidateId })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem
                        key={candidate.clerkId}
                        value={candidate.clerkId}
                      >
                        <UserInfo user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interviewers */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedInterviewer.map((interviewer) => (
                    <div key={interviewer.clerkId} className="">
                      <UserInfo user={interviewer} />
                      {interviewer.clerkId !== user?.id && (
                        <button
                          onClick={() => removeInterviewer(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <XIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {availableInterviewer.length > 0 && (
                  <Select onValueChange={addInterviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterviewer.map((interviewer) => (
                        <SelectItem
                          key={interviewer.clerkId}
                          value={interviewer.clerkId}
                        >
                          <UserInfo user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Date & Time */}
              <div className="flex gap-4">
                {/* Calender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={handleTimeSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimeSlots().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Action Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/*Loading State & Meeting Card  */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No interviews schedule
        </div>
      )}
    </div>
  );
};

export default InterviewScheduleUI;
