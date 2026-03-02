import psycopg

DB_URL = "postgresql://studybud:studybud@localhost:5432/studybud"

def get_connection():
    return psycopg.connect(DB_URL)

def insert_message(message: str, reply: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO messages (message, reply) VALUES (%s, %s);",
                (message, reply)
            )


def get_messages():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, message, reply, created_at " \
            "FROM ( SELECT id, message, reply, created_at " \
                "FROM messages " \
                "ORDER BY id DESC LIMIT 20" \
                ") recent " \
            "ORDER BY id ASC;")
            rows = cur.fetchall()

    return [
        {"id": row[0], "message": row[1], "reply": row[2], "created_at": row[3]} for row in rows
    ]
