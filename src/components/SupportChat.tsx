import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Paperclip, FileIcon, Image as ImageIcon, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
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
    { id: '1', role: 'assistant', content: 'Connection established. Establishing secure link with Sterro Concierge. How may I assist your operations today?' }
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
      You are Sterro Agent, a senior operations specialist for SterroCloud High-Performance Infrastructure.
      
      Your personality: Professional, technically precise, and authoritative yet helpful. You speak like a senior systems engineer.
      
      SterroCloud Operational Parameters:
      - Core Fleet: High-frequency Minecraft Nodes (Ryzen 7950X based) and Enterprise KVM Virtualization nodes.
      - Service Catalog:
        * Core Series (MC): Core-01 (2GB, ₹130), Core-02 (4GB, ₹260), Sigma Pro (6GB, ₹390).
        * D-Node Series (VPS): D-Node Alpha (4GB, ₹240), D-Node Beta (8GB, ₹480), D-Node Xeon Pro (16GB, ₹960).
        * Sandbox: Dev Sandbox trial (4GB) for proof-of-concept.
      - Global Infrastructure: IN, SG, DE, US regions. 10Gbps EdgeGuard active.
      
      Security & Compliance:
      - Trial Policy: Strictly one sandbox per user. If they've already tested, politely inform them: "Our records indicate you've already utilized the test environment. All systems are stable and bugs are squashed—we recommend moving to a dedicated production plan for full access."
      
      User Intelligence:
      - Current Contact: ${firebaseUser?.displayName || 'Authorized Guest'}
      - Account ID: ${firebaseUser?.email || 'Unauthorized'}
      - Authentication: ${firebaseUser?.emailVerified ? 'Verified' : 'Verification Pending'}
      
      Engagement Rules:
      1. Technical Assistance: Provide clear, sequential steps for panel operations or payment verification.
      2. Linguistics: Professional English, Hindi, or technical Hinglish.
      3. Tone: Confident but never arrogant. Use terms like "infrastructure", "nodes", "low-latency", "provisioning".
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
            <div className="bg-white/[0.03] border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-brand-cyan/20">
                    <Activity size={20} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050914]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xs uppercase tracking-widest">Operations Liaison</h3>
                  <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-tight">Terminal Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-brand-cyan text-bg-dark font-bold rounded-tr-none shadow-[0_10px_30px_rgba(0,240,255,0.1)]' : 'bg-white/5 text-zinc-100 rounded-tl-none border border-white/5'}`}>
                    {msg.attachment && (
                      <div className="flex items-center gap-2 mb-3 p-2 bg-black/40 rounded-xl border border-white/10">
                        {msg.attachment.type.startsWith('image/') ? <ImageIcon size={14} className="text-brand-cyan" /> : <FileIcon size={14} className="text-brand-cyan" />}
                        <span className="text-[10px] font-mono tracking-tighter truncate max-w-[150px] opacity-70">{msg.attachment.name}</span>
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
