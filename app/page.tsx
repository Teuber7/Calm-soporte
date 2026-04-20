"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { TicketsList } from "@/components/dashboard/tickets-list"
import { LocationMonitor } from "@/components/dashboard/location-monitor"
import { SatisfactionChart } from "@/components/dashboard/satisfaction-chart"
import type { Ticket } from "@/lib/mock-data"

const fallbackMetrics = {
  avgResponseTime: 2,
  avgResolutionTime: 2,
  slaCumplido: 94,
  satisfaccion: 4.6,
}

function calculateDashboardMetrics(tickets: Ticket[]) {
  const ratedTickets = tickets.filter((ticket) => typeof ticket.rating === "number")
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resuelto" && ticket.resolvedAt instanceof Date
  )

  const satisfaccion = ratedTickets.length > 0
    ? ratedTickets.reduce((total, ticket) => total + (ticket.rating ?? 0), 0) / ratedTickets.length
    : fallbackMetrics.satisfaccion

  const avgResolutionTime = resolvedTickets.length > 0
    ? resolvedTickets.reduce((total, ticket) => {
        const resolvedAt = ticket.resolvedAt ?? ticket.createdAt
        const durationInMinutes = (resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
        return total + durationInMinutes
      }, 0) / resolvedTickets.length
    : fallbackMetrics.avgResolutionTime

  const slaCumplido = resolvedTickets.length > 0
    ? Math.round(
        (resolvedTickets.filter((ticket) => {
          const resolvedAt = ticket.resolvedAt ?? ticket.createdAt
          const durationInMinutes = (resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
          return durationInMinutes <= 2
        }).length / resolvedTickets.length) * 100
      )
    : fallbackMetrics.slaCumplido

  const sortedRatedTickets = [...ratedTickets].sort(
    (left, right) => left.createdAt.getTime() - right.createdAt.getTime()
  )
  const midpoint = Math.floor(sortedRatedTickets.length / 2)
  const previousRatings = sortedRatedTickets.slice(0, midpoint)
  const recentRatings = sortedRatedTickets.slice(midpoint)

  const previousAverage = previousRatings.length > 0
    ? previousRatings.reduce((total, ticket) => total + (ticket.rating ?? 0), 0) / previousRatings.length
    : satisfaccion

  const recentAverage = recentRatings.length > 0
    ? recentRatings.reduce((total, ticket) => total + (ticket.rating ?? 0), 0) / recentRatings.length
    : satisfaccion

  const satisfactionTrend = previousAverage > 0
    ? Math.round(((recentAverage - previousAverage) / previousAverage) * 100)
    : 0

  return {
    avgResponseTime: fallbackMetrics.avgResponseTime,
    avgResolutionTime,
    slaCumplido,
    satisfaccion,
    satisfactionTrend,
  }
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const dashboardMetrics = calculateDashboardMetrics(tickets)

  // Poll tickets every 5s for real-time updates
  useEffect(() => {
    const load = () => {
      fetch("/api/tickets")
        .then((r) => r.json())
        .then((data: Ticket[]) =>
          setTickets(
            data.map((t) => ({
              ...t,
              createdAt: new Date(t.createdAt),
              resolvedAt: t.resolvedAt ? new Date(t.resolvedAt) : undefined,
            }))
          )
        )
        .catch(() => {})
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout
      title="Dashboard"
      description="Vista general del sistema IT"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <KPICards {...dashboardMetrics} />

        {/* Location Monitor */}
        <LocationMonitor />

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TicketsList tickets={tickets} compact />
          <SatisfactionChart tickets={tickets} />
        </div>
      </div>
    </DashboardLayout>
  )
}
