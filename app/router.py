from fastapi import APIRouter
from .schemas import AgentInput

router = APIRouter()

@router.post("/agent")
async def chat_endpoint(payload: AgentInput):
    # Import inside the handler to avoid circular dependency
    from .agent_graph import app_graph
    
    state = {"input": payload.input}
    result = app_graph.invoke(state)
    
    return {
        "status": "success",
        "response": result.get("result", "No result returned")
    }

@router.get("/tasks")
def get_tasks():
    from .database.db import SessionLocal
    from .database.models import Task
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return [{"id": t.id, "title": t.title, "description": t.description} for t in tasks]

@router.get("/meetings")
def get_meetings():
    from .database.db import SessionLocal
    from .database.models import Meeting
    db = SessionLocal()
    meetings = db.query(Meeting).all()
    db.close()
    return [{"id": m.id, "title": m.title, "date": m.date, "time": str(m.time)} for m in meetings]

@router.get("/reminders")
def get_reminders():
    from .database.db import SessionLocal
    from .database.models import Reminder
    db = SessionLocal()
    reminders = db.query(Reminder).all()
    db.close()
    return [{"id": r.id, "message": r.message, "time": str(r.time)} for r in reminders]

