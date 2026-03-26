import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const users = await prisma.userAccess.findMany({ orderBy: { id: "asc" } })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const body = await req.json() as {
    name: string
    email: string
    department: string
    status: "onboarding" | "offboarding"
    onboardingChecklist?: { item: string; completed: boolean }[]
    offboardingChecklist?: { item: string; completed: boolean }[]
  }
  const user = await prisma.userAccess.create({
    data: {
      id: body.id ?? `USR-${Date.now()}`,
      name: body.name,
      email: body.email,
      department: body.department,
      status: body.status,
      onboardingChecklist: body.onboardingChecklist ?? null,
      offboardingChecklist: body.offboardingChecklist ?? null,
    },
  })
  return NextResponse.json(user, { status: 201 })
}
