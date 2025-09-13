"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Subject {
  id: string
  name: string
  code: string
  department: string
  semester: number
  credits: number
  lectureHours: number
  labHours: number
  type: "core" | "elective" | "lab"
  prerequisites: string[]
}

export function SubjectManagement() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Data Structures and Algorithms",
      code: "CS201",
      department: "Computer Science",
      semester: 3,
      credits: 4,
      lectureHours: 3,
      labHours: 2,
      type: "core",
      prerequisites: ["Programming Fundamentals"],
    },
    {
      id: "2",
      name: "Database Management Systems",
      code: "CS301",
      department: "Computer Science",
      semester: 5,
      credits: 3,
      lectureHours: 3,
      labHours: 0,
      type: "core",
      prerequisites: ["Data Structures"],
    },
    {
      id: "3",
      name: "Machine Learning",
      code: "CS401",
      department: "Computer Science",
      semester: 7,
      credits: 3,
      lectureHours: 2,
      labHours: 2,
      type: "elective",
      prerequisites: ["Statistics", "Linear Algebra"],
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
    credits: "",
    lectureHours: "",
    labHours: "",
    type: "",
    prerequisites: "",
  })

  const handleAddSubject = () => {
    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      code: newSubject.code,
      department: newSubject.department,
      semester: Number.parseInt(newSubject.semester),
      credits: Number.parseInt(newSubject.credits),
      lectureHours: Number.parseInt(newSubject.lectureHours),
      labHours: Number.parseInt(newSubject.labHours),
      type: newSubject.type as "core" | "elective" | "lab",
      prerequisites: newSubject.prerequisites
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
    }
    setSubjects([...subjects, subject])
    setNewSubject({
      name: "",
      code: "",
      department: "",
      semester: "",
      credits: "",
      lectureHours: "",
      labHours: "",
      type: "",
      prerequisites: "",
    })
    setIsAddDialogOpen(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "core":
        return "bg-blue-500"
      case "elective":
        return "bg-green-500"
      case "lab":
        return "bg-purple-500"
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
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Subject Management</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>Enter the details for the new subject</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Data Structures"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Code
                    </Label>
                    <Input
                      id="code"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                      className="col-span-3"
                      placeholder="CS201"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      value={newSubject.department}
                      onValueChange={(value) => setNewSubject({ ...newSubject, department: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="semester" className="text-right">
                      Semester
                    </Label>
                    <Input
                      id="semester"
                      type="number"
                      value={newSubject.semester}
                      onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                      className="col-span-3"
                      placeholder="3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="credits" className="text-right">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      type="number"
                      value={newSubject.credits}
                      onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                      className="col-span-3"
                      placeholder="4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lectureHours" className="text-right">
                      Lecture Hours
                    </Label>
                    <Input
                      id="lectureHours"
                      type="number"
                      value={newSubject.lectureHours}
                      onChange={(e) => setNewSubject({ ...newSubject, lectureHours: e.target.value })}
                      className="col-span-3"
                      placeholder="3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="labHours" className="text-right">
                      Lab Hours
                    </Label>
                    <Input
                      id="labHours"
                      type="number"
                      value={newSubject.labHours}
                      onChange={(e) => setNewSubject({ ...newSubject, labHours: e.target.value })}
                      className="col-span-3"
                      placeholder="2"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newSubject.type}
                      onValueChange={(value) => setNewSubject({ ...newSubject, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core</SelectItem>
                        <SelectItem value="elective">Elective</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prerequisites" className="text-right">
                      Prerequisites
                    </Label>
                    <Input
                      id="prerequisites"
                      value={newSubject.prerequisites}
                      onChange={(e) => setNewSubject({ ...newSubject, prerequisites: e.target.value })}
                      className="col-span-3"
                      placeholder="Programming, Mathematics"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubject}>Add Subject</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Core Subjects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {subjects.filter((s) => s.type === "core").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Electives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {subjects.filter((s) => s.type === "elective").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lab Subjects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {subjects.filter((s) => s.type === "lab").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-foreground">
                    {subjects.reduce((sum, s) => sum + s.credits, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
            <CardDescription>Manage your institution's curriculum and course offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prerequisites</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.department}</TableCell>
                    <TableCell>{subject.semester}</TableCell>
                    <TableCell>{subject.credits}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Lecture: {subject.lectureHours}h</div>
                        {subject.labHours > 0 && <div>Lab: {subject.labHours}h</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(subject.type)} text-white`}>{subject.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subject.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
