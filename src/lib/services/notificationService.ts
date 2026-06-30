export type NotificationPreference = "in-app" | "email" | "sms" | "discord" | "push";

export type NotificationService = {
  sendTestAlert(method: NotificationPreference): Promise<{ ok: boolean; message: string }>;
};

// Future adapters: Resend for email, Twilio for SMS, Discord webhooks, and
// Firebase push notifications. Do not send provider secrets to the browser.
export const notificationService: NotificationService = {
  async sendTestAlert(method) {
    return {
      ok: true,
      message: `Mock ${method} alert queued.`,
    };
  },
};
