import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as {
    status?: "abierto" | "en_proceso" | "resuelto"
    resolvedAt?: string | null
    rating?: number
    comment?: string
  }

  const data: Record<string, unknown> = {}
  if (body.status !== undefined) data.status = body.status
  if (body.resolvedAt !== undefined) data.resolvedAt = body.resolvedAt ? new Date(body.resolvedAt) : null
  if (body.rating !== undefined) data.rating = body.rating
  if (body.comment !== undefined) data.comment = body.comment

  const ticket = await prisma.ticket.update({ where: { id }, data })

  // Send rating email when ticket is resolved and user has an email
  if (body.status === "resuelto" && ticket.userEmail && ticket.ratingToken) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const ratingUrl = `${appUrl}/calificar/${ticket.ratingToken}`

    await resend.emails.send({
      from: "Soporte Calm <ivanteuber@calmessimple.com.ar>",
      to: ticket.userEmail,
      subject: `¿Cómo fue tu experiencia con el soporte? (Ticket ${ticket.id})`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 8px;">Hola, ${ticket.userName} 👋</h2>
          <p style="margin-top: 0; color: #555;">
            Tu ticket <strong>${ticket.id}</strong> fue resuelto. Nos gustaría saber cómo fue tu experiencia con el soporte técnico.
          </p>
          <p style="color: #555;">
            Tómate un minuto para calificar la atención que recibiste. Tu opinión nos ayuda a mejorar.
          </p>
          <a href="${ratingUrl}"
             style="display: inline-block; margin-top: 16px; padding: 12px 28px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
            Calificar mi visita
          </a>
          <p style="margin-top: 32px; font-size: 12px; color: #aaa;">
            Este enlace es de un solo uso y expira cuando lo utilices.
          </p>
        </div>
      `,
    }).catch(() => {
      // Don't fail the request if email sending fails
    })
  }

  return NextResponse.json(ticket)
}
