from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import os

from database import get_db, engine
from models import Base
from schemas import *
from crud import *
from timetable_engine import TimetableGenerator
from ai_suggestions import GeminiAIAssistant

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Classroom Scheduler API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

# Authentication endpoints
@app.post("/api/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# Classroom management
@app.post("/api/classrooms", response_model=ClassroomResponse)
async def create_classroom(
    classroom: ClassroomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return create_classroom_db(db, classroom)

@app.get("/api/classrooms", response_model=List[ClassroomResponse])
async def get_classrooms(db: Session = Depends(get_db)):
    return get_classrooms_db(db)

# Faculty management
@app.post("/api/faculty", response_model=FacultyResponse)
async def create_faculty(
    faculty: FacultyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return create_faculty_db(db, faculty)

@app.get("/api/faculty", response_model=List[FacultyResponse])
async def get_faculty(db: Session = Depends(get_db)):
    return get_faculty_db(db)

# Subject management
@app.post("/api/subjects", response_model=SubjectResponse)
async def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return create_subject_db(db, subject)

@app.get("/api/subjects", response_model=List[SubjectResponse])
async def get_subjects(db: Session = Depends(get_db)):
    return get_subjects_db(db)

# Batch management
@app.post("/api/batches", response_model=BatchResponse)
async def create_batch(
    batch: BatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return create_batch_db(db, batch)

@app.get("/api/batches", response_model=List[BatchResponse])
async def get_batches(db: Session = Depends(get_db)):
    return get_batches_db(db)

# Timetable generation
@app.post("/api/timetable/generate", response_model=TimetableGenerationResponse)
async def generate_timetable(
    request: TimetableGenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    generator = TimetableGenerator(db)
    result = await generator.generate_optimized_timetable(
        batch_ids=request.batch_ids,
        constraints=request.constraints,
        use_ai_suggestions=request.use_ai_suggestions
    )
    
    return result

@app.get("/api/timetable/{batch_id}", response_model=TimetableResponse)
async def get_timetable(batch_id: int, db: Session = Depends(get_db)):
    timetable = get_timetable_db(db, batch_id)
    if not timetable:
        raise HTTPException(status_code=404, detail="Timetable not found")
    return timetable

@app.post("/api/timetable/approve")
async def approve_timetable(
    request: TimetableApprovalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return approve_timetable_db(db, request.timetable_id, current_user.id)

# Reports and analytics
@app.get("/api/reports", response_model=ReportsResponse)
async def get_reports(
    report_type: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return generate_reports(db, report_type, start_date, end_date)

# AI Assistant endpoints
@app.post("/api/ai/suggestions", response_model=AISuggestionsResponse)
async def get_ai_suggestions(
    request: AISuggestionsRequest,
    db: Session = Depends(get_db)
):
    ai_assistant = GeminiAIAssistant()
    suggestions = await ai_assistant.get_timetable_suggestions(
        timetable_data=request.timetable_data,
        constraints=request.constraints
    )
    return {"suggestions": suggestions}

# Utility functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
