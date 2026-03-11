from typing import TypedDict
import os
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from .agents.task_agent import task_agent
from .agents.calendar_agent import calendar_agent
from .agents.reminder_agent import reminder_agent

load_dotenv()

class State(TypedDict):
    input: str
    result: any

llm = ChatOpenAI(
    model="google/gemini-2.0-flash-001",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0
)

def router_logic(state: State):
    user_input = state["input"]
    prompt = f"""
Choose agent:
task_agent
calendar_agent
reminder_agent

User request: {user_input}

Return only the agent name.
"""
    response = llm.invoke(prompt)
    return response.content.strip()

graph = StateGraph(State)

graph.add_node("task_agent", task_agent)
graph.add_node("calendar_agent", calendar_agent)
graph.add_node("reminder_agent", reminder_agent)

graph.set_conditional_entry_point(
    router_logic,
    {
        "task_agent": "task_agent",
        "calendar_agent": "calendar_agent",
        "reminder_agent": "reminder_agent"
    }
)

graph.add_edge("task_agent", END)
graph.add_edge("calendar_agent", END)
graph.add_edge("reminder_agent", END)

app_graph = graph.compile()



