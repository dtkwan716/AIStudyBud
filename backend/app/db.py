import psycopg

DB_URL = "postgresql://studybud:studybud@localhost:5432/studybud"

def get_connection():
    return psycopg.connect(DB_URL)

def insert_message(chat_id: int, role: str, content: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO messages (chat_id, role, content) VALUES (%s, %s, %s);",
                (chat_id, role, content)
            )


def get_messages(chat_id: int, limit: int = 10):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, chat_id, role, content, created_at " \
            "FROM ( SELECT id, chat_id, role, content, created_at " \
                "FROM messages " \
                "WHERE chat_id = %s " \
                "ORDER BY id DESC " \
                "LIMIT %s" \
                ") recent " \
            "ORDER BY id ASC;"
            , (chat_id, limit)
            )
            rows = cur.fetchall()

    return [
        {"id": row[0], "chat_id": row[1], "role": row[2], "content": row[3], "created_at": row[4]} for row in rows
    ]
