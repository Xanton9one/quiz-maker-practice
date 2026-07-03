from pydantic import BaseModel
from typing import Literal

class GenerateRequest(BaseModel):
    text: str
    type: Literal["quiz", "flashcard"]