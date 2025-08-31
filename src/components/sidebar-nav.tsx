"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Settings,
  Brain,
  Files
} from "lucide-react"

const navigation = [
  { name: "Multi Drafts", href: "/multi-drafts", icon: Files, color: "text-orange-600" },
  { name: "Settings", href: "/settings", icon: Settings, color: "text-gray-600" },
]

interface SidebarNavProps {
  collapsed?: boolean
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()

  if (collapsed) {
    return (
      <nav className="flex flex-col w-16 bg-white border-r border-gray-200 h-screen">
        <div className="p-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto">
            <Brain className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 p-2">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={item.name}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : item.color)} />
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Prompt Manager
            </h1>
            <p className="text-xs text-gray-500">
              Multi-Draft System
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : item.color)} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900">AI Assistant</p>
            <p className="text-xs text-gray-500 truncate">Ready to help</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
