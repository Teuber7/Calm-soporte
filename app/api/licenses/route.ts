import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const licenses = await prisma.license.findMany({ orderBy: { id: "asc" } })
  return NextResponse.json(licenses)
}

export async function POST(req: Request) {
  const body = await req.json() as {
    software: string
    totalLicenses: number
    usedLicenses: number
    icon: string
  }
  const item = await prisma.license.create({
    data: { id: (body as { id?: string }).id ?? `LIC-${Date.now()}`, software: body.software, totalLicenses: body.totalLicenses, usedLicenses: body.usedLicenses, icon: body.icon },
  })
  return NextResponse.json(item, { status: 201 })
}
