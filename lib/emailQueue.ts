import { sendMail } from "./mailer";

interface EmailJob {
  to: string;
  subject: string;
  html: string;
}

class EmailQueue {
  private queue: EmailJob[] = [];
  private processing = false;
  private delayBetweenEmails = 1500; // 1.5 seconds between emails (safe for most SMTP)

  /**
   * Add email to queue
   */
  add(to: string, subject: string, html: string) {
    this.queue.push({ to, subject, html });
    console.log(`📧 Email queued for ${to} (Queue size: ${this.queue.length})`);

    // Start processing if not already processing
    if (!this.processing) {
      this.process();
    }
  }

  /**
   * Add multiple emails to queue
   */
  addBatch(emails: EmailJob[]) {
    this.queue.push(...emails);
    console.log(`📧 ${emails.length} emails queued (Queue size: ${this.queue.length})`);

    if (!this.processing) {
      this.process();
    }
  }

  /**
   * Process queue - send emails one by one with delay
   */
  private async process() {
    if (this.processing) return;

    this.processing = true;
    console.log("🚀 Email queue processing started...");

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;

      try {
        await sendMail(job.to, job.subject, job.html);
        console.log(`✅ Email sent to ${job.to}`);
      } catch (error: any) {
        console.error(`❌ Failed to send email to ${job.to}:`, error.message);
      }

      // Wait before sending next email (rate limiting)
      if (this.queue.length > 0) {
        console.log(`⏳ Waiting ${this.delayBetweenEmails}ms before next email...`);
        await this.delay(this.delayBetweenEmails);
      }
    }

    this.processing = false;
    console.log("✅ Email queue processing completed");
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
    };
  }

  /**
   * Set delay between emails (in milliseconds)
   */
  setDelay(ms: number) {
    this.delayBetweenEmails = ms;
    console.log(`⚙️  Email delay set to ${ms}ms`);
  }
}

// Singleton instance
export const emailQueue = new EmailQueue();

/**
 * Helper function to send email to user
 */
export async function sendEmailToUser(
  userEmail: string,
  subject: string,
  html: string
) {
  emailQueue.add(userEmail, subject, html);
}

/**
 * Helper function to send email to all admins
 */
export async function sendEmailToAllAdmins(subject: string, html: string) {
  try {
    const Admin = (await import("@/models/Admin")).default;
    const admins = await Admin.find({}, "email");

    if (admins.length === 0) {
      console.warn("⚠️  No admins found in database");
      return;
    }

    // Queue all admin emails
    const emails = admins.map((admin) => ({
      to: admin.email,
      subject,
      html,
    }));

    emailQueue.addBatch(emails);
    console.log(`📧 Queued emails for ${admins.length} admin(s)`);
  } catch (error) {
    console.error("Failed to queue admin emails:", error);
  }
}
