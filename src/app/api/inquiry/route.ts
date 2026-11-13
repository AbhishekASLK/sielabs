import { NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

function escapeHtml(str: string) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, program, message } = body;

    // Validate required fields (only name and phone/WhatsApp required now)
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Please provide your name and phone / WhatsApp number.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanProgram = (program || 'General Inquiry').trim();
    const cleanMessage = (message || '').trim();

    // 1. Try to persist to MongoDB (non-blocking if DB fails)
    try {
      await connectToDatabase();
      await Inquiry.create({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        program: cleanProgram,
        message: cleanMessage,
      });
    } catch (dbErr) {
      console.error('Failed to save inquiry to MongoDB:', dbErr);
    }

    // 2. Send email notification to SieLabs Team (sielabs.inc@gmail.com)
    const recipientEmail = 'sielabs.inc@gmail.com';
    const emailSubject = `New Callback Request: ${cleanProgram} - ${cleanName} (${cleanPhone})`;

    const digitsOnlyPhone = cleanPhone.replace(/[^0-9]/g, '');

    const adminHtmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #FAF9F5; border: 1px solid #E5E3DC; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <div style="background: #141413; padding: 24px 28px; color: #FAF9F5;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 16px; font-weight: 700; color: #D97757; letter-spacing: -0.01em;">SieLabs Academy</span>
          </div>
          <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 600; color: #FFFFFF;">New Contact / Callback Request</h2>
          <p style="margin: 0; font-size: 13px; color: #A19F97;">Submitted via website floating widget</p>
        </div>

        <div style="padding: 24px 28px; background: #FFFFFF;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              <tr style="border-bottom: 1px solid #F0EEE6;">
                <td style="padding: 10px 0; color: #6E6D68; width: 140px; font-weight: 500;">Full Name:</td>
                <td style="padding: 10px 0; color: #141413; font-weight: 600; font-size: 15px;">${escapeHtml(cleanName)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F0EEE6;">
                <td style="padding: 10px 0; color: #6E6D68; font-weight: 500;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0;">
                  <a href="https://wa.me/${digitsOnlyPhone}" target="_blank" style="color: #25D366; text-decoration: none; font-weight: 700; font-size: 15px;">
                    ${escapeHtml(cleanPhone)} → Chat on WhatsApp
                  </a>
                </td>
              </tr>
              ${cleanEmail ? `
              <tr style="border-bottom: 1px solid #F0EEE6;">
                <td style="padding: 10px 0; color: #6E6D68; font-weight: 500;">Email:</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #D97757; text-decoration: none; font-weight: 600;">
                    ${escapeHtml(cleanEmail)}
                  </a>
                </td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #F0EEE6;">
                <td style="padding: 10px 0; color: #6E6D68; font-weight: 500;">Program / Interest:</td>
                <td style="padding: 10px 0;">
                  <span style="display: inline-block; background: #F3EAE2; color: #3E231B; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; border: 1px solid rgba(217, 119, 87, 0.25);">
                    ${escapeHtml(cleanProgram)}
                  </span>
                </td>
              </tr>
              ${cleanMessage ? `
              <tr>
                <td style="padding: 12px 0 6px; color: #6E6D68; font-weight: 500; vertical-align: top;">Message:</td>
                <td style="padding: 12px 0 6px; color: #2D2C2A; line-height: 1.55; white-space: pre-wrap; font-size: 13.5px;">${escapeHtml(cleanMessage)}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F0EEE6; display: flex; gap: 12px;">
            <a href="https://wa.me/${digitsOnlyPhone}" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: 600; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 13px;">
              Direct WhatsApp Chat
            </a>
            <a href="tel:${digitsOnlyPhone}" style="display: inline-block; background: #141413; color: #FAF9F5; font-weight: 500; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 13px;">
              Call Directly
            </a>
          </div>
        </div>

        <div style="padding: 12px 28px; background: #F6F4EE; border-top: 1px solid #E5E3DC; font-size: 11.5px; color: #9C9A92;">
          Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST) &bull; SieLabs Systems
        </div>
      </div>
    `;

    // Send admin notification
    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [recipientEmail],
      subject: emailSubject,
      html: adminHtmlContent,
    });

    // 3. Send friendly acknowledgment to user only if email provided
    if (cleanEmail) {
      try {
        const userAckHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #FAF9F5; border: 1px solid #E5E3DC; border-radius: 14px; overflow: hidden;">
            <div style="background: #141413; padding: 22px 26px; color: #FAF9F5;">
              <h2 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #FFFFFF;">Thanks, ${escapeHtml(cleanName)}!</h2>
              <p style="margin: 0; font-size: 13px; color: #A19F97;">We received your inquiry for <strong>${escapeHtml(cleanProgram)}</strong>.</p>
            </div>
            <div style="padding: 24px 26px; background: #FFFFFF; line-height: 1.6; color: #2D2C2A; font-size: 14px;">
              <p>Our mentors will contact you via WhatsApp / Phone at <strong>${escapeHtml(cleanPhone)}</strong>.</p>
              <p>You can also join our WhatsApp community:</p>
              <p style="margin: 18px 0;">
                <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" style="display: inline-block; background: #D97757; color: #FFFFFF; font-weight: 600; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-size: 13.5px;">
                  Join WhatsApp Community →
                </a>
              </p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: [cleanEmail],
          subject: `We've received your request - SieLabs Academy`,
          html: userAckHtml,
        });
      } catch (ackErr) {
        console.warn('User acknowledgment email skipped:', ackErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your details have been sent to our team.',
    });
  } catch (err: any) {
    console.error('Inquiry API Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
