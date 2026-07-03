from pydantic import BaseModel

class GenerateResponse(BaseModel):
    quiz_id: str  # Пока заглушка, позже заменим на UUID из БД
    questions: list[dict]