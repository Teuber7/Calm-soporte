import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const ticket = await prisma.ticket.findUnique({
    where: { ratingToken: token },
    select: { id: true, userName: true, problem: true, rating: true },
  })
  if (!ticket) return NextResponse.json({ error: "Token inválido" }, { status: 404 })
  return NextResponse.json(ticket)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json() as { rating: number; comment?: string }

  const ticket = await prisma.ticket.findUnique({ where: { ratingToken: token } })
  if (!ticket) return NextResponse.json({ error: "Token inválido" }, { status: 404 })
  if (ticket.rating !== null) return NextResponse.json({ error: "Ya calificaste este ticket" }, { status: 409 })

  await prisma.ticket.update({
    where: { ratingToken: token },
    data: { rating: body.rating, comment: body.comment || null },
  })

  return NextResponse.json({ ok: true })
}
