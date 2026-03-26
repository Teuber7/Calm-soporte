import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const equipment = await prisma.equipment.findMany({ orderBy: { id: "asc" } })
  return NextResponse.json(equipment)
}

export async function POST(req: Request) {
  const body = await req.json() as {
    type: "PC" | "Notebook" | "Periferico" | "Monitor" | "Impresora"
    model: string
    status: "activo" | "mantenimiento" | "baja"
    assignedTo?: string
    serialNumber: string
  }
  const item = await prisma.equipment.create({
    data: {
      id: (body as { id?: string }).id ?? `EQ-${Date.now()}`,
      type: body.type,
      model: body.model,
      status: body.status,
      assignedTo: body.assignedTo ?? null,
      serialNumber: body.serialNumber,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
