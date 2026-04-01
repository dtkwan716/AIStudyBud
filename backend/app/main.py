from app.chat_service import gen_reply
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_connection, insert_message, get_messages as db_get_messages


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    persona_id: str
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        reply = gen_reply(request.persona_id, request.message)
        return{"response": reply}
    except Exception as e:
        return{"error": str(e)}

@app.get("/messages/{persona_id}")
def get_messages(persona_id: str):
    return db_get_messages(persona_id)