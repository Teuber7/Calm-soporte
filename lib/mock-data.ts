// Types
export interface Ticket {
  id: string
  userName: string
  problem: string
  priority: "alta" | "media" | "baja"
  status: "abierto" | "en_proceso" | "resuelto"
  createdAt: Date
  resolvedAt?: Date
  rating?: number
  comment?: string
}

export interface Location {
  id: string
  name: string
  status: "online" | "offline"
  uptimeStart: Date
  lastDowntime?: Date
}

export interface Equipment {
  id: string
  type: "PC" | "Notebook" | "Periferico" | "Monitor" | "Impresora"
  model: string
  status: "activo" | "mantenimiento" | "baja"
  assignedTo?: string
  serialNumber: string
}

export interface License {
  id: string
  software: string
  totalLicenses: number
  usedLicenses: number
  icon: string
}

export interface UserAccess {
  id: string
  name: string
  email: string
  department: string
  status: "onboarding" | "offboarding" | "active" | "inactive"
  onboardingChecklist?: { item: string; completed: boolean }[]
  offboardingChecklist?: { item: string; completed: boolean }[]
}

// Mock Data
export const mockTickets: Ticket[] = [
  
]

export const mockLocations: Location[] = [
  {
    id: "LOC-001",
    name: "Localm Austrias",
    status: "online",
    uptimeStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "LOC-002",
    name: "Localm Libertador",
    status: "online",
    uptimeStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "LOC-003",
    name: "Localm Godoy",
    status: "online",
    uptimeStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "LOC-004",
    name: "Localm Santos",
    status: "offline",
    uptimeStart: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastDowntime: new Date(),
  },
]

export const mockEquipment: Equipment[] = [
  { id: "EQ-001", type: "PC", model: "Dell OptiPlex 7090", status: "activo", assignedTo: "Carlos Martinez", serialNumber: "DL7090-001" },
  { id: "EQ-002", type: "Notebook", model: "Lenovo ThinkPad X1", status: "activo", assignedTo: "Ana García", serialNumber: "LN-X1-002" },
  { id: "EQ-003", type: "Monitor", model: "Samsung 27\" 4K", status: "activo", assignedTo: "Miguel López", serialNumber: "SM27-003" },
  { id: "EQ-004", type: "PC", model: "HP ProDesk 400", status: "mantenimiento", serialNumber: "HP400-004" },
  { id: "EQ-005", type: "Impresora", model: "HP LaserJet Pro", status: "activo", serialNumber: "HPLJ-005" },
  { id: "EQ-006", type: "Notebook", model: "MacBook Pro 14\"", status: "activo", assignedTo: "Laura Sánchez", serialNumber: "MBP14-006" },
  { id: "EQ-008", type: "PC", model: "Dell OptiPlex 5090", status: "baja", serialNumber: "DL5090-008" },
]

export const mockLicenses: License[] = [
  { id: "LIC-001", software: "Microsoft Office 365", totalLicenses: 150, usedLicenses: 142, icon: "file-text" },
  { id: "LIC-002", software: "Slack", totalLicenses: 200, usedLicenses: 156, icon: "message-square" },
  { id: "LIC-003", software: "Netsuite", totalLicenses: 50, usedLicenses: 48, icon: "database" },
  { id: "LIC-004", software: "Figma", totalLicenses: 30, usedLicenses: 25, icon: "pen-tool" },
  { id: "LIC-005", software: "Google Workspace", totalLicenses: 180, usedLicenses: 165, icon: "mail" },
  { id: "LIC-006", software: "WordPress", totalLicenses: 10, usedLicenses: 8, icon: "globe" },
]

export const mockUsers: UserAccess[] = [
  {
    id: "USR-001",
    name: "María Fernández",
    email: "maria.fernandez@empresa.com",
    department: "Marketing",
    status: "onboarding",
    onboardingChecklist: [
      { item: "Email corporativo creado", completed: true },
      { item: "Acceso a Slack", completed: true },
      { item: "Acceso a Drive compartido", completed: false },
      { item: "Equipo asignado", completed: false },
      { item: "VPN configurada", completed: false },
    ],
  },
  {
    id: "USR-002",
    name: "Pedro González",
    email: "pedro.gonzalez@empresa.com",
    department: "Ventas",
    status: "offboarding",
    offboardingChecklist: [
      { item: "Email desactivado", completed: true },
      { item: "Accesos revocados", completed: true },
      { item: "Equipo recuperado", completed: false },
      { item: "Datos respaldados", completed: true },
    ],
  },
  {
    id: "USR-003",
    name: "Sofía Martínez",
    email: "sofia.martinez@empresa.com",
    department: "Desarrollo",
    status: "active",
  },
]

export const securityMetrics = {
  employeesTrained: 85,
  phishingSimulationsPassed: 78,
  securityIncidents: 3,
  lastIncidentDays: 12,
  pendingUpdates: 15,
  firewallStatus: "active" as const,
}

export const kpiMetrics = {
  avgResponseTime: 25, // minutes
  avgResolutionTime: 4.2, // hours
  slaCumplido: 94,
  satisfaccion: 4.6,
}
