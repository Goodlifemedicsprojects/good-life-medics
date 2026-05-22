import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Good Life Medics <onboarding@resend.dev>'
export const CREATOR_EMAIL = process.env.CREATOR_EMAIL!

export async function sendEbookEmail(
  toEmail: string,
  toName: string,
  ebookTitle: string,
  driveLink: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `📚 Your Free Ebook: ${ebookTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="font-family:'DM Sans',Arial,sans-serif;background:#f7fafa;margin:0;padding:0;">
        <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #d0e4e4;">
          <div style="background:linear-gradient(135deg,#0a5c5c,#0e8080);padding:40px 32px;text-align:center;">
            <h1 style="color:white;font-size:24px;margin:0 0 8px;">Good Life Medics</h1>
            <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Evidence-Based Health Education</p>
          </div>
          <div style="padding:32px;">
            <p style="color:#1a2e2e;font-size:16px;margin:0 0 16px;">Hi ${toName}! 👋</p>
            <p style="color:#5a7070;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Thank you for downloading from Good Life Medics! Your free ebook is ready.
            </p>
            <div style="background:#e6f4f4;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
              <p style="color:#0a5c5c;font-weight:600;font-size:16px;margin:0 0 4px;">📚 ${ebookTitle}</p>
              <p style="color:#5a7070;font-size:13px;margin:0;">Click below to access your ebook</p>
            </div>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${driveLink}" style="background:#0a5c5c;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
                ⬇️ Download My Ebook
              </a>
            </div>
            <p style="color:#aab5b5;font-size:12px;text-align:center;margin:0;">
              If the button doesn't work, copy this link: ${driveLink}
            </p>
          </div>
          <div style="background:#f7fafa;padding:20px;text-align:center;border-top:1px solid #d0e4e4;">
            <p style="color:#aab5b5;font-size:12px;margin:0;">
              © ${new Date().getFullYear()} Good Life Medics. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendNewSubscriberAlert(
  name: string,
  email: string,
  ebookTitle: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: CREATOR_EMAIL,
    subject: `🎉 New Subscriber: ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#0a5c5c;">New Ebook Download!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Ebook:</strong> ${ebookTitle}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  })
}
