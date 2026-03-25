"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Ticket } from "@/lib/mock-data"

interface TicketsListProps {
  tickets: Ticket[]
  compact?: boolean
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `hace ${days} día${days > 1 ? "s" : ""}`
  }
  if (hours > 0) {
    return `hace ${hours}h`
  }
  return `hace ${minutes}min`
}

function getPriorityColor(priority: Ticket["priority"]) {
  switch (priority) {
    case "alta":
      return "bg-destructive/20 text-destructive border-destructive/30"
    case "media":
      return "bg-warning/20 text-warning border-warning/30"
    case "baja":
      return "bg-primary/20 text-primary border-primary/30"
  }
}

function getStatusColor(status: Ticket["status"]) {
  switch (status) {
    case "abierto":
      return "bg-chart-2/20 text-chart-2 border-chart-2/30"
    case "en_proceso":
      return "bg-warning/20 text-warning border-warning/30"
    case "resuelto":
      return "bg-success/20 text-success border-success/30"
  }
}

function getStatusLabel(status: Ticket["status"]) {
  switch (status) {
    case "abierto":
      return "Abierto"
    case "en_proceso":
      return "En Proceso"
    case "resuelto":
      return "Resuelto"
  }
}

export function TicketsList({ tickets, compact = false }: TicketsListProps) {
  const displayTickets = compact ? tickets.slice(0, 5) : tickets

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Tickets Recientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  {ticket.id}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-medium", getPriorityColor(ticket.priority))}
                >
                  {ticket.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm font-medium text-card-foreground truncate">
                {ticket.problem}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {ticket.userName} · {getTimeAgo(ticket.createdAt)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-[10px]", getStatusColor(ticket.status))}
            >
              {getStatusLabel(ticket.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
