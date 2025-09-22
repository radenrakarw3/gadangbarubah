import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isFromUni: boolean;
  timestamp: Date;
}

interface ChatOption {
  id: string;
  text: string;
  response: string;
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
      text: 'Selamat datang di Gadang Barubah! Saya Uni, siap membantu Anda hari ini. Silakan pilih topik yang ingin Anda ketahui:',
      isFromUni: true,
      timestamp: new Date()
    }
  ]);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([
    { id: '1', text: 'Tentang Gadang Barubah', response: 'Gadang Barubah adalah tempat yang menyediakan pengalaman terbaik untuk Anda. Kami berkomitmen memberikan pelayanan yang memuaskan!' },
    { id: '2', text: 'Produk & Layanan', response: 'Kami menawarkan berbagai produk dan layanan berkualitas tinggi. Setiap produk kami dibuat dengan penuh perhatian untuk kepuasan Anda.' },
    { id: '3', text: 'Cara Pemesanan', response: 'Pemesanan sangat mudah! Anda bisa menghubungi kami atau datang langsung. Tim kami siap membantu proses pemesanan Anda.' },
    { id: '4', text: 'Kontak Kami', response: 'Anda bisa menghubungi kami kapan saja. Kami selalu siap melayani dan menjawab pertanyaan Anda dengan ramah!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const followUpOptions = [
    { id: 'more1', text: 'Ceritakan lebih detail', response: 'Tentu! Gadang Barubah telah melayani pelanggan dengan dedikasi tinggi. Kami bangga menjadi bagian dari komunitas ini.' },
    { id: 'more2', text: 'Ada pertanyaan lain', response: 'Saya senang membantu! Silakan pilih topik lain yang ingin Anda ketahui.' },
    { id: 'thanks', text: 'Terima kasih Uni!', response: 'Sama-sama! Saya senang bisa membantu. Jangan ragu untuk bertanya lagi kapan saja!' },
    { id: 'restart', text: 'Mulai dari awal', response: 'Baik! Mari kita mulai lagi. Silakan pilih topik yang ingin Anda ketahui:' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionClick = (option: ChatOption) => {
    // Add user's choice as message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      isFromUni: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowOptions(false);
    
    // Simulate Uni typing and responding
    setIsTyping(true);
    setTimeout(() => {
      const uniMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: option.response,
        isFromUni: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, uniMessage]);
      setIsTyping(false);
      onUniMessage?.(option.response);
      
      // Show follow-up options
      if (option.id === 'restart') {
        setCurrentOptions([
          { id: '1', text: 'Tentang Gadang Barubah', response: 'Gadang Barubah adalah tempat yang menyediakan pengalaman terbaik untuk Anda. Kami berkomitmen memberikan pelayanan yang memuaskan!' },
          { id: '2', text: 'Produk & Layanan', response: 'Kami menawarkan berbagai produk dan layanan berkualitas tinggi. Setiap produk kami dibuat dengan penuh perhatian untuk kepuasan Anda.' },
          { id: '3', text: 'Cara Pemesanan', response: 'Pemesanan sangat mudah! Anda bisa menghubungi kami atau datang langsung. Tim kami siap membantu proses pemesanan Anda.' },
          { id: '4', text: 'Kontak Kami', response: 'Anda bisa menghubungi kami kapan saja. Kami selalu siap melayani dan menjawab pertanyaan Anda dengan ramah!' }
        ]);
      } else {
        setCurrentOptions(followUpOptions);
      }
      
      setTimeout(() => {
        setShowOptions(true);
      }, 1000);
    }, 1500);
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
          
          {/* Choice buttons */}
          {showOptions && !isTyping && (
            <div className="space-y-2">
              {currentOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  variant="outline"
                  className="w-full text-left justify-start text-sm h-auto py-2 px-3 hover-elevate"
                  data-testid={`button-option-${option.id}`}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}