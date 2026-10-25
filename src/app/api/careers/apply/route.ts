import { NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      coverNote,
      roleTitle = 'Software Engineer Intern',
    } = body;

    const resolvedLinkedinUrl = linkedinUrl || portfolioUrl;

    // Validate all compulsory fields:
    // Full Name, Email, Phone, GitHub, LinkedIn, Resume, and Why SieLabs
    if (!fullName || !email || !phone || !githubUrl || !resolvedLinkedinUrl || !resumeUrl || !coverNote) {
      return NextResponse.json(
        {
          error:
            'Please fill in all required fields: Full Name, Email, Phone, GitHub, LinkedIn Profile, Resume Link, and Why you want to join SieLabs.',
        },
        { status: 400 }
      );
    }

    const recipientEmail = 'sielabs.inc@gmail.com';
    const emailSubject = `New Application: ${roleTitle} - ${fullName}`;

    // 1. Email to SieLabs Team (sielabs.inc@gmail.com)
    const adminHtmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7dfc8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <div style="background: linear-gradient(135deg, #9A7B1A, #B89628); padding: 24px 28px; color: #ffffff;">
          <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700;">SieLabs &bull; New Internship Application</h2>
          <p style="margin: 0; opacity: 0.92; font-size: 14px; font-weight: 500;">Role: ${roleTitle}</p>
        </div>
        
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; width: 140px; font-weight: 600;">Candidate Name:</td>
                <td style="padding: 10px 0; color: #111; font-weight: 600;">${escapeHtml(fullName)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Email Address:</td>
                <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #9A7B1A; text-decoration: underline;">${escapeHtml(email)}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0; color: #111;">${escapeHtml(phone)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; font-weight: 600;">GitHub Profile:</td>
                <td style="padding: 10px 0;"><a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" style="color: #9A7B1A; font-weight: 500;">${escapeHtml(githubUrl)}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; font-weight: 600;">LinkedIn Profile:</td>
                <td style="padding: 10px 0;"><a href="${escapeHtml(resolvedLinkedinUrl)}" target="_blank" rel="noopener noreferrer" style="color: #9A7B1A; font-weight: 500;">${escapeHtml(resolvedLinkedinUrl)}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f2ede0;">
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Resume Link:</td>
                <td style="padding: 10px 0;"><a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #9A7B1A; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">View Resume &rarr;</a></td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 24px; padding: 18px; background: #faf7f0; border-radius: 8px; border-left: 3px solid #9A7B1A;">
            <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 13px; color: #444; text-transform: uppercase; letter-spacing: 0.04em;">Why do you want to join SieLabs?</p>
            <p style="margin: 0; color: #222; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(coverNote)}</p>
          </div>

          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888; display: flex; justify-content: space-between;">
            <span>Submitted via SieLabs Careers Portal</span>
            <span>${new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [recipientEmail],
      replyTo: email,
      subject: emailSubject,
      html: adminHtmlContent,
    });

    if (error) {
      console.error('Resend error sending to admin:', error);
      return NextResponse.json({ error: error.message || 'Failed to send email via Resend' }, { status: 400 });
    }

    // 2. Automated Confirmation Email to Applicant / Student
    try {
      const studentHtmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e7dfc8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <div style="background: linear-gradient(135deg, #9A7B1A, #B89628); padding: 28px; color: #ffffff;">
            <h2 style="margin: 0 0 4px 0; font-size: 22px; font-weight: 700;">SieLabs</h2>
            <p style="margin: 0; opacity: 0.95; font-size: 14px; font-weight: 500;">Application Confirmation &bull; ${roleTitle}</p>
          </div>
          
          <div style="padding: 28px; color: #222; font-size: 14.5px; line-height: 1.7;">
            <p style="margin-top: 0;">Hi <strong>${escapeHtml(fullName)}</strong>,</p>
            
            <p>Thank you for applying for the <strong>${roleTitle}</strong> role at <strong>SieLabs</strong>!</p>
            
            <p>We have successfully received your application details, including your GitHub profile, LinkedIn profile, and resume link. Our team will review your profile carefully, and if there is a strong match, we will reach out to you directly with the next steps.</p>

            <p style="margin-bottom: 0; margin-top: 24px;">Warm regards,<br><strong>SieLabs Engineering Team</strong><br><a href="https://sielabs.org" target="_blank" style="color: #9A7B1A; text-decoration: none; font-weight: 600;">sielabs.org</a></p>
          </div>
          
          <div style="background: #fafafa; padding: 16px 28px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
            &copy; 2026 SieLabs. All rights reserved. &bull; Questions? You can reach us at sielabs.inc@gmail.com.
          </div>
        </div>
      `;

      await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: [email],
        subject: `Thank you for applying to SieLabs – ${roleTitle}`,
        html: studentHtmlContent,
      });
    } catch (studentEmailErr) {
      // Non-fatal if student domain restriction exists on Resend free plan
      console.warn('Note: Could not send student confirmation email (likely Resend sandbox domain restriction):', studentEmailErr);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Career application error:', err);
    return NextResponse.json(
      { error: err?.message || 'Server error processing application' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
