"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type PageState = "loading" | "form" | "already_rated" | "submitted" | "error"

interface TicketInfo {
  id: string
  userName: string
  problem: string
  rating: number | null
}

export default function CalificarPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<PageState>("loading")
  const [ticket, setTicket] = useState<TicketInfo | null>(null)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/calificar/${token}`)
      .then((r) => {
        if (r.status === 404) { setState("error"); return null }
        return r.json()
      })
      .then((data: TicketInfo | null) => {
        if (!data) return
        setTicket(data)
        setState(data.rating !== null ? "already_rated" : "form")
      })
      .catch(() => setState("error"))
  }, [token])

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return
    setSubmitting(true)
    const res = await fetch(`/api/calificar/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment: comment || undefined }),
    })
    if (res.status === 409) {
      setState("already_rated")
    } else if (res.ok) {
      setState("submitted")
    } else {
      setState("error")
    }
    setSubmitting(false)
  }

  const labels: Record<number, string> = {
    1: "Malo",
    2: "Regular",
    3: "Bueno",
    4: "Muy bueno",
    5: "Excelente",
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg">
        {/* Logo / Branding */}
        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Soporte Técnico</p>
          <h1 className="text-xl font-bold text-card-foreground">Calm</h1>
        </div>

        {state === "loading" && (
          <p className="text-center text-muted-foreground text-sm">Cargando…</p>
        )}

        {state === "error" && (
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Enlace inválido o expirado</p>
            <p className="text-sm text-muted-foreground">Este link de calificación no es válido.</p>
          </div>
        )}

        {state === "already_rated" && (
          <div className="text-center space-y-2">
            <p className="text-2xl">✅</p>
            <p className="font-semibold text-card-foreground">¡Ya calificaste este ticket!</p>
            <p className="text-sm text-muted-foreground">Tu opinión ya fue registrada. ¡Gracias!</p>
          </div>
        )}

        {state === "submitted" && (
          <div className="text-center space-y-3">
            <p className="text-4xl">🙌</p>
            <p className="font-semibold text-card-foreground text-lg">¡Gracias por tu calificación!</p>
            <p className="text-sm text-muted-foreground">
              Tu opinión nos ayuda a seguir mejorando el soporte.
            </p>
          </div>
        )}

        {state === "form" && ticket && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-card-foreground">Hola, {ticket.userName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tu ticket <span className="font-mono">{ticket.id}</span> fue resuelto.
                ¿Cómo fue la atención que recibiste?
              </p>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onPointerEnter={() => setHovered(star)}
                    onPointerLeave={() => setHovered(0)}
                    onClick={() => { setRating(star); setHovered(0) }}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "h-9 w-9 transition-colors",
                        star <= (hovered > 0 ? hovered : rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p className="text-sm font-medium text-primary">
                  {labels[hovered || rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Comentario <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contanos más sobre tu experiencia…"
                className="bg-secondary border-0 min-h-[80px]"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
            >
              {submitting ? "Enviando…" : "Enviar calificación"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
