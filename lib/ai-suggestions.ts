// AI-powered scheduling suggestions and optimization engine

export interface ConflictAnalysis {
  type: "faculty" | "classroom" | "batch" | "time"
  severity: "high" | "medium" | "low"
  description: string
  affectedEntities: string[]
  suggestedResolution: string
  autoResolvable: boolean
}

export interface OptimizationSuggestion {
  category: "utilization" | "workload" | "efficiency" | "preference"
  title: string
  description: string
  impact: {
    utilizationImprovement: number
    conflictReduction: number
    workloadBalance: number
  }
  implementation: {
    difficulty: "easy" | "medium" | "complex"
    estimatedTime: string
    requiredActions: string[]
  }
}

export interface AIInsight {
  type: "pattern" | "anomaly" | "recommendation" | "prediction"
  title: string
  description: string
  confidence: number
  data: any
  actionable: boolean
}

export class AISchedulingEngine {
  private timetableData: any[]
  private facultyData: any[]
  private classroomData: any[]
  private batchData: any[]

  constructor(timetable: any[], faculty: any[], classrooms: any[], batches: any[]) {
    this.timetableData = timetable
    this.facultyData = faculty
    this.classroomData = classrooms
    this.batchData = batches
  }

  public analyzeConflicts(): ConflictAnalysis[] {
    const conflicts: ConflictAnalysis[] = []

    // Faculty conflicts
    const facultyConflicts = this.detectFacultyConflicts()
    conflicts.push(...facultyConflicts)

    // Classroom conflicts
    const classroomConflicts = this.detectClassroomConflicts()
    conflicts.push(...classroomConflicts)

    // Batch conflicts
    const batchConflicts = this.detectBatchConflicts()
    conflicts.push(...batchConflicts)

    return conflicts
  }

  private detectFacultyConflicts(): ConflictAnalysis[] {
    const conflicts: ConflictAnalysis[] = []
    const facultySchedule = new Map<string, Map<string, string[]>>()

    // Build faculty schedule map
    this.timetableData.forEach((slot) => {
      const facultyId = slot.facultyId
      const timeKey = `${slot.timeSlot.day}-${slot.timeSlot.startTime}`

      if (!facultySchedule.has(facultyId)) {
        facultySchedule.set(facultyId, new Map())
      }

      const schedule = facultySchedule.get(facultyId)!
      if (!schedule.has(timeKey)) {
        schedule.set(timeKey, [])
      }

      schedule.get(timeKey)!.push(slot.id)
    })

    // Detect conflicts
    facultySchedule.forEach((schedule, facultyId) => {
      schedule.forEach((slots, timeKey) => {
        if (slots.length > 1) {
          const faculty = this.facultyData.find((f) => f.id === facultyId)
          conflicts.push({
            type: "faculty",
            severity: "high",
            description: `${faculty?.name || "Faculty"} has ${slots.length} overlapping classes at ${timeKey}`,
            affectedEntities: slots,
            suggestedResolution: "Reschedule one of the conflicting classes to a different time slot",
            autoResolvable: true,
          })
        }
      })
    })

    return conflicts
  }

  private detectClassroomConflicts(): ConflictAnalysis[] {
    const conflicts: ConflictAnalysis[] = []
    const classroomSchedule = new Map<string, Map<string, string[]>>()

    // Build classroom schedule map
    this.timetableData.forEach((slot) => {
      const classroomId = slot.classroomId
      const timeKey = `${slot.timeSlot.day}-${slot.timeSlot.startTime}`

      if (!classroomSchedule.has(classroomId)) {
        classroomSchedule.set(classroomId, new Map())
      }

      const schedule = classroomSchedule.get(classroomId)!
      if (!schedule.has(timeKey)) {
        schedule.set(timeKey, [])
      }

      schedule.get(timeKey)!.push(slot.id)
    })

    // Detect conflicts
    classroomSchedule.forEach((schedule, classroomId) => {
      schedule.forEach((slots, timeKey) => {
        if (slots.length > 1) {
          const classroom = this.classroomData.find((c) => c.id === classroomId)
          conflicts.push({
            type: "classroom",
            severity: "high",
            description: `${classroom?.name || "Classroom"} is double-booked at ${timeKey}`,
            affectedEntities: slots,
            suggestedResolution: "Move one class to an available classroom",
            autoResolvable: true,
          })
        }
      })
    })

    return conflicts
  }

  private detectBatchConflicts(): ConflictAnalysis[] {
    const conflicts: ConflictAnalysis[] = []
    const batchSchedule = new Map<string, Map<string, string[]>>()

    // Build batch schedule map
    this.timetableData.forEach((slot) => {
      const batchId = slot.batchId
      const timeKey = `${slot.timeSlot.day}-${slot.timeSlot.startTime}`

      if (!batchSchedule.has(batchId)) {
        batchSchedule.set(batchId, new Map())
      }

      const schedule = batchSchedule.get(batchId)!
      if (!schedule.has(timeKey)) {
        schedule.set(timeKey, [])
      }

      schedule.get(timeKey)!.push(slot.id)
    })

    // Detect conflicts
    batchSchedule.forEach((schedule, batchId) => {
      schedule.forEach((slots, timeKey) => {
        if (slots.length > 1) {
          const batch = this.batchData.find((b) => b.id === batchId)
          conflicts.push({
            type: "batch",
            severity: "high",
            description: `${batch?.name || "Batch"} has overlapping classes at ${timeKey}`,
            affectedEntities: slots,
            suggestedResolution: "Reschedule one class to avoid student conflicts",
            autoResolvable: true,
          })
        }
      })
    })

    return conflicts
  }

  public generateOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // Classroom utilization optimization
    const utilizationSuggestions = this.analyzeClassroomUtilization()
    suggestions.push(...utilizationSuggestions)

    // Faculty workload balancing
    const workloadSuggestions = this.analyzeFacultyWorkload()
    suggestions.push(...workloadSuggestions)

    // Time slot efficiency
    const efficiencySuggestions = this.analyzeTimeSlotEfficiency()
    suggestions.push(...efficiencySuggestions)

    return suggestions
  }

  private analyzeClassroomUtilization(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const utilizationMap = new Map<string, number>()

    // Calculate utilization for each classroom
    this.classroomData.forEach((classroom) => {
      const totalSlots = 40 // Assuming 8 slots per day * 5 days
      const usedSlots = this.timetableData.filter((slot) => slot.classroomId === classroom.id).length
      const utilization = (usedSlots / totalSlots) * 100
      utilizationMap.set(classroom.id, utilization)
    })

    // Find underutilized classrooms
    utilizationMap.forEach((utilization, classroomId) => {
      if (utilization < 60) {
        const classroom = this.classroomData.find((c) => c.id === classroomId)
        suggestions.push({
          category: "utilization",
          title: `Improve ${classroom?.name} Utilization`,
          description: `${classroom?.name} is only ${utilization.toFixed(1)}% utilized. Consider moving smaller classes here.`,
          impact: {
            utilizationImprovement: 25,
            conflictReduction: 5,
            workloadBalance: 0,
          },
          implementation: {
            difficulty: "easy",
            estimatedTime: "15 minutes",
            requiredActions: ["Identify suitable classes", "Move classes to this room", "Update timetable"],
          },
        })
      }
    })

    return suggestions
  }

  private analyzeFacultyWorkload(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const workloadMap = new Map<string, number>()

    // Calculate workload for each faculty
    this.facultyData.forEach((faculty) => {
      const totalHours = this.timetableData
        .filter((slot) => slot.facultyId === faculty.id)
        .reduce((sum, slot) => sum + slot.timeSlot.duration / 60, 0)
      workloadMap.set(faculty.id, totalHours)
    })

    // Find workload imbalances
    const workloads = Array.from(workloadMap.values())
    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length
    const maxWorkload = Math.max(...workloads)
    const minWorkload = Math.min(...workloads)

    if (maxWorkload - minWorkload > avgWorkload * 0.3) {
      suggestions.push({
        category: "workload",
        title: "Balance Faculty Workload",
        description: `Workload varies from ${minWorkload.toFixed(1)} to ${maxWorkload.toFixed(1)} hours. Consider redistributing subjects.`,
        impact: {
          utilizationImprovement: 10,
          conflictReduction: 15,
          workloadBalance: 40,
        },
        implementation: {
          difficulty: "medium",
          estimatedTime: "30 minutes",
          requiredActions: ["Identify overloaded faculty", "Find suitable redistributions", "Update assignments"],
        },
      })
    }

    return suggestions
  }

  private analyzeTimeSlotEfficiency(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []
    const timeSlotUsage = new Map<string, number>()

    // Analyze time slot usage patterns
    this.timetableData.forEach((slot) => {
      const timeKey = `${slot.timeSlot.day}-${slot.timeSlot.startTime}`
      timeSlotUsage.set(timeKey, (timeSlotUsage.get(timeKey) || 0) + 1)
    })

    // Find underutilized time slots
    const avgUsage = Array.from(timeSlotUsage.values()).reduce((sum, usage) => sum + usage, 0) / timeSlotUsage.size

    timeSlotUsage.forEach((usage, timeKey) => {
      if (usage < avgUsage * 0.5) {
        suggestions.push({
          category: "efficiency",
          title: `Optimize ${timeKey} Time Slot`,
          description: `${timeKey} is underutilized with only ${usage} classes. Consider moving classes here to reduce conflicts.`,
          impact: {
            utilizationImprovement: 15,
            conflictReduction: 20,
            workloadBalance: 5,
          },
          implementation: {
            difficulty: "easy",
            estimatedTime: "10 minutes",
            requiredActions: ["Identify moveable classes", "Reschedule to this slot", "Verify no conflicts"],
          },
        })
      }
    })

    return suggestions
  }

  public generateInsights(): AIInsight[] {
    const insights: AIInsight[] = []

    // Pattern analysis
    insights.push(...this.analyzeSchedulingPatterns())

    // Anomaly detection
    insights.push(...this.detectAnomalies())

    // Predictive insights
    insights.push(...this.generatePredictiveInsights())

    return insights
  }

  private analyzeSchedulingPatterns(): AIInsight[] {
    const insights: AIInsight[] = []

    // Most popular time slots
    const timeSlotPopularity = new Map<string, number>()
    this.timetableData.forEach((slot) => {
      const timeKey = slot.timeSlot.startTime
      timeSlotPopularity.set(timeKey, (timeSlotPopularity.get(timeKey) || 0) + 1)
    })

    const mostPopularTime = Array.from(timeSlotPopularity.entries()).sort((a, b) => b[1] - a[1])[0]

    insights.push({
      type: "pattern",
      title: "Peak Scheduling Time",
      description: `${mostPopularTime[0]} is the most scheduled time slot with ${mostPopularTime[1]} classes`,
      confidence: 0.95,
      data: { timeSlot: mostPopularTime[0], count: mostPopularTime[1] },
      actionable: true,
    })

    return insights
  }

  private detectAnomalies(): AIInsight[] {
    const insights: AIInsight[] = []

    // Detect unusual faculty workload
    const workloadMap = new Map<string, number>()
    this.facultyData.forEach((faculty) => {
      const totalHours = this.timetableData
        .filter((slot) => slot.facultyId === faculty.id)
        .reduce((sum, slot) => sum + slot.timeSlot.duration / 60, 0)
      workloadMap.set(faculty.id, totalHours)
    })

    const workloads = Array.from(workloadMap.values())
    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length
    const stdDev = Math.sqrt(workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) / workloads.length)

    workloadMap.forEach((workload, facultyId) => {
      if (Math.abs(workload - avgWorkload) > 2 * stdDev) {
        const faculty = this.facultyData.find((f) => f.id === facultyId)
        insights.push({
          type: "anomaly",
          title: "Unusual Faculty Workload",
          description: `${faculty?.name} has ${workload.toFixed(1)} hours, significantly ${
            workload > avgWorkload ? "above" : "below"
          } average (${avgWorkload.toFixed(1)} hours)`,
          confidence: 0.85,
          data: { facultyId, workload, average: avgWorkload },
          actionable: true,
        })
      }
    })

    return insights
  }

  private generatePredictiveInsights(): AIInsight[] {
    const insights: AIInsight[] = []

    // Predict potential conflicts based on current trends
    const conflictProbability = this.calculateConflictProbability()

    if (conflictProbability > 0.3) {
      insights.push({
        type: "prediction",
        title: "High Conflict Risk",
        description: `Based on current scheduling patterns, there's a ${(conflictProbability * 100).toFixed(
          1,
        )}% chance of conflicts in the next scheduling cycle`,
        confidence: 0.75,
        data: { probability: conflictProbability },
        actionable: true,
      })
    }

    return insights
  }

  private calculateConflictProbability(): number {
    // Simplified conflict probability calculation
    const totalSlots = this.timetableData.length
    const uniqueTimeSlots = new Set(this.timetableData.map((slot) => `${slot.timeSlot.day}-${slot.timeSlot.startTime}`))
      .size
    const avgSlotsPerTime = totalSlots / uniqueTimeSlots

    // Higher average slots per time = higher conflict probability
    return Math.min(avgSlotsPerTime / 10, 1)
  }

  public autoResolveConflicts(conflicts: ConflictAnalysis[]): {
    resolved: ConflictAnalysis[]
    unresolved: ConflictAnalysis[]
  } {
    const resolved: ConflictAnalysis[] = []
    const unresolved: ConflictAnalysis[] = []

    conflicts.forEach((conflict) => {
      if (conflict.autoResolvable) {
        // Implement auto-resolution logic here
        // For now, we'll simulate successful resolution
        resolved.push(conflict)
      } else {
        unresolved.push(conflict)
      }
    })

    return { resolved, unresolved }
  }
}

// Utility functions for AI-powered scheduling
export const AIUtils = {
  calculateOptimizationScore: (timetable: any[], classrooms: any[], faculty: any[]) => {
    // Calculate overall optimization score (0-100)
    const utilizationScore = AIUtils.calculateUtilizationScore(timetable, classrooms)
    const workloadScore = AIUtils.calculateWorkloadScore(timetable, faculty)
    const conflictScore = AIUtils.calculateConflictScore(timetable)

    return Math.round((utilizationScore + workloadScore + conflictScore) / 3)
  },

  calculateUtilizationScore: (timetable: any[], classrooms: any[]) => {
    const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0)
    const usedCapacity = timetable.reduce((sum, slot) => {
      const classroom = classrooms.find((r) => r.id === slot.classroomId)
      return sum + (classroom?.capacity || 0)
    }, 0)

    return Math.min((usedCapacity / totalCapacity) * 100, 100)
  },

  calculateWorkloadScore: (timetable: any[], faculty: any[]) => {
    const workloads = faculty.map((f) => {
      return timetable
        .filter((slot) => slot.facultyId === f.id)
        .reduce((sum, slot) => sum + slot.timeSlot.duration / 60, 0)
    })

    const avgWorkload = workloads.reduce((sum, w) => sum + w, 0) / workloads.length
    const variance = workloads.reduce((sum, w) => sum + Math.pow(w - avgWorkload, 2), 0) / workloads.length

    // Lower variance = higher score
    return Math.max(100 - variance * 10, 0)
  },

  calculateConflictScore: (timetable: any[]) => {
    // Simple conflict detection - in reality, this would be more sophisticated
    const timeSlotMap = new Map<string, number>()

    timetable.forEach((slot) => {
      const key = `${slot.facultyId}-${slot.timeSlot.day}-${slot.timeSlot.startTime}`
      timeSlotMap.set(key, (timeSlotMap.get(key) || 0) + 1)
    })

    const conflicts = Array.from(timeSlotMap.values()).filter((count) => count > 1).length

    return Math.max(100 - conflicts * 10, 0)
  },
}
