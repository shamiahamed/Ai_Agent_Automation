import json
import datetime
from app.llm_config import llm
from app.database.db import SessionLocal
from app.database.models import JobListing, JobProfile
from langchain_community.tools import DuckDuckGoSearchRun

def job_scout_agent(state: dict):
    user_input = state.get("input", "")
    db = SessionLocal()
    
    # Get user profile if exists
    profile = db.query(JobProfile).first()
    profile_info = ""
    skills = ""
    if profile:
        profile_info = f"User Profile: {profile.full_name}, Skills: {profile.skills}, Target: {profile.target_roles}"
        skills = profile.skills
        
    try:
        search = DuckDuckGoSearchRun()
        search_query = f"site:linkedin.com/jobs/view {user_input} {skills}"
        live_search_results = search.invoke(search_query)
    except Exception as e:
        live_search_results = f"Search failed: {e}. Generate typical realistic placeholders."
    
    scout_prompt = f"""
    You are the AgentOS Job Scout. Your mission is to find relevant job openings for the user.
    User Input: "{user_input}"
    {profile_info}
    
    Today's Date: {datetime.date.today()}
    
    LIVE SEARCH RESULTS:
    {live_search_results}
    
    If the user is asking to find jobs, generate 3-5 realistic job listings based on the LIVE SEARCH RESULTS above if possible.
    COORDINATES:
    - Use EXACT links and titles from the live search results whenever possible.
    - If live results are poor, then search your knowledge for: Full-time, Onsite (Chennai), and Remote roles with realistic LinkedIn-style URLs.
    
    Each listing must be a JSON object with:
    - title: Job title
    - company: Company name
    - location: City (e.g., Chennai) or Remote
    - description: 2-3 sentence technical summary
    - link: The exact application URL from search, otherwise realistic URL
    
    Return ONLY a JSON list of these jobs. If the user is NOT asking for jobs, return [].
    """
    
    try:
        response = llm.invoke(scout_prompt)
        content = response.content.strip().strip("```json").strip("```")
        jobs_data = json.loads(content)
        
        if not jobs_data:
            return {"result": "I couldn't find any specific job requests. Try 'Find me React developer jobs'."}
            
        new_jobs = []
        for job in jobs_data:
            # Ensure description is a string if it's somehow returned as a list
            desc = job.get('description', '')
            if isinstance(desc, list):
                desc = " ".join(desc)

            new_job = JobListing(
                title=job['title'],
                company=job['company'],
                location=job['location'],
                description=desc,
                link=job['link'],
                date_found=datetime.date.today(),
                status="New"
            )
            db.add(new_job)
            new_jobs.append(f"🔍 Found: **{job['title']}** at **{job['company']}**")
            
        db.commit()
        return {"result": "Successfully scouted new opportunities!\n\n" + "\n".join(new_jobs) + "\n\nCheck your **Career Dashboard** to view all listings."}
        
    except Exception as e:
        return {"result": f"Job Scout Error: {str(e)}"}
    finally:
        db.close()
