from typing import TypedDict
import os
from langgraph.graph import StateGraph, END
from .llm_config import llm
from .agents.task_agent import task_agent
from .agents.calendar_agent import calendar_agent
from .agents.reminder_agent import reminder_agent
from .agents.chat_agent import chat_agent
from .agents.email_agent import email_agent
from .agents.job_scout_agent import job_scout_agent
from .agents.job_apply_agent import job_apply_agent

class State(TypedDict):
    input: str
    result: any

def router_logic(state: State):
    user_input = state["input"].lower()
    
    # Simple keyword routing for speed, fallback to LLM
    if "scout" in user_input or "find job" in user_input:
        return "job_scout_agent"
    if "apply" in user_input or "set my profile" in user_input or "update my profile" in user_input:
        return "job_apply_agent"
        
    prompt = f"""
    Choose agent:
    task_agent, calendar_agent, reminder_agent, email_agent, job_scout_agent, job_apply_agent, chat_agent

    User request: {user_input}

    Return 'job_scout_agent' if searching for jobs.
    Return 'job_apply_agent' if applying or updating job profile.
    Return 'email_agent' for emails.
    Return 'chat_agent' for everything else.
    """
    response = llm.invoke(prompt)
    return response.content.strip()

graph = StateGraph(State)

graph.add_node("task_agent", task_agent)
graph.add_node("calendar_agent", calendar_agent)
graph.add_node("reminder_agent", reminder_agent)
graph.add_node("chat_agent", chat_agent)
graph.add_node("email_agent", email_agent)
graph.add_node("job_scout_agent", job_scout_agent)
graph.add_node("job_apply_agent", job_apply_agent)

graph.set_conditional_entry_point(
    router_logic,
    {
        "task_agent": "task_agent",
        "calendar_agent": "calendar_agent",
        "reminder_agent": "reminder_agent",
        "chat_agent": "chat_agent",
        "email_agent": "email_agent",
        "job_scout_agent": "job_scout_agent",
        "job_apply_agent": "job_apply_agent"
    }
)

graph.add_edge("task_agent", END)
graph.add_edge("calendar_agent", END)
graph.add_edge("reminder_agent", END)
graph.add_edge("chat_agent", END)
graph.add_edge("email_agent", END)
graph.add_edge("job_scout_agent", END)
graph.add_edge("job_apply_agent", END)

app_graph = graph.compile()



