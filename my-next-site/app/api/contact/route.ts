import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const receiveEmail = process.env.CONTACT_RECEIVE_EMAIL;

export async function POST(req: Request) {
  try {
    if (!receiveEmail) {
      return Response.json({ success: false, message: "Email config missing" }, { status: 500 });
    }
    // 保留你原来的 website 蜜罐字段，不改动前端字段名
    const { name, email, message, website } = await req.json();

    // 蜜罐校验：website不为空直接拦截（和你原来逻辑一致）
    if (website) {
      return Response.json({ success: false, message: "Submission blocked" }, { status: 400 });
    }

    if (!name || !email || !message) {
      return Response.json({ success: false, message: "Please fill out all fields" }, { status: 400 });
    }

    // 新增简单邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ success: false, message: "Invalid email address" }, { status: 400 });
    }

    const subject = `New contact submission from FileDocSwift - ${name}`;

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
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  <p style="margin-top:20px;"><strong>Message:</strong></p>
  <div style="background:#f8f9fa;padding:16px;border-radius:8px;color:#333;white-space:pre-wrap;">${message}</div>
  <hr style="border:0;border-top:1px solid #eee;margin:20px 0;">
  <p style="font-size:12px;color:#777;">This form submission comes from filedocswift.com</p>
</div>
`;

    const { error } = await resend.emails.send({
      from: 'Contact <contact@filedocswift.com>',
      to: receiveEmail,
      reply_to: email, // ✅ 重点：回复自动给到访客邮箱
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend error", error);
      return Response.json({ success: false, message: "Failed to send, please try again later" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
