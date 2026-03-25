"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LocationMonitor } from "@/components/dashboard/location-monitor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockLocations, type Location } from "@/lib/mock-data"
import { Wifi, WifiOff, RefreshCw, Server, Activity, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

function UptimeStats({ locations }: { locations: Location[] }) {
  const online = locations.filter((l) => l.status === "online").length
  const total = locations.length
  const uptimePercentage = Math.round((online / total) * 100)

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
            <p className="text-3xl font-bold text-card-foreground">{online}</p>
            <p className="text-xs text-muted-foreground">Sedes Online</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <p className="text-3xl font-bold text-card-foreground">{total - online}</p>
            <p className="text-xs text-muted-foreground">Sedes Offline</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <p className={cn(
              "text-3xl font-bold",
              uptimePercentage >= 90 ? "text-success" : uptimePercentage >= 75 ? "text-warning" : "text-destructive"
            )}>
              {uptimePercentage}%
            </p>
            <p className="text-xs text-muted-foreground">Uptime Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface Incident {
  id: string
  locationName: string
  type: "caída" | "restauración" | "latencia"
  startTime: Date
  endTime?: Date
}

function formatDuration(start: Date, end?: Date): string {
  const now = end || new Date()
  let diff = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`
  return `${Math.floor(diff / 86400)}d`
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return "Ahora"
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return `${Math.floor(diff / 86400)}d atrás`
}

function IncidentHistory({ incidents }: { incidents: Incident[] }) {
  const sortedIncidents = [...incidents].reverse()

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-warning" />
          Historial de Incidentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedIncidents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Sin incidentes registrados
            </p>
          ) : (
            sortedIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    incident.type === "caída" ? "bg-destructive/20" : incident.type === "restauración" ? "bg-success/20" : "bg-warning/20"
                  )}>
                    {incident.type === "caída" || incident.type === "latencia" ? (
                      <WifiOff className={cn(
                        "h-4 w-4",
                        incident.type === "caída" ? "text-destructive" : "text-warning"
                      )} />
                    ) : (
                      <Wifi className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {incident.locationName}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {incident.type === "caída" ? "Caída de red" : incident.type === "restauración" ? "Restauración" : "Latencia alta"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDuration(incident.startTime, incident.endTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(incident.startTime)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ServerStatus() {
  const servers = [
    { name: "Servidor Principal", status: "online", cpu: 45, memory: 62 },
    { name: "Servidor Backup", status: "online", cpu: 12, memory: 34 },
    { name: "Servidor BD", status: "online", cpu: 78, memory: 85 },
    { name: "Servidor Email", status: "maintenance", cpu: 0, memory: 0 },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-chart-2" />
          Estado de Servidores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {servers.map((server) => (
            <div
              key={server.name}
              className="rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">
                  {server.name}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    server.status === "online"
                      ? "bg-success/20 text-success border-success/30"
                      : "bg-warning/20 text-warning border-warning/30"
                  )}
                >
                  {server.status === "online" ? "Online" : "Mantenimiento"}
                </Badge>
              </div>
              {server.status === "online" && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">CPU</span>
                      <span className={cn(
                        server.cpu > 80 ? "text-destructive" : server.cpu > 60 ? "text-warning" : "text-success"
                      )}>
                        {server.cpu}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          server.cpu > 80 ? "bg-destructive" : server.cpu > 60 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${server.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">RAM</span>
                      <span className={cn(
                        server.memory > 80 ? "text-destructive" : server.memory > 60 ? "text-warning" : "text-success"
                      )}>
                        {server.memory}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          server.memory > 80 ? "bg-destructive" : server.memory > 60 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${server.memory}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function InfraestructuraPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previousStates, setPreviousStates] = useState<Record<string, "online" | "offline">>({})

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

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const savedLocations = localStorage.getItem("infraLocations")
    const savedIncidents = localStorage.getItem("infraIncidents")
    
    if (savedLocations) {
      try {
        const parsed = JSON.parse(savedLocations)
        const normalizedLocations = normalizeLocations(parsed)
        setLocations(normalizedLocations)
        setPreviousStates(Object.fromEntries(normalizedLocations.map((loc: Location) => [loc.id, loc.status])))
      } catch {
        const normalizedMock = normalizeLocations(mockLocations)
        setLocations(normalizedMock)
        setPreviousStates(Object.fromEntries(normalizedMock.map((loc) => [loc.id, loc.status])))
      }
    } else {
      const normalizedMock = normalizeLocations(mockLocations)
      setLocations(normalizedMock)
      setPreviousStates(Object.fromEntries(normalizedMock.map((loc) => [loc.id, loc.status])))
    }

    if (savedIncidents) {
      try {
        const parsed = JSON.parse(savedIncidents, (key, value) => {
          if ((key === "startTime" || key === "endTime") && typeof value === "string") {
            return new Date(value)
          }
          return value
        })
        setIncidents(parsed)
      } catch {
        setIncidents([])
      }
    }
  }, [])

  // Detectar cambios de estado y crear incidentes
  useEffect(() => {
    if (locations.length === 0) return

    locations.forEach((location) => {
      const prevStatus = previousStates[location.id]
      
      // Si cambió de online a offline
      if (prevStatus === "online" && location.status === "offline") {
        const newIncident: Incident = {
          id: `INC-${Date.now()}-${location.id}`,
          locationName: location.name,
          type: "caída",
          startTime: new Date(),
        }
        setIncidents((prev) => {
          const updated = [...prev, newIncident]
          localStorage.setItem("infraIncidents", JSON.stringify(updated))
          return updated
        })
      }
      // Si cambió de offline a online
      else if (prevStatus === "offline" && location.status === "online") {
        // Marcar como restaurado el último incidente de caída
        setIncidents((prev) => {
          const updated = prev.map((inc) =>
            inc.locationName === location.name && inc.type === "caída" && !inc.endTime
              ? { ...inc, type: "restauración", endTime: new Date() }
              : inc
          )
          localStorage.setItem("infraIncidents", JSON.stringify(updated))
          return updated
        })
      }
    })

    // Actualizar estados previos
    setPreviousStates(
      Object.fromEntries(locations.map((loc) => [loc.id, loc.status]))
    )
  }, [locations])

  // Guardar ubicaciones en localStorage cuando cambien
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem("infraLocations", JSON.stringify(locations))
    }
  }, [locations])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const toggleStatus = (locationId: string) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId
          ? {
              ...loc,
              status: loc.status === "online" ? "offline" : "online",
              uptimeStart: loc.status === "offline" ? new Date() : loc.uptimeStart,
              lastDowntime: loc.status === "online" ? new Date() : loc.lastDowntime,
            }
          : loc
      )
    )
  }

  return (
    <DashboardLayout
      title="Infraestructura"
      description="Monitoreo de red y servidores en tiempo real"
    >
      <div className="space-y-6">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
              <Wifi className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">
              Monitoreo activo - Actualizando cada 1 segundo ({incidents.length} incidentes)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Actualizar
          </Button>
        </div>

        {/* Stats */}
        <UptimeStats locations={locations} />

        {/* Location Monitor */}
        <LocationMonitor locations={locations} />

        {/* Simulate controls - for demo */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Simulación de Estados (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Haz clic en una sede para simular una caída o restauración de conexión
            </p>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Button
                  key={loc.id}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStatus(loc.id)}
                  className={cn(
                    loc.status === "online"
                      ? "border-success/50 text-success hover:bg-success/10"
                      : "border-destructive/50 text-destructive hover:bg-destructive/10"
                  )}
                >
                  {loc.status === "online" ? (
                    <Wifi className="h-3 w-3 mr-1" />
                  ) : (
                    <WifiOff className="h-3 w-3 mr-1" />
                  )}
                  {loc.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ServerStatus />
          <IncidentHistory incidents={incidents} />
        </div>
      </div>
    </DashboardLayout>
  )
}
