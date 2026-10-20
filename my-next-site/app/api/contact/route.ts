import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const receiveEmail = process.env.CONTACT_RECEIVE_EMAIL;

export async function POST(req: Request) {
  try {
    if (!receiveEmail) {
      return Response.json({ success: false, message: "邮箱配置缺失" }, { status: 500 });
    }
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ success: false, message: "请填写全部内容" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'Contact <contact@filedocswift.com>',
      to: receiveEmail,
      subject: `filedocswift 新留言：${name}`,
      text: `发件人姓名：${name}
发件邮箱：${email}
留言内容：
${message}`
    });

    if (error) {
      console.error("Resend error", error);
      return Response.json({ success: false, message: "发送失败，请稍后重试" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: "服务异常" }, { status: 500 });
  }
}