"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  ArrowLeft,
  Download,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

export function ReportsAnalytics() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("current-semester")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Sample data for charts
  const utilizationData = [
    { name: "A-101", utilization: 85, capacity: 60, type: "Lecture Hall" },
    { name: "B-205", utilization: 72, capacity: 30, type: "Lab" },
    { name: "C-301", utilization: 91, capacity: 45, type: "Classroom" },
    { name: "D-102", utilization: 68, capacity: 35, type: "Lab" },
    { name: "E-203", utilization: 79, capacity: 50, type: "Classroom" },
    { name: "F-104", utilization: 95, capacity: 40, type: "Seminar Room" },
  ]

  const facultyWorkloadData = [
    { name: "Dr. Smith", hours: 18, maxHours: 20, subjects: 3, efficiency: 90 },
    { name: "Prof. Johnson", hours: 16, maxHours: 18, subjects: 2, efficiency: 89 },
    { name: "Dr. Brown", hours: 22, maxHours: 20, subjects: 4, efficiency: 85 },
    { name: "Prof. Davis", hours: 14, maxHours: 18, subjects: 2, efficiency: 78 },
    { name: "Dr. Wilson", hours: 19, maxHours: 20, subjects: 3, efficiency: 95 },
  ]

  const weeklyTrendsData = [
    { week: "Week 1", conflicts: 5, utilization: 78, satisfaction: 85 },
    { week: "Week 2", conflicts: 3, utilization: 82, satisfaction: 88 },
    { week: "Week 3", conflicts: 7, utilization: 75, satisfaction: 82 },
    { week: "Week 4", conflicts: 2, utilization: 89, satisfaction: 92 },
    { week: "Week 5", conflicts: 4, utilization: 86, satisfaction: 89 },
    { week: "Week 6", conflicts: 1, utilization: 91, satisfaction: 94 },
  ]

  const departmentData = [
    { name: "Computer Science", value: 35, color: "#3b82f6" },
    { name: "Mathematics", value: 25, color: "#10b981" },
    { name: "Physics", value: 20, color: "#f59e0b" },
    { name: "Chemistry", value: 15, color: "#ef4444" },
    { name: "Biology", value: 5, color: "#8b5cf6" },
  ]

  const timeSlotData = [
    { time: "09:00", usage: 95, conflicts: 2 },
    { time: "10:00", usage: 88, conflicts: 1 },
    { time: "11:00", usage: 92, conflicts: 3 },
    { time: "12:00", usage: 76, conflicts: 0 },
    { time: "14:00", usage: 84, conflicts: 1 },
    { time: "15:00", usage: 79, conflicts: 2 },
    { time: "16:00", usage: 71, conflicts: 0 },
  ]

  const kpiData = [
    {
      title: "Overall Utilization",
      value: "84.2%",
      change: "+5.3%",
      trend: "up",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Active Conflicts",
      value: "3",
      change: "-67%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Faculty Satisfaction",
      value: "91%",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Schedule Efficiency",
      value: "88.5%",
      change: "+12%",
      trend: "up",
      icon: Clock,
      color: "text-purple-600",
    },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-semester">Current Semester</SelectItem>
                  <SelectItem value="last-semester">Last Semester</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <div className="flex items-center mt-1">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="utilization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="utilization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Classroom Utilization Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Classroom Utilization</CardTitle>
                  <CardDescription>Usage percentage by classroom</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Class allocation by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Utilization Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Utilization Report</CardTitle>
                <CardDescription>Comprehensive classroom usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {utilizationData.map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{room.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {room.type} • Capacity: {room.capacity}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{room.utilization}%</div>
                          <div className="text-sm text-muted-foreground">Utilization</div>
                        </div>
                        <div className="w-24">
                          <Progress value={room.utilization} className="h-2" />
                        </div>
                        <Badge
                          variant={room.utilization > 80 ? "default" : room.utilization > 60 ? "secondary" : "outline"}
                        >
                          {room.utilization > 80 ? "High" : room.utilization > 60 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Faculty Workload Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Workload</CardTitle>
                  <CardDescription>Teaching hours vs maximum capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={facultyWorkloadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#10b981" />
                      <Bar dataKey="maxHours" fill="#e5e7eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Faculty Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Efficiency</CardTitle>
                  <CardDescription>Performance metrics by faculty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facultyWorkloadData.map((faculty, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{faculty.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {faculty.hours}h / {faculty.subjects} subjects
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="font-semibold">{faculty.efficiency}%</div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                          <div className="w-16">
                            <Progress value={faculty.efficiency} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                  <CardDescription>Performance metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Slot Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Time Slot Analysis</CardTitle>
                  <CardDescription>Usage patterns throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSlotData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="usage" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Trend Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Trend Summary</CardTitle>
                <CardDescription>Key insights from recent performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">+12%</div>
                    <div className="text-sm text-muted-foreground">Utilization Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">94%</div>
                    <div className="text-sm text-muted-foreground">Peak Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">-67%</div>
                    <div className="text-sm text-muted-foreground">Conflict Reduction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conflict Analysis</CardTitle>
                <CardDescription>Current scheduling conflicts and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-semibold text-red-800">Faculty Double Booking</div>
                        <div className="text-sm text-red-600">Dr. Smith scheduled for 2 classes at 10:00 AM Monday</div>
                      </div>
                    </div>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-semibold text-yellow-800">Classroom Overbooked</div>
                        <div className="text-sm text-yellow-600">Room B-205 has 45 students but capacity is 30</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-800">Conflict Resolved</div>
                        <div className="text-sm text-green-600">
                          Prof. Johnson's schedule conflict automatically resolved
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Intelligent recommendations for optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-800">Optimization Opportunity</div>
                          <div className="text-sm text-blue-600 mt-1">
                            Moving 3 classes to underutilized rooms could improve overall efficiency by 15%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-purple-800">Workload Balance</div>
                          <div className="text-sm text-purple-600 mt-1">
                            Redistributing 2 subjects could balance faculty workload and reduce conflicts
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-800">Peak Performance</div>
                          <div className="text-sm text-green-600 mt-1">
                            Current schedule achieves 91% satisfaction rate, 9% above target
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Actionable steps for improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Optimize Room A-101</div>
                        <div className="text-sm text-muted-foreground">Currently at 85% utilization</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Balance Faculty Load</div>
                        <div className="text-sm text-muted-foreground">Redistribute 2 subjects</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Schedule Maintenance</div>
                        <div className="text-sm text-muted-foreground">3 rooms need attention</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
