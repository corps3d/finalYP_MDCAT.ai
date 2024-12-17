# main.py

from fastapi import FastAPI, HTTPException
from .models import FeedbackRequest, QuizState, NextQuestionRequest, QuizAction
from .db_utils import get_user_data, update_user_data
from .qlearning_utils import (
    state_to_2d_index,
    action_to_index,
    calculate_reward,
    update_q_table,
    update_metrics,
    choose_action
)
import numpy as np
from .constants import SUBJECTS, DIFFICULTIES, ACCURACY_BINS
from typing import Dict, Any

app = FastAPI(title="Adaptive Quiz System", 
             description="An intelligent quiz system that adapts to user performance using Q-Learning")

# Calculate state space dimensions
STATE_ROWS = ACCURACY_BINS ** len(SUBJECTS)  # For all subjects
STATE_COLS = len(DIFFICULTIES)  # For difficulty levels
ACTION_SPACE = len(SUBJECTS) * len(DIFFICULTIES)

@app.post("/next")
async def get_next_question(request: NextQuestionRequest):
    """Select the next question using 2D state representation."""
    # Get user data
    user_data = get_user_data(request.user_id, STATE_ROWS, STATE_COLS, ACTION_SPACE)
    accuracies = user_data["accuracies"]
    attempts = user_data.get("attempts", {})
    q_table = np.array(user_data["q_table"])
    
    last_question = user_data.get("last_question", {})
    current_difficulty = last_question.get("difficulty", "easy")
    epsilon = user_data.get("epsilon", 1.0)
    
    # Create QuizState and get 2D state indices
    state = QuizState(
        accuracies=accuracies,
        attempts=attempts,
        current_difficulty=current_difficulty
    )
    state_indices = state_to_2d_index(state)

    # Choose next question
    subject, difficulty, exploration = choose_action(
        q_table,
        state_indices,
        accuracies,
        attempts,
        request.current_subject,
        epsilon
    )

    # Save the selected question
    update_user_data(
        request.user_id,
        accuracies=accuracies,
        attempts=attempts,
        q_table=q_table,
        last_question={"subject": subject, "difficulty": difficulty},
    )

    return {
        "subject": subject,
        "difficulty": difficulty,
        "exploration": exploration,
        "metrics": {
            "current_accuracy": accuracies.get(f"{subject}_{difficulty}", 0.0),
            "total_attempts": attempts.get(f"{subject}_{difficulty}", 0)
        }
    }

@app.post("/update")
async def update_state(request: FeedbackRequest):
    """Update Q-table and metrics using 2D state representation."""
    user_data = get_user_data(request.user_id, STATE_ROWS, STATE_COLS, ACTION_SPACE)
    accuracies = user_data["accuracies"]
    attempts = user_data.get("attempts", {})
    q_table = np.array(user_data["q_table"])
    last_question = user_data.get("last_question")

    if not last_question:
        raise HTTPException(
            status_code=400,
            detail="No previous question found for this user"
        )

    # Create state and action objects
    state = QuizState(
        accuracies=accuracies,
        attempts=attempts,
        current_difficulty=last_question["difficulty"]
    )
    action = QuizAction(
        subject=last_question["subject"],
        difficulty=last_question["difficulty"]
    )

    # Get state indices and action index
    current_state_indices = state_to_2d_index(state)
    action_idx = action_to_index(action)

    # Calculate reward
    reward = calculate_reward(state, action, request.correct)

    # Update metrics
    accuracies, attempts = update_metrics(accuracies, attempts, action, request.correct)

    # Create new state with updated metrics
    new_state = QuizState(
        accuracies=accuracies,
        attempts=attempts,
        current_difficulty=last_question["difficulty"]
    )
    new_state_indices = state_to_2d_index(new_state)

    # Update Q-table
    q_table = update_q_table(
        q_table,
        current_state_indices,
        action_idx,
        reward,
        new_state_indices
    )

    # Save updated data
    update_user_data(
        request.user_id,
        accuracies=accuracies,
        attempts=attempts,
        q_table=q_table,
        iteration=user_data.get("iteration", 1)
    )

    subject_key = f"{action.subject}_{action.difficulty}"
    performance = {
        diff: accuracies.get(f"{action.subject}_{diff}", 0.0)
        for diff in DIFFICULTIES
    }
    
    return {
        "reward": reward,
        "new_accuracy": accuracies[subject_key],
        "total_attempts": attempts[subject_key],
        "current_difficulty": action.difficulty,
        "performance_summary": {
            "subject": action.subject,
            "accuracies": performance,
            "total_attempts": attempts.get(subject_key, 0)
        }
    }
    
@app.get("/{user_id}/stats")
async def get_user_statistics(user_id: str) -> Dict[str, Any]:
    """Get detailed statistics for a user."""
    user_data = get_user_data(user_id, STATE_ROWS, STATE_COLS, ACTION_SPACE)
    
    # Calculate statistics per subject and difficulty
    stats = {}
    for subject in SUBJECTS:
        subject_stats = {}
        for difficulty in DIFFICULTIES:
            key = f"{subject}_{difficulty}"
            subject_stats[difficulty] = {
                "accuracy": user_data["accuracies"].get(key, 0.0),
                "attempts": user_data["attempts"].get(key, 0)
            }
        stats[subject] = subject_stats
    
    return {
        "user_id": user_id,
        "statistics": stats
    }

@app.get("/{user_id}/progress")
async def get_user_progress(user_id: str):
    """Get detailed progress report for a user."""
    user_data = get_user_data(user_id, STATE_ROWS, STATE_COLS, ACTION_SPACE)
    
    progress_report = {}
    for subject in SUBJECTS:
        subject_progress = {}
        for difficulty in DIFFICULTIES:
            key = f"{subject}_{difficulty}"
            subject_progress[difficulty] = {
                "accuracy": user_data["accuracies"].get(key, 0.0),
                "attempts": user_data["attempts"].get(key, 0),
                "mastered": user_data["accuracies"].get(key, 0.0) >= 0.7 and 
                           user_data["attempts"].get(key, 0) >= 5
            }
        progress_report[subject] = subject_progress
    
    return {
        "user_id": user_id,
        "progress_report": progress_report,
        "overall_stats": {
            "total_attempts": sum(user_data["attempts"].values()),
            "average_accuracy": np.mean(list(user_data["accuracies"].values())) if user_data["accuracies"] else 0.0
        }
    }
