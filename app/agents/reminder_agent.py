from app.database.db import SessionLocal
from app.database.models import Reminder
import datetime

def reminder_agent(state: dict):
    user_input = state.get("input", "").lower()
    db = SessionLocal()

    if "remind" in user_input:
        # Clean up input to extract a basic message
        message = user_input.replace("remind me to", "").strip()
        if not message:
            message = "General Reminder"
            
        # Set for 5 minutes from now for the demo
        now = datetime.datetime.now()
        target_time = now + datetime.timedelta(minutes=5)
        time_obj = target_time.time()
        
        reminder = Reminder(message=message, time=time_obj)
        db.add(reminder)
        db.commit()
        return {"result": f"Reminder set: '{message}' at {time_obj}"}

    elif "show reminders" in user_input:
        reminders = db.query(Reminder).all()
        return {"result": [r.message for r in reminders]}

    return {"result": "Reminder command not recognized"}


