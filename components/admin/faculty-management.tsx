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
import { Users, Plus, Edit, Trash2, ArrowLeft, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

interface Faculty {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  maxDailyClasses: number
  subjects: string[]
  availability: string[]
  status: "active" | "on-leave" | "inactive"
}

export function FacultyManagement() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1-555-0123",
      department: "Computer Science",
      designation: "Professor",
      maxDailyClasses: 4,
      subjects: ["Data Structures", "Algorithms", "Database Systems"],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      status: "active",
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1-555-0124",
      department: "Mathematics",
      designation: "Associate Professor",
      maxDailyClasses: 3,
      subjects: ["Calculus", "Linear Algebra", "Statistics"],
      availability: ["Monday", "Wednesday", "Friday"],
      status: "active",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      phone: "+1-555-0125",
      department: "Physics",
      designation: "Assistant Professor",
      maxDailyClasses: 3,
      subjects: ["Quantum Physics", "Thermodynamics"],
      availability: ["Tuesday", "Thursday", "Friday"],
      status: "on-leave",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    maxDailyClasses: "",
    subjects: "",
    availability: "",
  })

  const handleAddFaculty = () => {
    const facultyMember: Faculty = {
      id: Date.now().toString(),
      name: newFaculty.name,
      email: newFaculty.email,
      phone: newFaculty.phone,
      department: newFaculty.department,
      designation: newFaculty.designation,
      maxDailyClasses: Number.parseInt(newFaculty.maxDailyClasses),
      subjects: newFaculty.subjects.split(",").map((s) => s.trim()),
      availability: newFaculty.availability.split(",").map((a) => a.trim()),
      status: "active",
    }
    setFaculty([...faculty, facultyMember])
    setNewFaculty({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      maxDailyClasses: "",
      subjects: "",
      availability: "",
    })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "on-leave":
        return "bg-yellow-500"
      case "inactive":
        return "bg-red-500"
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
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Faculty Management</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Faculty Member</DialogTitle>
                  <DialogDescription>Enter the details for the new faculty member</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                      className="col-span-3"
                      placeholder="john.doe@university.edu"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                      className="col-span-3"
                      placeholder="+1-555-0123"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      value={newFaculty.department}
                      onValueChange={(value) => setNewFaculty({ ...newFaculty, department: value })}
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
                    <Label htmlFor="designation" className="text-right">
                      Designation
                    </Label>
                    <Select
                      value={newFaculty.designation}
                      onValueChange={(value) => setNewFaculty({ ...newFaculty, designation: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxClasses" className="text-right">
                      Max Classes/Day
                    </Label>
                    <Input
                      id="maxClasses"
                      type="number"
                      value={newFaculty.maxDailyClasses}
                      onChange={(e) => setNewFaculty({ ...newFaculty, maxDailyClasses: e.target.value })}
                      className="col-span-3"
                      placeholder="4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjects" className="text-right">
                      Subjects
                    </Label>
                    <Input
                      id="subjects"
                      value={newFaculty.subjects}
                      onChange={(e) => setNewFaculty({ ...newFaculty, subjects: e.target.value })}
                      className="col-span-3"
                      placeholder="Data Structures, Algorithms"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="availability" className="text-right">
                      Availability
                    </Label>
                    <Input
                      id="availability"
                      value={newFaculty.availability}
                      onChange={(e) => setNewFaculty({ ...newFaculty, availability: e.target.value })}
                      className="col-span-3"
                      placeholder="Monday, Tuesday, Wednesday"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFaculty}>Add Faculty</Button>
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
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Faculty</p>
                  <p className="text-2xl font-bold text-foreground">
                    {faculty.filter((f) => f.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                  <p className="text-2xl font-bold text-foreground">
                    {faculty.filter((f) => f.status === "on-leave").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold text-foreground">{new Set(faculty.map((f) => f.department)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                  <p className="text-2xl font-bold text-foreground">{faculty.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Faculty Members</CardTitle>
            <CardDescription>Manage your institution's faculty and their assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Max Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.designation}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.subjects.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{member.maxDailyClasses}/day</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full mr-2`}></div>
                        <span className="capitalize">{member.status.replace("-", " ")}</span>
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
