import nodemailer from "nodemailer";

const isSmtpConfigured = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

let transporter: nodemailer.Transporter | null = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const from = process.env.SMTP_FROM || `"YSSF Portal" <${process.env.SMTP_USER || "no-reply@yssf.org"}>`;
  
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });
      return true;
    } catch (error) {
      console.error(`Failed to send email via SMTP to ${to}:`, error);
      // Fall back to logging in development
      if (process.env.NODE_ENV !== "production") {
        console.log(`[FALLBACK DEV EMAIL] To: ${to}\nSubject: ${subject}\nBody:\n${text || html}`);
        return true;
      }
      return false;
    }
  } else {
    // If not configured, print to log (for dev)
    console.log(`\n===================================`);
    console.log(`[MOCK EMAIL SERVICE] Sending email...`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (HTML):\n${html}`);
    console.log(`===================================\n`);
    return true;
  }
}

export async function sendOTPEmail(to: string, otp: string): Promise<boolean> {
  const subject = `${otp} is your YSSF verification code`;
  const text = `Your Youth Sakti Social Foundation (YSSF) verification code is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #0B5D3B; margin-top: 0;">Youth Sakti Social Foundation (YSSF)</h2>
      <p>Hello,</p>
      <p>Thank you for registering with YSSF. Use the following security code to verify your email address. This code is valid for 10 minutes.</p>
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 20px 0; border-radius: 6px;">
        ${otp}
      </div>
      <p>If you did not request this code, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 12px; color: #6b7280;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, html, text });
}

export async function sendVerificationLinkEmail(to: string, url: string): Promise<boolean> {
  const subject = "Verify your email address for YSSF";
  const text = `Please verify your email address by visiting this link: ${url}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #0B5D3B; margin-top: 0;">Youth Sakti Social Foundation (YSSF)</h2>
      <p>Hello,</p>
      <p>Thank you for registering with YSSF. Click the button below to verify your email address and activate your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #0B5D3B; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #4b5563;">${url}</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 12px; color: #6b7280;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, html, text });
}
