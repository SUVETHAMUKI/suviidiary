import nodemailer from "nodemailer";

export interface DigestData {
  userEmail: string;
  userName?: string;
  period: "daily" | "weekly";
  habitsDone: number;
  habitsTotal: number;
  tasksDone: number;
  tasksTotal: number;
  currentStreak: number;
  savingsBalance: number;
  quote?: {
    ta: string;
    en: string;
    meaning: string;
  };
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendTaskDueEmail(toEmail: string, taskTitle: string, taskTime: string) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || "Suvii Diary <no-reply@suviidiary.app>";

  const html = `
    <div style="font-family: 'Quicksand', sans-serif; max-width: 500px; margin: 0 auto; background: #fff5f7; border-radius: 20px; padding: 30px; border: 2px solid #f6d9e3; color: #7a2348;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 40px;">🌸</span>
        <h1 style="font-family: 'Fraunces', serif; font-style: italic; color: #e0578a; margin: 5px 0;">Suvii Diary Reminder</h1>
      </div>
      <div style="background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 15px rgba(224,87,138,0.08);">
        <h2 style="margin-top: 0; color: #7a2348; font-size: 20px;">Time for your task! ✨</h2>
        <p style="font-size: 16px; font-weight: bold; color: #d6336c; background: #fde3ec; padding: 12px 18px; border-radius: 12px; margin: 16px 0;">
          ${taskTitle}
        </p>
        <p style="font-size: 14px; color: #a9607f; margin: 0;">Scheduled for: <b>${taskTime}</b></p>
      </div>
      <p style="text-align: center; font-size: 12px; color: #b06d86; margin-top: 24px;">
        Stay consistent with your 1% Better Everyday challenge! 💖
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Simulation] To: ${toEmail} | Subject: Task Reminder: ${taskTitle}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `🌸 Suvii Diary Reminder: ${taskTitle}`,
      html,
    });
    return { success: true, simulated: false };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return { success: false, error };
  }
}

export async function sendDigestEmail(data: DigestData) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || "Suvii Diary <no-reply@suviidiary.app>";

  const title = data.period === "daily" ? "Today's Glow-Up Digest ✨" : "Weekly Progress Summary 🌸";

  const html = `
    <div style="font-family: 'Quicksand', sans-serif; max-width: 550px; margin: 0 auto; background: #fff5f7; border-radius: 24px; padding: 32px; border: 2px solid #f6d9e3; color: #7a2348;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 42px;">🌸</span>
        <h1 style="font-family: 'Fraunces', serif; font-style: italic; color: #7a2348; margin: 6px 0;">Suvii Diary</h1>
        <p style="font-size: 13px; color: #a9607f; letter-spacing: 1px; text-transform: uppercase;">1% Better Everyday</p>
      </div>

      <div style="background: #ffffff; border-radius: 18px; padding: 24px; box-shadow: 0 6px 20px rgba(214,51,108,0.08); margin-bottom: 20px;">
        <h2 style="margin-top: 0; color: #e0578a; font-size: 20px;">${title}</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0;">
          <div style="background: #fff5f7; padding: 14px; border-radius: 14px; text-align: center;">
            <div style="font-size: 22px; font-weight: bold; color: #d6336c;">${data.habitsDone} / ${data.habitsTotal}</div>
            <div style="font-size: 12px; color: #a9607f; margin-top: 4px;">Habits Completed</div>
          </div>
          <div style="background: #f7f3fd; padding: 14px; border-radius: 14px; text-align: center;">
            <div style="font-size: 22px; font-weight: bold; color: #8e62c6;">${data.tasksDone} / ${data.tasksTotal}</div>
            <div style="font-size: 12px; color: #8e62c6; margin-top: 4px;">Tasks Completed</div>
          </div>
        </div>

        <div style="background: #fff0f5; border-radius: 12px; padding: 12px 16px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; color: #7a2348;">🔥 Best Streak: <b>${data.currentStreak} Days</b></span>
          <span style="font-size: 14px; color: #7a2348;">💰 Savings Balance: <b>₹${data.savingsBalance.toLocaleString("en-IN")}</b></span>
        </div>
      </div>

      ${data.quote ? `
        <div style="background: #ffffff; border-radius: 16px; padding: 18px 22px; border: 1px solid #f6d9e3; text-align: center;">
          <p style="font-family: 'Fraunces', serif; font-size: 18px; color: #7a2348; margin: 0 0 6px;">
            "${data.quote.ta}"
          </p>
          <p style="font-size: 13px; color: #e0578a; font-style: italic; margin: 0 0 6px;">
            "${data.quote.en}"
          </p>
          <p style="font-size: 12px; color: #a9607f; margin: 0;">
            ${data.quote.meaning}
          </p>
        </div>
      ` : ""}

      <p style="text-align: center; font-size: 12px; color: #b06d86; margin-top: 24px;">
        Keep shining! You're making progress every single day. 💕
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`[Digest Email Simulation] To: ${data.userEmail} | ${title} | Habits: ${data.habitsDone}/${data.habitsTotal} | Tasks: ${data.tasksDone}/${data.tasksTotal}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from,
      to: data.userEmail,
      subject: `🌸 Suvii Diary: ${title}`,
      html,
    });
    return { success: true, simulated: false };
  } catch (error) {
    console.error("Error sending digest email:", error);
    return { success: false, error };
  }
}
