from pydantic import BaseModel
from typing import List, Optional, Literal

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    sender_name: Optional[str] = None

class AgentConfig(BaseModel):
    name: str
    system_prompt: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    model: str = "llama3" # Default model
    agents: Optional[List[AgentConfig]] = None

class ChatResponse(BaseModel):
    messages: List[Message]
    final_synthesis: str
