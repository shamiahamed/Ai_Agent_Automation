import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Force load environment variables
load_dotenv(override=True)

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("DEBUG ERROR: OPENROUTER_API_KEY is missing from .env")
else:
    # Print first few chars to verify it's the right key
    print(f"DEBUG: Using API Key starting with: {api_key[:10]}...")

def get_llm(temperature=0):
    return ChatOpenAI(
        model="google/gemini-2.0-flash-001",
        openai_api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        temperature=temperature
    )

llm = get_llm()
