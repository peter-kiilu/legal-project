# Legal Sage AI

An intelligent legal document analysis platform powered by AI. Upload legal documents, get summaries, chat with your documents, and receive case outcome predictions.

## 🏗️ Project Structure

```
legal-project/
├── backend/          # FastAPI Python backend with RAG capabilities
├── legal-sage-ai/    # React + TypeScript frontend
└── README.md
```

## ✨ Features

- **📄 Document Upload** - Upload PDF and Word documents for analysis
- **📝 Document Summarization** - Get AI-powered summaries of legal documents
- **💬 Chat with Documents** - Ask questions about your uploaded documents
- **🔮 Case Prediction** - Get AI predictions for case outcomes based on details

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **LangChain** - LLM orchestration framework
- **ChromaDB** - Vector database for document embeddings
- **Ollama** - Local LLM integration

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Component library
- **React Query** - Data fetching and caching
- **Supabase** - Authentication and backend services

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Ollama (for local LLM)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file with your environment variables:

   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   ```

6. Run the server:

   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd legal-sage-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your environment variables:

   ```env
   VITE_API_URL=http://localhost:8000
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint   | Description                         |
| ------ | ---------- | ----------------------------------- |
| GET    | `/`        | Health check                        |
| POST   | `/upload`  | Upload a document for processing    |
| POST   | `/analyze` | Get summary of an uploaded document |
| POST   | `/predict` | Get case outcome prediction         |
| POST   | `/chat`    | Chat with your uploaded documents   |

## 📝 License

This project is for educational and demonstration purposes.
