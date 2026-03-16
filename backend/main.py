import os
import uuid
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from dotenv import load_dotenv
from rag import ingest_document, get_summary, get_prediction, chat_with_doc

load_dotenv()

app = FastAPI(title="Legal Sage AI Backend")

# In-memory session storage (for production, use a database)
sessions: Dict[str, dict] = {}
SESSIONS_FILE = "sessions.json"

def load_sessions():
    """Load sessions from file if exists."""
    global sessions
    if os.path.exists(SESSIONS_FILE):
        try:
            with open(SESSIONS_FILE, 'r') as f:
                sessions = json.load(f)
        except:
            sessions = {}

def save_sessions():
    """Save sessions to file."""
    with open(SESSIONS_FILE, 'w') as f:
        json.dump(sessions, f, indent=2, default=str)

# Load sessions on startup
load_sessions()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    history: List[dict] = []

class PredictionRequest(BaseModel):
    case_details: str

class SessionCreate(BaseModel):
    title: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Legal Sage AI Backend is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{file.filename}"
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Process the document
        success = ingest_document(file_path)
        
        if success:
            return {"message": f"Successfully uploaded and processed {file.filename}", "filename": file.filename}
        else:
            raise HTTPException(status_code=500, detail="Failed to process document")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_document(filename: str):
    try:
        summary = get_summary(filename)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict_case(request: PredictionRequest):
    try:
        prediction = get_prediction(request.case_details)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = chat_with_doc(request.query, request.history)
        
        # If session_id provided, save the message to session
        if request.session_id and request.session_id in sessions:
            session = sessions[request.session_id]
            session["messages"].append({
                "role": "user",
                "content": request.query,
                "timestamp": datetime.now().isoformat()
            })
            session["messages"].append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
            session["updated_at"] = datetime.now().isoformat()
            # Auto-generate title from first user message if not set
            if session["title"] == "New Chat" and len(session["messages"]) == 2:
                session["title"] = request.query[:50] + ("..." if len(request.query) > 50 else "")
            save_sessions()
        
        return {"response": response, "session_id": request.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Session Management Endpoints
@app.post("/sessions")
async def create_session(request: SessionCreate = None):
    """Create a new chat session."""
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "id": session_id,
        "title": request.title if request and request.title else "New Chat",
        "messages": [],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    save_sessions()
    return sessions[session_id]

@app.get("/sessions")
async def list_sessions():
    """List all sessions, sorted by most recent."""
    session_list = list(sessions.values())
    session_list.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
    return {"sessions": session_list}

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get a specific session with its messages."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    del sessions[session_id]
    save_sessions()
    return {"message": "Session deleted"}

@app.put("/sessions/{session_id}")
async def update_session(session_id: str, request: SessionCreate):
    """Update session title."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    if request.title:
        sessions[session_id]["title"] = request.title
        sessions[session_id]["updated_at"] = datetime.now().isoformat()
        save_sessions()
    return sessions[session_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

