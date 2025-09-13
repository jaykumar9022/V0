"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ArrowLeft, Download, Edit, Save, RotateCcw, Grid3X3, List, Filter, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

interface TimetableSlot {
  id: string
  day: string
  time: string
  subject: string
  faculty: string
  classroom: string
  batch: string
  type: "lecture" | "lab" | "tutorial"
  color: string
}

export function TimetableView() {
  const router = useRouter()
  const [selectedBatch, setSelectedBatch] = useState("CS-2023-A")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const batches = [
    { id: "CS-2023-A", name: "CS-2023-A", program: "Computer Science" },
    { id: "CS-2023-B", name: "CS-2023-B", program: "Computer Science" },
    { id: "MATH-2022-A", name: "MATH-2022-A", program: "Mathematics" },
    { id: "PHY-2023-A", name: "PHY-2023-A", program: "Physics" },
  ]

  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:15-12:15",
    "12:15-13:15",
    "14:15-15:15",
    "15:15-16:15",
    "16:15-17:15",
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const sampleTimetable: TimetableSlot[] = [
    {
      id: "1",
      day: "Monday",
      time: "09:00-10:00",
      subject: "Data Structures",
      faculty: "Dr. Smith",
      classroom: "A-101",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-blue-500",
    },
    {
      id: "2",
      day: "Monday",
      time: "10:00-11:00",
      subject: "Database Systems",
      faculty: "Prof. Johnson",
      classroom: "B-205",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-green-500",
    },
    {
      id: "3",
      day: "Monday",
      time: "11:15-12:15",
      subject: "OS Lab",
      faculty: "Dr. Brown",
      classroom: "C-301",
      batch: "CS-2023-A",
      type: "lab",
      color: "bg-purple-500",
    },
    {
      id: "4",
      day: "Tuesday",
      time: "09:00-10:00",
      subject: "Computer Networks",
      faculty: "Prof. Davis",
      classroom: "A-102",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-orange-500",
    },
    {
      id: "5",
      day: "Tuesday",
      time: "10:00-11:00",
      subject: "Software Engineering",
      faculty: "Dr. Wilson",
      classroom: "B-206",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-red-500",
    },
    {
      id: "6",
      day: "Wednesday",
      time: "09:00-10:00",
      subject: "Data Structures",
      faculty: "Dr. Smith",
      classroom: "A-101",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-blue-500",
    },
    {
      id: "7",
      day: "Wednesday",
      time: "11:15-12:15",
      subject: "Database Lab",
      faculty: "Prof. Johnson",
      classroom: "D-102",
      batch: "CS-2023-A",
      type: "lab",
      color: "bg-green-500",
    },
    {
      id: "8",
      day: "Thursday",
      time: "10:00-11:00",
      subject: "Computer Networks",
      faculty: "Prof. Davis",
      classroom: "A-102",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-orange-500",
    },
    {
      id: "9",
      day: "Friday",
      time: "09:00-10:00",
      subject: "Software Engineering",
      faculty: "Dr. Wilson",
      classroom: "B-206",
      batch: "CS-2023-A",
      type: "lecture",
      color: "bg-red-500",
    },
  ]

  const getSlotForDayTime = (day: string, time: string) => {
    return sampleTimetable.find((slot) => slot.day === day && slot.time === time && slot.batch === selectedBatch)
  }

  const filteredTimetable = sampleTimetable.filter(
    (slot) =>
      slot.batch === selectedBatch &&
      (searchTerm === "" ||
        slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.classroom.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSlotClick = (slot: TimetableSlot) => {
    if (isEditing) {
      // Handle slot editing
      console.log("Editing slot:", slot)
    }
  }

  const handleDragStart = (e: React.DragEvent, slot: TimetableSlot) => {
    if (!isEditing) return
    e.dataTransfer.setData("text/plain", JSON.stringify(slot))
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditing) return
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    if (!isEditing) return
    e.preventDefault()
    const slotData = JSON.parse(e.dataTransfer.getData("text/plain"))
    console.log("Moving slot to:", day, time, slotData)
    // Handle slot movement logic here
  }

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
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Timetable View</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? "Save Changes" : "Edit Mode"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name} - {batch.program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects, faculty, or classrooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {isEditing && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Edit className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Edit Mode Active</span>
                <span className="text-sm text-orange-600">
                  Drag and drop slots to reschedule. Click on slots to edit details.
                </span>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="ml-auto">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="faculty">Faculty View</TabsTrigger>
            <TabsTrigger value="classroom">Classroom View</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            {viewMode === "grid" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Timetable - {selectedBatch}</CardTitle>
                  <CardDescription>Interactive grid view with drag-and-drop editing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Time header */}
                      <div className="grid grid-cols-6 gap-2 mb-2">
                        <div className="p-2 text-center font-medium text-muted-foreground">Time</div>
                        {days.map((day) => (
                          <div key={day} className="p-2 text-center font-medium text-foreground bg-muted rounded">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Timetable grid */}
                      {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                          <div className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/50 rounded">
                            {time}
                          </div>
                          {days.map((day) => {
                            const slot = getSlotForDayTime(day, time)
                            return (
                              <div
                                key={`${day}-${time}`}
                                className={`min-h-[80px] p-2 border-2 border-dashed border-border rounded-lg transition-all ${
                                  isEditing ? "hover:border-primary cursor-pointer" : ""
                                }`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day, time)}
                              >
                                {slot ? (
                                  <div
                                    className={`h-full p-2 rounded text-white text-xs cursor-pointer transition-all hover:shadow-md ${
                                      slot.color
                                    } ${isEditing ? "cursor-move" : ""}`}
                                    draggable={isEditing}
                                    onDragStart={(e) => handleDragStart(e, slot)}
                                    onClick={() => handleSlotClick(slot)}
                                  >
                                    <div className="font-semibold truncate">{slot.subject}</div>
                                    <div className="truncate opacity-90">{slot.faculty}</div>
                                    <div className="truncate opacity-75">{slot.classroom}</div>
                                    <Badge
                                      variant="secondary"
                                      className="mt-1 text-xs bg-white/20 text-white border-white/30"
                                    >
                                      {slot.type}
                                    </Badge>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                                    {isEditing ? "Drop here" : "Free"}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule - {selectedBatch}</CardTitle>
                  <CardDescription>List view of all scheduled classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {days.map((day) => {
                      const daySlots = filteredTimetable.filter((slot) => slot.day === day)
                      return (
                        <div key={day}>
                          <h3 className="font-semibold text-lg mb-3 text-foreground">{day}</h3>
                          {daySlots.length > 0 ? (
                            <div className="space-y-2">
                              {daySlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex items-center space-x-4 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                  <div className={`w-4 h-4 rounded-full ${slot.color}`}></div>
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div>
                                      <div className="font-medium">{slot.time}</div>
                                    </div>
                                    <div>
                                      <div className="font-medium">{slot.subject}</div>
                                      <Badge variant="outline" className="mt-1">
                                        {slot.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <div className="text-sm text-muted-foreground">Faculty</div>
                                      <div>{slot.faculty}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-muted-foreground">Classroom</div>
                                      <div>{slot.classroom}</div>
                                    </div>
                                  </div>
                                  {isEditing && (
                                    <Button variant="outline" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">No classes scheduled</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Daily View</CardTitle>
                <CardDescription>Detailed view of daily schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Daily view implementation - Select a specific day to view detailed schedule
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle>Faculty View</CardTitle>
                <CardDescription>View schedules organized by faculty members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Faculty view implementation - View all classes assigned to each faculty member
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classroom">
            <Card>
              <CardHeader>
                <CardTitle>Classroom View</CardTitle>
                <CardDescription>View schedules organized by classroom utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Classroom view implementation - View utilization and booking status of each classroom
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Core Subjects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Database Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Lab Sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Network Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Engineering Courses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
