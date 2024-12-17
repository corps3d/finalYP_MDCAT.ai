from dotenv import load_dotenv
import os, torch
import pandas as pd
from prompts import new_prompt, instruction_str, context, messages_to_prompt
from note_engine import note_engine
from llama_index.core import PromptTemplate 
from llama_index.core.query_engine import PandasQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from transformers import BitsAndBytesConfig
from llama_index.llms.huggingface import HuggingFaceInferenceAPI
from pdf import engine as ragbot

# Paths to files
book_path = os.path.join("data", "Biology 9.pdf")
perf_df = pd.read_csv("data/performance.csv") 

# Load .env file
load_dotenv()


llm = HuggingFaceInferenceAPI(
    model_name = "HuggingFaceH4/zephyr-7b-beta",
    api_key = "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"   
)

perf_query_engine = PandasQueryEngine(df=perf_df, verbose=True, instruction_str=instruction_str, llm=llm)

perf_query_engine.update_prompts({"pandas_prompt": new_prompt})

tools = [
    note_engine,
    QueryEngineTool(
        query_engine=perf_query_engine,
        metadata=ToolMetadata(
            name="performance_data",
            description="This gives information about a user's performance in a test"
        ),
    ),
    QueryEngineTool(
        query_engine=ragbot,
        metadata=ToolMetadata(
            name="biology9",
            description="This gives information about an academic book of biology of 9th class"
        ),
    ),
]

agent = ReActAgent.from_tools(tools=tools, llm=llm, verbose=True, context=context)

while (prompt := input("Enter a prompt (q to quit): ")) != "q":
    result = agent.query(prompt)
    print(result)
    
