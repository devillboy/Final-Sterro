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

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Qurob AI, a helpful support assistant for SterroCloud, a high-performance game hosting and VPS provider. Help users with technical questions about their servers, pricing, and deployment.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: inputValue.trim() }
          ]
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "I'm sorry, I'm having trouble connecting to my brain right now.";

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiContent
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat Error:', err);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again later or contact support directly."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#050914] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
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

      {/* Chat Bubble Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-[#00F0FF] to-[#00b8cc] rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center text-[#050914] relative z-50 transition-all font-bold"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="text-[#050914] fill-current" />}
      </motion.button>
    </div>
  );
}
