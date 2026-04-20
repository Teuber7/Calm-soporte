"use client"

import { useEffect, useState } from "react"
import { PasswordGate } from "@/components/auth/password-gate"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserAccess } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  UserPlus, 
  UserMinus,
  CheckCircle,
  Circle,
  Mail,
  Building,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

function UserStats({ users }: { users: UserAccess[] }) {
  const onboarding = users.filter((u) => u.status === "onboarding").length
  const offboarding = users.filter((u) => u.status === "offboarding").length
  const active = users.filter((u) => u.status === "active").length

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Onboarding Activos</p>
              <p className="text-2xl font-bold text-primary">{onboarding}</p>
              <p className="text-xs text-muted-foreground mt-1">Nuevos ingresos</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/20">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Offboarding Activos</p>
              <p className="text-2xl font-bold text-warning">{offboarding}</p>
              <p className="text-xs text-muted-foreground mt-1">Salidas en proceso</p>
            </div>
            <div className="p-2 rounded-lg bg-warning/20">
              <UserMinus className="h-5 w-5 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Usuarios Activos</p>
              <p className="text-2xl font-bold text-success">{active}</p>
              <p className="text-xs text-muted-foreground mt-1">Con accesos completos</p>
            </div>
            <div className="p-2 rounded-lg bg-success/20">
              <Users className="h-5 w-5 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChecklistCard({ 
  user, 
  onToggle,
  onComplete,
}: { 
  user: UserAccess
  onToggle: (userId: string, itemIndex: number) => void 
  onComplete: (userId: string) => void
}) {
  const isOnboarding = user.status === "onboarding"
  const checklist = isOnboarding ? user.onboardingChecklist : user.offboardingChecklist
  
  if (!checklist) return null

  const completedItems = checklist.filter((item) => item.completed).length
  const totalItems = checklist.length
  const progress = Math.round((completedItems / totalItems) * 100)

  return (
    <Card className={cn(
      "bg-card border-border",
      progress === 100 && "border-success/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
              isOnboarding ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"
            )}>
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h3 className="text-sm font-medium text-card-foreground">{user.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]",
              isOnboarding
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-warning/20 text-warning border-warning/30"
            )}
          >
            {isOnboarding ? "Onboarding" : "Offboarding"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <Building className="h-3 w-3" />
          {user.department}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progreso</span>
            <span className={cn(
              "font-medium",
              progress === 100 ? "text-success" : progress >= 50 ? "text-chart-2" : "text-muted-foreground"
            )}>
              {completedItems}/{totalItems} completados
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-success" : isOnboarding ? "bg-primary" : "bg-warning"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {checklist.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2 transition-colors",
                item.completed && "bg-success/10 border-success/30"
              )}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => onToggle(user.id, index)}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              <span className={cn(
                "text-sm flex-1",
                item.completed ? "text-success line-through" : "text-card-foreground"
              )}>
                {item.item}
              </span>
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {progress === 100 && (
          <Button className="w-full mt-4" variant="outline" onClick={() => onComplete(user.id)}>
            <CheckCircle className="h-4 w-4 mr-2 text-success" />
            Completar {isOnboarding ? "Onboarding" : "Offboarding"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function ActiveUsersList({ users }: { users: UserAccess[] }) {
  const activeUsers = users.filter((u) => u.status === "active")

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-success" />
          Usuarios Activos Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/20 text-sm font-medium text-success">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.department}</p>
              </div>
              <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-[10px]">
                Activo
              </Badge>
            </div>
          ))}

          {activeUsers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay usuarios activos para mostrar
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InactiveUsersList({ users }: { users: UserAccess[] }) {
  const inactiveUsers = users.filter((u) => u.status === "inactive")

  return (
    <Card className="bg-card border-border border-destructive/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserMinus className="h-4 w-4 text-destructive" />
          Offboarding Completados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {inactiveUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/20 text-sm font-medium text-destructive">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.department}</p>
              </div>
              <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 text-[10px]">
                Baja
              </Badge>
            </div>
          ))}

          {inactiveUsers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay offboardings completados
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserAccess[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "IT",
    type: "onboarding" as "onboarding" | "offboarding",
  })

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data: UserAccess[]) => setUsers(data))
      .catch(() => {})
  }, [])

  const handleCreateUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return

    const newUser: UserAccess = {
      id: `USR-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      status: formData.type,
      onboardingChecklist: formData.type === "onboarding" ? [
        { item: "Crear cuenta de usuario", completed: false },
        { item: "Configurar acceso VPN", completed: false },
        { item: "Instalación de software requerido", completed: false },
        { item: "Capacitación de seguridad", completed: false },
      ] : undefined,
      offboardingChecklist: formData.type === "offboarding" ? [
        { item: "Revocar acceso VPN", completed: false },
        { item: "Deshabilitar cuenta de usuario", completed: false },
        { item: "Recuperar equipos", completed: false },
        { item: "Auditoría de accesos", completed: false },
      ] : undefined,
    }
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }).catch(() => {})
    setUsers((prev) => [...prev, newUser])
    setFormData({ name: "", email: "", department: "IT", type: "onboarding" })
    setIsDialogOpen(false)
  }

  const handleToggleChecklist = async (userId: string, itemIndex: number) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return
    const isOnboarding = user.status === "onboarding"
    const checklist = isOnboarding ? user.onboardingChecklist : user.offboardingChecklist
    if (!checklist) return
    const updatedChecklist = checklist.map((item, i) =>
      i === itemIndex ? { ...item, completed: !item.completed } : item
    )
    const patch = isOnboarding
      ? { onboardingChecklist: updatedChecklist }
      : { offboardingChecklist: updatedChecklist }
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {})
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? isOnboarding
            ? { ...u, onboardingChecklist: updatedChecklist }
            : { ...u, offboardingChecklist: updatedChecklist }
          : u
      )
    )
  }

  const handleCompleteProcess = async (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return
    if (user.status === "onboarding") {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", onboardingChecklist: null }),
      }).catch(() => {})
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: "active" as const, onboardingChecklist: undefined } : u
        )
      )
    } else if (user.status === "offboarding") {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive", offboardingChecklist: null }),
      }).catch(() => {})
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: "inactive" as const, offboardingChecklist: undefined } : u
        )
      )
    }
  }

  const onboardingUsers = users.filter((u) => u.status === "onboarding")
  const offboardingUsers = users.filter((u) => u.status === "offboarding")

  return (
    <PasswordGate section="Gestión de Usuarios">
    <DashboardLayout
      title="Gestión de Usuarios"
      description="Onboarding y Offboarding de empleados"
    >
      <div className="space-y-6">
        <UserStats users={users} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Procesos Activos</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Onboarding / Offboarding
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Onboarding ({onboardingUsers.length})
            </h3>
            {onboardingUsers.map((user) => (
              <ChecklistCard
                key={user.id}
                user={user}
                onToggle={handleToggleChecklist}
                onComplete={handleCompleteProcess}
              />
            ))}
            {onboardingUsers.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay onboardings en proceso
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserMinus className="h-4 w-4 text-warning" />
              Offboarding ({offboardingUsers.length})
            </h3>
            {offboardingUsers.map((user) => (
              <ChecklistCard
                key={user.id}
                user={user}
                onToggle={handleToggleChecklist}
                onComplete={handleCompleteProcess}
              />
            ))}
            {offboardingUsers.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay offboardings en proceso
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ActiveUsersList users={users} />
          <InactiveUsersList users={users} />
        </div>
      </div>
      
      {/* Dialog para crear nuevo usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Crear Nuevo Proceso</DialogTitle>
            <DialogDescription>
              Agrega un nuevo usuario para onboarding o offboarding
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Nombre Completo
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
                className="bg-secondary border-0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@empresa.com"
                className="bg-secondary border-0"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Departamento
              </label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="IT"
                className="bg-secondary border-0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Tipo de Proceso
              </label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "onboarding" | "offboarding") => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-primary" />
                      Onboarding (Ingreso)
                    </div>
                  </SelectItem>
                  <SelectItem value="offboarding">
                    <div className="flex items-center gap-2">
                      <UserMinus className="h-4 w-4 text-warning" />
                      Offboarding (Salida)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Crear Proceso
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
    </PasswordGate>
  )
}
