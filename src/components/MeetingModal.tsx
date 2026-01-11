import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface MeetingModalprops {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({
  isOpen,
  onClose,
  title,
  isJoinMeeting,
}: MeetingModalprops) {
  const [meetingUrl, setMeetingUrl] = useState("");

  const createMeeting = async () => {};

  const joinMeeting = async () => {};

  const handleStart = () => {};
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className="spaace-y-4 pt-4">
            {isJoinMeeting && (
              <Input
                placeholder="paste meeting link here..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleStart}
                disabled={isJoinMeeting && !meetingUrl.trim()}
              >
                {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingModal;
