import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.classes.GenerateRequest import GenerateRequest
from backend.classes.GenerateResponse import GenerateResponse

app = FastAPI(title="Quiz Generator API")

# Разрешаем запросы с React-фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "qwen2.5:7b"
TIMEOUT = 120.0
DATA_LENGTH_LIMIT = 4000


def build_prompt(text: str, quiz_type: str, count_of_questions: str) -> str:
    format_instruction = """
    Если type == "quiz", формат:
    [{"question": "...", "options": ["...", "...", "...", "..."], "correct_answer": "..."}]

    Если type == "flashcard", формат:
    [{"question": "Термин или вопрос?", "options": [], "correct_answer": "Подробный ответ"}]
    """

    return f"""Ты — эксперт-преподаватель. Создай {quiz_type} из {count_of_questions} вопросов на основе текста.
    Верни СТРОГО валидный JSON-массив без markdown, без комментариев, без пояснений.
    {format_instruction}

    Текст лекции:
    {text}
    """


@app.post("/api/generate", response_model=GenerateResponse)
async def generate_quiz(req: GenerateRequest):
    text = req.text[:DATA_LENGTH_LIMIT]
    prompt = build_prompt(text, req.type, req.count_of_questions)

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                    "format": "json",
                },
            )
            response.raise_for_status()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Ollama error: {e}")

    raw_content = response.json()["message"]["content"]
    try:
        questions = json.loads(raw_content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Модель вернула невалидный JSON: {raw_content[:200]}",
        )

    if not isinstance(questions, list):
        raise HTTPException(status_code=500, detail="Ожидался массив вопросов")

    # Здесь позже будет сохранение в PostgreSQL и возврат реального quiz_id
    return GenerateResponse(quiz_id="temp-123", questions=questions)


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": MODEL}