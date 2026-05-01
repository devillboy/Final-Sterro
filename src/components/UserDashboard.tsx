import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutTemplate, Database, ChevronRight, Server, Clock, ShieldCheck, ExternalLink, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, getDoc, doc } from 'firebase/firestore';

export default function UserDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'credentials'>('subscriptions');
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any>(null);
  const { firebaseUser: user } = useAuth();

  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail) setActiveTab(e.detail);
    };

    window.addEventListener('OPEN_USER_DASHBOARD', handleOpen);
    return () => window.removeEventListener('OPEN_USER_DASHBOARD', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && user?.uid) {
      loadData();
    }
  }, [isOpen, user]);

  async function loadData() {
    setLoading(true);
    try {
      // Load subscriptions
      const subQuery = query(collection(db, "users", user!.uid, "subscriptions"), orderBy("createdAt", "desc"));
      const subSnap = await getDocs(subQuery);
      setSubscriptions(subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load credentials
      const credDoc = await getDoc(doc(db, "users", user!.uid, "settings", "panel"));
      if (credDoc.exists()) {
        setCredentials(credDoc.data());
      }
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }

  const close = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={close}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-bg-dark border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-[600px]"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white/5 border-r border-white/5 p-8 flex flex-col gap-2">
              <div className="mb-10">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Client <span className="text-brand-cyan">Portal</span></h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 underline decoration-brand-cyan/30 underline-offset-4">Stereo Operational Stack</p>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'subscriptions', label: 'History', icon: LayoutTemplate },
                  { id: 'credentials', label: 'Login Vault', icon: Database },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-brand-cyan text-bg-dark shadow-[0_10px_20px_rgba(0,240,255,0.15)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-white/10 bg-brand-cyan/5 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-brand-cyan" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Security Status</p>
                    <p className="text-[10px] font-bold text-green-400">ENCRYPTED</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-[#070b14]/50">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">
                    {activeTab === 'subscriptions' ? 'Operational History' : 'Access Credentials'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    {activeTab === 'subscriptions' ? `${subscriptions.length} Instance Records found` : 'Managed Pterodactyl Identity'}
                  </p>
                </div>
                <button onClick={close} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <Loader2 size={32} className="text-brand-cyan animate-spin" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fetching Encrypted Data...</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {activeTab === 'subscriptions' ? (
                      <div className="space-y-4">
                        {subscriptions.length === 0 ? (
                          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                            <AlertCircle size={40} className="mx-auto text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">No deployments detected</p>
                            <p className="text-[10px] text-zinc-600 mt-2 italic">Your operational history will appear here after your first purchase.</p>
                          </div>
                        ) : (
                          subscriptions.map((sub, i) => (
                            <div key={sub.id} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-brand-cyan/30 hover:bg-brand-cyan/[0.02] transition-all duration-300">
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-brand-cyan transition-colors">
                                    <Server size={20} />
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-tight">{sub.serverName || 'System Node'}</h5>
                                    <p className="text-[10px] font-bold text-brand-cyan capitalize">{sub.planName}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-black text-white tracking-tighter">₹{sub.price}</p>
                                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">One-Time / Recurring</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={10}/> Timestamp
                                  </span>
                                  <span className="text-[11px] font-bold text-zinc-400 font-mono">
                                    {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : 'Deploying...'}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck size={10}/> Health
                                  </span>
                                  <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Active 
                                  </span>
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                  <button onClick={() => window.open(sub.panelUrl || 'https://panel.sterro.cloud', '_blank')} className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                    Launch Interface <ExternalLink size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto space-y-8 py-8 px-4">
                        <div className="text-center mb-10">
                          <div className="w-20 h-20 bg-brand-cyan/10 rounded-3xl border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mx-auto mb-6 shadow-3d rotate-3">
                            <Database size={40} />
                          </div>
                          <h5 className="text-xl font-black text-white uppercase italic tracking-tighter">Unified Access <span className="text-brand-cyan">Vault</span></h5>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Personal Credentials for panel.sterro.cloud</p>
                        </div>

                        {!credentials ? (
                          <div className="text-center p-10 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                            <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">Vault is Empty</p>
                            <p className="text-[10px] text-zinc-700 mt-2 italic">Set your credentials during your first deployment.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Panel Identity (Email)</label>
                               <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                                  <span className="text-sm font-mono text-white truncate mr-4">{credentials.email}</span>
                                  <button onClick={() => navigator.clipboard.writeText(credentials.email)} className="p-2 hover:bg-white/10 rounded-lg text-brand-cyan transition-colors">
                                     <Copy size={16} />
                                  </button>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Pterodactyl Username</label>
                               <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl">
                                  <span className="text-sm font-mono text-white truncate mr-4">{credentials.username}</span>
                                  <button onClick={() => navigator.clipboard.writeText(credentials.username)} className="p-2 hover:bg-white/10 rounded-lg text-brand-cyan transition-colors">
                                     <Copy size={16} />
                                  </button>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Encrypted Password</label>
                               <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group flex flex-col gap-4">
                                  <div className="flex items-center justify-between">
                                     <span className="text-sm font-mono text-white tracking-widest">••••••••••••</span>
                                     <button onClick={() => navigator.clipboard.writeText(credentials.password)} className="p-2 hover:bg-white/10 rounded-lg text-brand-cyan transition-colors flex items-center gap-2">
                                        <span className="text-[9px] font-black">COPY</span> <Copy size={16} />
                                     </button>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-red-400/5 rounded-xl border border-red-400/10">
                                     <AlertCircle size={14} className="text-red-400 shrink-0" />
                                     <p className="text-[9px] font-bold text-red-400 leading-tight uppercase tracking-widest">Never share your panel credentials. Stereo engineers will never ask for your password.</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <button onClick={() => window.open('https://panel.sterro.cloud', '_blank')} className="w-full h-14 bg-white text-bg-dark font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-brand-cyan transition-all group">
                             Jump to Control Panel <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
