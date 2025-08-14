import { useState } from "react"
import { 
  LayoutDashboard, 
  AlertTriangle, 
  MapPin, 
  Anchor, 
  Zap,
  Settings,
  Bell,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    badge: null
  },
  { 
    title: "Alerts", 
    url: "/alerts", 
    icon: AlertTriangle,
    badge: 3
  },
  { 
    title: "Yard Plan", 
    url: "/yard", 
    icon: MapPin,
    badge: null
  },
  { 
    title: "Berth Assignments", 
    url: "/berths", 
    icon: Anchor,
    badge: null
  },
  { 
    title: "Surge Actions", 
    url: "/surge", 
    icon: Zap,
    badge: 1
  },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const collapsed = !open
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isExpanded = navigationItems.some((item) => isActive(item.url))

  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent/50 transition-colors duration-200"

  return (
    <Sidebar 
      className={`border-r border-border bg-sidebar ${collapsed ? "w-14" : "w-64"}`}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.24C15.81 5.42 15.56 5.8 15.56 6.24C15.56 6.9 16.05 7.44 16.67 7.5L18.5 9.5L17 11L15 9L11 13L13 15L15 13L17 15L21 11V9ZM11 22H13V20H15V18H13V16H11V18H9V20H11V22Z"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">SurgeOps</h2>
              <p className="text-xs text-sidebar-foreground/60">Port Operations</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 px-2 mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${getNavClasses(isActive(item.url))}`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="destructive" 
                              className="h-5 px-1.5 text-xs font-medium"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 px-2 mb-2">
              Quick Actions
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent/50 transition-colors duration-200 w-full">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent/50 transition-colors duration-200 w-full">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">
              OP
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">Operator</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Singapore Port</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}