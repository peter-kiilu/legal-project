import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from rag import ingest_document, get_summary, get_prediction, chat_with_doc

load_dotenv()

app = FastAPI(title="Legal Sage AI Backend")

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
    history: List[dict] = []

class PredictionRequest(BaseModel):
    case_details: str

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
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
