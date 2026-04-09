"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TicketForm } from "@/components/tickets/ticket-form"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { RatingDialog } from "@/components/tickets/rating-dialog"
import type { Ticket } from "@/lib/mock-data"

function normalizeTickets(rawTickets: Ticket[]): Ticket[] {
  return rawTickets.map((ticket) => ({
    ...ticket,
    createdAt: new Date(ticket.createdAt),
    resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
  }))
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [ratingTicketId, setRatingTicketId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then((data: Ticket[]) => setTickets(normalizeTickets(data)))
      .catch(() => {})
  }, [])

  const handleCreateTicket = async (data: {
    userName: string
    userEmail: string
    problem: string
    priority: "alta" | "media" | "baja"
  }) => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const newTicket: Ticket = await res.json()
    setTickets((prev) => [normalizeTickets([newTicket])[0], ...prev])
  }

  const handleStatusChange = async (ticketId: string, status: Ticket["status"]) => {
    const resolvedAt = status === "resuelto" ? new Date().toISOString() : null
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolvedAt }),
    })
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status, resolvedAt: resolvedAt ? new Date(resolvedAt) : undefined }
          : t
      )
    )
  }

  const handleResolve = (ticketId: string) => {
    handleStatusChange(ticketId, "resuelto")
    setRatingTicketId(ticketId)
  }

  const handleRating = async (rating: number, comment?: string) => {
    if (ratingTicketId) {
      await fetch(`/api/tickets/${ratingTicketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      })
      setTickets((prev) =>
        prev.map((t) => (t.id === ratingTicketId ? { ...t, rating, comment } : t))
      )
      setRatingTicketId(null)
    }
  }

  return (
    <DashboardLayout
      title="Tickets"
      description="Gestión de tickets de soporte"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TicketForm onSubmit={handleCreateTicket} />
        </div>
        <div className="lg:col-span-2">
          <TicketsTable
            tickets={tickets}
            onStatusChange={handleStatusChange}
            onResolve={handleResolve}
          />
        </div>
      </div>

      <RatingDialog
        open={ratingTicketId !== null}
        onClose={() => setRatingTicketId(null)}
        onSubmit={handleRating}
        ticketId={ratingTicketId || ""}
      />
    </DashboardLayout>
  )
}
