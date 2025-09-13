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
import { MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Classroom {
  id: string
  name: string
  capacity: number
  type: string
  building: string
  floor: number
  equipment: string[]
  status: "available" | "maintenance" | "occupied"
}

export function ClassroomManagement() {
  const router = useRouter()
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "A-101",
      capacity: 60,
      type: "Lecture Hall",
      building: "Academic Block A",
      floor: 1,
      equipment: ["Projector", "Whiteboard", "AC"],
      status: "available",
    },
    {
      id: "2",
      name: "B-205",
      capacity: 30,
      type: "Lab",
      building: "Academic Block B",
      floor: 2,
      equipment: ["Computers", "Projector", "AC"],
      status: "occupied",
    },
    {
      id: "3",
      name: "C-301",
      capacity: 45,
      type: "Classroom",
      building: "Academic Block C",
      floor: 3,
      equipment: ["Projector", "Whiteboard"],
      status: "maintenance",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    capacity: "",
    type: "",
    building: "",
    floor: "",
    equipment: "",
  })

  const handleAddClassroom = () => {
    const classroom: Classroom = {
      id: Date.now().toString(),
      name: newClassroom.name,
      capacity: Number.parseInt(newClassroom.capacity),
      type: newClassroom.type,
      building: newClassroom.building,
      floor: Number.parseInt(newClassroom.floor),
      equipment: newClassroom.equipment.split(",").map((e) => e.trim()),
      status: "available",
    }
    setClassrooms([...classrooms, classroom])
    setNewClassroom({ name: "", capacity: "", type: "", building: "", floor: "", equipment: "" })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-blue-500"
      case "maintenance":
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
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Classroom Management</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Classroom
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Classroom</DialogTitle>
                  <DialogDescription>Enter the details for the new classroom</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newClassroom.name}
                      onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., A-101"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                      Capacity
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newClassroom.capacity}
                      onChange={(e) => setNewClassroom({ ...newClassroom, capacity: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 60"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newClassroom.type}
                      onValueChange={(value) => setNewClassroom({ ...newClassroom, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                        <SelectItem value="Classroom">Classroom</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building" className="text-right">
                      Building
                    </Label>
                    <Input
                      id="building"
                      value={newClassroom.building}
                      onChange={(e) => setNewClassroom({ ...newClassroom, building: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Academic Block A"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="floor" className="text-right">
                      Floor
                    </Label>
                    <Input
                      id="floor"
                      type="number"
                      value={newClassroom.floor}
                      onChange={(e) => setNewClassroom({ ...newClassroom, floor: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="equipment" className="text-right">
                      Equipment
                    </Label>
                    <Input
                      id="equipment"
                      value={newClassroom.equipment}
                      onChange={(e) => setNewClassroom({ ...newClassroom, equipment: e.target.value })}
                      className="col-span-3"
                      placeholder="Projector, Whiteboard, AC"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClassroom}>Add Classroom</Button>
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
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-foreground">
                    {classrooms.filter((c) => c.status === "available").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold text-foreground">
                    {classrooms.filter((c) => c.status === "occupied").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-foreground">
                    {classrooms.filter((c) => c.status === "maintenance").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold text-foreground">
                    {classrooms.reduce((sum, c) => sum + c.capacity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classrooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Classrooms</CardTitle>
            <CardDescription>Manage your institution's classrooms and facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell className="font-medium">{classroom.name}</TableCell>
                    <TableCell>{classroom.type}</TableCell>
                    <TableCell>
                      {classroom.building} - Floor {classroom.floor}
                    </TableCell>
                    <TableCell>{classroom.capacity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {classroom.equipment.map((eq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${getStatusColor(classroom.status)} rounded-full mr-2`}></div>
                        <span className="capitalize">{classroom.status}</span>
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
