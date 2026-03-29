from fastapi import APIRouter
from .schemas import AgentInput
from .database.db import SessionLocal
from .database.models import Meeting, Task, Reminder, JobListing, JobProfile
from datetime import datetime

router = APIRouter()

@router.post("/agent")
async def chat_endpoint(payload: AgentInput):
    from .agent_graph import app_graph
    state = {"input": payload.input}
    result = app_graph.invoke(state)
    return {
        "status": "success",
        "response": result.get("result", "No result returned")
    }

@router.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return [{"id": t.id, "title": t.title, "description": t.description} for t in tasks]

@router.get("/meetings")
def get_meetings():
    db = SessionLocal()
    now = datetime.now()
    all_meetings = db.query(Meeting).all()
    
    upcoming_meetings = []
    for m in all_meetings:
        meeting_datetime = datetime.combine(m.date, m.time)
        if meeting_datetime >= now:
            upcoming_meetings.append({
                "id": m.id, 
                "title": m.title, 
                "date": m.date, 
                "time": str(m.time)
            })
            
    db.close()
    return upcoming_meetings

@router.get("/reminders")
def get_reminders():
    db = SessionLocal()
    reminders = db.query(Reminder).all()
    db.close()
    return [{"id": r.id, "message": r.message, "time": str(r.time)} for r in reminders]

@router.get("/jobs")
def get_jobs():
    db = SessionLocal()
    jobs = db.query(JobListing).order_by(JobListing.id.desc()).all()
    db.close()
    return [{
        "id": j.id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "status": j.status,
        "description": j.description,
        "link": j.link,
        "draft_message": j.draft_message
    } for j in jobs]

@router.get("/profile")
def get_profile():
    db = SessionLocal()
    profile = db.query(JobProfile).first()
    db.close()
    if not profile:
        return {}
    return {
        "full_name": profile.full_name,
        "email": profile.email,
        "skills": profile.skills,
        "bio": profile.bio,
        "target_roles": profile.target_roles
    }

