import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, MemoryStick, Activity, Network, Archive, LayoutTemplate, Shield, Database, Users, Gamepad2, Server, X, Upload, CheckCircle2, Loader2, AlertCircle, MapPin, Copy, CreditCard, ChevronRight, ChevronLeft, Info, HelpCircle, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import WorldMap from './WorldMap';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface PaymentFormData {
  utrId: string;
  upiId: string;
  date: string;
  email: string;
  username: string;
  nodeLocation: string;
}

interface Plan {
  id: string;
  name: string;
  price: string | number;
  ram: string;
  cpu: string;
  storage: string;
  ssd?: string;
  throughput?: string;
  ports: string;
  type: 'minecraft' | 'vps';
  highlight?: boolean;
  order: number;
  isTrial?: boolean;
  backups?: string;
  db?: string;
  ddos?: string;
  players?: string;
}

const fallbackMinecraftPlans: Plan[] = [
  { id: 'trial', name: "1 Hour Free Trial", price: "0", ram: "4GB RAM", storage: "100GB SSD", cpu: "150% CPU", ports: "1 Additional Port", backups: "0 Backup Limit", db: "1 Database", ddos: "Trial Protection", players: "Testing Only", isTrial: true, type: 'minecraft', order: 0 },
  { id: 'p1', name: "Plan One", price: "130", ram: "2GB RAM", storage: "75GB SSD", cpu: "100% CPU (4.0GHz)", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps EdgeGuard", players: "10-20 Players", type: 'minecraft', order: 1 },
  { id: 'p2', name: "Plan Two", price: "260", ram: "4GB RAM", storage: "100GB SSD", cpu: "150% CPU", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps Protection", players: "20-35 Players", type: 'minecraft', order: 2 },
  { id: 'p3', name: "Plan Three", price: "390", ram: "6GB RAM", storage: "125GB SSD", cpu: "200% CPU", ports: "2 Additional Ports", backups: "2 Backup Limits", db: "2 Databases", ddos: "10 Gbps Protection", players: "30-50 Players", highlight: true, type: 'minecraft', order: 3 }
];

const fallbackVpsPlans: Plan[] = [
  { id: 'v1', name: "VPS Plan 1", price: "240", ram: "4GB RAM", cpu: "200% CPU", type: 'vps', storage: '50GB', ports: '1', order: 0 },
  { id: 'v2', name: "VPS Plan 2", price: "480", ram: "8GB RAM", cpu: "400% CPU", type: 'vps', storage: '100GB', ports: '1', order: 1 },
  { id: 'v3', name: "VPS Plan 3", price: "960", ram: "16GB RAM", cpu: "800% CPU", highlight: true, type: 'vps', storage: '200GB', ports: '1', order: 2 }
];

export default function PricingList() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps'>('minecraft');
  const [minecraftPlans, setMinecraftPlans] = useState<Plan[]>(fallbackMinecraftPlans);
  const [vpsPlans, setVpsPlans] = useState<Plan[]>(fallbackVpsPlans);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success?: boolean, error?: string, credentials?: any, serverStatus?: string} | null>(null);
  const [billingStep, setBillingStep] = useState(1); // 1: Config, 2: Payment, 3: Success
  const { discordUser: user } = useAuth();

  useEffect(() => {
    async function loadPlans() {
      try {
        const q = query(collection(db, "plans"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const allPlans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
          setMinecraftPlans(allPlans.filter(p => p.type === 'minecraft'));
          setVpsPlans(allPlans.filter(p => p.type === 'vps'));
        }
      } catch (e) {
        console.warn("Live plans load failed, using fallbacks.");
      }
    }
    loadPlans();
  }, []);

  // Trial specific states
  const [trialStep, setTrialStep] = useState<1 | 2>(1);
  const [discordId, setDiscordId] = useState("");
  const [trialOtp, setTrialOtp] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PaymentFormData>();
  const currentNodeLocation = watch("nodeLocation");

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        username: user.username || "",
        upiId: "",
        utrId: "",
        date: new Date().toISOString().split('T')[0],
        nodeLocation: "1"
      });
      setDiscordId(user.id);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!screenshot) return;
    
    setIsSubmitting(true);
    setVerificationResult(null);

    const formData = new FormData();
    formData.append('screenshot', screenshot);
    formData.append('utrId', data.utrId);
    formData.append('upiId', data.upiId);
    formData.append('date', data.date);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('planName', selectedPlan.name);
    if ((data as any).nodeLocation) {
      formData.append('nodeId', (data as any).nodeLocation);
    }

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setVerificationResult({ success: true, credentials: result.credentials, serverStatus: result.serverStatus });
      } else {
        setVerificationResult({ error: result.error || result.reason || 'Verification failed.' });
      }
    } catch (error) {
      setVerificationResult({ error: 'Connection error while contacting AI Gateway.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    if (!isSubmitting) {
      setSelectedPlan(null);
      setScreenshot(null);
      setPreviewUrl(null);
      setVerificationResult(null);
      setTrialStep(1);
      setBillingStep(1);
      setDiscordId("");
      setTrialOtp("");
    }
  }

  const handleSendTrialOtp = async (data: PaymentFormData) => {
    if (!discordId) return;
    setIsSubmitting(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/discord/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId }),
      });

      const result = await response.json();
      if (response.ok) {
        setTrialStep(2);
      } else {
        setVerificationResult({ error: result.error || 'Failed to send OTP.' });
      }
    } catch (error) {
      setVerificationResult({ error: 'Connection error while contacting Discord Bot.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimTrial = async (data: PaymentFormData) => {
    if (!trialOtp || !discordId) return;
    setIsSubmitting(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/discord/claim-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          discordId, 
          otp: trialOtp, 
          email: data.email, 
          username: data.username,
          nodeId: (data as any).nodeLocation
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setVerificationResult({ success: true, credentials: result.credentials, serverStatus: result.serverStatus });
      } else {
        setVerificationResult({ error: result.error || 'Verification failed.' });
      }
    } catch (error) {
      setVerificationResult({ error: 'Connection error while provisioning Trial.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-surface)]/30 border-t border-[var(--color-border)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Hosting Built for<br/>
            <span className="text-[#00F0FF]">Speed & Stability</span>
          </h2>
          <p className="text-[var(--color-text-dim)] max-w-2xl mx-auto mb-10 font-medium">
            Deploy in minutes, scale anytime. Choose between our Premium Minecraft Hosting or high-performance Intel VPS solutions.
          </p>
          
          <div className="inline-flex flex-col md:flex-row p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl relative z-20 shadow-xl mx-auto mb-12">
            <button
              onClick={() => setActiveTab('minecraft')}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'minecraft' ? 'bg-[#00F0FF] text-black shadow-md' : 'text-[var(--color-text-dim)] hover:text-white hover:bg-white/5'}`}
            >
              <Gamepad2 size={18} /> Premium Minecraft
            </button>
            <button
              onClick={() => setActiveTab('vps')}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'vps' ? 'bg-[#00F0FF] text-black shadow-md' : 'text-[var(--color-text-dim)] hover:text-white hover:bg-white/5'}`}
            >
              <Server size={18} /> Intel VPS Plans
            </button>
          </div>

          {activeTab === 'minecraft' && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-semibold text-[var(--color-text-dim)] bg-[var(--color-surface)]/50 border border-[var(--color-border)] py-3 px-6 rounded-lg max-w-3xl mx-auto mb-4">
               <div>Locations: 🇮🇳 🇸🇬 🇩🇪 🇺🇸</div>
               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[var(--color-border)]"></div>
               <div>Active Nodes: 17</div>
               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[var(--color-border)]"></div>
               <div>CPUs: AMD Ryzen 9 7900x, AMD EPYC 9965x, Intel Xeon Gold</div>
            </div>
          )}

          {activeTab === 'vps' && (
             <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-semibold text-[var(--color-text-dim)] bg-[var(--color-surface)]/50 border border-[var(--color-border)] py-3 px-6 rounded-lg max-w-2xl mx-auto mb-4">
               <div>All plans run on Intel Xeon processors</div>
               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[var(--color-border)]"></div>
               <div>Locations: 🇮🇳 🇩🇪 🇺🇸 🇸🇬</div>
             </div>
          )}
        </div>

        <div className="flex flex-col gap-8 perspective-2000">
          {activeTab === 'minecraft' && minecraftPlans.map((p, i) => (
            <motion.div
              key={`mc-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ 
                scale: 1.01, 
                rotateY: 1, 
                rotateX: 0.5, 
                z: 15,
                boxShadow: "0 25px 50px -12px rgba(0, 240, 255, 0.25)"
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`bg-[var(--color-surface)] border shadow-3d-lg preserve-3d ${p.highlight ? 'border-[#00F0FF] glow-primary-strong relative z-10' : 'border-[var(--color-border)]'} rounded-4xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between hover:border-[#00F0FF]/60 transition-colors cursor-default group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex-1 w-full relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">{p.name}</h4>
                  <span className="bg-[#1A233A] text-[#00F0FF] text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border border-[#00F0FF]/20">₹{p.price} / month</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-[13px] font-semibold">
                  <div className="flex items-center gap-2"><MemoryStick size={16} className="text-[#00F0FF]"/> <span className="text-white">{p.ram}</span></div>
                  <div className="flex items-center gap-2"><HardDrive size={16} className="text-[#00F0FF]"/> <span className="text-white">{p.storage || p.ssd}</span></div>
                  <div className="flex items-center gap-2"><Cpu size={16} className="text-[#00F0FF]"/> <span className="text-white">{p.cpu}</span></div>
                  <div className="flex items-center gap-2"><Network size={16} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">{p.ports}</span></div>
                  <div className="flex items-center gap-2"><Archive size={16} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">{p.backups || 'Standard Backups'}</span></div>
                  <div className="flex items-center gap-2"><Database size={16} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">{p.db || 'MySQL DB'}</span></div>
                  <div className="flex items-center gap-2"><Shield size={16} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">{p.ddos || '10Gbps Protection'}</span></div>
                  <div className="flex items-center gap-2"><Users size={16} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">{p.players || 'Unlimited'}</span></div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)] shrink-0 pl-0 md:pl-8">
                <button 
                  onClick={() => setSelectedPlan(p)}
                  className={`w-full md:w-auto px-10 py-3.5 rounded-lg font-bold text-white transition-colors text-sm shadow-lg ${(p as any).isTrial ? 'bg-[#5865F2] hover:bg-[#4752C4] shadow-[#5865F2]/20' : (p.highlight ? 'bg-[#00F0FF] text-black hover:bg-[#00D8E6] shadow-[#00F0FF]/20' : 'bg-black hover:bg-[#0e0e0e] border border-[#00F0FF]/30 hover:border-[#00F0FF]')} `}>
                  {(p as any).isTrial ? 'Claim Free Trial' : 'Buy Plan'}
                </button>
              </div>
            </motion.div>
          ))}

          {activeTab === 'vps' && vpsPlans.map((p, i) => (
             <motion.div
              key={`vps-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ 
                scale: 1.01, 
                rotateY: -1, 
                rotateX: 0.5, 
                z: 15,
                boxShadow: "0 25px 50px -12px rgba(0, 240, 255, 0.25)"
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`bg-[var(--color-surface)] border shadow-3d-lg preserve-3d ${p.highlight ? 'border-[#00F0FF] glow-primary-strong relative z-10' : 'border-[var(--color-border)]'} rounded-4xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between hover:border-[#00F0FF]/60 transition-colors cursor-default group overflow-hidden`}
           >
             <div className="absolute inset-0 bg-gradient-to-bl from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             
             <div className="flex-1 w-full relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <h4 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00F0FF] transition-colors">{p.ram} Intel VPS</h4>
                 <span className="bg-[#1A233A] text-[#00F0FF] text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border border-[#00F0FF]/20">₹{p.price} / month</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-[14px] font-semibold">
                 <div className="flex items-center gap-2"><MemoryStick size={18} className="text-[#00F0FF]"/> <span className="text-white">{p.ram}</span></div>
                 <div className="flex items-center gap-2"><Cpu size={18} className="text-[#00F0FF]"/> <span className="text-white">{p.cpu}</span></div>
                 <div className="flex items-center gap-2"><HardDrive size={18} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">NVMe SSD</span></div>
                 <div className="flex items-center gap-2"><Network size={18} className="text-[#00F0FF]"/> <span className="text-[var(--color-text-dim)]">High Speed Uplink</span></div>
               </div>
             </div>

             <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)] shrink-0 pl-0 md:pl-8">
               <div className="hidden md:flex flex-col items-end opacity-[0.2]">
                  <span className="font-black text-xl tracking-[0.2em] leading-none mb-1">INTEL</span>
                  <span className="font-black text-4xl tracking-tighter leading-none text-white whitespace-nowrap">XEON</span>
                </div>
               <button 
                 onClick={() => setSelectedPlan(p)}
                 className={`w-full md:w-auto px-10 py-3.5 rounded-lg font-bold text-white transition-colors text-sm shadow-lg ${p.highlight ? 'bg-[#00F0FF] text-black hover:bg-[#00D8E6] shadow-[#00F0FF]/20' : 'bg-[var(--color-bg-main)] hover:bg-[#00F0FF]/10 border border-[#00F0FF]/30 hover:border-[#00F0FF]'} `}>
                 Buy Plan
               </button>
             </div>
           </motion.div>
          ))}

        </div>
      </div>

      {/* AI Verification Payment Gateway Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeDialog}
            />
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-4xl shadow-3d-lg overflow-hidden max-h-[90vh] flex flex-col preserve-3d"
              >
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 bg-[#070b19]">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPlan.isTrial ? 'Discord Trial Verification' : 'AI Purchase Gateway'}</h3>
                  <p className="text-sm text-[var(--color-text-dim)]">
                    {selectedPlan.isTrial ? 'Verify via Discord bot to claim your 1-hour free trial' : `Purchasing ${selectedPlan.name || `${selectedPlan.ram} Intel VPS`} for ₹${selectedPlan.price}/mo`}
                  </p>
                </div>
                <button onClick={closeDialog} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto">
                 <div className="p-8">
                    {/* Stepper */}
                    {!verificationResult && !selectedPlan.isTrial && (
                      <div className="flex items-center justify-between mb-10 max-w-sm mx-auto">
                         <StepItem active={billingStep >= 1} completed={billingStep > 1} label="Config" icon={<Settings size={14}/>} />
                         <div className={`flex-1 h-px mx-4 ${billingStep > 1 ? 'bg-[#00F0FF]' : 'bg-white/10'}`} />
                         <StepItem active={billingStep >= 2} completed={billingStep > 2} label="Payment" icon={<CreditCard size={14}/>} />
                         <div className={`flex-1 h-px mx-4 ${billingStep > 2 ? 'bg-[#00F0FF]' : 'bg-white/10'}`} />
                         <StepItem active={billingStep >= 3} completed={billingStep > 3} label="Finish" icon={<CheckCircle2 size={14}/>} />
                      </div>
                    )}

                    {verificationResult ? (
                      <div className="text-center py-8">
                        {verificationResult.success ? (
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="w-20 h-20 bg-[#00F0FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00F0FF]/30">
                              <CheckCircle2 size={40} className="text-[#00F0FF]" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Node Provisioned!</h3>
                            <p className="text-[var(--color-text-dim)] mb-8 font-medium">Your high-performance server is ready for deployment.</p>
                            
                            <div className="bg-[#080C14] border border-[#121B2B] rounded-2xl p-6 text-left mb-8 space-y-4">
                              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">Access Credentials</span>
                                <button className="text-[10px] font-bold text-white/40 hover:text-[#00F0FF] flex items-center gap-1"><Copy size={10}/> Copy All</button>
                              </div>
                              <CredentialItem label="Panel URL" value={verificationResult.credentials.panelUrl} />
                              <CredentialItem label="Username" value={verificationResult.credentials.username} />
                              <CredentialItem label="Password" value={verificationResult.credentials.password} isPassword />
                            </div>

                            <p className="text-xs text-[#00F0FF] font-bold mb-8 flex items-center justify-center gap-2">
                              <Info size={14} /> {verificationResult.serverStatus}
                            </p>

                            <button onClick={closeDialog} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-white uppercase tracking-widest transition-all">
                              Close & Launch Panel
                            </button>
                          </motion.div>
                        ) : (
                          <div className="py-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                              <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
                            <p className="text-red-400 bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-sm mb-8">{verificationResult.error}</p>
                            <button onClick={() => setVerificationResult(null)} className="w-full py-4 bg-[#00F0FF] text-black font-black rounded-xl uppercase tracking-widest">
                              Try Again
                            </button>
                          </div>
                        )}
                      </div>
                    ) : selectedPlan.isTrial ? (
                      <div className="max-w-md mx-auto">
                         {trialStep === 1 ? (
                           <form onSubmit={handleSubmit(handleSendTrialOtp)} className="space-y-6">
                             <div className="text-center">
                                <h3 className="text-2xl font-black text-white mb-2">FREE TRIAL <span className="text-[#5865F2]">VERIFICATION</span></h3>
                                <p className="text-sm text-[var(--color-text-dim)]">Enter your Discord User ID to receive an OTP.</p>
                             </div>
                             <div className="bg-[#5865F2]/5 border border-[#5865F2]/20 rounded-2xl p-6 mb-6">
                               <label className="block text-[10px] font-black uppercase tracking-widest text-[#5865F2] mb-3">Your Discord ID</label>
                               <input 
                                 value={discordId} 
                                 onChange={(e) => setDiscordId(e.target.value)} 
                                 placeholder="18-digit identifier" 
                                 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#5865F2] outline-none font-mono text-lg"
                               />
                               <p className="text-[10px] mt-4 text-white/30 flex items-center gap-2 italic">
                                 <HelpCircle size={12} /> How to get ID? Settings {'>'} Advanced {'>'} Developer Mode ON {'>'} Right click profile.
                               </p>
                             </div>
                             <button 
                               type="submit"
                               disabled={isSubmitting || discordId.length < 17}
                               className="w-full h-14 bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                               {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Request Discord OTP'}
                             </button>
                           </form>
                         ) : (
                            <form onSubmit={handleSubmit(handleClaimTrial)} className="space-y-6">
                               <div className="text-center">
                                  <h3 className="text-2xl font-black text-[#5865F2] mb-2 uppercase tracking-tighter">Confirm Claim</h3>
                                  <p className="text-sm text-[var(--color-text-dim)]">Configure your trial node details.</p>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2 space-y-2">
                                     <label className="text-xs font-black uppercase tracking-widest text-white/60">Node Location</label>
                                     <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
                                  </div>
                                  <div className="col-span-2">
                                     <Input label="Verification OTP" value={trialOtp} onChange={(e) => setTrialOtp(e.target.value)} maxLength={6} placeholder="123456" className="text-center tracking-[0.5em] text-xl border-[#5865F2]" />
                                  </div>
                                  <Input label="Email" {...register("email", {required: true})} />
                                  <Input label="Username" {...register("username", {required: true})} />
                               </div>
                               <button type="submit" disabled={isSubmitting} className="w-full h-14 bg-[#5865F2] text-white font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest">
                                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Finalize Trial Provisioning'}
                               </button>
                            </form>
                         )}
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto">
                         {billingStep === 1 && (
                           <div className="space-y-8">
                             <div className="flex justify-between items-center bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-[2rem] p-8">
                                <div>
                                   <h3 className="text-xl font-bold text-white mb-1">{selectedPlan.name}</h3>
                                   <div className="flex items-baseline gap-2">
                                      <span className="text-3xl font-black text-[#00F0FF]">₹{selectedPlan.price}</span>
                                      <span className="text-xs text-[var(--color-text-dim)]">/Month</span>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2">Infrastructure</div>
                                   <div className="flex items-center gap-3 text-xs font-bold text-white">
                                      <span className="flex items-center gap-1"><Cpu size={12} className="text-[#00F0FF]"/> {selectedPlan.cpu}</span>
                                      <span className="flex items-center gap-1"><MemoryStick size={12} className="text-[#00F0FF]"/> {selectedPlan.ram}</span>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-6">
                                <div className="space-y-3">
                                   <label className="text-xs font-black uppercase tracking-widest text-[#00F0FF] flex items-center gap-2">
                                      <MapPin size={14} /> Deployment Node Location
                                   </label>
                                   <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                   <Input label="Control Panel Email" {...register("email", {required: true})} type="email" />
                                   <Input label="Panel Username" {...register("username", {required: true})} />
                                </div>
                             </div>

                             <button 
                               onClick={() => setBillingStep(2)}
                               className="w-full h-14 bg-[#00F0FF] text-black font-black rounded-2xl shadow-3d hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                             >
                               Proceed to Payment <ChevronRight size={18} />
                             </button>
                           </div>
                         )}

                         {billingStep === 2 && (
                           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="bg-[#080C14] border border-[#121B2B] rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/10 blur-3xl -z-10" />
                                <h4 className="text-xs font-black text-[#00F0FF] uppercase tracking-widest mb-4 flex items-center gap-2">
                                   <CreditCard size={14} /> UPI Payment Gateway
                                </h4>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                   <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl shrink-0">
                                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ayushlegit@fam&pn=SterroCloud&am=${selectedPlan.price}&cu=INR`} alt="Payment QR" className="w-full h-full" />
                                   </div>
                                   <div className="flex-1 text-center md:text-left">
                                      <p className="text-white/60 text-sm mb-1 uppercase tracking-tighter">Pay to UPI ID:</p>
                                      <div className="flex items-center gap-2 justify-center md:justify-start">
                                         <span className="text-2xl font-black text-white tracking-widest">ayushlegit@fam</span>
                                         <button type="button" onClick={() => navigator.clipboard.writeText('ayushlegit@fam')} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <Copy size={16} className="text-[#00F0FF]" />
                                         </button>
                                      </div>
                                      <p className="text-[10px] text-[#00F0FF] font-black mt-2 uppercase tracking-widest">Amount: ₹{selectedPlan.price}</p>
                                   </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <Input label="UTR / Transaction ID" {...register("utrId", {required: true})} placeholder="12 digit identifier" />
                                <Input label="Your Payment UPI ID" {...register("upiId", {required: true})} />
                                <div className="col-span-2">
                                   <Input label="Payment Date" {...register("date", {required: true})} type="date" />
                                </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Payment Proof</label>
                                <label className={`block w-full border-2 border-dashed ${previewUrl ? 'border-[#00F0FF] bg-[#00F0FF]/5' : 'border-[#121B2B] bg-black/40'} rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-[#00F0FF]/40`}>
                                   <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                   {previewUrl ? (
                                     <div className="flex items-center gap-4 text-left">
                                        <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-[#00F0FF]/30" />
                                        <div>
                                           <p className="text-sm font-bold text-white">Screenshot Loaded</p>
                                           <p className="text-[10px] text-[#00F0FF] uppercase font-black">Click to change</p>
                                        </div>
                                     </div>
                                   ) : (
                                     <div className="flex flex-col items-center gap-2">
                                        <Upload size={20} className="text-[var(--color-text-dim)]" />
                                        <span className="text-xs font-bold text-white/40">Select Screenshot</span>
                                     </div>
                                   )}
                                </label>
                             </div>

                             <div className="flex gap-4">
                                <button type="button" onClick={() => setBillingStep(1)} className="px-6 h-14 bg-white/5 text-white/60 font-black rounded-xl hover:bg-white/10 flex items-center justify-center">
                                   <ChevronLeft size={20} />
                                </button>
                                <button 
                                  type="submit"
                                  disabled={isSubmitting || !screenshot}
                                  className="flex-1 h-14 bg-[#00F0FF] text-black font-black rounded-xl shadow-3d hover:bg-[#00D8E6] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Finalize Verification'}
                                </button>
                             </div>
                           </form>
                         )}
                      </div>
                    )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Input({ label, error, className = "", ...props }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{label}</label>
      <input 
        className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00F0FF] outline-none transition-all placeholder:text-white/10 ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>}
    </div>
  );
}

function StepItem({ active, completed, label, icon }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
        completed ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 
        active ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]' : 
        'bg-white/5 border-white/10 text-white/20'
      }`}>
        {completed ? <CheckCircle2 size={18} /> : icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active || completed ? 'text-white' : 'text-white/20'}`}>{label}</span>
    </div>
  );
}

function CredentialItem({ label, value, isPassword }: any) {
  const [show, setShow] = React.useState(!isPassword);
  return (
    <div className="group relative">
      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group-hover:border-white/20 transition-all">
        <span className="flex-1 font-mono text-sm text-white truncate">
          {show ? value : "••••••••••••"}
        </span>
        <div className="flex gap-1">
           {isPassword && (
             <button onClick={() => setShow(!show)} className="p-1.5 text-white/40 hover:text-white">
                {show ? <X size={14}/> : <Activity size={14}/>}
             </button>
           )}
           <button onClick={() => navigator.clipboard.writeText(value)} className="p-1.5 text-white/40 hover:text-[#00F0FF]">
              <Copy size={14} />
           </button>
        </div>
      </div>
    </div>
  );
}
