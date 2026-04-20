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

const SLA_MINUTES: Record<string, number> = {
  alta: 4 * 60,
  media: 8 * 60,
  baja: 24 * 60,
}


function calculateDashboardMetrics(tickets: Ticket[]) {
  const ratedTickets = tickets.filter((t) => t.rating != null)
  const resolvedTickets = tickets.filter(
    (t) => t.status === "resuelto" && t.resolvedAt instanceof Date
  )
  const respondedTickets = tickets.filter((t) => t.firstResponseAt instanceof Date)

  // Tiempo de primera respuesta promedio
  const avgResponseTime = respondedTickets.length > 0
    ? respondedTickets.reduce((total, t) => {
        const mins = (new Date(t.firstResponseAt!).getTime() - t.createdAt.getTime()) / (1000 * 60)
        return total + mins
      }, 0) / respondedTickets.length
    : 0

  // Tiempo de resolución promedio
  const avgResolutionTime = resolvedTickets.length > 0
    ? resolvedTickets.reduce((total, t) => {
        const mins = (new Date(t.resolvedAt!).getTime() - t.createdAt.getTime()) / (1000 * 60)
        return total + mins
      }, 0) / resolvedTickets.length
    : 0

  // SLA: ticket resuelto dentro del umbral según prioridad
  const slaCumplido = resolvedTickets.length > 0
    ? Math.round(
        resolvedTickets.filter((t) => {
          const mins = (new Date(t.resolvedAt!).getTime() - t.createdAt.getTime()) / (1000 * 60)
          return mins <= (SLA_MINUTES[t.priority] ?? SLA_MINUTES.media)
        }).length / resolvedTickets.length * 100
      )
    : 0

  // Satisfacción y tendencia
  const satisfaccion = ratedTickets.length > 0
    ? ratedTickets.reduce((total, t) => total + (t.rating ?? 0), 0) / ratedTickets.length
    : fallbackMetrics.satisfaccion

  const sorted = [...ratedTickets].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  const mid = Math.floor(sorted.length / 2)
  const prevAvg = sorted.slice(0, mid).reduce((s, t) => s + (t.rating ?? 0), 0) / (mid || 1)
  const recentAvg = sorted.slice(mid).reduce((s, t) => s + (t.rating ?? 0), 0) / (sorted.slice(mid).length || 1)
  const satisfactionTrend = prevAvg > 0 ? Math.round(((recentAvg - prevAvg) / prevAvg) * 100) : 0

  return {
    avgResponseTime,
    avgResolutionTime,
    slaCumplido,
    satisfaccion,
    satisfactionTrend,
    hasData: resolvedTickets.length > 0,
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
              firstResponseAt: t.firstResponseAt ? new Date(t.firstResponseAt) : undefined,
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
