"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Clock, Star } from "lucide-react"
import type { Ticket } from "@/lib/mock-data"

interface TicketsTableProps {
  tickets: Ticket[]
  onStatusChange: (ticketId: string, status: Ticket["status"]) => void
  onResolve: (ticketId: string) => void
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

function getSLAStatus(ticket: Ticket): { label: string; color: string } {
  if (ticket.status === "resuelto") {
    return { label: "Completado", color: "text-success" }
  }

  const now = new Date()
  const diff = now.getTime() - ticket.createdAt.getTime()
  const hours = diff / (1000 * 60 * 60)

  // SLA thresholds based on priority
  const slaHours = ticket.priority === "alta" ? 4 : ticket.priority === "media" ? 8 : 24

  const percentUsed = (hours / slaHours) * 100

  if (percentUsed >= 100) {
    return { label: "SLA Vencido", color: "text-destructive" }
  }
  if (percentUsed >= 75) {
    return { label: "En riesgo", color: "text-warning" }
  }
  return { label: "En tiempo", color: "text-success" }
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

export function TicketsTable({ tickets, onStatusChange, onResolve }: TicketsTableProps) {
  const [filter, setFilter] = useState<"all" | Ticket["status"]>("all")

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Todos los Tickets</CardTitle>
        <Select value={filter} onValueChange={(v: "all" | Ticket["status"]) => setFilter(v)}>
          <SelectTrigger className="w-40 bg-secondary border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="abierto">Abiertos</SelectItem>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="resuelto">Resueltos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const sla = getSLAStatus(ticket)
            return (
              <div
                key={ticket.id}
                className="rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {ticket.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-medium", getPriorityColor(ticket.priority))}
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", getStatusColor(ticket.status))}
                      >
                        {ticket.status === "abierto"
                          ? "Abierto"
                          : ticket.status === "en_proceso"
                          ? "En Proceso"
                          : "Resuelto"}
                      </Badge>
                      {ticket.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3 w-3",
                                star <= ticket.rating!
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-card-foreground mb-1">
                      {ticket.problem}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.userName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(ticket.createdAt)}
                      </div>
                      <p className={cn("text-xs font-medium", sla.color)}>
                        {sla.label}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {ticket.status !== "en_proceso" && ticket.status !== "resuelto" && (
                          <DropdownMenuItem onClick={() => onStatusChange(ticket.id, "en_proceso")}>
                            Marcar En Proceso
                          </DropdownMenuItem>
                        )}
                        {ticket.status !== "resuelto" && (
                          <DropdownMenuItem onClick={() => onResolve(ticket.id)}>
                            Resolver Ticket
                          </DropdownMenuItem>
                        )}
                        {ticket.status === "resuelto" && (
                          <DropdownMenuItem onClick={() => onStatusChange(ticket.id, "abierto")}>
                            Reabrir Ticket
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay tickets para mostrar
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
