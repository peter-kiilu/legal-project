import os
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Initialize global variables
vector_store = None
llm = None

# Ollama model configuration
OLLAMA_MODEL = "llama3.2:1b"  # Change to qwen2:1.5b if preferred
OLLAMA_EMBED_MODEL = "nomic-embed-text"

# Conversational response patterns
GREETING_PATTERNS = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "sup", "what's up"]
IDENTITY_PATTERNS = ["who are you", "what are you", "what is your name", "your name", "tell me about yourself"]
CREATOR_PATTERNS = ["who created you", "who made you", "who built you", "who developed you", "your creator", "your developer"]

# Predefined responses
GREETING_RESPONSE = """Hello! 👋 I'm your AI Legal Assistant powered by Legal Sage AI. I'm here to help you with:

• **Document Analysis** - Upload and analyze legal documents
• **Case Predictions** - Get insights on potential case outcomes
• **Legal Q&A** - Ask questions about your uploaded documents

How can I assist you today?"""

IDENTITY_RESPONSE = """I am **Legal Sage AI**, an intelligent legal assistant designed to help you navigate legal documents and provide insights.

**My Capabilities:**
- 📄 Analyze legal documents (PDFs, Word docs, text files)
- ⚖️ Predict case outcomes based on Kenyan law
- 💬 Answer questions about your uploaded documents
- 📋 Summarize complex legal texts

I use advanced AI technology to provide accurate and helpful legal assistance. Upload a document to get started!"""

CREATOR_RESPONSE = """I was created by **Musila Peter**, a talented student at the **University of Embu** pursuing **BSc. Information Technology**.

**About My Creator:**
- 🎓 University of Embu, BSc. IT Student
- 📊 Data-driven researcher
- 🚀 Visionary tech student passionate about AI and legal technology
- 💡 Innovator bridging technology and legal services

Musila Peter developed Legal Sage AI to make legal assistance more accessible through cutting-edge AI technology."""

def is_conversational_query(query: str) -> tuple[bool, str]:
    """Check if query is a conversational/greeting type and return appropriate response."""
    query_lower = query.lower().strip()
    
    # Check for greetings
    for pattern in GREETING_PATTERNS:
        if query_lower == pattern or query_lower.startswith(pattern + " ") or query_lower.startswith(pattern + "!") or query_lower.startswith(pattern + ","):
            return True, GREETING_RESPONSE
    
    # Check for identity questions
    for pattern in IDENTITY_PATTERNS:
        if pattern in query_lower:
            return True, IDENTITY_RESPONSE
    
    # Check for creator questions
    for pattern in CREATOR_PATTERNS:
        if pattern in query_lower:
            return True, CREATOR_RESPONSE
    
    return False, ""

def get_llm():
    global llm
    if llm is None:
        llm = ChatOllama(model=OLLAMA_MODEL, temperature=0.3)
    return llm

def get_embeddings():
    return OllamaEmbeddings(model=OLLAMA_EMBED_MODEL)

def ingest_document(file_path: str) -> bool:
    global vector_store
    try:
        # Load document based on extension
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith('.docx'):
            loader = Docx2txtLoader(file_path)
        elif file_path.endswith('.txt'):
            loader = TextLoader(file_path)
        else:
            return False
            
        documents = loader.load()
        
        # Split text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)
        
        # Create or update vector store
        embeddings = get_embeddings()
        
        if vector_store is None:
            vector_store = Chroma.from_documents(
                documents=chunks, 
                embedding=embeddings,
                persist_directory="./chroma_db"
            )
        else:
            vector_store.add_documents(chunks)
            
        return True
    except Exception as e:
        print(f"Error ingesting document: {e}")
        return False

def get_summary(filename: str) -> str:
    # For MVP, we'll just summarize the content of the file directly
    # In a real app, we might retrieve from vector store or store raw text separately
    try:
        file_path = f"uploads/{filename}"
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith('.docx'):
            loader = Docx2txtLoader(file_path)
        elif file_path.endswith('.txt'):
            loader = TextLoader(file_path)
        else:
            return "Unsupported file format"
            
        documents = loader.load()
        full_text = " ".join([doc.page_content for doc in documents])
        
        # Truncate if too long (Gemini has a large context window but good to be safe)
        if len(full_text) > 30000:
            full_text = full_text[:30000] + "..."
            
        llm = get_llm()
        prompt = f"Please provide a comprehensive summary of the following legal document. Highlight key entities, dates, obligations, and risks:\n\n{full_text}"
        
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        return f"Error generating summary: {e}"

def get_prediction(case_details: str) -> str:
    try:
        llm = get_llm()
        prompt = f"""
        You are a legal expert AI specialized in Kenyan Law and general common law principles. 
        Analyze the following case details and predict the likely outcome. 
        
        Please structure your response as follows:
        1. **Legal Issues**: Identify the key legal questions.
        2. **Relevant Laws**: Cite specific Kenyan statutes, Constitution of Kenya 2010, or relevant case law precedents.
        3. **Analysis**: Apply the law to the facts.
        4. **Prediction**: State the likely ruling (e.g., Plaintiff wins, Defendant liable).
        
        Case Details:
        {case_details}
        """
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        return f"Error generating prediction: {e}"

def chat_with_doc(query: str, history: list) -> str:
    global vector_store
    try:
        # First check if this is a conversational query (greetings, identity, creator)
        is_conversational, response = is_conversational_query(query)
        if is_conversational:
            return response
        
        if vector_store is None:
            # Try to load existing db
            if os.path.exists("./chroma_db"):
                embeddings = get_embeddings()
                vector_store = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
            else:
                return "Please upload a document first to start chatting."
        
        llm = get_llm()
        
        # Create retriever
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        
        # Format retrieved docs
        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)
        
        # Modern LCEL approach
        prompt = ChatPromptTemplate.from_template(
            """You are a helpful legal assistant. Use the following context to answer the question.
            If you don't know, say you don't know.
            
            Context:
            {context}
            
            Question:
            {question}
            """
        )
        
        # Build the chain using LCEL
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        
        result = rag_chain.invoke(query)
        return result
        
    except Exception as e:
        return f"Error in chat: {e}"
