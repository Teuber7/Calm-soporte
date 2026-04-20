"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw, Activity, Clock, Gauge, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UptimeMonitor {
  id?: number
  name: string
  ip: string
  url: string | null
  status: "online" | "offline" | "degraded"
  uptime: string
  responseTime: number | null
}

function StatusBadge({ status }: { status: UptimeMonitor["status"] }) {
  if (status === "online") return (
    <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-[10px]">
      Online
    </Badge>
  )
  if (status === "degraded") return (
    <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30 text-[10px]">
      Degradado
    </Badge>
  )
  return (
    <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 text-[10px]">
      Offline
    </Badge>
  )
}

function MonitorCard({ monitor }: { monitor: UptimeMonitor }) {
  const isOnline = monitor.status === "online"
  const isDegraded = monitor.status === "degraded"

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
            isOnline ? "bg-success/20" : isDegraded ? "bg-warning/20" : "bg-destructive/20"
          )}>
            {isOnline ? (
              <Wifi className="h-5 w-5 text-success" />
            ) : isDegraded ? (
              <AlertTriangle className="h-5 w-5 text-warning" />
            ) : (
              <WifiOff className="h-5 w-5 text-destructive" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-card-foreground">{monitor.name}</p>
            <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">
              {monitor.ip}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOnline ? "Conexión estable" : isDegraded ? "Latencia elevada" : "Sin conexión"}
            </p>
          </div>
        </div>
        <StatusBadge status={monitor.status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-card/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Uptime histórico</span>
          </div>
          <p className={cn(
            "text-lg font-bold",
            parseFloat(monitor.uptime) >= 99 ? "text-success" :
            parseFloat(monitor.uptime) >= 95 ? "text-warning" : "text-destructive"
          )}>
            {monitor.uptime}%
          </p>
        </div>
        <div className="rounded-md bg-card/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Gauge className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tiempo respuesta</span>
          </div>
          <p className={cn(
            "text-lg font-bold",
            monitor.responseTime === null ? "text-muted-foreground" :
            monitor.responseTime < 300 ? "text-success" :
            monitor.responseTime < 800 ? "text-warning" : "text-destructive"
          )}>
            {monitor.responseTime !== null ? `${monitor.responseTime}ms` : "—"}
          </p>
        </div>
      </div>
    </div>
  )
}

function OverallStats({ monitors }: { monitors: UptimeMonitor[] }) {
  const online = monitors.filter((m) => m.status === "online").length
  const total = monitors.length
  const avgUptime = total > 0
    ? (monitors.reduce((acc, m) => acc + parseFloat(m.uptime), 0) / total).toFixed(2)
    : "0"

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Estado General
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <p className="text-3xl font-bold text-success">{online}</p>
            <p className="text-xs text-muted-foreground">Sedes Online</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{total - online}</p>
            <p className="text-xs text-muted-foreground">Sedes Offline</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <p className={cn(
              "text-3xl font-bold",
              parseFloat(avgUptime) >= 99 ? "text-success" :
              parseFloat(avgUptime) >= 95 ? "text-warning" : "text-destructive"
            )}>
              {avgUptime}%
            </p>
            <p className="text-xs text-muted-foreground">Uptime Promedio</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InfraestructuraPage() {
  const [monitors, setMonitors] = useState<UptimeMonitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMonitors = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const res = await fetch("/api/uptime")
      const data = await res.json() as UptimeMonitor[]
      setMonitors(data)
      setLastUpdated(new Date())
    } catch {
      // keep previous state on error
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchMonitors()
  }, [fetchMonitors])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchMonitors(), 60000)
    return () => clearInterval(interval)
  }, [fetchMonitors])

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <DashboardLayout
      title="Infraestructura"
      description="Monitoreo de red en tiempo real via UptimeRobot"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              monitors.some((m) => m.status !== "online") ? "bg-destructive/20" : "bg-success/20"
            )}>
              <Wifi className={cn(
                "h-4 w-4",
                monitors.some((m) => m.status !== "online") ? "text-destructive" : "text-success"
              )} />
            </div>
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Consultando UptimeRobot…" : (
                <>
                  Actualización automática cada 60s
                  {lastUpdated && (
                    <span className="ml-1 text-muted-foreground/60">
                      — última: {formatTime(lastUpdated)}
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMonitors(true)}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Actualizar
          </Button>
        </div>

        {/* Overall stats */}
        {!isLoading && <OverallStats monitors={monitors} />}

        {/* Monitor cards */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-secondary/30 p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : monitors.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No hay monitores configurados. Verificá las variables de entorno UPTIMEROBOT_GODOY y UPTIMEROBOT_UGARTE.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {monitors.map((monitor) => (
              <MonitorCard key={monitor.name} monitor={monitor} />
            ))}
          </div>
        )}

        {/* Last updated footer */}
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Datos de UptimeRobot — última actualización: {formatTime(lastUpdated)}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
