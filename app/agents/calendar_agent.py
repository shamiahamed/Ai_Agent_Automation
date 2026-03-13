from app.database.db import SessionLocal
from app.database.models import Meeting
from app.llm_config import llm
import datetime
import json

def calendar_agent(state: dict):
    user_input = state.get("input", "")
    db = SessionLocal()

    if "show" in user_input.lower():
        meetings = db.query(Meeting).all()
        return {"result": [m.title for m in meetings]}

    # Semantic extraction
    now = datetime.datetime.now()
    prompt = f"""
    Current time: {now}
    Extract meeting details from the user input.
    User input: "{user_input}"
    
    Return JSON format:
    {{
        "title": "meeting title",
        "date": "YYYY-MM-DD",
        "time": "HH:mm:ss"
    }}
    
    If no date is mentioned, assume tomorrow.
    If no time is mentioned, assume 09:00:00.
    Return ONLY JSON.
    """
    
    try:
        response = llm.invoke(prompt)
        data = json.loads(response.content.strip().strip("```json").strip("```"))
        
        title = data.get("title", "New Meeting")
        date_str = data.get("date")
        time_str = data.get("time")
        
        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S").time()
        
        # Conflict Detection Logic
        existing_conflict = db.query(Meeting).filter(
            Meeting.date == date_obj,
            Meeting.time == time_obj
        ).first()
        
        if existing_conflict:
            return {
                "result": f"⚠️ CONFLICT DETECTED: You already have '{existing_conflict.title}' scheduled for {date_obj} at {time_obj}. Would you like to schedule it at a different time?"
            }
        
        meeting = Meeting(title=title, date=date_obj, time=time_obj)
        db.add(meeting)
        db.commit()
        
        return {
            "result": f"Meeting '{title}' scheduled for {date_obj} at {time_obj}.\n\n** Should I draft and send email invitations to the participants for this meeting?"
        }
    except Exception as e:
        return {"result": f"Failed to schedule meeting: {str(e)}"}


