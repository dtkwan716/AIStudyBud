from ollama import chat
from app.db import insert_message, get_messages


def gen_reply(chat_id: int, user_message:str) -> str:
    insert_message(chat_id, 'user', user_message)
    history = get_messages(chat_id)
    messages=[]

    for msg in history:
        messages.append({
            "role": msg['role'],
            "content": msg['content']
    })
    messages.insert(0, {
        "role": "system",
        "content": "You are StudyBud, an AI tutor that helps students with their studies. You provide clear and concise explanations to help students understand complex concepts."
    })
    response = chat(
        model='llama3.1:8b',
        messages=messages,
        stream=False,
        )
    reply = response.message.content
    insert_message(chat_id, 'assistant', reply)
    return reply
