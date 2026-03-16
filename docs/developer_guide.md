# Legal Sage AI - Developer Documentation

Welcome to the comprehensive developer documentation for **Legal Sage AI**. This guide provides an in-depth look into the project structure, technologies, architectural concepts, APIs, and guidelines for contributing to and extending the system.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [Backend (FastAPI) Deep Dive](#backend-fastapi-deep-dive)
7. [Frontend (React) Deep Dive](#frontend-react-deep-dive)
8. [AI Integration & RAG Pipeline](#ai-integration--rag-pipeline)
9. [Adding New Features (Developer Guidelines)](#adding-new-features)

---

## Project Overview
**Legal Sage AI** is an intelligent legal document analysis application leveraging Retrieval-Augmented Generation (RAG) and open-source local LLMs to assure complete data privacy and security.

**Core Capabilities:**
- **Document Ingestion:** Submitting and parsing legal PDFs and Word documents.
- **AI Analytics:** Automatically extracting actionable insights and structured summaries.
- **RAG Chat System:** Querying massive, indexed legal documents in real-time.
- **Case Prediction:** Evaluating factors for likely legal outcomes using deep learning and inference.

---

## Technology Stack

The platform embraces a modern, separation-of-concerns architecture between the Frontend and the Backend:

**Frontend Ecosystem:**
- **Framework:** React 18 (TypeScript) via Vite for HMR and high-performance builds.
- **Styling:** Tailwind CSS combined with Shadcn/UI (Radix primitives) for accessible components.
- **State & Data Fetching:** React Query (TanStack Query) for efficient caching and mutation handling.

**Backend Ecosystem:**
- **Framework:** FastAPI / Python 3.10+ handling REST routes concurrently and generating async OpenAPI docs.
- **AI Orchestration:** LangChain serving up templates, output parsers, and chains.
- **Vector Intelligence:** ChromaDB for local embedding storage and high-speed similarity search.
- **Generative Models:** Ollama interfacing local deployments of foundation models (e.g., Llama 3).

**Infrastructure & Auth:**
- **Authentication:** Supabase handles secure JWT tracking and user context.
- **Database:** Supabase PostgreSQL manages application metadata state.

---

## System Architecture

The Legal Sage AI architecture is built into three well-defined layers: 
1. **Presentation Layer:** State synchronization and rendering.
2. **Application Layer:** Prompt orchestration and document processing.
3. **Data & AI Infrastructure:** High-dimensional vector storage and pure LLM inference.

*(Check out `system_architecture.md` in the root folder for a visual representation using Mermaid flowcharts).*

---

## Project Structure

A high-level view of where your logic lives:

```
d:\legal project
├── backend/                  # The Python FastAPI AI Service layer
│   ├── main.py               # Main ASGI Server entrypoint and router
│   ├── requirements.txt      # Python dependencies
│   ├── venv/                 # Virtual environment
│   └── sessions.json         # (Local) File-based tracking for testing
├── legal-sage-ai/            # The React TypeScript Vite Application
│   ├── src/                  # Core frontend source
│   │   ├── components/       # Shadcn/UI building blocks and application widgets
│   │   ├── hooks/            # Custom React Query data extractors
│   │   ├── lib/              # Utility functions, supabase client wrappers
│   │   └── App.tsx           # React Root Component
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configurations
│   └── vite.config.ts        # Vite build configurations
├── README.md                 # Public high-level introduction
└── DEVELOPER_GUIDE.md        # (You are here) Comprehensive dev documentation
```

---

## Local Development Setup

### 1. Backend Service Configuration (Python)
Requirements: **Python 3.10+** and **Ollama**.

First, boot the local Ollama LLM service running on port `:11434`.
Ensure you have the required open-source LLM model pulled via the Ollama CLI: `ollama run <model-name>`

```bash
# 1. Enter the backend directory
cd backend

# 2. Spawn a local Python virtual environment
python -m venv venv

# 3. Activate the environment
source venv/bin/activate       # Unix/MacOS
venv\Scripts\activate          # Windows

# 4. Install ML/Web Requirements
pip install -r requirements.txt

# 5. Start the ASGI server directly utilizing asyncio/uvicorn under the hood
python main.py
```
> The API mounts to `http://localhost:8000`. Full OpenAPI interactive documentation is generated automatically by FastAPI at `http://localhost:8000/docs`.

### 2. Frontend Interface Configuration (Node)
Requirements: **Node v18+**.

```bash
# 1. Enter the frontend directory
cd legal-sage-ai

# 2. Install dependencies (React, TanStack, Tailwind, etc.)
npm install

# 3. Ensure your local .env file matches dev expectations
# .env required: VITE_API_URL=http://localhost:8000, VITE_SUPABASE_*

# 4. Boot via Vite builder
npm run dev
```

---

## Backend (FastAPI) Deep Dive

FastAPI is strictly typed and handles incoming logic via API Routes (`@app.post()`, `@app.get()`). 

### Core API Endpoints:
- `POST /upload`: Invokes the `Document Processor` service using PyPDF or `docx2txt`. Handles asynchronous streams when chunking files.
- `POST /analyze`: Reads the chunked file extracts and passes a summarization prompt to the LangChain orchestrator. 
- `POST /predict`: Pushes extracted case parameters through a zero-shot decision-making LLM agent to classify outcomes.
- `POST /chat`: Highly dynamic RAG interface endpoint taking an arbitrary user prompt and returning LangChain's augmented generation payload.

### Architectural Rule:
- **Dependency Injection:** Use FastAPI dependency injection (`Depends()`) for authenticating tokens coming from the React client before exposing AI processing logic.

---

## Frontend (React) Deep Dive

The UI focuses on React server-state separation and declarative styling.

### 1. Data Fetching (React Query)
Do not use raw `useEffect` and `fetch` for data! Always implement asynchronous API calls utilizing `useMutation` and `useQuery` hooks. This handles loading states, error boundaries, and cache invalidation under the hood cleanly without component bloat.

### 2. UI Components (Shadcn/Tailwind)
Legal Sage relies on Radix primitives surfaced via Shadcn/UI for absolute accessibility control. 
- **Rule of Thumb:** Need a new button, dialog, or input form? Run the Shadcn CLI to inject it into `components/ui/` rather than building from scratch.
- **Styling:** Limit styles mostly to inline utility classes from Tailwind.

---

## AI Integration & RAG Pipeline

The RAG (Retrieval-Augmented Generation) pipeline consists of four major steps:
1. **Data Ingestion:** Large documents are parsed into massive sets of small text chunks using LangChain text splitters.
2. **Embedding:** The chunks use a highly-trained local embedding layer to convert text vectors dynamically.
3. **Indexing:** Those vectors sit inside a partitioned `ChromaDB` collection. 
4. **Retrieval & Inference:** A user prompt triggers an immediate `similarity_search` in ChromaDB fetching the nearest neighbors (the contextual chunks) which are appended to a precise strict system prompt inside LangChain, finalizing the sequence by querying `Ollama` for a natural response.

---

## Adding New Features

Follow this workflow when modifying Legal Sage:

1. **API First:** Always construct the backend Pydantic models for incoming responses, create the FastAPI route mapping the Pydantic classes, and manually test via `/docs`.
2. **Update Client SDK:** Update and export custom fetch wrapper functions from the frontend `/services/*` or generic `/lib` utilities.
3. **Draft the UI:** Scaffold components using Shadcn UI variables. Hook the component into React Query bindings `useMutation` pointing to your SDK wrapper. 
4. **End-to-End Test:** Run Ollama and upload a complex legal document to watch the process execute.
