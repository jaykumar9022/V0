"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen, MapPin, Clock, BarChart3, Settings, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { AIAssistant } from "@/components/ai-assistant/ai-assistant"

export function AdminDashboard() {
  const router = useRouter()

  const stats = [
    { title: "Total Classrooms", value: "24", icon: MapPin, color: "bg-blue-500" },
    { title: "Active Faculty", value: "156", icon: Users, color: "bg-green-500" },
    { title: "Subjects", value: "89", icon: BookOpen, color: "bg-purple-500" },
    { title: "Weekly Classes", value: "1,247", icon: Clock, color: "bg-orange-500" },
  ]

  const quickActions = [
    {
      title: "Generate Timetable",
      description: "Create optimized schedules",
      icon: Calendar,
      onClick: () => router.push("/admin/timetable"),
    },
    {
      title: "Manage Faculty",
      description: "Add or update faculty information",
      icon: Users,
      onClick: () => router.push("/admin/faculty"),
    },
    {
      title: "Classroom Setup",
      description: "Configure rooms and capacity",
      icon: MapPin,
      onClick: () => router.push("/admin/classrooms"),
    },
    {
      title: "Subject Management",
      description: "Organize courses and electives",
      icon: BookOpen,
      onClick: () => router.push("/admin/subjects"),
    },
    {
      title: "View Reports",
      description: "Analytics and utilization reports",
      icon: BarChart3,
      onClick: () => router.push("/admin/reports"),
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      onClick: () => router.push("/admin/settings"),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Smart Classroom Scheduler</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2">
                  3
                </Badge>
              </Button>
              <div className="text-sm text-muted-foreground">Admin Dashboard</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, Administrator</h2>
          <p className="text-muted-foreground">Manage your institution's scheduling and resources efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.onClick}>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3">
                      <action.icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Timetable generated for Computer Science Department
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New faculty member added: Dr. Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Classroom A-101 maintenance scheduled</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
