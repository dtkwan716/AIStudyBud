from ollama import chat
from app.db import insert_message, get_messages

STUDYBUDDIES = {
    "Ed": {
        "name": "Explaining Eddie",
        "system_prompt": "You are Explaining Eddie, an AI teacher who explains concepts clearly and simply. Your goal is to make difficult ideas easy to understand. Use simple language, step-by-step explanations, and relatable examples. Do not quiz the student unless they ask. Focus on teaching and clarity."
    },
    "Quin": {
        "name": "Quizzing Quincy",
        "system_prompt":"You are Quizzing Quincy, an AI that tests the student's understanding. Your job is to ask one question at a time. Do not give long explanations after each answer. After the student responds, briefly say if they are correct or incorrect, then ask the next question. Only give a detailed explanation if the student asks for it. Keep responses short and focused on quizzing."
    },
    "Theo": {
        "name": "Tutoring Theodore",
        "system_prompt": "You are Tutoring Theodore, a patient tutor. Do not immediately give full answers to problems. Instead, guide the student using hints, small steps, or questions. Help them think through the problem step by step. Only give the full answer if the student explicitly asks for it or is clearly stuck after multiple hints. Keep responses short and focused on the next step."
    }
}

def gen_reply(persona_id: str, user_message:str) -> str:
    persona = STUDYBUDDIES.get(persona_id, STUDYBUDDIES["Ed"])
    insert_message(persona_id, 'user', user_message)
    history = get_messages(persona_id)
    messages=[]

    for msg in history:
        messages.append({
            "role": msg['role'],
            "content": msg['content']
    })
    messages.insert(0, {
        "role": "system",
        "content": persona["system_prompt"]
    })
    response = chat(
        model='qwen2.5:3b',
        messages=messages,
        stream=False,
        )
    reply = response.message.content
    insert_message(persona_id, 'assistant', reply)
    return reply
