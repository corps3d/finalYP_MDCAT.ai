# Subject and difficulty configurations
SUBJECTS = ["biology", "physics", "chemistry", "logical", "english"]
DIFFICULTIES = ["easy", "medium", "hard"]
ACCURACY_BINS = 3

# Learning Parameters
LEARNING_RATE = 0.1
DISCOUNT_FACTOR = 0.9
MIN_EPSILON = 0.1
ACCURACY_DECAY = 0.1

# Performance thresholds
MASTERY_THRESHOLD = 0.7  # Required accuracy to consider a difficulty level mastered
STRUGGLE_THRESHOLD = 0.4  # Accuracy below this suggests difficulty should decrease
MINIMUM_ATTEMPTS = 5  # Minimum attempts before considering difficulty change
