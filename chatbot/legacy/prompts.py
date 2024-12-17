from llama_index.core import PromptTemplate


def messages_to_prompt(messages):
  prompt = ""
  for message in messages:
    if message.role == 'system':
      prompt += f"<|system|>\n{message.content}</s>\n"
    elif message.role == 'user':
      prompt += f"<|user|>\n{message.content}</s>\n"
    elif message.role == 'assistant':
      prompt += f"<|assistant|>\n{message.content}</s>\n"

  # ensure we start with a system prompt, insert blank if needed
  if not prompt.startswith("<|system|>\n"):
    prompt = "<|system|>\n</s>\n" + prompt

  # add final assistant prompt
  prompt = prompt + "<|assistant|>\n"

  return prompt


instruction_str = """
    1. Convert the query to executable Python code using Pandas. Your response SHOULD ONLY CONTAIN PYTHON CODE NOTHING ELSE.
    Note: The expression should be a single line of code.
    2. The final line of code should be a Python expression that can be called with the 'eval()' function.
    3. The code should represent a solution to the query.
    4. PRINT ONLY THE EXPRESSION.
    5. Do not quote the expression.
"""

new_prompt = PromptTemplate(
    """
    You are working with a pandas dataframe in Python.
    The name of the dataframe is 'df'.
    This is the result of 'print(df.head())':
    {df_str}
    
    Follow these instructions:
    {instruction_str}
    Query: {query_str}
    
    Expression: 
    """
)

context = '''
    Purpose: The primary role of the agent is to assist a user b providing accuracte answers
    related to academic courses related to medical and dental college admission test. Your goal is to maximize
    the users learning by providing accuracte and to the point answers.
'''