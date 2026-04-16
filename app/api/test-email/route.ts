import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return NextResponse.json({ error: "Variables no configuradas", user: !!user, pass: !!pass }, { status: 500 })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: pass.replace(/\s/g, "") },
    })

    await transporter.verify()

    await transporter.sendMail({
      from: `"Soporte Calm" <${user}>`,
      to: user,
      subject: "Test email - Calm Soporte",
      html: "<p>Si recibís este mail, el envío funciona correctamente ✅</p>",
    })

    return NextResponse.json({ ok: true, message: `Mail enviado a ${user}` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
