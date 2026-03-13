from app.llm_config import get_llm
import os

llm = get_llm(temperature=0.7)

def chat_agent(state: dict):
    user_input = state.get("input", "")
    
    prompt = f"""
    You are a helpful AI assistant for a productivity app called AgentOS.
    The user is asking a general question or chatting. 
    Provide a concise and helpful response.
    
    User message: {user_input}
    """
    
    response = llm.invoke(prompt)
    return {"result": response.content}
