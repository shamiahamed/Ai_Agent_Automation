from app.database.db import SessionLocal
from app.database.models import Reminder
from app.llm_config import llm
import datetime
import os
import json

def reminder_agent(state: dict):
    user_input = state.get("input", "")
    db = SessionLocal()

    if "show" in user_input.lower():
        reminders = db.query(Reminder).all()
        return {"result": [r.message for r in reminders]}

    # Semantic extraction
    now = datetime.datetime.now()
    prompt = f"""
    Current time: {now}
    Extract reminder details from the user input.
    User input: "{user_input}"
    
    Return JSON format:
    {{
        "message": "the reminder message",
        "time": "HH:mm:ss"
    }}
    
    If no specific time is mentioned, set it for 10 minutes from now ({ (now + datetime.timedelta(minutes=10)).strftime("%H:%M:%S") }).
    Return ONLY JSON.
    """
    
    try:
        response = llm.invoke(prompt)
        data = json.loads(response.content.strip().strip("```json").strip("```"))
        
        message = data.get("message", "General Reminder")
        time_str = data.get("time")
        time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S").time()
        
        reminder = Reminder(message=message, time=time_obj)
        db.add(reminder)
        db.commit()
        return {"result": f"Set reminder: '{message}' at {time_obj}"}
    except Exception as e:
        return {"result": f"Failed to set reminder: {str(e)}"}


