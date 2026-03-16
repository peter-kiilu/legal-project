import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Sparkles, Info, Plus, History, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: { role: string; content: string; timestamp: string }[];
  created_at: string;
  updated_at: string;
}

const LegalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI legal assistant. I can answer questions based on the documents you've uploaded. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
    // Check for existing session in localStorage
    const savedSessionId = localStorage.getItem('currentSessionId');
    if (savedSessionId) {
      loadSession(savedSessionId);
    }
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSession = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`);
      if (response.ok) {
        const session = await response.json();
        setSessionId(session.id);
        localStorage.setItem('currentSessionId', session.id);
        
        // Convert session messages to component format
        if (session.messages && session.messages.length > 0) {
          const formattedMessages: Message[] = session.messages.map((msg: any, index: number) => ({
            id: `${session.id}-${index}`,
            content: msg.content,
            sender: msg.role === 'user' ? 'user' : 'assistant',
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        } else {
          // Reset to welcome message if no messages
          setMessages([{
            id: '1',
            content: "Hello! I'm your AI legal assistant. I can answer questions based on the documents you've uploaded. How can I help you today?",
            sender: 'assistant',
            timestamp: new Date()
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const session = await response.json();
        setSessionId(session.id);
        localStorage.setItem('currentSessionId', session.id);
        setMessages([{
          id: '1',
          content: "Hello! I'm your AI legal assistant. I can answer questions based on the documents you've uploaded. How can I help you today?",
          sender: 'assistant',
          timestamp: new Date()
        }]);
        loadSessions();
        toast({
          title: "New Chat",
          description: "Started a new conversation",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new session",
        variant: "destructive"
      });
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadSessions();
        if (id === sessionId) {
          setSessionId(null);
          localStorage.removeItem('currentSessionId');
          setMessages([{
            id: '1',
            content: "Hello! I'm your AI legal assistant. I can answer questions based on the documents you've uploaded. How can I help you today?",
            sender: 'assistant',
            timestamp: new Date()
          }]);
        }
        toast({ title: "Deleted", description: "Chat session deleted" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete session", variant: "destructive" });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create session if not exists
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (response.ok) {
          const session = await response.json();
          currentSessionId = session.id;
          setSessionId(session.id);
          localStorage.setItem('currentSessionId', session.id);
        }
      } catch (error) {
        console.error('Failed to create session');
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentInput,
          session_id: currentSessionId,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'human' : 'assistant',
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      loadSessions(); // Refresh session list to update titles
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from assistant. Make sure you've uploaded documents first.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickPrompts = [
    "Summarize the main legal issues",
    "What are the key arguments?",
    "Explain the relevant precedents",
    "What are the risks involved?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">Legal Assistant Chat</h1>
          <p className="text-muted-foreground">
            Chat with your AI assistant about uploaded legal documents.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Conversation History Sidebar */}
        {showHistory && (
          <Card className="lg:col-span-1 border-0 shadow-lg h-fit max-h-[600px] overflow-hidden flex flex-col">
            <CardHeader className="pb-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <CardTitle className="text-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-orange-600" />
                  Past Chats
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  onClick={createNewSession}
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto flex-1 max-h-[480px]">
              {sessions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No conversations yet
                </p>
              ) : (
                <div className="space-y-1">
                  {sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className={`group p-2 rounded-lg cursor-pointer transition-all text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center justify-between ${
                        session.id === sessionId ? 'bg-orange-100 dark:bg-orange-900/40 border-l-2 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{session.title}</p>
                        <p className="text-muted-foreground truncate">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={(e) => deleteSession(session.id, e)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className={`${showHistory ? 'lg:col-span-3' : 'lg:col-span-4'} border-0 shadow-lg overflow-hidden`}>
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Legal Assistant
              <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
                Powered by AI
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages - Limited height for testing */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-transparent dark:from-orange-950/10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                        : 'bg-card border shadow-sm rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === 'assistant' && (
                        <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex-shrink-0">
                          <Bot className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm prose prose-sm max-w-none ${
                          message.sender === 'user' ? 'text-white prose-invert' : 'dark:prose-invert'
                        }`}>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user'
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="p-1.5 rounded-lg bg-white/20 flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border shadow-sm rounded-2xl rounded-bl-md p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                        <Bot className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask about your legal documents..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1 h-12 rounded-xl"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isTyping || !inputMessage.trim()}
                  className="h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 rounded-xl"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3 text-xs hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300"
                  onClick={() => setInputMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-600" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Upload documents first for context-aware answers</p>
              <p>• Be specific in your questions</p>
              <p>• Ask follow-up questions for clarity</p>
              <p>• Request citations when needed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;