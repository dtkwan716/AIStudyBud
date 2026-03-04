from ollama import chat


def gen_reply(user_message:str) -> str:
    response = chat(
        model='llama3.1:8b',
        messages=[
            {'role': 'system', 'content': 'You are StudyBud, a AI tutor that helps students with their studies. You provide clear and concise explanations to help students understand complex concepts.'},
            {'role': 'user', 'content': user_message}
        ],
        stream = False,
    )
    return response.message.content