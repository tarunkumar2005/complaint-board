import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST!;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASS!;
const from = process.env.FROM_EMAIL!;

if (!host || !user || !pass) {
  console.warn("SMTP config missing. Emails will fail.");
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!host || !user || !pass) {
    console.warn("SMTP not configured, skipping email");
    return;
  }

  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`✅ Email sent to ${to}`);
  } catch (error: any) {
    // Handle rate limit errors gracefully
    if (error.responseCode === 550 || error.code === "EENVELOPE") {
      console.warn(
        `⚠️  Email rate limit reached for ${to}. Email skipped.`
      );
      console.warn(
        "💡 Tip: Upgrade Mailtrap plan or use a different SMTP service"
      );
    } else {
      console.error(`❌ Failed to send email to ${to}:`, error.message);
    }
    // Don't throw error - allow the request to continue
  }
}