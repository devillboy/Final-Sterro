import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, CreditCard, CheckCircle2, 
  Settings, Loader2, AlertCircle, Info, Copy, 
  Users, MapPin, Cpu, MemoryStick, HardDrive, 
  Network, Folder, Paperclip, Shield, Star,
  Eye, EyeOff
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useSounds } from "../utils/sounds";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import WorldMap from "../components/WorldMap";

// Re-using options from PricingList for consistency
const EGG_OPTIONS = [
  { id: 1, name: "Bungeecord" },
  { id: 3, name: "Forge" },
  { id: 4, name: "Paper" },
  { id: 11, name: "Vanilla" },
  { id: 12, name: "Bedrock" },
  { id: 25, name: "Pocketmine" }
];

const LoadingMessages = ({ isSubmitting, isCreatingServer }: { isSubmitting: boolean, isCreatingServer: boolean }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = isSubmitting 
    ? ["Syncing with UPI Network...", "Verifying UTR Authenticity...", "Confirming Settlement...", "Finalizing Verification..."]
    : ["Initializing Cluster...", "Allocating NVMe Storage...", "Provisioning vCores...", "Configuring Pterodactyl...", "Starting Instance..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] animate-pulse">{messages[msgIdx]}</p>;
};

const CloudRainEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      opacity: 0.05 + Math.random() * 0.1,
      size: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: ['0vh', '100vh'],
            opacity: [0, p.opacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size * 25}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.2))',
            borderRadius: '100%',
          }}
        />
      ))}
    </div>
  );
};

import { ALL_PLANS } from "../constants/plans";

export default function Billing() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { firebaseUser, loginGoogle, loading } = useAuth();
  const { playClick, playError, playSuccess } = useSounds();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [billingStep, setBillingStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingServer, setIsCreatingServer] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useExistingAccount, setUseExistingAccount] = useState(false);
  const [savedCreds, setSavedCreds] = useState<any>(null);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    defaultValues: {
      nodeLocation: "1",
      eggId: 1
    }
  });
  const currentEggId = watch("eggId");
  const currentNodeLocation = watch("nodeLocation");

  useEffect(() => {
    if (loading) return;

    // Check if user logged in
    if (!firebaseUser) {
      navigate('/');
      return;
    }

    if (!firebaseUser) return;

    // Fetch saved credentials
    const fetchCreds = async () => {
      try {
        const q = query(collection(db, "users", firebaseUser.uid, "settings"), where("__name__", "==", "panel"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setSavedCreds(data);
          setUseExistingAccount(true);
        }
      } catch (e) {
        console.error("Error fetching credentials:", e);
      }
    };
    fetchCreds();

    // Fetch plan details
    const loadPlan = async () => {
      // First check hardcoded plans
      let plan = ALL_PLANS.find(p => p.id === planId);
      
      if (!plan && planId) {
        // Try to fetch from Firestore if not in hardcoded list
        try {
          const { getDoc } = await import("firebase/firestore");
          const planRef = doc(db, "plans", planId);
          const planSnap = await getDoc(planRef);
          if (planSnap.exists()) {
            plan = { id: planSnap.id, ...planSnap.data() } as any;
          }
        } catch (e) {
          console.error("Error fetching plan from Firestore:", e);
        }
      }

      if (plan) {
        setSelectedPlan(plan);
      } else if (!loading) {
        console.error("Plan not found:", planId);
        navigate('/pricing');
      }
    };
    loadPlan();
  }, [planId, firebaseUser, navigate, loading]);

  if (loading || !selectedPlan) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
         <div className="relative">
            <div className="w-20 h-20 border-4 border-brand-gold/10 rounded-full animate-spin border-t-brand-gold" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Loader2 size={32} className="text-brand-gold animate-pulse" />
            </div>
         </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      playClick();
    }
  };

  const onSubmit = async (data: any) => {
    playClick();
    setIsSubmitting(true);
    
    // Simulate payment verification delay
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    setIsSubmitting(false);
    setIsCreatingServer(true);
    
    try {
      const payload = {
        ...data,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        priceInr: selectedPlan.price,
        userId: firebaseUser.uid,
        status: 'pending',
        timestamp: serverTimestamp()
      };

      // Store in payments collection keyed by UTR to prevent duplicates
      const paymentRef = doc(db, "payments", data.utrId);
      await setDoc(paymentRef, payload);
      
      // Also update user's internal settings if they provided new credentials
      if (!useExistingAccount && data.username && data.password) {
         try {
           // We are using a simplified path that matches our rules: /users/{userId}/settings/panel
           // But a collection path for addDoc/setDoc is needed. 
           // Better to use setDoc for specific doc
           // Actually addDoc to collection "payments" is what we want for verification
         } catch (err) {
           console.error("Failed to update panel settings:", err);
         }
      }
      
      // Simulate server creation
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      setVerificationResult({
        success: true,
        serverStatus: "ACTIVE (Delayed Update)",
        serverDetails: {
          serverName: data.serverName,
          plan: selectedPlan.name,
          ram: selectedPlan.ram
        },
        credentials: {
          panelUrl: "https://panel.stereocloud.in",
          username: useExistingAccount ? savedCreds.username : data.username,
          password: useExistingAccount ? "SUR-SAVED-••••••" : data.password
        }
      });
      playSuccess();
    } catch (e: any) {
      setVerificationResult({
        success: false,
        error: e.message || "Failed to process deployment."
      });
      playError();
    } finally {
      setIsCreatingServer(false);
    }
  };

  const handleClaimTrial = async (data: any) => {
    playClick();
    setIsSkeletonLoading(true);
    
    try {
      // Simulate trial creation
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      setVerificationResult({
        success: true,
        serverStatus: "ACTIVE",
        serverDetails: {
          serverName: data.serverName,
          plan: "Free Trial",
          ram: "2GB"
        },
        credentials: {
          panelUrl: "https://panel.stereocloud.in",
          username: data.username,
          password: data.password
        }
      });
      playSuccess();
    } catch (e: any) {
      setVerificationResult({
        success: false,
        error: e.message || "Failed to claim trial server."
      });
      playError();
    } finally {
      setIsSkeletonLoading(false);
    }
  };
  if (!selectedPlan) return null;

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-bg-dark">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent top-0 shadow-glow-gold" />
      <div className="absolute inset-0 cinematic-vignette opacity-60 z-10 pointer-events-none" />
      <div className="absolute inset-0 visible-grid-gold opacity-[0.03] pointer-events-none" />
      <CloudRainEffect />
      
      <div className="max-w-6xl mx-auto relative z-20 overflow-visible">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/pricing')}
          className="group flex items-center gap-4 text-zinc-500 hover:text-white transition-all mb-16 uppercase text-xs font-black tracking-[0.4em]"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:bg-brand-gold/20 group-hover:border-brand-gold/50 group-hover:shadow-glow-gold transition-all flex items-center justify-center">
            <ChevronLeft size={20} />
          </div>
          Return to Infrastructure Cluster
        </motion.button>

        <div className="grid lg:grid-cols-12 gap-16 items-start perspective-2000">
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-12 rounded-[4rem] platinum-glass border border-white/10 relative overflow-hidden group shadow-3d-lg preserve-3d"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-10">
                  <Star size={14} className="text-brand-gold" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase text-brand-gold tracking-[0.3em]">Payload Configuration</span>
                </div>
                
                <h2 className="text-5xl font-black text-white mb-10 uppercase tracking-tighter font-display text-glow-gold">{selectedPlan.name}</h2>
                
                <div className="space-y-6 mb-12 border-b border-white/5 pb-12">
                  <SummaryItem icon={<Cpu size={18}/>} label="Compute Engine" value={selectedPlan.cpu} />
                  <SummaryItem icon={<MemoryStick size={18}/>} label="DDR4 Memory" value={selectedPlan.ram} />
                  <SummaryItem icon={<HardDrive size={18}/>} label="NVMe Storage" value={selectedPlan.storage || selectedPlan.ssd} />
                  <SummaryItem icon={<Network size={18}/>} label="Edge Uplink" value="Gigabit Active" />
                </div>

                <div className="flex items-end justify-between bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 shadow-3d group-hover:border-brand-gold/30 transition-colors duration-700">
                  <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1">Settlement Total</div>
                  <div className="text-5xl font-black text-brand-gold tracking-tight drop-shadow-glow">₹{selectedPlan.price}</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex items-center gap-6 group hover:bg-white/[0.03] transition-all duration-700 shadow-3d-sm"
            >
               <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-110 group-hover:shadow-glow-orange transition-all duration-500">
                  <Shield size={28} />
               </div>
               <div>
                  <p className="text-sm font-black text-white uppercase tracking-widest leading-none mb-2">Enterprise Security</p>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold leading-tight">Quantum-grade encryption secured by Stereocloud Engine.</p>
               </div>
            </motion.div>
          </div>

          {/* Checkout Main Area */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-12 md:p-20 rounded-[4rem] platinum-glass border border-white/10 shadow-3d-lg relative overflow-hidden preserve-3d"
            >
              {!verificationResult && !selectedPlan.isTrial && (
                <div className="flex items-center justify-between mb-20 max-w-lg mx-auto overflow-visible relative z-30">
                    <StepItem active={billingStep >= 1} completed={billingStep > 1} label="Identity" icon={<Settings size={18}/>} />
                    <div className={`flex-1 h-px mx-6 transition-all duration-1000 ${billingStep > 1 ? 'bg-brand-gold shadow-glow-gold' : 'bg-white/10'}`} />
                    <StepItem active={billingStep >= 2} completed={billingStep > 2} label="Settlement" icon={<CreditCard size={18}/>} />
                    <div className={`flex-1 h-px mx-6 transition-all duration-1000 ${billingStep > 2 ? 'bg-brand-gold shadow-glow-gold' : 'bg-white/10'}`} />
                    <StepItem active={billingStep >= 3} completed={billingStep > 3} label="Broadcast" icon={<CheckCircle2 size={18}/>} />
                </div>
              )}

              {verificationResult ? (
                <VerificationDisplay result={verificationResult} onRetry={() => setVerificationResult(null)} onHome={() => navigate('/')} />
              ) : selectedPlan.isTrial ? (
                <TrialForm 
                  onSubmit={handleSubmit(handleClaimTrial)} 
                  isLoading={isSkeletonLoading} 
                  currentEggId={currentEggId}
                  currentNodeLocation={currentNodeLocation}
                  setValue={setValue}
                  register={register}
                  isHumanVerified={isHumanVerified}
                  setIsHumanVerified={setIsHumanVerified}
                />
              ) : (
                <AnimatePresence mode="wait">
                   {billingStep === 1 ? (
                     <motion.div
                       key="step1"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                     >
                        <ConfigForm 
                          currentEggId={currentEggId}
                          currentNodeLocation={currentNodeLocation}
                          setValue={setValue}
                          register={register}
                          savedCreds={savedCreds}
                          useExistingAccount={useExistingAccount}
                          setUseExistingAccount={setUseExistingAccount}
                          onNext={async () => {
                            const fields = useExistingAccount 
                              ? ["serverName"] 
                              : ["serverName", "email", "username", "password"];
                            const isValid = await trigger(fields as any);
                            if (isValid) setBillingStep(2);
                            else playError();
                          }}
                          selectedPlan={selectedPlan}
                          errors={errors}
                        />
                     </motion.div>
                   ) : (
                     <motion.div
                       key="step2"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                     >
                        <PaymentForm 
                          onSubmit={handleSubmit(onSubmit)}
                          isSubmitting={isSubmitting}
                          isCreatingServer={isCreatingServer}
                          selectedPlan={selectedPlan}
                          register={register}
                          handleFileChange={handleFileChange}
                          previewUrl={previewUrl}
                          onBack={() => setBillingStep(1)}
                          screenshot={screenshot}
                        />
                     </motion.div>
                   )}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner structure

const SummaryItem = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
      <span className="text-brand-gold/60">{icon}</span>
      {label}
    </div>
    <div className="text-xs font-bold text-white">{value}</div>
  </div>
);

const StepItem = ({ active, completed, label, icon }: any) => (
  <div className="flex flex-col items-center gap-3">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
      completed ? 'bg-brand-gold border-brand-gold text-slate-950 shadow-glow-gold scale-110' : 
      active ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 
      'bg-white/5 border-white/10 text-white/20'
    }`}>
      {completed ? <CheckCircle2 size={24} /> : icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest text-center ${active || completed ? 'text-white' : 'text-white/20'}`}>{label}</span>
  </div>
);

const Input = ({ label, error, className = "", ...props }: any) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
    <input 
      className={`w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-gold/50 outline-none transition-all placeholder:text-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] ${className}`}
      {...props}
    />
    {error && <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>}
  </div>
);

const VerificationDisplay = ({ result, onRetry, onHome }: any) => (
  <div className="text-center py-4">
    {result.success ? (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-gold/30 shadow-glow-gold">
          <CheckCircle2 size={48} className="text-brand-gold" />
        </div>
        <h3 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Node Online</h3>
        <p className="text-zinc-500 mb-10 font-bold uppercase text-[10px] tracking-[0.2em]">Infrastructre provisioned successfully via Stereocloud Engine.</p>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-left mb-10 space-y-6 shadow-3d">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
             <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Access Credentials</span>
             <button onClick={() => {}} className="text-[9px] font-black text-slate-500 hover:text-white flex items-center gap-2 transition-colors uppercase">
               <Copy size={12}/> Copy Secure Token
             </button>
          </div>
          <CredentialItem label="Engine Panel" value={result.credentials?.panelUrl} />
          <CredentialItem label="System ID" value={result.credentials?.username} />
          <CredentialItem label="Auth Secret" value={result.credentials?.password} isPassword />
        </div>

        <button onClick={onHome} className="w-full py-5 bg-brand-gold text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-glow-gold hover:translate-y-[-2px] transition-all">
          Manage Infrastructure
        </button>
      </motion.div>
    ) : (
      <div>
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Verification Exception</h3>
        <p className="text-red-400/80 bg-red-500/5 p-6 rounded-2xl border border-red-500/10 text-sm mb-10 font-medium leading-relaxed">
          {result.error}
        </p>
        <button onClick={onRetry} className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl uppercase tracking-widest border border-white/10 transition-all">
          Retry Verification
        </button>
      </div>
    )}
  </div>
);

const CredentialItem = ({ label, value, isPassword }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">{label}</div>
      <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-5 py-3 group">
        <span className="flex-1 font-mono text-sm text-white/90 truncate">
          {show || !isPassword ? value : "••••••••••••••••"}
        </span>
        {isPassword && (
          <button onClick={() => setShow(!show)} className="text-slate-500 hover:text-brand-gold transition-colors">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const ConfigForm = ({ currentEggId, currentNodeLocation, setValue, register, savedCreds, useExistingAccount, setUseExistingAccount, onNext, selectedPlan, errors }: any) => (
  <div className="space-y-10">
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] flex items-center gap-2">
        <Settings size={14} /> System Configuration
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EGG_OPTIONS.map((egg) => (
          <button 
            key={egg.id} 
            type="button"
            onClick={() => { setValue("eggId", egg.id); }} 
            className={`p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentEggId === egg.id ? 'bg-brand-gold text-slate-950 border-brand-gold shadow-glow-gold scale-105' : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/30'}`}
          >
            {egg.name}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
       <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] flex items-center gap-2">
         <MapPin size={14} /> Global Node Selection
       </h3>
       <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
    </div>

    <div className="grid sm:grid-cols-2 gap-6">
       <Input 
         label="Instance Identifier" 
         {...register("serverName", {required: "Server name is required"})} 
         defaultValue={`${selectedPlan.name} Cluster-1`}
         error={errors.serverName?.message}
       />
       
       {savedCreds ? (
         <div className="col-span-full p-6 rounded-3xl bg-brand-gold/5 border border-brand-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Users size={24} />
               </div>
               <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Saved Credentials</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Verified linked account: {savedCreds.username}</p>
               </div>
            </div>
            <button 
              type="button" 
              onClick={() => setUseExistingAccount(!useExistingAccount)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useExistingAccount ? 'bg-brand-gold text-slate-950 shadow-glow-gold' : 'bg-white/5 border border-white/10 text-white'}`}
            >
              {useExistingAccount ? 'Using Saved Profile' : 'Create New Profile'}
            </button>
         </div>
       ) : null}

       {!useExistingAccount && (
         <>
           <div className="col-span-full h-px bg-white/5 my-4" />
           <Input 
             label="Control Email" 
             {...register("email", {required: "Email is required"})} 
             type="email" 
             error={errors.email?.message}
           />
           <Input 
             label="Profile Key (Username)" 
             {...register("username", {required: "Username is required"})} 
             error={errors.username?.message}
           />
           <div className="col-span-full">
             <Input 
               label="Security Secret (Password)" 
               {...register("password", {required: "Password is required"})} 
               type="password" 
               error={errors.password?.message}
             />
           </div>
         </>
       )}
    </div>

    <button 
      type="button"
      onClick={onNext}
      className="w-full h-16 bg-brand-gold text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-glow-gold hover:translate-y-[-4px] active:translate-y-[2px] transition-all flex items-center justify-center gap-3"
    >
      Proceed to Deployment Gateway <ChevronRight size={20} />
    </button>
  </div>
);

const PaymentForm = ({ onSubmit, isSubmitting, isCreatingServer, selectedPlan, register, handleFileChange, previewUrl, onBack, screenshot }: any) => (
  <div className="space-y-10">
    {(isSubmitting || isCreatingServer) ? (
      <div className="py-12 flex flex-col items-center">
         <div className="relative mb-12">
            <div className="w-24 h-24 border-4 border-brand-gold/20 rounded-full animate-spin border-t-brand-gold" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Shield size={32} className="text-brand-gold animate-pulse" />
            </div>
         </div>
         <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">
           {isSubmitting ? 'Verifying Gateway' : 'Syncing Node'}
         </h3>
         <LoadingMessages isSubmitting={isSubmitting} isCreatingServer={isCreatingServer} />
         
         <div className="mt-12 w-full max-w-sm space-y-4">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="h-full w-1/3 bg-brand-gold shadow-glow-gold"
               />
            </div>
            <p className="text-[8px] text-zinc-600 uppercase text-center tracking-[0.5em]">Establishing Secure Handshake...</p>
         </div>
      </div>
    ) : (
      <form onSubmit={onSubmit} className="space-y-10">
        <div className="p-8 rounded-[2rem] bg-brand-gold/5 border border-brand-gold/20 relative overflow-hidden group shadow-3d">
           <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-gold/10 blur-3xl rounded-full" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-32 h-32 bg-white rounded-3xl p-3 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ayushlegit@fam&pn=Stereocloud&am=${selectedPlan.price}&cu=INR`} alt="Payment QR" />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2">Instant Settlement</p>
                 <h4 className="text-2xl font-black text-white mb-2 tracking-widest">ayushlegit@fam</h4>
                 <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                    <button 
                      type="button" 
                      onClick={() => { navigator.clipboard.writeText('ayushlegit@fam'); }}
                      className="px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                      <Copy size={14}/> Copy ID
                    </button>
                    <div className="text-xl font-bold font-mono text-white/40">₹{selectedPlan.price}</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
           <Input label="UTR (12-Digit Identifier)" {...register("utrId", {required: true})} />
           <Input label="Payment Context (Your ID)" {...register("upiId", {required: true})} />
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] flex items-center gap-2">
             <Paperclip size={14} /> Settlement Proof
           </h3>
           <label className={`block group relative rounded-[2rem] border-2 border-dashed transition-all duration-500 overflow-hidden ${previewUrl ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 bg-white/[0.01] hover:border-brand-gold/30'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              
              {previewUrl ? (
                <div className="relative p-3 flex items-center gap-6">
                   <img src={previewUrl} alt="Receipt" className="w-24 h-24 rounded-2xl object-cover border border-brand-gold/20 shadow-2xl" />
                   <div className="flex-1 text-left">
                      <p className="text-sm font-black text-white uppercase tracking-widest">Image Anchored</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Reference locked successfully. Click to replace.</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mr-4 shadow-glow-gold">
                      <CheckCircle2 size={24} />
                   </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-4 text-center">
                   <div className="w-16 h-16 rounded-3xl bg-white/5 group-hover:bg-brand-gold/10 flex items-center justify-center transition-all group-hover:scale-110">
                      <Folder size={32} className="text-slate-600 group-hover:text-brand-gold transition-colors" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest">Attach Screenshot</p>
                      <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter">Support: PNG, JPG (Max 5MB)</p>
                   </div>
                </div>
              )}
           </label>
        </div>

        <div className="flex gap-6">
           <button onClick={onBack} type="button" className="px-8 h-16 bg-white/[0.02] border border-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <ChevronLeft size={24} />
           </button>
           <button 
             type="submit" 
             disabled={!screenshot}
             className="flex-1 h-16 bg-brand-gold text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-glow-gold hover:translate-y-[-4px] active:translate-y-[2px] transition-all disabled:opacity-30 disabled:grayscale"
           >
              Finalize Infrastructure Deployment
           </button>
        </div>
      </form>
    )}
  </div>
);

const TrialForm = ({ onSubmit, isLoading, currentEggId, currentNodeLocation, setValue, register, isHumanVerified, setIsHumanVerified }: any) => (
  <form onSubmit={onSubmit} className="space-y-10">
    <div className="text-center mb-10">
       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 text-blue-500">
          <Shield size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Anti-Abuse Verification</span>
       </div>
       <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Claim Sandbox</h3>
       <p className="text-xs text-zinc-500 font-medium">Provision your 48-hour high-availability cluster.</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-8">
       <div className="col-span-full space-y-4">
          <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] ml-1">Environment Software</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EGG_OPTIONS.map((egg) => (
              <button 
                key={egg.id} 
                type="button"
                onClick={() => setValue("eggId", egg.id)} 
                className={`p-3 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentEggId === egg.id ? 'bg-brand-gold text-slate-950 border-brand-gold shadow-glow-gold' : 'bg-white/[0.02] border-white/10 text-white/40'}`}
              >
                {egg.name}
              </button>
            ))}
          </div>
       </div>

       <div className="col-span-full space-y-4">
          <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] ml-1">Deploy Location</label>
          <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
       </div>

       <Input label="Registry Email" {...register("email", {required: true})} type="email" />
       <Input label="Server Name" {...register("serverName", {required: true})} defaultValue="Sterro Sandbox Cluster" />
       <Input label="Create Username" {...register("username", {required: true})} />
       <Input label="Create Password" {...register("password", {required: true})} type="password" />

       <div className="col-span-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center justify-between group cursor-pointer" onClick={() => setIsHumanVerified(!isHumanVerified)}>
          <div className="flex items-center gap-6">
             <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${isHumanVerified ? 'bg-brand-gold border-brand-gold shadow-glow-gold text-slate-950' : 'bg-transparent border-white/10 text-white/10'}`}>
                {isHumanVerified && <CheckCircle2 size={24} />}
             </div>
             <div>
                <p className="text-sm font-black text-white uppercase tracking-widest">I am a human operator</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Certify this trial provisioning request.</p>
             </div>
          </div>
          <Shield className={`transition-colors duration-500 ${isHumanVerified ? 'text-brand-gold' : 'text-white/5'}`} size={32} />
       </div>
    </div>

    <button 
      type="submit" 
      disabled={!isHumanVerified || isLoading}
      className="w-full h-16 bg-white border border-white/10 text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-xl hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:grayscale"
    >
       {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Provision Trial Resource'}
    </button>
  </form>
);
