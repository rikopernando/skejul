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
  ChevronRight,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
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
        url: "/dashboard/master-data/teachers",
      },
      {
        title: "Subjects",
        url: "/dashboard/master-data/subjects",
      },
      {
        title: "Classes",
        url: "/dashboard/master-data/classes",
      },
      {
        title: "Rooms",
        url: "/dashboard/master-data/rooms",
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
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible key={item.title} asChild defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
