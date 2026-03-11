from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AgentInput(BaseModel):
    input: str

