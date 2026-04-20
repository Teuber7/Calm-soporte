"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, TrendingUp, Star } from "lucide-react"
import { cn } from "@/lib/utils"

function formatMinutes(minutes: number): string {
  if (minutes === 0) return "—"
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  className?: string
}

function KPICard({ title, value, subtitle, icon, trend, className }: KPICardProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <span className={cn("text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface KPICardsProps {
  avgResponseTime: number
  avgResolutionTime: number
  slaCumplido: number
  satisfaccion: number
  satisfactionTrend?: number
  hasData?: boolean
}

export function KPICards({
  avgResponseTime,
  avgResolutionTime,
  slaCumplido,
  satisfaccion,
  satisfactionTrend = 0,
  hasData = false,
}: KPICardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Primera Respuesta"
        value={formatMinutes(avgResponseTime)}
        subtitle={hasData ? "Promedio real" : "Sin datos aún"}
        icon={<Clock className="h-5 w-5" />}
      />
      <KPICard
        title="Tiempo de Resolución"
        value={formatMinutes(avgResolutionTime)}
        subtitle={hasData ? "Promedio real" : "Sin datos aún"}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <KPICard
        title="SLA Cumplido"
        value={hasData ? `${slaCumplido}%` : "—"}
        subtitle={hasData ? "Alta: 4h · Media: 8h · Baja: 24h" : "Sin tickets resueltos"}
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <KPICard
        title="Satisfacción"
        value={satisfaccion.toFixed(1)}
        subtitle="de 5 estrellas"
        icon={<Star className="h-5 w-5 fill-primary" />}
        trend={satisfactionTrend !== 0 ? { value: Math.abs(satisfactionTrend), isPositive: satisfactionTrend >= 0 } : undefined}
      />
    </div>
  )
}
