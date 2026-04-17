import { sendInterviewEmail } from "@/lib/email";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface Recipient {
  email: string;
  name: string;
  role: "interviewer" | "candidate";
}

interface SendEmailRequest {
  interviewTitle: string;
  interviewDescription?: string;
  dateTime: string;
  streamCallId: string;
  recipients: Recipient[];
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SendEmailRequest = await request.json();
    const { interviewTitle, interviewDescription, dateTime, streamCallId, recipients } = body;

    if (!interviewTitle || !dateTime || !streamCallId || !recipients?.length) {
      return NextResponse.json(
        { error: "Missing required fields: interviewTitle, dateTime, streamCallId, recipients" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const meetingLink = `${appUrl}/meeting/${streamCallId}`;

    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        sendInterviewEmail({
          to: recipient.email,
          recipientName: recipient.name,
          recipientRole: recipient.role,
          interviewTitle,
          interviewDescription,
          dateTime,
          meetingLink,
        })
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => r.reason?.message || "Unknown error");
      console.error("Some emails failed to send:", errors);
    }

    return NextResponse.json({
      success: true,
      sent: succeeded,
      failed,
      total: recipients.length,
    });
  } catch (error) {
    console.error("Error in send-email route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
