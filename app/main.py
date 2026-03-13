from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router import router
from app.database.db import engine
from app.database import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the server starts
    models.Base.metadata.create_all(bind=engine)
    yield
    # This runs when the server stops

app = FastAPI(title="LangGraph Agent API", lifespan=lifespan)

# Setup CORS to allow the React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Agent API"}

