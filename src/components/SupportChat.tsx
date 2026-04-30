import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Paperclip, FileIcon, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    type: string;
    url?: string;
  };
}

export default function SupportChat() {
  const { firebaseUser, loginGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I am Qurob AI, your SterroCloud assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large (Max 5MB)");
        return;
      }
      setAttachedFile(file);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !attachedFile) return;

    let messageContent = inputValue.trim();
    const fileName = attachedFile?.name;
    
    if (attachedFile) {
      if (!messageContent) messageContent = `[Sent a file: ${fileName}]`;
      else messageContent += ` (Attached: ${fileName})`;
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      attachment: attachedFile ? {
        name: attachedFile.name,
        type: attachedFile.type,
      } : undefined
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setAttachedFile(null);
    setIsTyping(true);

    const systemPrompt = `
      You are Qurob AI, the official Advanced Automated Agent for SterroCloud.
      SterroCloud Knowledge Base:
      - Services: High-performance Game Hosting (Minecraft, GTA, etc.), VPS (Intel Xeon), and Root Servers.
      - Pricing: 
        * Minecraft: Plan One (₹130, 2GB RAM), Plan Two (₹260, 4GB RAM), Plan Three (₹390, 6GB RAM).
        * VPS: Plan 1 (₹240, 4GB RAM), Plan 2 (₹480, 8GB RAM), Plan 3 (₹960, 16GB RAM).
        * Trial: 1 Hour Free Trial (4GB RAM) for Minecraft.
      - Locations: India (🇮🇳), Singapore (🇸🇬), Germany (🇩🇪), USA (🇺🇸).
      - Protection: 10Gbps EdgeGuard DDoS Protection.
      
      User Context:
      - Name: ${firebaseUser?.displayName || 'Guest'}
      - Email: ${firebaseUser?.email || 'Not logged in'}
      - Verified: ${firebaseUser?.emailVerified ? 'Yes' : 'No'}
      
      Capabilities & Guidance:
      1. Verification Help: If a user is not verified, guide them to check their email or offer to assist with "Manual Verification Request" (you can log this for admins).
      2. Support: Assist with technical steps for Pterodactyl panel, payment verification (UTR/UPI), and server deployment.
      3. Language: Seamlessly handle Hindi, English, and Hinglish. 
      4. Professionalism: Be concise, technical, and always helpful.
      
      Current Request contains attached file: ${fileName || 'None'}
    `;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
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
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#00F0FF] text-black rounded-tr-sm font-medium' : 'bg-white/5 text-zinc-300 rounded-tl-sm border border-white/5'}`}>
                    {msg.attachment && (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-black/20 rounded-lg border border-black/10">
                        {msg.attachment.type.startsWith('image/') ? <ImageIcon size={14} /> : <FileIcon size={14} />}
                        <span className="text-[10px] truncate max-w-[120px]">{msg.attachment.name}</span>
                      </div>
                    )}
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

            {/* Verification Helper (If Guest) */}
            {!firebaseUser && (
              <div className="px-4 py-2 bg-[#00F0FF]/5 border-t border-[#00F0FF]/10 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">Login to enable account sync</span>
                <button onClick={loginGoogle} className="text-[10px] text-[#00F0FF] font-bold uppercase hover:underline">Login Now</button>
              </div>
            )}
            {firebaseUser && !firebaseUser.emailVerified && (
              <div className="px-4 py-2 bg-yellow-500/5 border-t border-yellow-500/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <AlertCircle size={10} />
                  <span className="text-[10px] font-bold uppercase">Unverified Account</span>
                </div>
                <button className="text-[10px] text-white/40 hover:text-white uppercase font-bold">Resend Email</button>
              </div>
            )}

            {/* Input Overlay for Attachments */}
            <AnimatePresence>
              {attachedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-2 border-t border-white/5 bg-[#050914] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded-lg">
                    <FileIcon size={12} />
                    <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#050914]">
              <div className="relative flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleFileClick}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
                >
                  <Paperclip size={18} />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your issue..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={(!inputValue.trim() && !attachedFile) || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00F0FF] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b8cc] transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
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
