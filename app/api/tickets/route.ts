import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function GET() {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(tickets)
}

export async function POST(req: Request) {
  const body = await req.json() as { userName: string; userEmail?: string; problem: string; priority: "alta" | "media" | "baja" }
  const ratingToken = randomBytes(24).toString("hex")
  const ticket = await prisma.ticket.create({
    data: {
      id: `TK-${Date.now()}`,
      userName: body.userName,
      userEmail: body.userEmail || null,
      problem: body.problem,
      priority: body.priority,
      status: "abierto",
      ratingToken,
    },
  })
  return NextResponse.json(ticket, { status: 201 })
}
