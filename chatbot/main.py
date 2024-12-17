from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.prompts import PromptTemplate
import os, json, uvicorn
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from groq import Groq
from GroqLLM import GroqLLM
from QAChatbot import QAChatbot
from ConnectionManager import ConnectionManager
from qlearning.main import app as rl_system
from prompts import QUESTION_ANSWERING_PROMPT, FEEDBACK_PROMPT


load_dotenv()

# Set up Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the environment variables")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in the environment variables")

groq_client = Groq(api_key=GROQ_API_KEY)

# Initialize LLM with Groq
llm = GroqLLM(client=groq_client)

QA_PROMPT = PromptTemplate(template=QUESTION_ANSWERING_PROMPT, input_variables=["context", "question"])

qa_chatbot = QAChatbot(llm=llm, prompt=QA_PROMPT)

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    status = qa_chatbot.setup(
        pinecone_api_key=PINECONE_API_KEY,
        index_name="mdcat-books",
        embedding_model="BAAI/bge-m3"
    )
    print(f"Startup initialization: {status}")
    
    yield
    
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)
app.mount("/rl", rl_system)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "MDCAT Assistant API is running"}    

@app.post("/llm/feedback")
async def generateFeedback(quiz: Request):
    body = await quiz.json()
    prompt = FEEDBACK_PROMPT.format(body=body)
    feedback = llm.invoke(FEEDBACK_PROMPT)
    print(feedback)
    return { "feedback": feedback }

@app.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await manager.connect(websocket, chat_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            question = message_data.get("question", "").strip()
            chatHistory = message_data.get("chatHistory", [])
            chatHistory = "\n".join(
                [f"{msg['sender']}: {msg['content']}" for msg in chatHistory]
            )
            chatHistory += f"\nCurrent User Message: {question}"
            
            if question:
                answer = qa_chatbot.get_answer(question=chatHistory)
                await manager.send_message_to_chat(chat_id, {
                    "type": "answer",
                    "question": question,
                    "answer": answer,
                })
    except WebSocketDisconnect:
        manager.disconnect(chat_id)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )