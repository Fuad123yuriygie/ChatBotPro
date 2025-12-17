import os
import asyncio
import httpx
from openai import AsyncOpenAI
from app.agents import PERSONAS, SYNTHESIZER_PROMPT
from app.models import Message, ChatResponse

# Configuration for Local LLM Service (e.g., LM Studio)
# The "v1" suffix is required for OpenAI-compatible endpoints
LM_STUDIO_URL = os.getenv("LLM_BASE_URL", "http://host.docker.internal:1234/v1")

# Initialize Async OpenAI Client
CLIENT = AsyncOpenAI(base_url=LM_STUDIO_URL, api_key="lm-studio")

async def get_agent_response(agent_conf: dict, user_message: str, history: list[Message], model: str) -> Message:
    """
    Get a response from a specific agent persona.
    """
    messages = [{"role": "system", "content": agent_conf["system_prompt"]}]
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    try:
        completion = await CLIENT.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7
        )
        content = completion.choices[0].message.content
        return Message(role="assistant", content=content, sender_name=agent_conf["name"])
    except Exception as e:
        print(f"Error getting response from {agent_conf['name']}: {e}")
        return Message(role="assistant", content=f"[Error: {str(e)}]", sender_name=agent_conf["name"])

async def synthesis_response(user_message: str, agent_responses: list[Message], model: str) -> str:
    """
    Synthesize the responses into a final answer.
    """
    discussion_log = f"User Question: {user_message}\n\n"
    for resp in agent_responses:
        discussion_log += f"{resp.sender_name} said:\n{resp.content}\n\n"

    messages = [
        {"role": "system", "content": SYNTHESIZER_PROMPT},
        {"role": "user", "content": f"Here is the discussion so far:\n\n{discussion_log}\n\nPlease provide your synthesis."}
    ]

    try:
        completion = await CLIENT.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error visualizing synthesis: {str(e)}"

async def run_debate(user_message: str, history: list[Message], model: str, custom_agents: list = None) -> ChatResponse:
    # 1. Get responses from all personas in parallel
    if custom_agents:
        # Convert Pydantic models to dicts if they aren't already
        agents_to_use = [agent.dict() if hasattr(agent, 'dict') else agent for agent in custom_agents]
    else:
        agents_to_use = PERSONAS

    tasks = [get_agent_response(p, user_message, history, model) for p in agents_to_use]
    agent_responses = await asyncio.gather(*tasks)

    # 2. Synthesize
    final_answer = await synthesis_response(user_message, agent_responses, model)

    return ChatResponse(messages=agent_responses, final_synthesis=final_answer)

async def list_local_models():
    """
    List available models from LM Studio using the models endpoint.
    """
    try:
        # direct http call because client.models.list() is cleaner but let's be robust
        models = await CLIENT.models.list()
        return [m.id for m in models.data]
    except Exception as e:
        print(f"Error listing models: {e}")
        return []
