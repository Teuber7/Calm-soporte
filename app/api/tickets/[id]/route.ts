import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
  return NextResponse.json(ticket)
}
