import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as {
    type?: "PC" | "Notebook" | "Periferico" | "Monitor" | "Impresora"
    model?: string
    status?: "activo" | "mantenimiento" | "baja"
    assignedTo?: string | null
    serialNumber?: string
  }
  const item = await prisma.equipment.update({ where: { id }, data: body })
  return NextResponse.json(item)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.equipment.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
