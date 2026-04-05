import json
import datetime
import webbrowser
from app.llm_config import llm
from app.database.db import SessionLocal
from app.database.models import JobListing, JobProfile

def job_apply_agent(state: dict):
    user_input = state.get("input", "")
    db = SessionLocal()
    
    # Check if user wants to update profile
    if "set my profile" in user_input.lower() or "update my profile" in user_input.lower():
        prompt = f"""
        Extract the following information from the user's message: "{user_input}"
        Return JSON field: full_name, email, phone, linkedin_url, gender, disability, sponsorship, skills, bio, target_roles.
        """
        try:
            response = llm.invoke(prompt)
            data = json.loads(response.content.strip().strip("```json").strip("```"))

            # Convert lists to comma-separated strings for the database
            for key in ['skills', 'target_roles']:
                if isinstance(data.get(key), list):
                    data[key] = ", ".join(data[key])
            
            profile = db.query(JobProfile).first()
            if not profile:
                profile = JobProfile(**data)
                db.add(profile)
            else:
                for key, val in data.items():
                    setattr(profile, key, val)
            
            db.commit()
            return {"result": f"✅ **Profile Updated!**\n\n**Name:** {data.get('full_name')}\n**Skills:** {data.get('skills')}"}
        except Exception as e:
            return {"result": f"Profile Update Error: {str(e)}"}
        finally:
            db.close()

    # Apply Logic
    # Find active job in input or latest new job
    job = db.query(JobListing).filter(JobListing.status == "New").order_by(JobListing.id.desc()).first()
    profile = db.query(JobProfile).first()
    
    if not job:
        return {"result": "I couldn't find any 'New' jobs to apply to. Try 'Scout for jobs' first."}
    
    if not profile:
        return {"result": "I need your **Job Profile** before I can apply! Try saying 'Set my profile: My name is [Name], my skills are [Skills]...'"}

    apply_prompt = f"""
    You are the AgentOS Career Agent. Draft a professional application for this job:
    Job: {job.title} at {job.company}
    Description: {job.description}
    
    Applicant Profile: {profile.full_name}, Skills: {profile.skills}, Bio: {profile.bio}
    
    Draft a high-impact, short, and persuasive application message.
    Return ONLY the application text.
    """
    
    try:
        response = llm.invoke(apply_prompt)
        job.status = "Applied"
        job.draft_message = response.content
        db.commit()
        
        # Determine the correct URL separator and trigger the Ghost Browser
        try:
            sep = "&" if "?" in job.link else "?"
            target_url = f"{job.link}{sep}agentos_autofill=true"
            webbrowser.open(target_url)
        except Exception as e:
            print(f"Failed to open browser automatically: {e}")
            
        return {"result": f"🚀 **Applied to {job.title} at {job.company}!**\n\n**Ghost Browser Launched!** Check your active browser—your application is being automatically filled out.\n\n**Drafted Cover Letter:**\n\n{response.content}"}
    except Exception as e:
        return {"result": f"Job Apply Error: {str(e)}"}
    finally:
        db.close()
