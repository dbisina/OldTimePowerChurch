import { Resend } from 'resend';
import { type Sermon, type Announcement, type Subscriber } from '@shared/schema';

if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY environment variable. Email features will be disabled.");
}

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');
const FROM_EMAIL = 'Old Time Power Church <updates@oldtimepower.com>'; // Update this when you have a domain
// For testing/development without a verified domain, use 'onboarding@resend.dev'
const TEST_FROM_EMAIL = 'onboarding@resend.dev';

// Helper to determine which email to use
const getFromEmail = () => {
    return process.env.NODE_ENV === 'production' ? FROM_EMAIL : TEST_FROM_EMAIL;
};

export class EmailService {
    async sendNewSermonNotification(sermon: Sermon, subscribers: Subscriber[]) {
        if (!process.env.RESEND_API_KEY) return false;

        // Filter active subscribers
        const activeSubscribers = subscribers.filter(s => s.status === 'active');

        if (activeSubscribers.length === 0) return true;

        // Send in batches to avoid rate limits if list is huge (not needed for small lists)
        try {
            // For now, we'll send individually to personalize the unsubscribe link
            // In production with large lists, you'd use Broadcasts or Audiences
            const emailPromises = activeSubscribers.map(subscriber => {
                const unsubscribeLink = `${process.env.App_URL || 'http://localhost:5000'}/api/unsubscribe/${subscriber.unsubscribeToken}`;

                return resend.emails.send({
                    from: getFromEmail(),
                    to: subscriber.email,
                    subject: `New Sermon: ${sermon.title}`,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>New Sermon Available</h1>
              <h2>${sermon.title}</h2>
              <p>Preached by: ${sermon.preacher}</p>
              <p>Date: ${new Date(sermon.date).toLocaleDateString()}</p>
              
              ${sermon.thumbnailUrl ? `<img src="${sermon.thumbnailUrl}" style="max-width: 100%; border-radius: 8px;" alt="Sermon Thumbnail" />` : ''}
              
              <p>${sermon.excerpt || 'A new sermon has been posted to our website.'}</p>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.App_URL || 'http://localhost:5000'}/sermons/${sermon.slug}" style="background-color: #b5621b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Watch Now</a>
              </div>
              
              <hr style="border: 1px solid #eee; margin: 40px 0 20px;" />
              <p style="font-size: 12px; color: #666;">
                You are receiving this email because you subscribed to updates from Old Time Power Church.
                <br />
                <a href="${unsubscribeLink}">Unsubscribe</a>
              </p>
            </div>
          `
                });
            });

            await Promise.all(emailPromises);
            console.log(`Sent new sermon notification to ${activeSubscribers.length} subscribers`);
            return true;
        } catch (error) {
            console.error("Failed to send sermon emails:", error);
            return false;
        }
    }

    async sendNewAnnouncementNotification(announcement: Announcement, subscribers: Subscriber[]) {
        if (!process.env.RESEND_API_KEY) return false;

        const activeSubscribers = subscribers.filter(s => s.status === 'active');
        if (activeSubscribers.length === 0) return true;

        try {
            const emailPromises = activeSubscribers.map(subscriber => {
                const unsubscribeLink = `${process.env.App_URL || 'http://localhost:5000'}/api/unsubscribe/${subscriber.unsubscribeToken}`;

                return resend.emails.send({
                    from: getFromEmail(),
                    to: subscriber.email,
                    subject: `New Announcement: ${announcement.title}`,
                    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>New Announcement</h1>
              <h2>${announcement.title}</h2>
              
              ${announcement.graphicUrl ? `<img src="${announcement.graphicUrl}" style="max-width: 100%; border-radius: 8px;" alt="Announcement Graphic" />` : ''}
              
              <div style="margin: 20px 0; line-height: 1.6;">
                ${announcement.contentHtml || 'Please visit our website for details.'}
              </div>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.App_URL || 'http://localhost:5000'}/announcements" style="background-color: #b5621b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Announcements</a>
              </div>
              
              <hr style="border: 1px solid #eee; margin: 40px 0 20px;" />
              <p style="font-size: 12px; color: #666;">
                <a href="${unsubscribeLink}">Unsubscribe</a>
              </p>
            </div>
          `
                });
            });

            await Promise.all(emailPromises);
            console.log(`Sent new announcement notification to ${activeSubscribers.length} subscribers`);
            return true;
        } catch (error) {
            console.error("Failed to send announcement emails:", error);
            return false;
        }
    }

    async sendWelcomeEmail(subscriber: Subscriber) {
        if (!process.env.RESEND_API_KEY) return false;

        try {
            const unsubscribeLink = `${process.env.App_URL || 'http://localhost:5000'}/api/unsubscribe/${subscriber.unsubscribeToken}`;

            await resend.emails.send({
                from: getFromEmail(),
                to: subscriber.email,
                subject: "Welcome to Old Time Power Church Updates",
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome, ${subscriber.name}!</h1>
            <p>Thank you for subscribing to updates from Old Time Power Church. You will now receive notifications when we post new sermons or important announcements.</p>
            
            <p>If you have any questions, feel free to reply to this email.</p>
            
            <p>Blessings,<br />The Old Time Power Church Team</p>
            
            <hr style="border: 1px solid #eee; margin: 40px 0 20px;" />
            <p style="font-size: 12px; color: #666;">
              <a href="${unsubscribeLink}">Unsubscribe</a>
            </p>
          </div>
        `
            });
            return true;
        } catch (error) {
            console.error("Failed to send welcome email:", error);
            return false;
        }
    }
}

export const emailService = new EmailService();
