"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Ticket,
  Globe,
  Shield,
  Monitor,
  Key,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Infraestructura", href: "/infraestructura", icon: Globe },
  // { name: "Seguridad", href: "/seguridad", icon: Shield },
  { name: "Inventario", href: "/inventario", icon: Monitor },
  { name: "Licencias", href: "/licencias", icon: Key },
  { name: "Usuarios", href: "/usuarios", icon: Users },
]

const secondaryNavigation = [
  { name: "Configuración", href: "/configuracion", icon: Settings },
  { name: "Ayuda", href: "/ayuda", icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-white/20">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-6 border-b border-white/20">
        <Image
          src="/images/calm-logo.png"
          alt="Calm Logo"
          width={120}
          height={40}
          className="h-10"
          style={{ width: "auto", height: "40px" }}
          priority
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-white/70">
          Principal
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <div className="my-4 border-t border-white/20" />

        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-white/70">
          Sistema
        </p>
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin IT</p>
            <p className="text-xs text-white/70 truncate">ivanteuber@calmessimple.com.ar</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
