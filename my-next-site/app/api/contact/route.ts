import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const receiveEmail = process.env.CONTACT_RECEIVE_EMAIL;

// 简单html转义，防止XSS
function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(req: Request) {
  try {
    if (!receiveEmail) {
      return Response.json({ success: false, msg: "Email config missing" }, { status: 500 });
    }

    const { name, email, message, website } = await req.json();

    // 蜜罐校验
    if (website) {
      return Response.json({ success: false, msg: "Submission blocked" }, { status: 400 });
    }

    if (!name || !email || !message) {
      return Response.json({ success: false, msg: "Please fill out all fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ success: false, msg: "Invalid email address" }, { status: 400 });
    }

    const subject = `New contact submission from FileDocSwift - ${escapeHtml(name)}`;

    const text = `
Sender Name: ${name}
Sender Email: ${email}

Message:
${message}

---
Submitted via filedocswift.com contact form
`;

    const html = `
<div style="font-family:Arial, sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:12px;">
  <h2 style="color:#222;margin-top:0;">New message from FileDocSwift</h2>
  <hr style="border:0;border-top:1px solid #eee;margin:20px 0;">
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <p style="margin-top:20px;"><strong>Message:</strong></p>
  <div style="background:#f8f9fa;padding:16px;border-radius:8px;color:#333;white-space:pre-wrap;">${escapeHtml(message)}</div>
  <hr style="border:0;border-top:1px solid #eee;margin:20px 0;">
  <p style="font-size:12px;color:#777;">This form submission comes from filedocswift.com</p>
</div>
`;

    const { error } = await resend.emails.send({
      from: 'Contact <contact@filedocswift.com>',
      to: receiveEmail,
      replyTo: email, // Resend SDK 是下划线 reply_to，不是 replyTo！这个是高频坑
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error", error);
      return Response.json({ success: false, msg: "Failed to send, please try again later" }, { status: 500 });
    }

    return Response.json({ success: true, msg: "Thank you! Your message has been sent successfully." });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}

// 跨域预检 OPTIONS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://filedocswift.com",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}