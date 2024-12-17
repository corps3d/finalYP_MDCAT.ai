# qlearning_utils.py

import numpy as np
from typing import Dict, Tuple
from .constants import (
    SUBJECTS, 
    DIFFICULTIES, 
    ACCURACY_BINS, 
    LEARNING_RATE, 
    DISCOUNT_FACTOR, 
    ACCURACY_DECAY,
    MASTERY_THRESHOLD,
    STRUGGLE_THRESHOLD,
    MINIMUM_ATTEMPTS
)
from .models import QuizState, QuizAction, UserPerformance

def init_q_table(state_rows: int, state_cols: int, action_space: int) -> np.ndarray:
    """Initialize Q-table with zeros using 2D state representation."""
    return np.zeros((state_rows, state_cols, action_space))

def get_difficulty_level(difficulty: str) -> int:
    """Convert difficulty string to numerical level."""
    return DIFFICULTIES.index(difficulty)

def get_performance_metrics(accuracies: Dict[str, float], attempts: Dict[str, int], subject: str) -> Dict[str, UserPerformance]:
    """Calculate detailed performance metrics for a subject across difficulties."""
    metrics = {}
    for diff in DIFFICULTIES:
        key = f"{subject}_{diff}"
        metrics[diff] = UserPerformance(
            subject=subject,
            difficulty=diff,
            accuracy=accuracies.get(key, 0.0),
            attempts=attempts.get(key, 0)
        )
    return metrics

def discretize_accuracy(accuracy: float) -> int:
    """Discretize accuracy into performance bins."""
    if accuracy < STRUGGLE_THRESHOLD:
        return 0
    elif accuracy < MASTERY_THRESHOLD:
        return 1
    return 2

def state_to_2d_index(state: QuizState, current_subject: str = None) -> Tuple[int, int]:
    """Map QuizState to 2D Q-table indices (row, col)."""
    row_index = 0
    if current_subject:
        # Only consider the current subject's performance
        key = f"{current_subject}_{state.current_difficulty}"
        accuracy = state.accuracies.get(key, 0.0)
        row_index = discretize_accuracy(accuracy)
    else:
        # Consider all subjects' performance
        for subject in SUBJECTS:
            metrics = get_performance_metrics(state.accuracies, state.attempts, subject)
            avg_accuracy = sum(m.accuracy for m in metrics.values()) / len(metrics)
            bin_value = discretize_accuracy(avg_accuracy)
            row_index = row_index * ACCURACY_BINS + bin_value
    
    # Column index is the difficulty level
    col_index = get_difficulty_level(state.current_difficulty)
    
    return row_index, col_index

def action_to_index(action: QuizAction) -> int:
    """Map QuizAction to Q-table index."""
    subject_idx = SUBJECTS.index(action.subject)
    diff_idx = DIFFICULTIES.index(action.difficulty)
    return subject_idx * len(DIFFICULTIES) + diff_idx

def calculate_reward(state: QuizState, action: QuizAction, correct: bool) -> float:
    # Reward calculation remains the same
    DIFFICULTY_MULTIPLIERS = {
        "easy": 1.0,
        "medium": 1.5,
        "hard": 2.0
    }
    
    performance = get_performance_metrics(state.accuracies, state.attempts, action.subject)
    current_diff_level = get_difficulty_level(action.difficulty)
    current_perf = performance[action.difficulty]
    
    base_reward = (1.0 if correct else -0.5) * DIFFICULTY_MULTIPLIERS[action.difficulty]
    
    difficulty_adjustment = 0.0
    if correct and current_diff_level < len(DIFFICULTIES) - 1:
        if (current_perf.accuracy >= MASTERY_THRESHOLD and 
            current_perf.attempts >= MINIMUM_ATTEMPTS):
            difficulty_adjustment += DIFFICULTY_MULTIPLIERS[action.difficulty]
    
    if not correct and current_perf.accuracy < STRUGGLE_THRESHOLD:
        if current_diff_level > 0:
            difficulty_adjustment -= DIFFICULTY_MULTIPLIERS[action.difficulty] * 0.5
    
    exploration_bonus = 0.2 if current_perf.attempts < MINIMUM_ATTEMPTS else 0.0
    
    return base_reward + difficulty_adjustment + exploration_bonus

def update_q_table(
    q_table: np.ndarray,
    state_indices: Tuple[int, int],
    action_idx: int,
    reward: float,
    next_state_indices: Tuple[int, int]
) -> np.ndarray:
    """Update the Q-table using 2D state representation."""
    row_idx, col_idx = state_indices
    next_row_idx, next_col_idx = next_state_indices
    
    current_q = q_table[row_idx, col_idx, action_idx]
    max_next_q = np.max(q_table[next_row_idx, next_col_idx])
    
    q_table[row_idx, col_idx, action_idx] += LEARNING_RATE * (
        reward + DISCOUNT_FACTOR * max_next_q - current_q
    )
    return q_table

def update_metrics(
    accuracies: Dict[str, float],
    attempts: Dict[str, int],
    action: QuizAction,
    correct: bool
) -> Tuple[Dict[str, float], Dict[str, int]]:
    """Update accuracy and attempts for the given subject-difficulty combination."""
    key = f"{action.subject}_{action.difficulty}"
    
    current_accuracy = accuracies.get(key, 0.0)
    accuracies[key] = current_accuracy * (1 - ACCURACY_DECAY) + (1.0 if correct else 0.0) * ACCURACY_DECAY
    
    attempts[key] = attempts.get(key, 0) + 1
    
    return accuracies, attempts

def choose_action(
    q_table: np.ndarray,
    state_indices: Tuple[int, int],
    accuracies: Dict[str, float],
    attempts: Dict[str, int],
    current_subject: str = None,
    epsilon: float = 1.0
) -> Tuple[str, str, bool]:
    """Choose action using epsilon-greedy strategy with 2D state representation."""
    row_idx, col_idx = state_indices
    
    if np.random.random() < epsilon:  # Exploration
        subject = current_subject or np.random.choice(SUBJECTS)
        difficulty = np.random.choice(DIFFICULTIES)
        return subject, difficulty, True
    
    else:  # Exploitation
        if current_subject:
            action_values = q_table[row_idx, col_idx]
            valid_actions = [i for i in range(len(action_values)) 
                           if i // len(DIFFICULTIES) == SUBJECTS.index(current_subject)]
            action_idx = valid_actions[np.argmax([action_values[i] for i in valid_actions])]
        else:
            action_idx = np.argmax(q_table[row_idx, col_idx])
        
        subject_idx = action_idx // len(DIFFICULTIES)
        diff_idx = action_idx % len(DIFFICULTIES)
        return SUBJECTS[subject_idx], DIFFICULTIES[diff_idx], False