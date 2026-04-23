import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, MemoryStick, Activity, Network, Archive, LayoutTemplate, Shield, Database, Users, Gamepad2, Server, X, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PaymentFormData {
  utrId: string;
  upiId: string;
  date: string;
  email: string;
  username: string;
}

const minecraftPlans = [
  { name: "Plan One", price: "130", ram: "2GB RAM", ssd: "75GB SSD", cpu: "100% CPU (4.0GHz)", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps EdgeGuard", players: "10-20 Players" },
  { name: "Plan Two", price: "260", ram: "4GB RAM", ssd: "100GB SSD", cpu: "150% CPU", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps Protection", players: "20-35 Players" },
  { name: "Plan Three", price: "390", ram: "6GB RAM", ssd: "125GB SSD", cpu: "200% CPU", ports: "2 Additional Ports", backups: "2 Backup Limits", db: "2 Databases", ddos: "10 Gbps Protection", players: "30-50 Players", highlight: true },
  { name: "Plan Four", price: "520", ram: "8GB RAM", ssd: "150GB SSD", cpu: "300% CPU", ports: "3 Additional Ports", backups: "3 Backup Limits", db: "3 Databases", ddos: "10 Gbps Protection", players: "50-70 Players" },
  { name: "Plan Five", price: "780", ram: "12GB RAM", ssd: "175GB SSD", cpu: "400% CPU", ports: "4 Additional Ports", backups: "4 Backup Limits", db: "4 Databases", ddos: "10 Gbps Protection", players: "70-100 Players" },
  { name: "Plan Six", price: "1040", ram: "16GB RAM", ssd: "200GB SSD", cpu: "600% CPU", ports: "4 Additional Ports", backups: "4 Backup Limits", db: "4 Databases", ddos: "10 Gbps Protection", players: "100-140 Players" },
  { name: "Plan Seven", price: "1560", ram: "24GB RAM", ssd: "250GB SSD", cpu: "∞ CPU", ports: "5 Additional Ports", backups: "5 Backup Limits", db: "5 Databases", ddos: "10 Gbps Protection", players: "140-200 Players" }
];

const vpsPlans = [
  { name: "VPS Plan 1", price: "240", ram: "4GB RAM", cpu: "200% CPU" },
  { name: "VPS Plan 2", price: "480", ram: "8GB RAM", cpu: "400% CPU" },
  { name: "VPS Plan 3", price: "960", ram: "16GB RAM", cpu: "800% CPU", highlight: true },
  { name: "VPS Plan 4", price: "1920", ram: "32GB RAM", cpu: "1600% CPU" },
  { name: "VPS Plan 5", price: "3840", ram: "64GB RAM", cpu: "3200% CPU" },
  { name: "VPS Plan 6", price: "7680", ram: "128GB RAM", cpu: "6400% CPU" },
  { name: "VPS Plan 7", price: "15360", ram: "256GB RAM", cpu: "12800% CPU" },
  { name: "VPS Plan 8", price: "30720", ram: "512GB RAM", cpu: "25600% CPU" }
];

export default function PricingList() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps'>('minecraft');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success?: boolean, error?: string, credentials?: any, serverStatus?: string} | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();

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
    }
  }

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-surface)]/30 border-t border-[var(--color-border)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Hosting Built for<br/>
            <span className="text-[#007BFF]">Speed & Stability</span>
          </h2>
          <p className="text-[var(--color-text-dim)] max-w-2xl mx-auto mb-10 font-medium">
            Deploy in minutes, scale anytime. Choose between our Premium Minecraft Hosting or high-performance Intel VPS solutions.
          </p>
          
          <div className="inline-flex flex-col md:flex-row p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl relative z-20 shadow-xl mx-auto mb-12">
            <button
              onClick={() => setActiveTab('minecraft')}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'minecraft' ? 'bg-[#007BFF] text-white shadow-md' : 'text-[var(--color-text-dim)] hover:text-white hover:bg-white/5'}`}
            >
              <Gamepad2 size={18} /> Premium Minecraft
            </button>
            <button
              onClick={() => setActiveTab('vps')}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'vps' ? 'bg-[#007BFF] text-white shadow-md' : 'text-[var(--color-text-dim)] hover:text-white hover:bg-white/5'}`}
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

        <div className="flex flex-col gap-4">
          {activeTab === 'minecraft' && minecraftPlans.map((p, i) => (
            <motion.div
              key={`mc-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[var(--color-surface)] border ${p.highlight ? 'border-[#007BFF] shadow-[0_0_25px_rgba(0,123,255,0.15)] relative z-10 scale-[1.01]' : 'border-[var(--color-border)]'} rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between hover:border-[#007BFF]/50 transition-all`}
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-2xl font-bold tracking-tight text-white">{p.name}</h4>
                  <span className="bg-[#1A233A] text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">₹{p.price} / month</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-[13px] font-semibold">
                  <div className="flex items-center gap-2"><MemoryStick size={16} className="text-[#007BFF]"/> <span className="text-white">{p.ram}</span></div>
                  <div className="flex items-center gap-2"><HardDrive size={16} className="text-[#007BFF]"/> <span className="text-white">{p.ssd}</span></div>
                  <div className="flex items-center gap-2"><Cpu size={16} className="text-[#007BFF]"/> <span className="text-white">{p.cpu}</span></div>
                  <div className="flex items-center gap-2"><Network size={16} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">{p.ports}</span></div>
                  <div className="flex items-center gap-2"><Archive size={16} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">{p.backups}</span></div>
                  <div className="flex items-center gap-2"><Database size={16} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">{p.db}</span></div>
                  <div className="flex items-center gap-2"><Shield size={16} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">{p.ddos}</span></div>
                  <div className="flex items-center gap-2"><Users size={16} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">{p.players}</span></div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)] shrink-0 pl-0 md:pl-8">
                <button 
                  onClick={() => setSelectedPlan(p)}
                  className={`w-full md:w-auto px-10 py-3.5 rounded-lg font-bold text-white transition-colors text-sm shadow-lg ${p.highlight ? 'bg-[#007BFF] hover:bg-[#0056b3] shadow-[#007BFF]/20' : 'bg-[var(--color-bg-main)] hover:bg-[#1a3a8a] border border-[#007BFF]/30 hover:border-[#007BFF]'} `}>
                  Buy Plan
                </button>
              </div>
            </motion.div>
          ))}

          {activeTab === 'vps' && vpsPlans.map((p, i) => (
             <motion.div
             key={`vps-${i}`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className={`bg-[var(--color-surface)] border ${p.highlight ? 'border-[#007BFF] shadow-[0_0_25px_rgba(0,123,255,0.15)] relative z-10 scale-[1.01]' : 'border-[var(--color-border)]'} rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between hover:border-[#007BFF]/50 transition-all`}
           >
             <div className="flex-1 w-full">
               <div className="flex items-center gap-3 mb-6">
                 <h4 className="text-2xl font-bold tracking-tight text-white">{p.ram} Intel VPS</h4>
                 <span className="bg-[#1A233A] text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">₹{p.price} / month</span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-[14px] font-semibold">
                 <div className="flex items-center gap-2"><MemoryStick size={18} className="text-[#007BFF]"/> <span className="text-white">{p.ram}</span></div>
                 <div className="flex items-center gap-2"><Cpu size={18} className="text-[#007BFF]"/> <span className="text-white">{p.cpu}</span></div>
                 <div className="flex items-center gap-2"><HardDrive size={18} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">NVMe SSD</span></div>
                 <div className="flex items-center gap-2"><Network size={18} className="text-[#007BFF]"/> <span className="text-[var(--color-text-dim)]">High Speed Uplink</span></div>
               </div>
             </div>

             <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)] shrink-0 pl-0 md:pl-8">
               <div className="hidden md:flex flex-col items-end opacity-[0.2]">
                  <span className="font-black text-xl tracking-[0.2em] leading-none mb-1">INTEL</span>
                  <span className="font-black text-4xl tracking-tighter leading-none text-white whitespace-nowrap">XEON</span>
                </div>
               <button 
                 onClick={() => setSelectedPlan(p)}
                 className={`w-full md:w-auto px-10 py-3.5 rounded-lg font-bold text-white transition-colors text-sm shadow-lg ${p.highlight ? 'bg-[#007BFF] hover:bg-[#0056b3] shadow-[#007BFF]/20' : 'bg-[var(--color-bg-main)] hover:bg-[#1a3a8a] border border-[#007BFF]/30 hover:border-[#007BFF]'} `}>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 bg-[#070b19]">
                <div>
                  <h3 className="text-xl font-bold text-white">AI Purchase Gateway</h3>
                  <p className="text-sm text-[var(--color-text-dim)]">Purchasing {selectedPlan.name || `${selectedPlan.ram} Intel VPS`} for ₹{selectedPlan.price}/mo</p>
                </div>
                <button onClick={closeDialog} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
              </div>

              <div className="p-6 overflow-y-auto">
                {verificationResult ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    {verificationResult.success ? (
                      <>
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Payment Verified!</h3>
                        <p className="text-[var(--color-text-dim)] mb-8 max-w-md">The AI successfully verified your payment screenshot. Your account and server have been auto-provisioned.</p>
                        
                        <div className="w-full max-w-md bg-black/40 border border-[var(--color-border)] rounded-xl p-6 text-left">
                          <h4 className="font-bold text-white mb-4 border-b border-[var(--color-border)] pb-2">Panel Credentials</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-[var(--color-text-dim)]">Panel URL:</span> <a href={verificationResult.credentials.panelUrl} target="_blank" rel="noreferrer" className="text-[#007BFF] hover:underline font-medium break-all">{verificationResult.credentials.panelUrl}</a></div>
                            <div className="flex justify-between"><span className="text-[var(--color-text-dim)]">Username:</span> <span className="text-white font-mono">{verificationResult.credentials.username}</span></div>
                            <div className="flex justify-between"><span className="text-[var(--color-text-dim)]">Password:</span> <span className="text-white font-mono">{verificationResult.credentials.password}</span></div>
                            <div className="flex justify-between mt-4 pt-3 border-t border-[var(--color-border)]"><span className="text-[var(--color-text-dim)]">Server Status:</span> <span className="text-green-400">{verificationResult.serverStatus}</span></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                        <p className="text-red-400 mb-8 max-w-md">{verificationResult.error}</p>
                        <button onClick={() => setVerificationResult(null)} className="px-6 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-white/5 rounded-lg font-bold transition-colors">Try Again</button>
                      </>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-[#1A233A]/50 border border-[#007BFF]/30 rounded-xl p-4 flex items-start gap-4">
                      <div className="mt-1 text-[#007BFF]"><CheckCircle2 size={20}/></div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Step 1: Make Payment</h4>
                        <p className="text-sm text-[var(--color-text-dim)]">Please pay exactly <strong className="text-white">₹{selectedPlan.price}</strong> via UPI to: <br/><strong className="text-lg text-[#007BFF] mt-1 block">ayushlegit@fam</strong></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTab === 'minecraft' && (
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-sm font-semibold text-[var(--color-text-dim)]">Select Server Location (Node)</label>
                          <select {...register("nodeLocation", { required: activeTab === 'minecraft' })} className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors appearance-none">
                            <option value="1">🇮🇳 India (Mumbai) - Premium CPU</option>
                            <option value="2">🇸🇬 Singapore - Low Latency Asia</option>
                            <option value="3">🇩🇪 Germany (Frankfurt) - EU Central</option>
                            <option value="4">🇺🇸 USA (New York) - NA East</option>
                          </select>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-[var(--color-text-dim)]">Your Email (for Panel)</label>
                        <input {...register("email", { required: true })} type="email" placeholder="email@example.com" className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-[var(--color-text-dim)]">Desired Username</label>
                        <input {...register("username", { required: true })} placeholder="Gamer123" className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-[var(--color-text-dim)]">Payment UTR / Ref Number</label>
                        <input {...register("utrId", { required: true })} placeholder="12 digit UTR number" className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-[var(--color-text-dim)]">Your UPI ID</label>
                        <input {...register("upiId", { required: true })} placeholder="yourname@upi" className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-[var(--color-text-dim)]">Date of Payment</label>
                        <input {...register("date", { required: true })} type="date" className="w-full bg-black/40 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#007BFF] transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[var(--color-text-dim)]">Payment Screenshot</label>
                      <label className={`block w-full border-2 border-dashed ${previewUrl ? 'border-[#007BFF] bg-[#007BFF]/5' : 'border-[var(--color-border)] hover:border-[var(--color-text-dim)] bg-black/20'} rounded-xl p-8 text-center cursor-pointer transition-colors relative overflow-hidden group`}>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        {previewUrl ? (
                          <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-[200px] aspect-[9/16] rounded border border-[var(--color-border)] overflow-hidden mb-3">
                              <img src={previewUrl} alt="Screenshot Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-bold flex items-center gap-2"><Upload size={16}/> Change Image</span>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-[#007BFF]">Screenshot Selected</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text-dim)]">
                              <Upload size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Click to upload screenshot</p>
                              <p className="text-xs text-[var(--color-text-dim)] mt-1">PNG, JPG up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !screenshot}
                        className="w-full py-4 bg-[#007BFF] hover:bg-[#0056b3] disabled:bg-[var(--color-surface)] disabled:text-[var(--color-text-dim)] disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#007BFF]/20"
                      >
                        {isSubmitting ? (
                          <><Loader2 size={18} className="animate-spin" /> Analyzing Payment & Provisioning Node...</>
                        ) : (
                          'Verify Payment & Create Server'
                        )}
                      </button>
                      <p className="text-center text-xs text-[var(--color-text-dim)] mt-3">
                        <Shield className="inline w-3 h-3 mr-1" /> AI protects against duplicate, tampered, or old UTR submissions. Verification takes ~5 seconds.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
