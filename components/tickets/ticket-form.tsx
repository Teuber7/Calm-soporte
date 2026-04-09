"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface TicketFormProps {
  onSubmit: (ticket: {
    userName: string
    userEmail: string
    problem: string
    priority: "alta" | "media" | "baja"
  }) => void
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [problem, setProblem] = useState("")
  const [priority, setPriority] = useState<"alta" | "media" | "baja">("media")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !problem.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onSubmit({ userName, userEmail, problem, priority })
    setUserName("")
    setUserEmail("")
    setProblem("")
    setPriority("media")
    setIsSubmitting(false)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Nombre del Usuario
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ingrese su nombre"
              className="bg-secondary border-0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Email del Usuario
            </label>
            <Input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="correo@empresa.com"
              className="bg-secondary border-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Descripción del Problema
            </label>
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describa el problema que está experimentando..."
              className="bg-secondary border-0 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Prioridad
            </label>
            <Select value={priority} onValueChange={(v: "alta" | "media" | "baja") => setPriority(v)}>
              <SelectTrigger className="bg-secondary border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Alta
                  </div>
                </SelectItem>
                <SelectItem value="media">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Media
                  </div>
                </SelectItem>
                <SelectItem value="baja">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Baja
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !userName.trim() || !problem.trim()}
          >
            {isSubmitting ? "Enviando..." : "Crear Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
