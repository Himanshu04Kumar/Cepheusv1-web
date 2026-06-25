import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendStatusUpdateEmail(email: string, customerName: string, bookingId: string, status: string) {
  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${bookingId}`;

    await resend.emails.send({
      from: 'Cepheus Repair <updates@cepheus.com>',
      to: email,
      subject: `Repair Update: ${status}`,
      html: `
        <h1>Hi ${customerName},</h1>
        <p>Your repair order <strong>${bookingId}</strong> has been updated to: <strong>${status}</strong>.</p>
        <p>You can track the real-time progress and view photographic documentation here:</p>
        <a href="${trackingUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track My Repair</a>
        <br/><br/>
        <p>Team Cepheus</p>
      `
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
