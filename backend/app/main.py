from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg


app = FastAPI()


DB_URL = "postgresql://studybud:studybud@localhost:5432/studybud"
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def status():
    return {"status": "ok"}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    reply = f"{request.message}"
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO messages (message, reply) VALUES (%s, %s);",
                (request.message, reply)
            )
            conn.commit()
    return{
        "response": f"{reply}"
    }

@app.get("/messages")
def get_messages():
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, message, reply, created_at FROM ( SELECT id, message, reply, created_at FROM messages ORDER BY id DESC LIMIT 20) recent ORDER BY id ASC;")
            rows = cur.fetchall()

    return [
        {"id": row[0], "message": row[1], "reply": row[2], "created_at": row[3]} for row in rows
    ]
