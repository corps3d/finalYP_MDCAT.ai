from pydantic import BaseModel
from typing import Dict, Optional

class QuizState(BaseModel):
    accuracies: Dict[str, float]
    current_difficulty: str
    attempts: Dict[str, int] = {}  # Track attempts per subject-difficulty combination

class QuizAction(BaseModel):
    subject: str
    difficulty: str

class FeedbackRequest(BaseModel):
    user_id: str
    correct: bool
    
class NextQuestionRequest(BaseModel):
    user_id: str
    current_subject: Optional[str] = None

class UserPerformance(BaseModel):
    subject: str
    difficulty: str
    accuracy: float
    attempts: int