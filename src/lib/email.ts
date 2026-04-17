import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface InterviewEmailParams {
  to: string;
  recipientName: string;
  recipientRole: "interviewer" | "candidate";
  interviewTitle: string;
  interviewDescription?: string;
  dateTime: string; // formatted date/time string
  meetingLink: string;
}

export async function sendInterviewEmail({
  to,
  recipientName,
  recipientRole,
  interviewTitle,
  interviewDescription,
  dateTime,
  meetingLink,
}: InterviewEmailParams) {
  const isInterviewer = recipientRole === "interviewer";

  const roleLabel = isInterviewer ? "Interviewer" : "Candidate";
  const roleColor = isInterviewer ? "#10b981" : "#6366f1";
  const greeting = isInterviewer
    ? `You have been assigned as an interviewer for an upcoming interview.`
    : `You have been scheduled for an upcoming interview.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%); padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700; letter-spacing:-0.5px;">
                TalentWay
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px; font-weight:400;">
                Interview Scheduling Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              
              <!-- Role Badge -->
              <div style="margin-bottom:24px;">
                <span style="display:inline-block; background-color:${roleColor}; color:#ffffff; font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
                  ${roleLabel}
                </span>
              </div>

              <!-- Greeting -->
              <h2 style="margin:0 0 8px; color:#18181b; font-size:22px; font-weight:600;">
                Hi ${recipientName},
              </h2>
              <p style="margin:0 0 24px; color:#71717a; font-size:15px; line-height:1.6;">
                ${greeting}
              </p>

              <!-- Interview Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border:1px solid #e4e4e7; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="margin:0 0 16px; color:#18181b; font-size:18px; font-weight:600;">
                      ${interviewTitle}
                    </h3>
                    ${
                      interviewDescription
                        ? `<p style="margin:0 0 16px; color:#52525b; font-size:14px; line-height:1.5;">${interviewDescription}</p>`
                        : ""
                    }
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:24px;">
                          <p style="margin:0 0 4px; color:#a1a1aa; font-size:12px; text-transform:uppercase; font-weight:600; letter-spacing:0.5px;">
                            📅 Date & Time
                          </p>
                          <p style="margin:0; color:#18181b; font-size:15px; font-weight:500;">
                            ${dateTime}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${meetingLink}" 
                       style="display:inline-block; background:linear-gradient(135deg, #10b981, #14b8a6); color:#ffffff; font-size:16px; font-weight:600; text-decoration:none; padding:14px 40px; border-radius:10px; letter-spacing:0.3px;">
                      Join Meeting
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p style="margin:0; color:#a1a1aa; font-size:13px; text-align:center; word-break:break-all;">
                Or copy this link: <a href="${meetingLink}" style="color:#10b981;">${meetingLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa; padding:24px 40px; border-top:1px solid #e4e4e7; text-align:center;">
              <p style="margin:0; color:#a1a1aa; font-size:12px;">
                This is an automated notification from TalentWay.
              </p>
              <p style="margin:4px 0 0; color:#a1a1aa; font-size:12px;">
                Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: `"TalentWay" <${process.env.GMAIL_USER}>`,
      to,
      subject: `Interview Scheduled: ${interviewTitle}`,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
}
