from sqlalchemy import Column, Integer, String, Date, Time, Text
from .db import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(1024), nullable=True)
    
class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    date = Column(Date)
    time = Column(Time)

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String(255), index=True)
    time = Column(Time)

class JobProfile(Base):
    __tablename__ = "job_profiles"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255))
    email = Column(String(255))
    skills = Column(Text)
    bio = Column(Text)
    target_roles = Column(String(1024))

class JobListing(Base):
    __tablename__ = "job_listings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    company = Column(String(255), index=True)
    location = Column(String(255))
    description = Column(Text)
    link = Column(String(1024))
    status = Column(String(50), default="New") # New, Applied, Rejected, Interviewing
    draft_message = Column(Text, nullable=True)
    date_found = Column(Date)
