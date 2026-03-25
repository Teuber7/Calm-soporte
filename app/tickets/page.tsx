"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TicketForm } from "@/components/tickets/ticket-form"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { RatingDialog } from "@/components/tickets/rating-dialog"
import { mockTickets, type Ticket } from "@/lib/mock-data"

const TICKETS_STORAGE_KEY = "supportTickets"

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
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedTickets = localStorage.getItem(TICKETS_STORAGE_KEY)

    if (!savedTickets) {
      setTickets(normalizeTickets(mockTickets))
      setIsHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(savedTickets) as Ticket[]
      setTickets(normalizeTickets(parsed))
    } catch {
      setTickets(normalizeTickets(mockTickets))
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets, isHydrated])

  const handleCreateTicket = (data: {
    userName: string
    problem: string
    priority: "alta" | "media" | "baja"
  }) => {
    const newTicket: Ticket = {
      id: `TK-${Date.now()}`,
      ...data,
      status: "abierto",
      createdAt: new Date(),
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const handleStatusChange = (ticketId: string, status: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              resolvedAt: status === "resuelto" ? new Date() : undefined,
            }
          : t
      )
    )
  }

  const handleResolve = (ticketId: string) => {
    // First mark as resolved
    handleStatusChange(ticketId, "resuelto")
    // Then open rating dialog
    setRatingTicketId(ticketId)
  }

  const handleRating = (rating: number, comment?: string) => {
    if (ratingTicketId) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ratingTicketId ? { ...t, rating, comment } : t
        )
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
