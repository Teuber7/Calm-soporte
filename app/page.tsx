"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { TicketsList } from "@/components/dashboard/tickets-list"
import { LocationMonitor } from "@/components/dashboard/location-monitor"
import { SatisfactionChart } from "@/components/dashboard/satisfaction-chart"
import { mockTickets, mockLocations, kpiMetrics, type Location, type Ticket } from "@/lib/mock-data"

const INFRA_LOCATIONS_STORAGE_KEY = "infraLocations"
const TICKETS_STORAGE_KEY = "supportTickets"

function calculateDashboardMetrics(tickets: Ticket[]) {
  const ratedTickets = tickets.filter((ticket) => typeof ticket.rating === "number")
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resuelto" && ticket.resolvedAt instanceof Date
  )

  const satisfaccion = ratedTickets.length > 0
    ? ratedTickets.reduce((total, ticket) => total + (ticket.rating ?? 0), 0) / ratedTickets.length
    : kpiMetrics.satisfaccion

  const avgResolutionTime = resolvedTickets.length > 0
    ? resolvedTickets.reduce((total, ticket) => {
        const resolvedAt = ticket.resolvedAt ?? ticket.createdAt
        const durationInMinutes = (resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
        return total + durationInMinutes
      }, 0) / resolvedTickets.length
    : kpiMetrics.avgResolutionTime

  const slaCumplido = resolvedTickets.length > 0
    ? Math.round(
        (resolvedTickets.filter((ticket) => {
          const resolvedAt = ticket.resolvedAt ?? ticket.createdAt
          const durationInMinutes = (resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
          return durationInMinutes <= 2
        }).length / resolvedTickets.length) * 100
      )
    : kpiMetrics.slaCumplido

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
    avgResponseTime: kpiMetrics.avgResponseTime,
    avgResolutionTime,
    slaCumplido,
    satisfaccion,
    satisfactionTrend,
  }
}

export default function DashboardPage() {
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const dashboardMetrics = calculateDashboardMetrics(tickets)

  // Load and refresh locations
  useEffect(() => {
    const normalizeLocations = (rawLocations: Location[]): Location[] => {
      const locationNamesById: Record<string, string> = {
        "LOC-001": "Localm Austrias",
        "LOC-002": "Localm Libertador",
        "LOC-003": "Localm Godoy",
        "LOC-004": "Localm Santos",
      }

      return rawLocations.map((loc) => ({
        ...loc,
        name: locationNamesById[loc.id] ?? loc.name,
        uptimeStart: new Date(loc.uptimeStart),
        lastDowntime: loc.lastDowntime ? new Date(loc.lastDowntime) : undefined,
      }))
    }

    const savedLocations = localStorage.getItem(INFRA_LOCATIONS_STORAGE_KEY)
    if (!savedLocations) {
      setLocations(normalizeLocations(mockLocations))
      return
    }

    try {
      const parsed = JSON.parse(savedLocations) as Location[]
      setLocations(normalizeLocations(parsed))
    } catch {
      setLocations(normalizeLocations(mockLocations))
    }
  }, [])

  // Load and refresh tickets with polling for real-time updates
  useEffect(() => {
    const normalizeTickets = (rawTickets: Ticket[]): Ticket[] => {
      return rawTickets.map((ticket) => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt),
        resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
      }))
    }

    const loadTickets = () => {
      const savedTickets = localStorage.getItem(TICKETS_STORAGE_KEY)
      if (!savedTickets) {
        setTickets(normalizeTickets(mockTickets))
        return
      }

      try {
        const parsed = JSON.parse(savedTickets) as Ticket[]
        setTickets(normalizeTickets(parsed))
      } catch {
        setTickets(normalizeTickets(mockTickets))
      }
    }

    // Load initially
    loadTickets()

    // Poll for updates every 2 seconds for real-time updates
    const interval = setInterval(loadTickets, 2000)

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
        <LocationMonitor locations={locations} />

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TicketsList tickets={tickets} compact />
          <SatisfactionChart tickets={tickets} />
        </div>
      </div>
    </DashboardLayout>
  )
}
