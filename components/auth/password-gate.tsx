"use client"

import { useState, useEffect } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const SESSION_KEY = "calm_protected_auth"
const PASSWORD = "Calm2019+"

interface PasswordGateProps {
  children: React.ReactNode
  section: string
}

export function PasswordGate({ children, section }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [input, setInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthenticated(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1")
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setInput("")
    }
  }

  // Avoid flash of lock screen on hydration
  if (!mounted) return null

  if (authenticated) return <>{children}</>

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Sección protegida</h2>
            <p className="text-sm text-muted-foreground mt-1">{section}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false) }}
                placeholder="Contraseña"
                className={cn(
                  "bg-secondary border-0 pr-10",
                  error && "ring-2 ring-destructive"
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive text-center">Contraseña incorrecta</p>
            )}

            <Button type="submit" className="w-full" disabled={!input}>
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
