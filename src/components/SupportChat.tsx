import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi there! I am Qurob AI. How can I help you with your hosting today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleToggle = () => {
      console.log("[CHAT] Toggle received");
      setIsOpen(prev => !prev);
    };
    window.addEventListener('TOGGLE_SUPPORT_CHAT', handleToggle);
    return () => window.removeEventListener('TOGGLE_SUPPORT_CHAT', handleToggle);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Qurob AI, the official support assistant for SterroCloud. SterroCloud provides high-performance game hosting (Minecraft, GTA, etc.) and VPS/Root servers. Help users with technical issues, pricing, and server setup. Always respond in English unless the user speaks another language. Be professional, technical, and helpful.' },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      if (!response.ok) {
        let errorMsg = 'API Error';
        try {
          const errorData = await response.json();
          errorMsg = errorData.details || errorData.error || `Error ${response.status}: ${response.statusText}`;
        } catch (e) {
          errorMsg = `HTTP Error ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "I'm sorry, I'm having trouble retrieving a response.";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error('Chat Error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Error: ${err.message}. Please make sure the Qurob AI API key is correctly configured in the settings.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] p-0 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[320px] sm:w-[400px] h-[550px] bg-[#050914] border border-[#00F0FF]/20 rounded-2xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00F0FF]/10 to-[#00b8cc]/10 border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF]">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Qurob AI Support</h3>
                  <p className="text-xs text-zinc-400">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#00F0FF] text-black rounded-tr-sm font-medium' : 'bg-white/5 text-zinc-300 rounded-tl-sm border border-white/5'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#050914]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00F0FF] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b8cc] transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                 <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Powered by Qurob AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-tr from-[#00F0FF] to-[#00b8cc] rounded-full shadow-[0_8px_30px_rgba(0,240,255,0.4)] flex items-center justify-center text-[#050914] transition-all relative group"
      >
        <div className="absolute inset-0 rounded-full bg-[#00F0FF] animate-ping opacity-20 group-hover:hidden"></div>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="fill-current" />}
      </motion.button>
    </div>
  );
}
