"use client"

import { useEffect, useState, type ElementType } from "react"
import { PasswordGate } from "@/components/auth/password-gate"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { License } from "@/lib/mock-data"
import { 
  Key, 
  FileText,
  MessageSquare,
  Database,
  PenTool,
  Mail,
  Globe,
  TrendingUp,
  AlertCircle,
  Pencil,
  Plus,
  Save,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

const licenseIcons = ["file-text", "message-square", "database", "pen-tool", "mail", "globe"] as const

function getIcon(iconName: string) {
  const icons: Record<string, ElementType> = {
    "file-text": FileText,
    "message-square": MessageSquare,
    "database": Database,
    "pen-tool": PenTool,
    "mail": Mail,
    "globe": Globe,
  }
  return icons[iconName] || Key
}

function LicenseOverview({ licenses }: { licenses: License[] }) {
  const totalLicenses = licenses.reduce((acc, l) => acc + l.totalLicenses, 0)
  const usedLicenses = licenses.reduce((acc, l) => acc + l.usedLicenses, 0)
  const efficiency = totalLicenses === 0 ? 0 : Math.round((usedLicenses / totalLicenses) * 100)
  const nearCapacity = licenses.filter((l) => (l.usedLicenses / l.totalLicenses) >= 0.9).length

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Licencias</p>
              <p className="text-2xl font-bold text-card-foreground">{totalLicenses}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/20">
              <Key className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">En Uso</p>
              <p className="text-2xl font-bold text-chart-2">{usedLicenses}</p>
            </div>
            <div className="p-2 rounded-lg bg-chart-2/20">
              <TrendingUp className="h-5 w-5 text-chart-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
              <p className="text-2xl font-bold text-success">{totalLicenses - usedLicenses}</p>
            </div>
            <div className="p-2 rounded-lg bg-success/20">
              <Key className="h-5 w-5 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Eficiencia</p>
              <p className={cn(
                "text-2xl font-bold",
                efficiency >= 70 ? "text-success" : efficiency >= 50 ? "text-warning" : "text-destructive"
              )}>
                {efficiency}%
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
                  strokeDasharray={`${efficiency * 1.26} 126`}
                  className={cn(
                    efficiency >= 70 ? "text-success" : efficiency >= 50 ? "text-warning" : "text-destructive"
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

function LicenseCard({
  license,
  onEdit,
  onDelete,
}: {
  license: License
  onEdit: (license: License) => void
  onDelete: (id: string) => void
}) {
  const Icon = getIcon(license.icon)
  const usagePercentage = Math.round((license.usedLicenses / license.totalLicenses) * 100)
  const available = license.totalLicenses - license.usedLicenses
  const isNearCapacity = usagePercentage >= 90

  return (
    <Card className={cn(
      "bg-card border-border transition-all hover:border-primary/50",
      isNearCapacity && "border-warning/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isNearCapacity ? "bg-warning/20" : "bg-primary/20"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                isNearCapacity ? "text-warning" : "text-primary"
              )} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-card-foreground">
                {license.software}
              </h3>
              <p className="text-xs text-muted-foreground">ID: {license.id}</p>
            </div>
          </div>
          {isNearCapacity && (
            <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30 text-[10px]">
              <AlertCircle className="h-3 w-3 mr-1" />
              Casi lleno
            </Badge>
          )}
        </div>

        {/* Usage Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Uso</span>
            <span className={cn(
              "font-medium",
              usagePercentage >= 90 ? "text-warning" : usagePercentage >= 70 ? "text-chart-2" : "text-success"
            )}>
              {usagePercentage}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercentage >= 90 ? "bg-warning" : usagePercentage >= 70 ? "bg-chart-2" : "bg-success"
              )}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-secondary/50 p-2">
            <p className="text-lg font-semibold text-card-foreground">{license.totalLicenses}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="rounded-md bg-secondary/50 p-2">
            <p className="text-lg font-semibold text-chart-2">{license.usedLicenses}</p>
            <p className="text-[10px] text-muted-foreground">En Uso</p>
          </div>
          <div className="rounded-md bg-secondary/50 p-2">
            <p className={cn(
              "text-lg font-semibold",
              available <= 5 ? "text-warning" : "text-success"
            )}>
              {available}
            </p>
            <p className="text-[10px] text-muted-foreground">Disponibles</p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(license)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(license.id)}>
            <Trash2 className="h-4 w-4 mr-2 text-destructive" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LicenseRecommendations({ licenses }: { licenses: License[] }) {
  const nearCapacity = licenses.filter((l) => (l.usedLicenses / l.totalLicenses) >= 0.9)
  const underutilized = licenses.filter((l) => (l.usedLicenses / l.totalLicenses) < 0.5)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recomendaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nearCapacity.length > 0 && (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning">Capacidad casi agotada</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {nearCapacity.map((l) => l.software).join(", ")} están cerca de su límite.
                  Considera aumentar las licencias.
                </p>
              </div>
            </div>
          </div>
        )}

        {underutilized.length > 0 && (
          <div className="rounded-lg border border-chart-2/30 bg-chart-2/10 p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-chart-2 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-chart-2">Oportunidad de optimización</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {underutilized.map((l) => l.software).join(", ")} tienen baja utilización.
                  Podrías reducir licencias para ahorrar costos.
                </p>
              </div>
            </div>
          </div>
        )}

        {nearCapacity.length === 0 && underutilized.length === 0 && (
          <div className="rounded-lg border border-success/30 bg-success/10 p-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-success">
                Todas las licencias están bien balanceadas
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function LicenciasPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    software: "",
    totalLicenses: "",
    usedLicenses: "",
    icon: "file-text",
  })

  useEffect(() => {
    fetch("/api/licenses")
      .then((r) => r.json())
      .then((data: License[]) => setLicenses(data))
      .catch(() => {})
  }, [])

  const resetForm = () => {
    setForm({ software: "", totalLicenses: "", usedLicenses: "", icon: "file-text" })
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!form.software.trim()) return
    const total = Number(form.totalLicenses)
    const used = Number(form.usedLicenses)
    if (!Number.isFinite(total) || !Number.isFinite(used) || total <= 0 || used < 0 || used > total) return

    if (editingId) {
      const updated = { software: form.software.trim(), totalLicenses: total, usedLicenses: used, icon: form.icon }
      await fetch(`/api/licenses/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch(() => {})
      setLicenses((prev) => prev.map((item) => item.id === editingId ? { ...item, ...updated } : item))
      resetForm()
      return
    }

    const newId = `LIC-${Date.now()}`
    const newLicense: License = { id: newId, software: form.software.trim(), totalLicenses: total, usedLicenses: used, icon: form.icon }
    await fetch("/api/licenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLicense),
    }).catch(() => {})
    setLicenses((prev) => [newLicense, ...prev])
    resetForm()
  }

  const handleEdit = (license: License) => {
    setEditingId(license.id)
    setForm({ software: license.software, totalLicenses: String(license.totalLicenses), usedLicenses: String(license.usedLicenses), icon: license.icon })
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/licenses/${id}`, { method: "DELETE" }).catch(() => {})
    setLicenses((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <PasswordGate section="Licencias de Software">
    <DashboardLayout
      title="Licencias de Software"
      description="Gestión y monitoreo de licencias"
    >
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">ABM de Licencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                value={form.software}
                onChange={(e) => setForm((prev) => ({ ...prev, software: e.target.value }))}
                placeholder="Software"
              />
              <Input
                value={form.totalLicenses}
                onChange={(e) => setForm((prev) => ({ ...prev, totalLicenses: e.target.value }))}
                placeholder="Total licencias"
                type="number"
                min={1}
              />
              <Input
                value={form.usedLicenses}
                onChange={(e) => setForm((prev) => ({ ...prev, usedLicenses: e.target.value }))}
                placeholder="Licencias en uso"
                type="number"
                min={0}
              />
              <Select value={form.icon} onValueChange={(v) => setForm((prev) => ({ ...prev, icon: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Icono" />
                </SelectTrigger>
                <SelectContent>
                  {licenseIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleSave} disabled={!form.software.trim()}>
                {editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {editingId ? "Guardar cambios" : "Agregar licencia"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar edición
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <LicenseOverview licenses={licenses} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {licenses.map((license) => (
            <LicenseCard
              key={license.id}
              license={license}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <LicenseRecommendations licenses={licenses} />
      </div>
    </DashboardLayout>
    </PasswordGate>
  )
}
