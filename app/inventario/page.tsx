"use client"

import { useEffect, useState } from "react"
import { PasswordGate } from "@/components/auth/password-gate"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Equipment } from "@/lib/mock-data"
import { 
  Monitor, 
  Laptop, 
  Printer, 
  Mouse,
  Search,
  Plus,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Pencil,
  Save,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

function getEquipmentIcon(type: Equipment["type"]) {
  switch (type) {
    case "PC":
      return Monitor
    case "Notebook":
      return Laptop
    case "Impresora":
      return Printer
    case "Monitor":
      return Monitor
    case "Periferico":
      return Mouse
    default:
      return Package
  }
}

function getStatusColor(status: Equipment["status"]) {
  switch (status) {
    case "activo":
      return "bg-success/20 text-success border-success/30"
    case "mantenimiento":
      return "bg-warning/20 text-warning border-warning/30"
    case "baja":
      return "bg-destructive/20 text-destructive border-destructive/30"
  }
}

function getStatusIcon(status: Equipment["status"]) {
  switch (status) {
    case "activo":
      return CheckCircle
    case "mantenimiento":
      return AlertCircle
    case "baja":
      return XCircle
  }
}

function InventoryStats({ equipment }: { equipment: Equipment[] }) {
  const total = equipment.length
  const active = equipment.filter((e) => e.status === "activo").length
  const maintenance = equipment.filter((e) => e.status === "mantenimiento").length
  const retired = equipment.filter((e) => e.status === "baja").length
  const updatePercentage = total === 0 ? 0 : Math.round((active / total) * 100)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Equipos</p>
              <p className="text-2xl font-bold text-card-foreground">{total}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/20">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-success">{active}</p>
            </div>
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Mantenimiento</p>
              <p className="text-2xl font-bold text-warning">{maintenance}</p>
            </div>
            <div className="p-2 rounded-lg bg-warning/20">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Dados de Baja</p>
              <p className="text-2xl font-bold text-destructive">{retired}</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/20">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">% Actualizado</p>
              <p className={cn(
                "text-2xl font-bold",
                updatePercentage >= 80 ? "text-success" : updatePercentage >= 60 ? "text-warning" : "text-destructive"
              )}>
                {updatePercentage}%
              </p>
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-secondary"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${updatePercentage * 1.26} 126`}
                  className={cn(
                    updatePercentage >= 80 ? "text-success" : updatePercentage >= 60 ? "text-warning" : "text-destructive"
                  )}
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EquipmentTable({
  equipment,
  onChange,
}: {
  equipment: Equipment[]
  onChange: (next: Equipment[]) => void
}) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | Equipment["type"]>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | Equipment["status"]>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    type: "PC" as Equipment["type"],
    model: "",
    status: "activo" as Equipment["status"],
    assignedTo: "",
    serialNumber: "",
  })

  const resetForm = () => {
    setForm({
      type: "PC",
      model: "",
      status: "activo",
      assignedTo: "",
      serialNumber: "",
    })
    setEditingId(null)
  }

  const handleSubmit = () => {
    if (!form.model.trim() || !form.serialNumber.trim()) return

    if (editingId) {
      onChange(
        equipment.map((item) =>
          item.id === editingId
            ? {
                ...item,
                type: form.type,
                model: form.model.trim(),
                status: form.status,
                assignedTo: form.assignedTo.trim() || undefined,
                serialNumber: form.serialNumber.trim(),
              }
            : item
        )
      )
      resetForm()
      return
    }

    const newEquipment: Equipment = {
      id: `EQ-${Date.now()}`,
      type: form.type,
      model: form.model.trim(),
      status: form.status,
      assignedTo: form.assignedTo.trim() || undefined,
      serialNumber: form.serialNumber.trim(),
    }

    onChange([newEquipment, ...equipment])
    resetForm()
  }

  const handleEdit = (item: Equipment) => {
    setEditingId(item.id)
    setForm({
      type: item.type,
      model: item.model,
      status: item.status,
      assignedTo: item.assignedTo ?? "",
      serialNumber: item.serialNumber,
    })
  }

  const handleDelete = (id: string) => {
    onChange(equipment.filter((item) => item.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.model.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.assignedTo?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || eq.type === typeFilter
    const matchesStatus = statusFilter === "all" || eq.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold">Lista de Equipos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg border border-border bg-secondary/20 p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Input
              value={form.model}
              onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
              placeholder="Modelo"
              className="bg-background"
            />
            <Input
              value={form.serialNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, serialNumber: e.target.value }))}
              placeholder="Serial"
              className="bg-background"
            />
            <Input
              value={form.assignedTo}
              onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
              placeholder="Asignado a (opcional)"
              className="bg-background"
            />
            <Select value={form.type} onValueChange={(v: Equipment["type"]) => setForm((prev) => ({ ...prev, type: v }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="Notebook">Notebook</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Impresora">Impresora</SelectItem>
                <SelectItem value="Periferico">Periferico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.status} onValueChange={(v: Equipment["status"]) => setForm((prev) => ({ ...prev, status: v }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!form.model.trim() || !form.serialNumber.trim()}>
              {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingId ? "Guardar cambios" : "Agregar equipo"}
            </Button>
            {editingId && (
              <Button size="sm" variant="outline" onClick={resetForm}>
                Cancelar edición
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por modelo, serial o usuario..."
              className="pl-9 bg-secondary border-0"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v: "all" | Equipment["type"]) => setTypeFilter(v)}>
            <SelectTrigger className="w-full sm:w-36 bg-secondary border-0">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PC">PC</SelectItem>
              <SelectItem value="Notebook">Notebook</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Impresora">Impresora</SelectItem>
              <SelectItem value="Periferico">Periferico</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v: "all" | Equipment["status"]) => setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-36 bg-secondary border-0">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="space-y-2">
          {filteredEquipment.map((eq) => {
            const Icon = getEquipmentIcon(eq.type)
            const StatusIcon = getStatusIcon(eq.status)
            return (
              <div
                key={eq.id}
                className="rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {eq.model}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] shrink-0", getStatusColor(eq.status))}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {eq.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>ID: {eq.id}</span>
                      <span>S/N: {eq.serialNumber}</span>
                      <span>Tipo: {eq.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {eq.assignedTo ? (
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {eq.assignedTo}
                        </p>
                        <p className="text-xs text-muted-foreground">Asignado</p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sin asignar</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(eq)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(eq.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredEquipment.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron equipos
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function InventarioPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])

  useEffect(() => {
    fetch("/api/equipment")
      .then((r) => r.json())
      .then((data: Equipment[]) => setEquipment(data))
      .catch(() => {})
  }, [])

  const handleEquipmentChange = async (next: Equipment[]) => {
    const prev = equipment
    if (next.length > prev.length) {
      const added = next.find((item) => !prev.some((p) => p.id === item.id))
      if (added) {
        await fetch("/api/equipment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(added),
        }).catch(() => {})
      }
    } else if (next.length < prev.length) {
      const removed = prev.find((item) => !next.some((n) => n.id === item.id))
      if (removed) {
        await fetch(`/api/equipment/${removed.id}`, { method: "DELETE" }).catch(() => {})
      }
    } else {
      const changed = next.find((item) => {
        const old = prev.find((p) => p.id === item.id)
        return old && JSON.stringify(old) !== JSON.stringify(item)
      })
      if (changed) {
        const { id, ...data } = changed
        await fetch(`/api/equipment/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(() => {})
      }
    }
    setEquipment(next)
  }

  return (
    <PasswordGate section="Inventario IT">
    <DashboardLayout
      title="Inventario IT"
      description="Gestión de equipos y activos"
    >
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Inventario oficial en Notion</p>
                <p className="text-xs text-muted-foreground">Accede directamente al inventario compartido del equipo</p>
              </div>
              <Button asChild>
                <a
                  href="https://www.notion.so/calmessimple/b33cc90601f648758c056c89bf6b6928?v=94b4db8e65a248a8ad35c6f52b6f2557"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir Inventario en Notion
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        <InventoryStats equipment={equipment} />
        <EquipmentTable equipment={equipment} onChange={handleEquipmentChange} />
      </div>
    </DashboardLayout>
    </PasswordGate>
  )
}
