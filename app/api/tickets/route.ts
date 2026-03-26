import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(tickets)
}

export async function POST(req: Request) {
  const body = await req.json() as { userName: string; problem: string; priority: "alta" | "media" | "baja" }
  const ticket = await prisma.ticket.create({
    data: {
      id: `TK-${Date.now()}`,
      userName: body.userName,
      problem: body.problem,
      priority: body.priority,
      status: "abierto",
    },
  })
  return NextResponse.json(ticket, { status: 201 })
}
