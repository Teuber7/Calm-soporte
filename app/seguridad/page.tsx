"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
const securityMetrics = {
  employeesTrained: 85,
  phishingSimulationsPassed: 78,
  securityIncidents: 3,
  lastIncidentDays: 12,
  pendingUpdates: 15,
  firewallStatus: "active" as const,
}
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Mail,
  Lock,
  Activity,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

function SecurityMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: "success" | "warning" | "destructive" | "primary"
}) {
  const colorClasses = {
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-destructive/20 text-destructive",
    primary: "bg-primary/20 text-primary",
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg", colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrainingProgress() {
  const departments = [
    { name: "Desarrollo", trained: 95, total: 20 },
    { name: "Ventas", trained: 78, total: 35 },
    { name: "Marketing", trained: 88, total: 15 },
    { name: "Operaciones", trained: 70, total: 40 },
    { name: "Finanzas", trained: 92, total: 12 },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Capacitación por Departamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => (
            <div key={dept.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-card-foreground">{dept.name}</span>
                <span className={cn(
                  "font-medium",
                  dept.trained >= 90 ? "text-success" : dept.trained >= 75 ? "text-warning" : "text-destructive"
                )}>
                  {dept.trained}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    dept.trained >= 90 ? "bg-success" : dept.trained >= 75 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${dept.trained}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PhishingSimulations() {
  const simulations = [
    { date: "15 Mar 2024", type: "Email CEO Falso", sent: 150, clicked: 12, reported: 85 },
    { date: "01 Mar 2024", type: "Factura Sospechosa", sent: 150, clicked: 18, reported: 72 },
    { date: "15 Feb 2024", type: "Actualización Urgente", sent: 145, clicked: 25, reported: 68 },
    { date: "01 Feb 2024", type: "Premio Falso", sent: 145, clicked: 8, reported: 92 },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4 text-warning" />
          Simulaciones de Phishing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {simulations.map((sim, i) => {
            const clickRate = Math.round((sim.clicked / sim.sent) * 100)
            const reportRate = Math.round((sim.reported / sim.sent) * 100)
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">
                    {sim.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{sim.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-secondary/50 p-2">
                    <p className="text-lg font-semibold text-card-foreground">{sim.sent}</p>
                    <p className="text-[10px] text-muted-foreground">Enviados</p>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2">
                    <p className={cn(
                      "text-lg font-semibold",
                      clickRate <= 10 ? "text-success" : clickRate <= 20 ? "text-warning" : "text-destructive"
                    )}>
                      {clickRate}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Click Rate</p>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2">
                    <p className={cn(
                      "text-lg font-semibold",
                      reportRate >= 80 ? "text-success" : reportRate >= 60 ? "text-warning" : "text-destructive"
                    )}>
                      {reportRate}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Reportados</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityIncidents() {
  const incidents = [
    { id: 1, type: "Intento de acceso no autorizado", severity: "alta", status: "resuelto", date: "Hace 12 días" },
    { id: 2, type: "Malware detectado en endpoint", severity: "alta", status: "resuelto", date: "Hace 18 días" },
    { id: 3, type: "Conexión VPN sospechosa", severity: "media", status: "resuelto", date: "Hace 25 días" },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Incidentes Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  incident.severity === "alta" ? "bg-destructive/20" : "bg-warning/20"
                )}>
                  <Shield className={cn(
                    "h-4 w-4",
                    incident.severity === "alta" ? "text-destructive" : "text-warning"
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {incident.type}
                  </p>
                  <p className="text-xs text-muted-foreground">{incident.date}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-success/20 text-success border-success/30"
              >
                {incident.status}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg border border-success/30 bg-success/10">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">
              {securityMetrics.lastIncidentDays} días sin incidentes activos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FirewallStatus() {
  const rules = [
    { name: "Bloqueo de IPs maliciosas", status: "active", blocked: 1243 },
    { name: "Filtro de contenido", status: "active", blocked: 856 },
    { name: "Prevención de intrusos", status: "active", blocked: 324 },
    { name: "Anti-DDoS", status: "active", blocked: 12 },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Lock className="h-4 w-4 text-success" />
          Estado del Firewall
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-success/10 border border-success/30">
          <Activity className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">Firewall Activo</span>
        </div>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.name}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-card-foreground">{rule.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {rule.blocked.toLocaleString()} bloqueados
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function SeguridadPage() {
  return (
    <DashboardLayout
      title="Seguridad"
      description="Panel de seguridad informática"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SecurityMetricCard
            title="Empleados Capacitados"
            value={`${securityMetrics.employeesTrained}%`}
            subtitle="122 de 150 empleados"
            icon={Users}
            color="success"
          />
          <SecurityMetricCard
            title="Phishing Test Pasados"
            value={`${securityMetrics.phishingSimulationsPassed}%`}
            subtitle="Último mes"
            icon={Mail}
            color="warning"
          />
          <SecurityMetricCard
            title="Incidentes Este Mes"
            value={securityMetrics.securityIncidents}
            subtitle="0 activos"
            icon={AlertTriangle}
            color="destructive"
          />
          <SecurityMetricCard
            title="Actualizaciones Pendientes"
            value={securityMetrics.pendingUpdates}
            subtitle="Endpoints"
            icon={Clock}
            color="primary"
          />
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TrainingProgress />
          <PhishingSimulations />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SecurityIncidents />
          <FirewallStatus />
        </div>
      </div>
    </DashboardLayout>
  )
}
