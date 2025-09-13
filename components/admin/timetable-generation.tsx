"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ArrowLeft, Play, RefreshCw, Download, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface Batch {
  id: string
  name: string
  program: string
  semester: number
  studentCount: number
  department: string
}

interface TimetableSlot {
  day: string
  time: string
  subject: string
  faculty: string
  classroom: string
  batch: string
  type: "lecture" | "lab" | "tutorial"
}

interface GenerationResult {
  id: string
  batchId: string
  batchName: string
  status: "generating" | "completed" | "failed" | "pending"
  progress: number
  conflicts: number
  utilization: number
  generatedAt: string
  slots: TimetableSlot[]
}

export function TimetableGeneration() {
  const router = useRouter()
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSettings, setGenerationSettings] = useState({
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: "60",
    breakDuration: "15",
    maxDailyHours: "6",
    preferredDays: "5",
  })

  const batches: Batch[] = [
    {
      id: "1",
      name: "CS-2023-A",
      program: "Computer Science",
      semester: 3,
      studentCount: 45,
      department: "Computer Science",
    },
    {
      id: "2",
      name: "CS-2023-B",
      program: "Computer Science",
      semester: 3,
      studentCount: 42,
      department: "Computer Science",
    },
    {
      id: "3",
      name: "MATH-2022-A",
      program: "Mathematics",
      semester: 5,
      studentCount: 38,
      department: "Mathematics",
    },
    {
      id: "4",
      name: "PHY-2023-A",
      program: "Physics",
      semester: 3,
      studentCount: 35,
      department: "Physics",
    },
  ]

  const handleBatchSelection = (batchId: string) => {
    setSelectedBatches((prev) => (prev.includes(batchId) ? prev.filter((id) => id !== batchId) : [...prev, batchId]))
  }

  const generateSampleTimetable = (batchId: string, batchName: string): TimetableSlot[] => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const times = ["09:00-10:00", "10:00-11:00", "11:15-12:15", "12:15-13:15", "14:15-15:15", "15:15-16:15"]
    const subjects = [
      "Data Structures",
      "Database Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
    ]
    const faculty = ["Dr. Smith", "Prof. Johnson", "Dr. Brown", "Prof. Davis", "Dr. Wilson"]
    const classrooms = ["A-101", "B-205", "C-301", "D-102", "E-203"]

    const slots: TimetableSlot[] = []

    days.forEach((day) => {
      times.slice(0, 4).forEach((time, index) => {
        slots.push({
          day,
          time,
          subject: subjects[index % subjects.length],
          faculty: faculty[index % faculty.length],
          classroom: classrooms[index % classrooms.length],
          batch: batchName,
          type: index % 3 === 0 ? "lab" : "lecture",
        })
      })
    })

    return slots
  }

  const handleGenerateTimetable = async () => {
    if (selectedBatches.length === 0) return

    setIsGenerating(true)
    const newResults: GenerationResult[] = selectedBatches.map((batchId) => {
      const batch = batches.find((b) => b.id === batchId)!
      return {
        id: Date.now().toString() + batchId,
        batchId,
        batchName: batch.name,
        status: "generating" as const,
        progress: 0,
        conflicts: 0,
        utilization: 0,
        generatedAt: new Date().toISOString(),
        slots: [],
      }
    })

    setGenerationResults(newResults)

    // Simulate generation process
    for (let i = 0; i < newResults.length; i++) {
      const result = newResults[i]

      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setGenerationResults((prev) => prev.map((r) => (r.id === result.id ? { ...r, progress } : r)))
      }

      // Complete generation
      const batch = batches.find((b) => b.id === result.batchId)!
      const slots = generateSampleTimetable(result.batchId, batch.name)

      setGenerationResults((prev) =>
        prev.map((r) =>
          r.id === result.id
            ? {
                ...r,
                status: "completed" as const,
                progress: 100,
                conflicts: Math.floor(Math.random() * 3),
                utilization: 75 + Math.floor(Math.random() * 20),
                slots,
              }
            : r,
        ),
      )
    }

    setIsGenerating(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "generating":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "generating":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
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
              <h1 className="text-xl font-semibold text-foreground">Timetable Generation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">AI-Powered Optimization</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="results">Generation Results</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            {/* Batch Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Batches</CardTitle>
                <CardDescription>Choose the batches for which you want to generate timetables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batches.map((batch) => (
                    <Card
                      key={batch.id}
                      className={`cursor-pointer transition-all ${
                        selectedBatches.includes(batch.id) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                      }`}
                      onClick={() => handleBatchSelection(batch.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{batch.name}</h3>
                          <Badge variant="outline">{batch.department}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Program: {batch.program}</div>
                          <div>Semester: {batch.semester}</div>
                          <div>Students: {batch.studentCount}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">{selectedBatches.length} batch(es) selected</div>
                  <Button
                    onClick={handleGenerateTimetable}
                    disabled={selectedBatches.length === 0 || isGenerating}
                    className="min-w-[150px]"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Timetables
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {/* Generation Results */}
            <Card>
              <CardHeader>
                <CardTitle>Generation Results</CardTitle>
                <CardDescription>View and manage generated timetables</CardDescription>
              </CardHeader>
              <CardContent>
                {generationResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No timetables generated yet. Go to the Generate tab to create new timetables.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generationResults.map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(result.status)}
                              <div>
                                <h3 className="font-semibold">{result.batchName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Generated: {new Date(result.generatedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getStatusColor(result.status)} text-white`}>{result.status}</Badge>
                              {result.status === "completed" && (
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </Button>
                              )}
                            </div>
                          </div>

                          {result.status === "generating" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{result.progress}%</span>
                              </div>
                              <Progress value={result.progress} className="w-full" />
                            </div>
                          )}

                          {result.status === "completed" && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{result.conflicts}</div>
                                <div className="text-sm text-muted-foreground">Conflicts</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{result.utilization}%</div>
                                <div className="text-sm text-muted-foreground">Utilization</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{result.slots.length}</div>
                                <div className="text-sm text-muted-foreground">Total Slots</div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Generation Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>Configure timetable generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={generationSettings.startTime}
                      onChange={(e) => setGenerationSettings({ ...generationSettings, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={generationSettings.endTime}
                      onChange={(e) => setGenerationSettings({ ...generationSettings, endTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                    <Select
                      value={generationSettings.slotDuration}
                      onValueChange={(value) => setGenerationSettings({ ...generationSettings, slotDuration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                    <Select
                      value={generationSettings.breakDuration}
                      onValueChange={(value) => setGenerationSettings({ ...generationSettings, breakDuration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDailyHours">Max Daily Hours</Label>
                    <Select
                      value={generationSettings.maxDailyHours}
                      onValueChange={(value) => setGenerationSettings({ ...generationSettings, maxDailyHours: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="7">7 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDays">Working Days per Week</Label>
                    <Select
                      value={generationSettings.preferredDays}
                      onValueChange={(value) => setGenerationSettings({ ...generationSettings, preferredDays: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="6">6 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Optimization Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Minimize Faculty Conflicts</div>
                        <div className="text-sm text-muted-foreground">
                          Prioritize avoiding faculty scheduling conflicts
                        </div>
                      </div>
                      <Badge variant="secondary">High Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Maximize Classroom Utilization</div>
                        <div className="text-sm text-muted-foreground">Optimize classroom usage efficiency</div>
                      </div>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Balance Faculty Workload</div>
                        <div className="text-sm text-muted-foreground">
                          Distribute teaching hours evenly among faculty
                        </div>
                      </div>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
