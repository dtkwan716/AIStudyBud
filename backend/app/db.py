import psycopg

DB_URL = "postgresql://studybud:studybud@localhost:5432/studybud"

def get_connection():
    return psycopg.connect(DB_URL)

def insert_message(persona_id: str, role: str, content: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO messages (persona_id, role, content) VALUES (%s, %s, %s);",
                (persona_id, role, content)
            )


def get_messages(persona_id: str, limit: int = 10):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, persona_id, role, content, created_at " \
            "FROM ( SELECT id, persona_id, role, content, created_at " \
                "FROM messages " \
                "WHERE persona_id = %s " \
                "ORDER BY id DESC " \
                "LIMIT %s" \
                ") recent " \
            "ORDER BY id ASC;"
            , (persona_id, limit)
            )
            rows = cur.fetchall()

    return [
        {"id": row[0], "persona_id": row[1], "role": row[2], "content": row[3], "created_at": row[4]} for row in rows
    ]
