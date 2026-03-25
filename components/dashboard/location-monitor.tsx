"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Wifi, WifiOff } from "lucide-react"
import type { Location } from "@/lib/mock-data"

interface LocationMonitorProps {
  locations: Location[]
  compact?: boolean
}

function formatUptime(uptimeStart: Date | string): string {
  const now = new Date()
  const uptimeStartDate = uptimeStart instanceof Date ? uptimeStart : new Date(uptimeStart)

  if (Number.isNaN(uptimeStartDate.getTime())) {
    return "--"
  }

  const diff = now.getTime() - uptimeStartDate.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  return `${minutes}m ${seconds}s`
}

function LocationCard({ location }: { location: Location }) {
  const [uptime, setUptime] = useState("--")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    setUptime(formatUptime(location.uptimeStart))
    
    const interval = setInterval(() => {
      setUptime(formatUptime(location.uptimeStart))
    }, 1000)

    return () => clearInterval(interval)
  }, [location.uptimeStart, isMounted])

  const isOnline = location.status === "online"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 transition-all",
        isOnline
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : (
            <WifiOff className="h-4 w-4 text-destructive" />
          )}
          <span className="font-medium text-sm text-card-foreground">
            {location.name}
          </span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isOnline ? "text-success" : "text-destructive"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              isOnline ? "bg-success" : "bg-destructive"
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          {isOnline ? "Sin caídas" : "Última caída"}
        </p>
        <p className={cn(
          "text-lg font-semibold font-mono",
          isOnline ? "text-success" : "text-destructive"
        )}>
          {uptime}
        </p>
      </div>

      {/* Status bar at bottom */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          isOnline ? "bg-success" : "bg-destructive"
        )}
      />
    </div>
  )
}

export function LocationMonitor({ locations, compact = false }: LocationMonitorProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Monitor de Sedes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-3",
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}>
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
