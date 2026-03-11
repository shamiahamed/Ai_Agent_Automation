from app.database.db import SessionLocal
from app.database.models import Meeting
import datetime

def calendar_agent(state: dict):
    user_input = state.get("input", "").lower()
    db = SessionLocal()

    if "schedule" in user_input or "meeting" in user_input:
        # Very simplified parsing for demonstration
        # A real system would use LLM tool calling/structured output to extract these
        title = "Scheduled Meeting"
        if "sync" in user_input: title = "Team Sync"
        elif "review" in user_input: title = "Project Review"
        elif "with" in user_input: title = f"Meeting {user_input.split('with')[-1].strip()}"
        
        # Default mock date/time for the interview demo if not found
        date_obj = datetime.date.today() + datetime.timedelta(days=1)
        time_obj = datetime.time(15, 0) # 3:00 PM
        
        meeting = Meeting(title=title, date=date_obj, time=time_obj)
        db.add(meeting)
        db.commit()
        return {"result": f"Meeting '{title}' scheduled successfully for {date_obj} at {time_obj}"}

    elif "show meetings" in user_input:
        meetings = db.query(Meeting).all()
        return {"result": [m.title for m in meetings]}

    return {"result": "Calendar command not recognized"}


