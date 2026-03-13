import json
import datetime
from app.llm_config import llm
from app.database.db import SessionLocal
from app.database.models import Meeting
from app.utils.email_sender import send_email
db = SessionLocal()

def email_agent(state: dict):
    user_input = state.get("input", "")
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Use LLM to classify intent
    classification_prompt = f"""
    Analyze the user's intent:
    "{user_input}"
    
    Categories:
    1. 'draft_invite': User wants to draft or create a meeting invitation/email.
    2. 'send_invite': User is confirming to "send", "mail", or "dispatch" the drafted invitation (e.g., "Yes", "Send it now").
    3. 'analyze_email': User provided an email body and wants to extract tasks or meetings from it.
    
    Return only the category name.
    """
    intent = llm.invoke(classification_prompt).content.strip().lower()

    # Case 1: Sending/Confirming the invitation
    if "send_invite" in intent:
        latest = db.query(Meeting).order_by(Meeting.id.desc()).first()
        if latest:
            # Extract recipient from input using LLM
            extraction_prompt = f"Extract only the email address from this message: '{user_input}'. If no email is found, return 'NONE'."
            recipient = llm.invoke(extraction_prompt).content.strip()
            
            if "NONE" in recipient:
                return {"result": f"📧 I'm ready to send the invite for **{latest.title}**, but I need a recipient. \n\n**To which email address should I send it?**"}

            subject = f"Meeting Invitation: {latest.title}"
            body = f"You are invited to a meeting: {latest.title}\nDate: {latest.date}\nTime: {latest.time}"
            
            success = send_email(recipient, subject, body)
            
            if success:
                return {"result": f"🚀 **Action Complete:** Invitation for '{latest.title}' sent successfully to **{recipient}**!"}
            else:
                return {"result": f"❌ **Error:** Failed to send email to {recipient}. Check your SMTP settings."}
        return {"result": "I couldn't find a meeting to send."}

    # Case 2: Drafting an invitation
    if state.get("action") == "draft_invite" or "draft_invite" in intent:
        meeting_details = state.get("meeting_details")
        
        if not meeting_details:
            latest = db.query(Meeting).order_by(Meeting.id.desc()).first()
            if latest:
                meeting_details = {
                    "title": latest.title,
                    "date": latest.date.strftime("%Y-%m-%d"),
                    "time": latest.time.strftime("%H:%M:%S")
                }
            else:
                return {"result": "I couldn't find any recent meetings to send an invite for."}

        prompt = f"""
        Draft a professional and friendly meeting invitation email.
        Title: {meeting_details.get('title')}
        Date: {meeting_details.get('date')}
        Time: {meeting_details.get('time')}
        Return ONLY the email subject and body.
        """
        response = llm.invoke(prompt)
        return {"result": f"📝 **Drafted Invite:**\n\n{response.content}\n\n*Should I send this to the participants?*"}

    # Case 2: Analyzing an existing email body
    prompt = f"""
    You are an AI Email Assistant for AgentOS. Today's date is {current_date}.
    Analyze this email content: "{user_input}"
    
    If it's a task, return JSON: {{"type": "task", "details": "..."}}
    If it's a meeting, return JSON: {{"type": "meeting", "title": "...", "date": "...", "time": "..."}}
    Return ONLY raw JSON.
    """
    
    try:
        response = llm.invoke(prompt)
        data = json.loads(response.content.strip().strip("```json").strip("```"))
        
        if data.get("type") == "task":
            return {"result": f"📧 Email Analysis: I found a TASK: '{data['details']}'. Should I add it?"}
        elif data.get("type") == "meeting":
             return {"result": f"📧 Email Analysis: I found a MEETING: '{data['title']}' on {data.get('date')}. Should I schedule it?"}
             
        return {"result": "📧 Email Analysis: No specific action items detected in this email."}
        
    except Exception as e:
        return {"result": f"Email Agent Error: {str(e)}"}
