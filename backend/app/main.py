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
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    reply = gen_reply(request.message)
    insert_message(request.message, reply)
    return{"response": reply}

@app.get("/messages")
def get_messages():
    return db_get_messages()