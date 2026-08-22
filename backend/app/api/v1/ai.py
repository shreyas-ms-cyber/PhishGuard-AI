import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/ai", tags=["AI Chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Read API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={GEMINI_API_KEY}"

SYSTEM_PROMPT = (
    "You are a cybersecurity education assistant. "
    "You help users learn about cybersecurity fundamentals, best practices, "
    "threat detection, phishing awareness, and security hygiene. "
    "You do NOT provide instructions for hacking, penetration testing, "
    "or any malicious activities. You are friendly and informative."
)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\n\nUser: {request.message}\nAssistant:"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800,
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(GEMINI_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            try:
                reply = data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError):
                reply = "I'm sorry, I couldn't generate a response. Please try again."
            return ChatResponse(response=reply)
        except httpx.HTTPStatusError as e:
            print(f"Gemini API error: {e.response.text}")
            raise HTTPException(status_code=500, detail=f"Gemini API error: {e.response.text}")
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
