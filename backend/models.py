from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # admin, faculty, student
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Classroom(Base):
    __tablename__ = "classrooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    capacity = Column(Integer)
    type = Column(String)  # lecture, lab, seminar
    available_slots = Column(Text)  # JSON string of available time slots
    created_at = Column(DateTime, default=datetime.utcnow)

class Faculty(Base):
    __tablename__ = "faculty"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True)
    max_daily_classes = Column(Integer, default=6)
    availability = Column(Text)  # JSON string of available time slots
    assigned_subjects = Column(Text)  # JSON string of subject IDs
    created_at = Column(DateTime, default=datetime.utcnow)

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True)
    lecture_hours = Column(Integer, default=0)
    lab_hours = Column(Integer, default=0)
    elective_group = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    program = Column(String)
    semester = Column(Integer)
    student_count = Column(Integer)
    elective_groups = Column(Text)  # JSON string of elective group preferences
    created_at = Column(DateTime, default=datetime.utcnow)

class Leave(Base):
    __tablename__ = "leaves"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id"))
    date = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="pending")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    
    faculty = relationship("Faculty")

class Timetable(Base):
    __tablename__ = "timetables"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    day = Column(String)  # Monday, Tuesday, etc.
    time_slot = Column(String)  # 09:00-10:00
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    faculty_id = Column(Integer, ForeignKey("faculty.id"))
    is_fixed = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    batch = relationship("Batch")
    classroom = relationship("Classroom")
    subject = relationship("Subject")
    faculty = relationship("Faculty")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)  # timetable_update, conflict_alert, etc.
    message = Column(Text)
    status = Column(String, default="unread")  # unread, read
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
