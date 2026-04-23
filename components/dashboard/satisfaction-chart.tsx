"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Ticket } from "@/lib/mock-data"

interface SatisfactionChartProps {
  tickets: Ticket[]
}

export function SatisfactionChart({ tickets }: SatisfactionChartProps) {
  const ratedTickets = tickets.filter((t) => t.rating != null)
  const avgRating =
    ratedTickets.length > 0
      ? ratedTickets.reduce((acc, t) => acc + (t.rating || 0), 0) / ratedTickets.length
      : 0

  // Calculate distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratedTickets.filter((t) => t.rating === star).length,
    percentage:
      ratedTickets.length > 0
        ? (ratedTickets.filter((t) => t.rating === star).length / ratedTickets.length) * 100
        : 0,
  }))

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Satisfacción del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= Math.round(avgRating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <div>
            <span className="text-2xl font-bold text-card-foreground">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground"> / 5</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({ratedTickets.length} valoraciones)
          </span>
        </div>

        <div className="space-y-2">
          {distribution.map((item) => (
            <div key={item.star} className="flex items-center gap-2">
              <span className="w-3 text-xs text-muted-foreground">{item.star}</span>
              <Star className="h-3 w-3 fill-primary text-primary" />
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Recent comments */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Comentarios recientes
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {ratedTickets
              .filter((t) => t.comment)
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-2 rounded-lg bg-secondary/50 text-xs"
                >
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= (ticket.rating || 0)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-card-foreground">{ticket.comment}</p>
                  <p className="text-muted-foreground mt-1">- {ticket.userName}</p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
