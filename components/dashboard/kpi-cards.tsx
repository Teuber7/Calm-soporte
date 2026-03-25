"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, TrendingUp, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
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
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
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
}

export function KPICards({ avgResponseTime, avgResolutionTime, slaCumplido, satisfaccion, satisfactionTrend = 0 }: KPICardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Tiempo de Respuesta"
        value={`${avgResponseTime} min`}
        subtitle="Promedio"
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: -12, isPositive: true }}
      />
      <KPICard
        title="Tiempo de Resolución"
        value={`${Math.round(avgResolutionTime)} min`}
        subtitle="Promedio"
        icon={<CheckCircle className="h-5 w-5" />}
        trend={{ value: -8, isPositive: true }}
      />
      <KPICard
        title="SLA Cumplido"
        value={`${slaCumplido}%`}
        subtitle="Este mes"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 3, isPositive: true }}
      />
      <KPICard
        title="Satisfacción"
        value={satisfaccion.toFixed(1)}
        subtitle="de 5 estrellas"
        icon={<Star className="h-5 w-5 fill-primary" />}
        trend={{ value: Math.abs(satisfactionTrend), isPositive: satisfactionTrend >= 0 }}
      />
    </div>
  )
}
