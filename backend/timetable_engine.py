from ortools.sat.python import cp_model
from typing import List, Dict, Any, Optional
import json
from sqlalchemy.orm import Session
from models import *
import asyncio

class TimetableGenerator:
    def __init__(self, db: Session):
        self.db = db
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        
    async def generate_optimized_timetable(
        self, 
        batch_ids: List[int], 
        constraints: Dict[str, Any],
        use_ai_suggestions: bool = True
    ) -> Dict[str, Any]:
        """
        Generate optimized timetable using Constraint Satisfaction Problem (CSP)
        """
        
        # Fetch data
        batches = self.db.query(Batch).filter(Batch.id.in_(batch_ids)).all()
        classrooms = self.db.query(Classroom).all()
        faculty = self.db.query(Faculty).all()
        subjects = self.db.query(Subject).all()
        
        # Define time slots (5 days, 8 slots per day)
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        time_slots = [
            '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
            '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
        ]
        
        # Create decision variables
        # schedule[b][d][t][c][s][f] = 1 if batch b has subject s with faculty f in classroom c on day d at time t
        schedule = {}
        
        for batch in batches:
            schedule[batch.id] = {}
            for day_idx, day in enumerate(days):
                schedule[batch.id][day_idx] = {}
                for time_idx, time_slot in enumerate(time_slots):
                    schedule[batch.id][day_idx][time_idx] = {}
                    for classroom in classrooms:
                        schedule[batch.id][day_idx][time_idx][classroom.id] = {}
                        for subject in subjects:
                            schedule[batch.id][day_idx][time_idx][classroom.id][subject.id] = {}
                            for fac in faculty:
                                schedule[batch.id][day_idx][time_idx][classroom.id][subject.id][fac.id] = \
                                    self.model.NewBoolVar(f'schedule_{batch.id}_{day_idx}_{time_idx}_{classroom.id}_{subject.id}_{fac.id}')
        
        # Constraint 1: Each batch can have at most one class at any time
        for batch in batches:
            for day_idx in range(len(days)):
                for time_idx in range(len(time_slots)):
                    self.model.Add(
                        sum(
                            schedule[batch.id][day_idx][time_idx][c.id][s.id][f.id]
                            for c in classrooms
                            for s in subjects
                            for f in faculty
                        ) <= 1
                    )
        
        # Constraint 2: Each classroom can host at most one class at any time
        for classroom in classrooms:
            for day_idx in range(len(days)):
                for time_idx in range(len(time_slots)):
                    self.model.Add(
                        sum(
                            schedule[b.id][day_idx][time_idx][classroom.id][s.id][f.id]
                            for b in batches
                            for s in subjects
                            for f in faculty
                        ) <= 1
                    )
        
        # Constraint 3: Each faculty can teach at most one class at any time
        for fac in faculty:
            for day_idx in range(len(days)):
                for time_idx in range(len(time_slots)):
                    self.model.Add(
                        sum(
                            schedule[b.id][day_idx][time_idx][c.id][s.id][fac.id]
                            for b in batches
                            for c in classrooms
                            for s in subjects
                        ) <= 1
                    )
        
        # Constraint 4: Faculty daily workload limit
        for fac in faculty:
            for day_idx in range(len(days)):
                self.model.Add(
                    sum(
                        schedule[b.id][day_idx][time_idx][c.id][s.id][fac.id]
                        for b in batches
                        for time_idx in range(len(time_slots))
                        for c in classrooms
                        for s in subjects
                    ) <= fac.max_daily_classes
                )
        
        # Constraint 5: Subject-faculty assignment
        for fac in faculty:
            assigned_subjects = json.loads(fac.assigned_subjects) if fac.assigned_subjects else []
            for subject in subjects:
                if subject.id not in assigned_subjects:
                    for batch in batches:
                        for day_idx in range(len(days)):
                            for time_idx in range(len(time_slots)):
                                for classroom in classrooms:
                                    self.model.Add(
                                        schedule[batch.id][day_idx][time_idx][classroom.id][subject.id][fac.id] == 0
                                    )
        
        # Objective: Maximize classroom utilization and minimize faculty workload variance
        utilization_vars = []
        for classroom in classrooms:
            for day_idx in range(len(days)):
                for time_idx in range(len(time_slots)):
                    utilization_vars.append(
                        sum(
                            schedule[b.id][day_idx][time_idx][classroom.id][s.id][f.id]
                            for b in batches
                            for s in subjects
                            for f in faculty
                        )
                    )
        
        self.model.Maximize(sum(utilization_vars))
        
        # Solve the model
        status = self.solver.Solve(self.model)
        
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            # Extract solution
            timetable_data = []
            
            for batch in batches:
                for day_idx, day in enumerate(days):
                    for time_idx, time_slot in enumerate(time_slots):
                        for classroom in classrooms:
                            for subject in subjects:
                                for fac in faculty:
                                    if self.solver.Value(schedule[batch.id][day_idx][time_idx][classroom.id][subject.id][fac.id]) == 1:
                                        timetable_data.append({
                                            'batch_id': batch.id,
                                            'day': day,
                                            'time_slot': time_slot,
                                            'classroom_id': classroom.id,
                                            'subject_id': subject.id,
                                            'faculty_id': fac.id
                                        })
            
            # Save to database
            for entry in timetable_data:
                timetable_entry = Timetable(**entry)
                self.db.add(timetable_entry)
            
            self.db.commit()
            
            # Calculate metrics
            metrics = self._calculate_metrics(timetable_data, classrooms, faculty)
            
            return {
                'status': 'success',
                'timetable': timetable_data,
                'metrics': metrics,
                'conflicts': [],
                'suggestions': []
            }
        
        else:
            return {
                'status': 'failed',
                'message': 'No feasible solution found',
                'conflicts': self._identify_conflicts(batches, classrooms, faculty, subjects),
                'suggestions': []
            }
    
    def _calculate_metrics(self, timetable_data: List[Dict], classrooms: List[Classroom], faculty: List[Faculty]) -> Dict[str, Any]:
        """Calculate utilization and workload metrics"""
        
        total_slots = len(classrooms) * 5 * 8  # 5 days, 8 slots per day
        used_slots = len(timetable_data)
        
        classroom_utilization = (used_slots / total_slots) * 100
        
        # Faculty workload distribution
        faculty_workload = {}
        for entry in timetable_data:
            fac_id = entry['faculty_id']
            faculty_workload[fac_id] = faculty_workload.get(fac_id, 0) + 1
        
        avg_workload = sum(faculty_workload.values()) / len(faculty) if faculty else 0
        
        return {
            'classroom_utilization': round(classroom_utilization, 2),
            'average_faculty_workload': round(avg_workload, 2),
            'total_classes_scheduled': used_slots,
            'faculty_workload_distribution': faculty_workload
        }
    
    def _identify_conflicts(self, batches, classrooms, faculty, subjects) -> List[Dict[str, Any]]:
        """Identify potential conflicts that prevented solution"""
        conflicts = []
        
        # Check for over-constrained resources
        total_required_slots = sum(
            json.loads(batch.elective_groups).get('total_hours', 30) 
            for batch in batches
        )
        
        available_slots = len(classrooms) * 5 * 8
        
        if total_required_slots > available_slots:
            conflicts.append({
                'type': 'resource_shortage',
                'message': f'Required {total_required_slots} slots but only {available_slots} available',
                'severity': 'high'
            })
        
        return conflicts
