import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3 border-0 shadow-lg overflow-hidden">
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
            {/* Messages */}
            <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-transparent dark:from-orange-950/10">
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