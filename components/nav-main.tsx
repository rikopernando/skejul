"use client"

import { Link } from "next-view-transitions"
import {
  Calendar,
  CreditCard,
  Home,
  Settings,
  Users,
  type LucideIcon,
  Bell,
  Bot,
  FileSpreadsheet,
  CalendarClock,
  Shield,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

const items: NavItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Schedule",
    url: "/dashboard",
    icon: Calendar,
  },
  {
    title: "Master Data",
    url: "/dashboard/master-data",
    icon: Users,
    items: [
      {
        title: "Teachers",
        url: "/dashboard/master-data",
      },
      {
        title: "Subjects",
        url: "/dashboard/master-data",
      },
      {
        title: "Classes",
        url: "/dashboard/master-data",
      },
      {
        title: "Rooms",
        url: "/dashboard/master-data",
      },
    ],
  },
  {
    title: "AI Assistant",
    url: "/dashboard/ai-assistant",
    icon: Bot,
    items: [
      {
        title: "Announcement Drafter",
        url: "/dashboard/ai-assistant",
      },
      {
        title: "Schedule Validator",
        url: "/dashboard/ai-assistant",
      },
    ],
  },
  {
    title: "Announcements",
    url: "/dashboard/announcements",
    icon: Bell,
  },
  {
    title: "Swap Requests",
    url: "/dashboard/swap-requests",
    icon: CalendarClock,
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Shield,
    items: [
      {
        title: "User Management",
        url: "/dashboard/admin",
      },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    items: [
      {
        title: "Google Calendar Sync",
        url: "/dashboard/settings",
      },
    ],
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.url}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
