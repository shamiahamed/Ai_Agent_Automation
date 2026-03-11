from app.database.db import SessionLocal
from app.database.models import Task

def task_agent(state: dict):
    user_input = state.get("input", "")
    db = SessionLocal()

    if "add task" in user_input.lower():
        # Clean up the command part more reliably
        title = user_input.lower().split("add task")[-1].strip().lstrip(":").strip()
        
        if not title:
            return {"result": "No task title provided."}

        task = Task(title=title)
        db.add(task)
        db.commit()

        return {"result": f"Task added: {title}"}

    elif "show tasks" in user_input.lower():
        tasks = db.query(Task).all()
        task_list = [t.title for t in tasks]
        return {"result": task_list}

    return {"result": "Task command not recognized"}


