import { NextResponse } from "next/server"

// UptimeRobot status codes
// 0 = paused, 1 = not checked yet, 2 = up, 8 = seems down, 9 = down

interface UptimeRobotMonitor {
  id: number
  friendly_name: string
  url: string
  status: number
  all_time_uptime_ratio: string
  average_response_time: string
  create_datetime: number
}

interface UptimeRobotResponse {
  stat: string
  monitors: UptimeRobotMonitor[]
}

async function fetchMonitor(apiKey: string): Promise<UptimeRobotMonitor | null> {
  try {
    const res = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: apiKey,
        format: "json",
        response_times: "1",
        all_time_uptime_ratio: "1",
      }),
      next: { revalidate: 0 },
    })
    const data = await res.json() as UptimeRobotResponse
    if (data.stat === "ok" && data.monitors?.length > 0) {
      return data.monitors[0]
    }
    return null
  } catch {
    return null
  }
}

function mapStatus(status: number): "online" | "offline" | "degraded" {
  if (status === 2) return "online"
  if (status === 8) return "degraded"
  return "offline"
}

export async function GET() {
  const monitors: { key: string; name: string; ip: string }[] = []

  if (process.env.UPTIMEROBOT_GODOY) {
    monitors.push({ key: process.env.UPTIMEROBOT_GODOY, name: "Localm Godoy", ip: "181.110.15.83" })
  }
  if (process.env.UPTIMEROBOT_UGARTE) {
    monitors.push({ key: process.env.UPTIMEROBOT_UGARTE, name: "Oficina Ugarte", ip: "190.224.135.237" })
  }
  if (process.env.UPTIMEROBOT_SANTOS) {
    monitors.push({ key: process.env.UPTIMEROBOT_SANTOS, name: "Localm Santos", ip: "181.14.209.205" })
  }
  if (process.env.UPTIMEROBOT_AUSTRIA) {
    monitors.push({ key: process.env.UPTIMEROBOT_AUSTRIA, name: "Localm Austria", ip: "181.104.115.5" })
  }

  const results = await Promise.all(
    monitors.map(async ({ key, name, ip }) => {
      const monitor = await fetchMonitor(key)
      if (!monitor) return { name, ip, url: null, status: "offline" as const, uptime: "0", responseTime: null }
      return {
        id: monitor.id,
        name,
        ip,
        url: monitor.url || null,
        status: mapStatus(monitor.status),
        uptime: parseFloat(monitor.all_time_uptime_ratio || "0").toFixed(2),
        responseTime: monitor.average_response_time ? parseInt(monitor.average_response_time) : null,
      }
    })
  )

  return NextResponse.json(results)
}
