from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import ChatRequest, ChatResponse
from app.orchestrator import run_debate, list_local_models

app = FastAPI(
    title="Chat Bot Pro API",
    description="Backend API for the Chat Bot Pro multi-agent orchestration platform.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = await run_debate(request.message, request.history, request.model, request.agents)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_models():
    models = await list_local_models()
    return {"models": models}

@app.get("/health")
def health_check():
    return {"status": "ok"}
