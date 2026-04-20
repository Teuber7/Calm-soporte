"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Wifi, WifiOff, AlertTriangle, Gauge, Activity } from "lucide-react"

interface UptimeMonitor {
  name: string
  ip: string
  status: "online" | "offline" | "degraded"
  uptime: string
  responseTime: number | null
}

function LocationCard({ monitor }: { monitor: UptimeMonitor }) {
  const isOnline = monitor.status === "online"
  const isDegraded = monitor.status === "degraded"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 transition-all",
        isOnline
          ? "border-success/30 bg-success/5"
          : isDegraded
          ? "border-warning/30 bg-warning/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : isDegraded ? (
            <AlertTriangle className="h-4 w-4 text-warning" />
          ) : (
            <WifiOff className="h-4 w-4 text-destructive" />
          )}
          <div>
            <span className="font-medium text-sm text-card-foreground block">
              {monitor.name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/70">
              {monitor.ip}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isOnline ? "text-success" : isDegraded ? "text-warning" : "text-destructive"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              isOnline ? "bg-success" : isDegraded ? "bg-warning" : "bg-destructive"
            )}
          />
          {isOnline ? "Online" : isDegraded ? "Degradado" : "Offline"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Uptime</span>
          </div>
          <p className={cn(
            "text-base font-bold font-mono",
            parseFloat(monitor.uptime) >= 99 ? "text-success" :
            parseFloat(monitor.uptime) >= 95 ? "text-warning" : "text-destructive"
          )}>
            {monitor.uptime}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <Gauge className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Respuesta</span>
          </div>
          <p className={cn(
            "text-base font-bold font-mono",
            monitor.responseTime === null ? "text-muted-foreground" :
            monitor.responseTime < 300 ? "text-success" :
            monitor.responseTime < 800 ? "text-warning" : "text-destructive"
          )}>
            {monitor.responseTime !== null ? `${monitor.responseTime}ms` : "—"}
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          isOnline ? "bg-success" : isDegraded ? "bg-warning" : "bg-destructive"
        )}
      />
    </div>
  )
}

export function LocationMonitor() {
  const [monitors, setMonitors] = useState<UptimeMonitor[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/uptime")
      const data = await res.json() as UptimeMonitor[]
      setMonitors(data)
    } catch {
      // keep previous state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Monitor de Sedes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border h-24 animate-pulse bg-secondary/30" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {monitors.map((monitor) => (
              <LocationCard key={monitor.name} monitor={monitor} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
