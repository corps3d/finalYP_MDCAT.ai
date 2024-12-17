from llama_index.core.tools import FunctionTool
import os 

note_file = os.path.join("data", "notes.txt")

def save_a_note(note):
    if not os.path.exists(note_file):
        open(note_file, "w")
    
    with open(note_file, "a") as f:
        f.writelines(note + "\n")
    
    return "Note saved successfully"

note_engine = FunctionTool.from_defaults(
    fn=save_a_note,
    name="note_saver",
    description="this tool can save a text based note to a file from a user"
)
    