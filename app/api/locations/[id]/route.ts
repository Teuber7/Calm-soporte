import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as {
    status?: "online" | "offline"
    uptimeStart?: string
    lastDowntime?: string | null
  }

  const data: Record<string, unknown> = {}
  if (body.status !== undefined) data.status = body.status
  if (body.uptimeStart !== undefined) data.uptimeStart = new Date(body.uptimeStart)
  if (body.lastDowntime !== undefined) data.lastDowntime = body.lastDowntime ? new Date(body.lastDowntime) : null

  const location = await prisma.location.update({ where: { id }, data })
  return NextResponse.json(location)
}
