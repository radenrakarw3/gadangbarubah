import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isFromUni: boolean;
  timestamp: Date;
}

interface ChatboxProps {
  isVisible?: boolean;
  onToggle?: () => void;
  onUniMessage?: (message: string) => void;
}

export default function Chatbox({ isVisible = true, onToggle, onUniMessage }: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Selamat datang di Gadang Barubah! Saya Uni, siap membantu Anda hari ini. Ada yang bisa saya bantu?',
      isFromUni: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const uniResponses = [
    "Terima kasih sudah mengunjungi Gadang Barubah! Kami senang bisa bertemu dengan Anda.",
    "Wah, pertanyaan yang menarik! Saya akan membantu Anda dengan senang hati.",
    "Gadang Barubah menyediakan produk terbaik untuk Anda. Ada yang ingin Anda ketahui?",
    "Saya di sini untuk membantu! Jangan ragu untuk bertanya apa saja.",
    "Pengalaman yang luar biasa menanti Anda di Gadang Barubah!"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isFromUni: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate Uni typing and responding
    setIsTyping(true);
    setTimeout(() => {
      const randomResponse = uniResponses[Math.floor(Math.random() * uniResponses.length)];
      const uniMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isFromUni: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, uniMessage]);
      setIsTyping(false);
      onUniMessage?.(randomResponse);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover-elevate"
        size="icon"
        data-testid="button-chat-toggle"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Chat dengan Uni</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            data-testid="button-chat-minimize"
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 overflow-y-auto space-y-3 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromUni ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isFromUni
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                  data-testid={message.isFromUni ? 'message-uni' : 'message-user'}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-accent text-accent-foreground px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tulis pesan Anda..."
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="shrink-0"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}