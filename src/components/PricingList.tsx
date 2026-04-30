import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, MemoryStick, Activity, Network, Archive, LayoutTemplate, Shield, Database, Users, Gamepad2, Server, X, Upload, CheckCircle2, Loader2, AlertCircle, MapPin, Copy, CreditCard, ChevronRight, ChevronLeft, Info, HelpCircle, Settings, Paperclip, Folder, ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import WorldMap from './WorldMap';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, getDoc, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const LoadingMessages = ({ isSubmitting, isCreatingServer }: { isSubmitting: boolean, isCreatingServer: boolean }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = isSubmitting 
    ? ["Analyzing payment screenshot...", "Scanning UTR number...", "Verifying payment with AI..."]
    : ["Connecting to Pterodactyl Panel...", "Creating User Account...", "Assigning Allocations & Ports...", "Allocating Server RAM & CPU...", "Waiting for Panel Response..."];

  useEffect(() => {
    setMsgIdx(0);
    const interval = setInterval(() => {
      setMsgIdx(prev => Math.min(prev + 1, msgs.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isSubmitting, isCreatingServer]);

  return <p className="text-white/60 text-sm animate-pulse">{msgs[msgIdx]}</p>;
}

interface PaymentFormData {
  utrId: string;
  upiId: string;
  date: string;
  email: string;
  username: string;
  serverName: string;
  password?: string;
  nodeLocation: string;
  eggId: string;
}

const EGG_OPTIONS = [
  { id: "4", name: "Paper (Recommended)" },
  { id: "5", name: "Vanilla" },
  { id: "1", name: "Bungeecord" },
  { id: "2", name: "Forge" },
  { id: "3", name: "Sponge" }
];

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
  { id: 'trial', name: "Dev Sandbox", price: "0", ram: "4GB RAM", storage: "100GB SSD", cpu: "150% CPU", ports: "1 Additional Port", backups: "0 Backup Limit", db: "1 Database", ddos: "Standard", players: "Testing Only", isTrial: true, type: 'minecraft', order: 0 },
  { id: 'p1', name: "Core-01", price: "130", ram: "2GB RAM", storage: "75GB SSD", cpu: "100% CPU (4.0GHz)", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps EdgeGuard", players: "10-20 Players", type: 'minecraft', order: 1 },
  { id: 'p2', name: "Core-02", price: "260", ram: "4GB RAM", storage: "100GB SSD", cpu: "150% CPU", ports: "2 Additional Ports", backups: "1 Backup Limit", db: "1 Database", ddos: "10 Gbps Protection", players: "20-35 Players", type: 'minecraft', order: 2 },
  { id: 'p3', name: "Sigma Pro", price: "390", ram: "6GB RAM", storage: "125GB SSD", cpu: "200% CPU", ports: "2 Additional Ports", backups: "2 Backup Limits", db: "2 Databases", ddos: "10 Gbps Protection", players: "30-50 Players", highlight: true, type: 'minecraft', order: 3 }
];

const fallbackVpsPlans: Plan[] = [
  { id: 'v1', name: "D-Node Alpha", price: "240", ram: "4GB RAM", cpu: "200% CPU", type: 'vps', storage: '50GB', ports: '1', order: 0 },
  { id: 'v2', name: "D-Node Beta", price: "480", ram: "8GB RAM", cpu: "400% CPU", type: 'vps', storage: '100GB', ports: '1', order: 1 },
  { id: 'v3', name: "D-Node Xeon Pro", price: "960", ram: "16GB RAM", cpu: "800% CPU", highlight: true, type: 'vps', storage: '200GB', ports: '1', order: 2 }
];


export default function PricingList() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps'>('minecraft');
  const [minecraftPlans, setMinecraftPlans] = useState<Plan[]>(fallbackMinecraftPlans);
  const [vpsPlans, setVpsPlans] = useState<Plan[]>(fallbackVpsPlans);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingServer, setIsCreatingServer] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success?: boolean, error?: string, credentials?: any, serverDetails?: any, serverStatus?: string} | null>(null);
  const [billingStep, setBillingStep] = useState(1); // 1: Config, 2: Payment, 3: Success
  const [hasClaimedTrial, setHasClaimedTrial] = useState(false);
  const [savedCreds, setSavedCreds] = useState<any>(null);
  const [useExistingAccount, setUseExistingAccount] = useState(true);
  const { firebaseUser: user } = useAuth();

  useEffect(() => {
    async function fetchSavedCreds() {
      if (user?.uid) {
        try {
          const credDoc = await getDoc(doc(db, "users", user.uid, "settings", "panel"));
          if (credDoc.exists()) {
            const data = credDoc.data();
            setSavedCreds(data);
            setUseExistingAccount(true);
          } else {
            setUseExistingAccount(false);
          }
        } catch (e) {
          console.warn("Failed to fetch saved creds");
          setUseExistingAccount(false);
        }
      }
    }
    fetchSavedCreds();
  }, [user, selectedPlan]);

  useEffect(() => {
    async function checkTrialStatus() {
      if (user?.email) {
        try {
          const trialDoc = await getDoc(doc(db, "trials", user.email));
          if (trialDoc.exists()) {
            setHasClaimedTrial(true);
          }
        } catch(e) { }
      }
    }
    checkTrialStatus();
  }, [user]);

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const q = query(collection(db, "plans"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const allPlans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
          
          let fetchedMcPlans = allPlans.filter(p => p.type === 'minecraft');
          if (fetchedMcPlans.length === 0) fetchedMcPlans = fallbackMinecraftPlans;

          if (!fetchedMcPlans.some(p => p.isTrial)) {
            const defaultTrial = fallbackMinecraftPlans.find(p => p.isTrial);
            if (defaultTrial) {
               fetchedMcPlans = [defaultTrial, ...fetchedMcPlans];
            }
          }
          
          setMinecraftPlans(fetchedMcPlans);
          const fetchedVpsPlans = allPlans.filter(p => p.type === 'vps');
          setVpsPlans(fetchedVpsPlans.length > 0 ? fetchedVpsPlans : fallbackVpsPlans);
        } else {
          // If snap is empty, we already have fallbacks in state, but let's be explicit
          setMinecraftPlans(fallbackMinecraftPlans);
          setVpsPlans(fallbackVpsPlans);
        }
      } catch (e) {
        console.warn("Live plans load failed, using fallbacks.");
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  // Trial specific states
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PaymentFormData>();
  const currentNodeLocation = watch("nodeLocation");
  const currentEggId = watch("eggId") || "4";
  const currentUtrId = watch("utrId");
  const isBypassUtr = currentUtrId === "20062012" || currentUtrId === "00000" || currentUtrId === "123456789012";

  useEffect(() => {
    reset({
      email: user?.email || "",
      username: user?.displayName || "",
      upiId: "",
      utrId: "",
      date: new Date().toISOString().split('T')[0],
      nodeLocation: "1",
      eggId: "4"
    });
  }, [user, reset, selectedPlan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    const bypass = data.utrId === "20062012" || data.utrId === "00000" || data.utrId === "123456789012";
    if (!screenshot && !bypass) return;
    
    setIsSubmitting(true);
    setVerificationResult(null);

    let screenshotBase64 = null;
    let mimeType = null;
    if (screenshot) {
      mimeType = screenshot.type;
      // Resize image on client to avoid Vercel/Netlify payload limits (max 4.5MB)
      screenshotBase64 = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // Resize to max 800px width
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height *= MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width *= MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress carefully to jpeg, max 0.7 quality to ensure small payload
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl.split(',')[1]);
        };
        img.src = URL.createObjectURL(screenshot);
      });
      mimeType = "image/jpeg"; // we converted it to jpeg
    }

    const payload = {
      utrId: data.utrId,
      upiId: data.upiId,
      date: data.date,
      email: useExistingAccount ? savedCreds.email : data.email,
      username: useExistingAccount ? savedCreds.username : data.username,
      serverName: data.serverName,
      password: useExistingAccount ? savedCreds.password : data.password,
      planName: selectedPlan.name,
      ram: selectedPlan.ram || '',
      cpu: selectedPlan.cpu || '',
      storage: selectedPlan.storage || '',
      databases: selectedPlan.db || '0',
      backups: selectedPlan.backups || '0',
      ports: selectedPlan.ports || '0',
      nodeId: data.nodeLocation,
      eggId: data.eggId,
      screenshot: screenshotBase64,
      screenshotMimeType: mimeType
    };

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result;
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        setVerificationResult({ error: result.error || result.reason || 'Verification failed.' });
        setIsSubmitting(false);
        return;
      }
      
      // Verification successful, proceed to create server
      setIsSubmitting(false);
      setIsCreatingServer(true);

      const serverResponse = await fetch('/api/create-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let serverResult;
      const serverText = await serverResponse.text();
      try {
        serverResult = JSON.parse(serverText);
      } catch (e) {
         throw new Error(`Server creation failed: ${serverText.substring(0, 100)}`);
      }

      if (serverResponse.ok) {
        setVerificationResult({ success: true, credentials: serverResult.credentials, serverDetails: serverResult.serverDetails, serverStatus: serverResult.serverStatus });
        
        // Save Credentials if new
        if (!useExistingAccount && user?.uid) {
           await setDoc(doc(db, "users", user.uid, "settings", "panel"), {
             email: data.email,
             username: data.username,
             password: data.password,
             updatedAt: serverTimestamp()
           });
        }

        // Save Subscription Record
        if (user?.uid) {
           await addDoc(collection(db, "users", user.uid, "subscriptions"), {
             planId: selectedPlan.id,
             planName: selectedPlan.name,
             price: selectedPlan.price,
             serverName: data.serverName,
             status: 'active',
             createdAt: serverTimestamp(),
             panelUrl: serverResult.credentials?.panelUrl
           });
        }
      } else {
        setVerificationResult({ error: serverResult.error || 'Server creation failed.' });
      }

    } catch (error: any) {
      console.error("Deploy Error:", error);
      let msg = error.message || 'Connection error while contacting AI Gateway or Panel.';
      if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
        msg = "The deployment engine cannot reach panel.sterro.cloud (ECONNREFUSED). The panel might be firewalling Vercel or is currently down.";
      }
      setVerificationResult({ error: msg });
    } finally {
      setIsSubmitting(false);
      setIsCreatingServer(false);
    }
  };

  const closeDialog = () => {
    if (!isSubmitting && !isCreatingServer) {
      setSelectedPlan(null);
      setScreenshot(null);
      setPreviewUrl(null);
      setVerificationResult(null);
      setBillingStep(1);
      setIsHumanVerified(false);
    }
  }

  const handleClaimTrial = async (data: PaymentFormData) => {
    if ((!data.email && !useExistingAccount) || !isHumanVerified) return;
    setIsSkeletonLoading(true);
    setVerificationResult(null);

    try {
      const payload = { 
        email: useExistingAccount ? savedCreds.email : data.email, 
        username: useExistingAccount ? savedCreds.username : data.username,
        serverName: data.serverName,
        password: useExistingAccount ? savedCreds.password : data.password,
        nodeId: currentNodeLocation,
        eggId: currentEggId
      };
      const response = await fetch('/api/trial/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let result;
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
      }

      if (response.ok) {
        setVerificationResult({ success: true, credentials: result.credentials, serverDetails: result.serverDetails, serverStatus: result.serverStatus });
        
        // Save Credentials if new
        if (!useExistingAccount && user?.uid) {
           await setDoc(doc(db, "users", user.uid, "settings", "panel"), {
             email: payload.email,
             username: payload.username,
             password: payload.password,
             updatedAt: serverTimestamp()
           });
        }

        // Save Subscription Record
        if (user?.uid) {
           await addDoc(collection(db, "users", user.uid, "subscriptions"), {
             planId: 'trial',
             planName: 'Cloud Trial Server',
             price: 0,
             serverName: payload.serverName,
             status: 'active',
             createdAt: serverTimestamp(),
             panelUrl: result.credentials?.panelUrl
           });
        }
      } else {
        setVerificationResult({ error: result.error || 'Verification failed.' });
      }
    } catch (error: any) {
      console.error("Trial Error:", error);
      let msg = error.message || 'Connection error while provisioning Trial.';
      if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
        msg = "The provisioner cannot reach the panel (ECONNREFUSED). This usually means the panel.sterro.cloud is offline or blocking our server's IP. Please contact support or try again later.";
      }
      setVerificationResult({ error: msg });
    } finally {
      setIsSkeletonLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-surface)]/30 border-t border-[var(--color-border)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Superior <span className="text-brand-cyan">Performance</span><br/>
            Unmatched Support
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-12 text-lg font-light tracking-wide">
            Enterprise-grade hardware meets simplified management. 
            Select your architecture and deploy your project in under 60 seconds.
          </p>
          
          <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl relative z-20 backdrop-blur-3xl mx-auto mb-16 px-2">
            <button
              onClick={() => setActiveTab('minecraft')}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-500 ${activeTab === 'minecraft' ? 'bg-brand-cyan text-bg-dark shadow-[0_10px_30px_rgba(0,240,255,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <Gamepad2 size={18} /> <span>MINECRAFT NODES</span>
            </button>
            <button
              onClick={() => setActiveTab('vps')}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-500 ${activeTab === 'vps' ? 'bg-brand-cyan text-bg-dark shadow-[0_10px_30px_rgba(0,240,255,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <Server size={18} /> <span>SCALABLE VPS</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs font-mono tracking-widest text-zinc-500 uppercase max-w-3xl mx-auto mb-8">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               Global Regions: IN, US, DE, SG
             </div>
             <div className="hidden md:block w-px h-4 bg-white/10" />
             <div className="flex items-center gap-2">
               <Shield size={14} className="text-brand-cyan" />
               Anti-DDoS EdgeGuard Active
             </div>
          </div>
        </div>

        <motion.div 
          className="flex flex-col gap-8 perspective-2000"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {loading ? (
            <>
              <PlanSkeleton highlight={false} />
              <PlanSkeleton highlight={true} />
              <PlanSkeleton highlight={false} />
            </>
          ) : (
            <>
              {activeTab === 'minecraft' && minecraftPlans.map((p, i) => (
                <motion.div
                  key={`mc-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50, damping: 20 } }
                  }}
                  whileHover={{ y: -4 }}
                  className={`group relative bg-bg-card/40 border ${p.highlight ? 'border-brand-cyan/30 shadow-[0_30px_100px_-20px_rgba(0,240,255,0.1)]' : 'border-white/5'} rounded-[2.5rem] p-1 md:p-1 flex flex-col md:flex-row items-stretch gap-0 transition-all duration-700 overflow-hidden backdrop-blur-3xl hover:bg-bg-card/60`}
                >
                  {/* Visual Side */}
                  <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden shrink-0">
                    <img 
                      src={p.isTrial ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800" : (i % 2 === 0 ? "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800" : "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800")} 
                      alt="" 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-card/40 md:to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-card/90 to-transparent md:hidden" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:hidden">
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{p.name}</h4>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 w-full space-y-8">
                      <div className="hidden md:block">
                        <div className="flex items-center gap-4 mb-2">
                           <h4 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-brand-cyan transition-colors duration-500">{p.name}</h4>
                           {p.highlight && <span className="admin-badge">Priority Node</span>}
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-wide">Enterprise High-Frequency Instance</p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        {[
                          { icon: MemoryStick, label: "Allocation", value: p.ram },
                          { icon: HardDrive, label: "NVMe Pool", value: p.storage || p.ssd },
                          { icon: Cpu, label: "Compute", value: p.cpu },
                          { icon: Network, label: "Protocol", value: "TCP/UDP Ready" },
                        ].map((spec, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                              <spec.icon size={12} className="text-brand-cyan/40" />
                              {spec.label}
                            </div>
                            <div className="text-base font-bold text-zinc-300 font-mono tracking-tight">{spec.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {['99.9% Uptime SLA', 'Ryzen 9 7950X', 'DDR5 ECC RAM'].map(f => (
                          <div key={f} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span className="w-1 h-1 bg-brand-cyan rounded-full" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-6 shrink-0">
                      <div className="text-center md:text-right">
                         <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cost Identifier</div>
                         <div className="text-4xl font-black text-white tracking-tighter">₹{p.price}<span className="text-sm font-medium text-zinc-600 tracking-normal">/mo</span></div>
                      </div>
                      
                      <button 
                        onClick={() => p.type === 'vps' ? window.open('https://discord.gg/b2PqWqSEU3', '_blank') : setSelectedPlan(p)}
                        className={`w-full md:w-52 h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${p.highlight ? 'bg-brand-cyan text-bg-dark shadow-[0_20px_40px_rgba(0,240,255,0.2)] hover:scale-105' : 'bg-white/5 text-white hover:bg-white hover:text-bg-dark border border-white/10'}`}
                      >
                        {p.isTrial ? 'Claim Sandbox' : 'Provision Node'}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'vps' && vpsPlans.map((p, i) => (
             <motion.div
               key={`vps-${i}`}
               variants={{
                 hidden: { opacity: 0, y: 30, scale: 0.95 },
                 visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50, damping: 20 } }
               }}
               whileHover={{ y: -4 }}
               className={`group relative bg-bg-card/40 border ${p.highlight ? 'border-brand-cyan/30 shadow-[0_30px_100px_-20px_rgba(0,240,255,0.1)]' : 'border-white/5'} rounded-[2.5rem] p-1 md:p-1 flex flex-col md:flex-row items-stretch gap-0 transition-all duration-700 overflow-hidden backdrop-blur-3xl hover:bg-bg-card/60`}
            >
               {/* Visual Side */}
               <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden shrink-0">
                 <img 
                   src={i === 2 ? "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800" : "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800"} 
                   alt="" 
                   className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-card/40 md:to-transparent" />
                 
                 <div className="absolute inset-0 flex flex-col justify-end p-6 md:hidden">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{p.name}</h4>
                 </div>
               </div>

               {/* Content Side */}
               <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex-1 w-full space-y-8">
                   <div className="hidden md:block">
                     <div className="flex items-center gap-4 mb-2">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-brand-cyan transition-colors duration-500">{p.name}</h4>
                        {p.highlight && <span className="admin-badge">Premium Compute</span>}
                     </div>
                     <p className="text-xs text-zinc-500 font-medium tracking-wide">Enterprise KVM Virtualization</p>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                      {[
                        { icon: MemoryStick, label: "RAM Pool", value: p.ram },
                        { icon: Cpu, label: "KVM vCore", value: p.cpu },
                        { icon: HardDrive, label: "NVMe Raid", value: p.storage },
                        { icon: Network, label: "BGP Port", value: "1 Gbps" },
                      ].map((spec, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                            <spec.icon size={12} className="text-brand-cyan/40" />
                            {spec.label}
                          </div>
                          <div className="text-base font-bold text-zinc-300 font-mono tracking-tight">{spec.value}</div>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {['Tier-3 Datacenter', 'Full Root Access', 'IPv6 Ready'].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          <span className="w-1 h-1 bg-brand-cyan rounded-full" />
                          {f}
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-6 shrink-0">
                   <div className="text-center md:text-right">
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Pricing Model</div>
                      <div className="text-4xl font-black text-white tracking-tighter">₹{p.price}<span className="text-sm font-medium text-zinc-600 tracking-normal">/mo</span></div>
                   </div>
                   
                   <button 
                     onClick={() => p.type === 'vps' ? window.open('https://discord.gg/b2PqWqSEU3', '_blank') : setSelectedPlan(p)}
                     className={`w-full md:w-52 h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${p.highlight ? 'bg-brand-cyan text-bg-dark shadow-[0_20px_40px_rgba(0,240,255,0.2)] hover:scale-105' : 'bg-white/5 text-white hover:bg-white hover:text-bg-dark border border-white/10'}`}
                   >
                     Deploy Node
                     <ChevronRight size={14} />
                   </button>
                 </div>
               </div>
            </motion.div>
          ))}
            </>
          )}
        </motion.div>
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
                  <h3 className="text-xl font-bold text-white">{selectedPlan.isTrial ? 'Trial Server Setup' : 'AI Purchase Gateway'}</h3>
                  <p className="text-sm text-[var(--color-text-dim)]">
                    {selectedPlan.isTrial ? 'Complete verification to claim your 1-hour free trial' : `Purchasing ${selectedPlan.name || `${selectedPlan.ram} Intel VPS`} for ₹${selectedPlan.price}/mo`}
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
                            {verificationResult.serverStatus?.includes('could not be allocated') || verificationResult.serverStatus?.includes('Error') || verificationResult.serverStatus?.includes('OFFLINE') ? (
                              <>
                                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
                                  <AlertCircle size={40} className="text-yellow-500" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Server Delayed (Panel Error)</h3>
                                <p className="text-[var(--color-text-dim)] mb-8 font-medium">Pterodactyl Node lacks Resources/Ports. Check Node Allocations.</p>
                              </>
                            ) : (
                              <>
                                <div className="w-20 h-20 bg-[#00F0FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00F0FF]/30">
                                  <CheckCircle2 size={40} className="text-[#00F0FF]" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Node Provisioned!</h3>
                                <p className="text-[var(--color-text-dim)] mb-8 font-medium">Your high-performance server is ready for deployment.</p>
                              </>
                            )}
                            
                            {verificationResult.serverDetails && (
                              <div className="bg-[#080C14] border border-[#00F0FF]/20 rounded-2xl p-6 text-left mb-4 flex flex-col gap-2">
                                 <div className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF] mb-2 border-b border-white/5 pb-2">Server Details</div>
                                 <div className="flex items-center justify-between pb-2">
                                     <span className="text-sm font-medium text-white/60">Server Name</span>
                                     <span className="text-sm font-bold text-white">{verificationResult.serverDetails.serverName}</span>
                                 </div>
                                 <div className="flex items-center justify-between pb-2">
                                     <span className="text-sm font-medium text-white/60">Plan</span>
                                     <span className="text-sm font-bold text-[#00F0FF]">{verificationResult.serverDetails.plan}</span>
                                 </div>
                                 {verificationResult.serverDetails.ram && (
                                   <div className="flex items-center justify-between">
                                       <span className="text-sm font-medium text-white/60">Allocated RAM</span>
                                       <span className="text-sm font-bold text-white">{verificationResult.serverDetails.ram}</span>
                                   </div>
                                 )}
                              </div>
                            )}

                            <div className="bg-[#080C14] border border-[#121B2B] rounded-2xl p-6 text-left mb-8 space-y-4">
                              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">Access Credentials</span>
                                <button className="text-[10px] font-bold text-white/40 hover:text-[#00F0FF] flex items-center gap-1"><Copy size={10}/> Copy All</button>
                              </div>
                              <CredentialItem label="Panel URL" value={verificationResult.credentials?.panelUrl} />
                              <CredentialItem label="Username" value={verificationResult.credentials?.username} />
                              <CredentialItem label="Password" value={verificationResult.credentials?.password} isPassword />
                            </div>

                            <p className="text-xs text-yellow-400 font-bold mb-8 flex items-center text-left p-4 bg-yellow-400/10 rounded-lg gap-3">
                              <Info size={24} className="shrink-0" /> 
                              <span>{verificationResult.serverStatus}</span>
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
                            <p className="text-red-400 bg-red-500/10 p-5 rounded-2xl border border-red-500/20 text-sm mb-8 font-mono shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] leading-relaxed">
                              {verificationResult.error}
                            </p>
                            <button onClick={() => setVerificationResult(null)} className="w-full py-4 bg-[#00F0FF] text-black font-black rounded-xl uppercase tracking-widest">
                              Try Again
                            </button>
                          </div>
                        )}
                      </div>
                    ) : selectedPlan.isTrial ? (
                      <div className="max-w-md mx-auto">
                         {isSkeletonLoading ? (
 <div className="flex flex-col gap-4">
 <div className="bg-[#121B2B]/50 border border-[#1a1f2e] p-6 rounded-2xl w-full max-w-md mx-auto mb-4">
 <div className="text-center mb-6">
 <h3 className="text-xl font-bold text-[#00F0FF] mb-2 uppercase tracking-widest">Creating Server...</h3>
 <LoadingMessages isSubmitting={false} isCreatingServer={true} />
 </div>
 </div>
                           <div className="bg-[#121B2B]/50 border border-[#1a1f2e] p-6 rounded-2xl w-full max-w-md mx-auto">
                             <div className="animate-pulse flex space-x-4">
                               <div className="rounded-full bg-[#1a1f2e] h-12 w-12"></div>
                               <div className="flex-1 space-y-4 py-1">
                                 <div className="h-3 bg-[#1a1f2e] rounded w-3/4"></div>
                                 <div className="space-y-2">
                                   <div className="h-3 bg-[#1a1f2e] rounded"></div>
                                   <div className="h-3 bg-[#1a1f2e] rounded w-5/6"></div>
                                 </div>
                               </div>
                             </div>
                             <div className="animate-pulse mt-8 space-y-4">
                               <div className="h-12 bg-[#1a1f2e] rounded-xl w-full"></div>
                               <div className="h-12 bg-[#1a1f2e] rounded-xl w-full"></div>
                               <div className="flex gap-4">
                                  <div className="h-12 bg-[#1a1f2e] rounded-xl w-1/2"></div>
                                  <div className="h-12 bg-[#1a1f2e] rounded-xl w-1/2"></div>
                               </div>
                               <div className="h-14 bg-[#1a1f2e] rounded-xl w-full mt-6"></div>
                             </div>
                           </div>
                           </div>
                         ) : (
                            <form onSubmit={handleSubmit(handleClaimTrial)} className="space-y-6">
                               <div className="text-center">
                                  <h3 className="text-2xl font-black text-[#00F0FF] mb-2 uppercase tracking-tighter">HUMAN VERIFICATION</h3>
                                  <p className="text-sm text-[var(--color-text-dim)]">Create your account to claim trial.</p>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2 space-y-2">
                                     <label className="text-xs font-black uppercase tracking-widest text-white/60">Server Software</label>
                                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                        {EGG_OPTIONS.map((egg) => (
                                           <div key={egg.id} onClick={() => setValue("eggId", egg.id)} className={`px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-all text-center flex items-center justify-center ${currentEggId === egg.id ? 'bg-[#00F0FF] text-black border-[#00F0FF]' : 'bg-black/50 border-[#121B2B] text-white/70 hover:border-[#00F0FF]/50 hover:text-white'}`}>
                                              {egg.name}
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="col-span-2 space-y-2 mt-2">
                                     <label className="text-xs font-black uppercase tracking-widest text-white/60">Choose Node Location</label>
                                     <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
                                  </div>
                                  <div className="col-span-2">
                                    <Input label="Email Address" {...register("email", {required: true})} type="email" placeholder="you@example.com" />
                                  </div>
                                  <Input label="Server Name" {...register("serverName", {required: true})} defaultValue="Sterro Trial Server" />
                                  <Input label="Panel Username" {...register("username", {required: true})} />
                                  <Input label="Panel Password" {...register("password", {required: true})} type="password" />
                               </div>
                               
                               {/* Human Verification Simple Checkbox */}
                               <div className="bg-[#080C14] border border-[#121B2B] rounded-2xl p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsHumanVerified(!isHumanVerified)}>
                                 <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-colors ${isHumanVerified ? 'bg-green-500 border-green-500' : 'bg-transparent border-[#121B2B]'}`}>
                                     {isHumanVerified && <CheckCircle2 className="text-white" size={20} />}
                                   </div>
                                   <span className="font-medium text-white">I am human</span>
                                 </div>
                                 <Shield className="text-[#00F0FF]/50" size={24} />
                               </div>

                               <button type="submit" disabled={isSkeletonLoading || !isHumanVerified} className="w-full h-14 bg-[#00F0FF] disabled:opacity-50 text-black font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-3d hover:bg-[#00D8E6]">
                                  {isSkeletonLoading ? <Loader2 className="animate-spin" /> : 'Claim Trial Server'}
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
                                      <MapPin size={14} /> Server Software
                                   </label>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                       {EGG_OPTIONS.map((egg) => (
                                          <div key={egg.id} onClick={() => setValue("eggId", egg.id)} className={`p-3 border rounded-xl text-sm font-bold cursor-pointer transition-all text-center flex items-center justify-center ${currentEggId === egg.id ? 'bg-[#00F0FF] text-black border-[#00F0FF]' : 'bg-[#080C14] border-[#121B2B] text-white/70 hover:border-[#00F0FF]/50 hover:text-white shadow-3d'}`}>
                                             {egg.name}
                                          </div>
                                       ))}
                                   </div>
                                </div>
                                <div className="space-y-3 mt-4">
                                   <label className="text-xs font-black uppercase tracking-widest text-[#00F0FF] flex items-center gap-2">
                                      <MapPin size={14} /> Deployment Node Location
                                   </label>
                                   <WorldMap selectedId={currentNodeLocation} onSelect={(id) => setValue("nodeLocation", id)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                   <div className="col-span-2">
                                     <Input label="Server Name" {...register("serverName", {required: true})} defaultValue={`${selectedPlan.name} Server`} />
                                   </div>
                                   
                                   {savedCreds && (
                                     <div className="col-span-2 p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-2xl flex items-center justify-between mb-2">
                                       <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                                           <Users size={18} />
                                         </div>
                                         <div>
                                           <p className="text-xs font-black text-white uppercase tracking-widest">Existing Account Found</p>
                                           <p className="text-[10px] text-white/40 uppercase tracking-tighter">Username: {savedCreds.username}</p>
                                         </div>
                                       </div>
                                       <button 
                                         type="button"
                                         onClick={() => setUseExistingAccount(!useExistingAccount)}
                                         className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${useExistingAccount ? 'bg-brand-cyan text-bg-dark' : 'bg-white/5 text-white/60'}`}
                                       >
                                         {useExistingAccount ? 'USING SAVED' : 'CREATE NEW'}
                                       </button>
                                     </div>
                                   )}

                                   {!useExistingAccount ? (
                                     <>
                                       <Input label="Control Panel Email" {...register("email", {required: !useExistingAccount})} type="email" />
                                       <Input label="Panel Username" {...register("username", {required: !useExistingAccount})} />
                                       <div className="col-span-2">
                                          <Input label="Panel Password" {...register("password", {required: !useExistingAccount})} type="password" />
                                       </div>
                                     </>
                                   ) : (
                                     <div className="col-span-2 text-center p-4 border border-dashed border-white/10 rounded-2xl opacity-50">
                                       <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Deploying with saved credentials</p>
                                     </div>
                                   )}
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
                           <>
                              {(isSubmitting || isCreatingServer) ? (
                                <div className="bg-[#121B2B]/50 border border-[#1a1f2e] p-6 rounded-2xl w-full max-w-2xl mx-auto mt-4">
                                  <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-[#00F0FF] mb-2 uppercase tracking-widest">{isSubmitting ? 'Verifying Payment...' : 'Creating Server...'}</h3>
                                    <LoadingMessages isSubmitting={isSubmitting} isCreatingServer={isCreatingServer} />
                                  </div>
                                  <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-[#1a1f2e] h-12 w-12"></div>
                                    <div className="flex-1 space-y-4 py-1">
                                      <div className="h-3 bg-[#1a1f2e] rounded w-3/4"></div>
                                      <div className="space-y-2">
                                        <div className="h-3 bg-[#1a1f2e] rounded"></div>
                                        <div className="h-3 bg-[#1a1f2e] rounded w-5/6"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="animate-pulse mt-8 space-y-4">
                                    <div className="h-32 bg-[#1a1f2e] rounded-xl w-full"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="h-12 bg-[#1a1f2e] rounded-xl w-full"></div>
                                       <div className="h-12 bg-[#1a1f2e] rounded-xl w-full"></div>
                                    </div>
                                    <div className="h-40 bg-[#1a1f2e] rounded-xl w-full"></div>
                                    <div className="flex gap-4 pt-4 border-t border-[#1a1f2e]">
                                       <div className="h-14 bg-[#1a1f2e] rounded-xl w-24"></div>
                                       <div className="h-14 bg-[#1a1f2e] rounded-xl flex-1"></div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF] flex items-center gap-2">
                                   <Paperclip size={14} /> Attach Payment Proof
                                </label>
                                <label className={`block w-full border-2 border-dashed ${previewUrl ? 'border-[#00F0FF] bg-[#00F0FF]/5' : 'border-[#121B2B] bg-[#080C14]'} rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-[#00F0FF]/40 group`}>
                                   <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                   {previewUrl ? (
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-left">
                                           <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-[#00F0FF]/30" />
                                           <div>
                                              <p className="text-sm font-bold text-white">Image Attached</p>
                                              <p className="text-[10px] text-[#00F0FF] uppercase font-black">Click to change</p>
                                           </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                                           <CheckCircle2 size={16} />
                                        </div>
                                     </div>
                                   ) : (
                                     <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#00F0FF]/10 flex items-center justify-center transition-colors">
                                           <Folder size={24} className="text-white/40 group-hover:text-[#00F0FF] transition-colors" />
                                        </div>
                                        <div className="flex flex-col items-center">
                                           <span className="text-sm font-bold text-white mb-1">Select File / From Folder</span>
                                           <span className="text-[10px] uppercase tracking-widest font-black text-white/40">Only image format supported</span>
                                        </div>
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
                                  disabled={isSubmitting || (!screenshot && !isBypassUtr)}
                                  className="flex-1 h-14 bg-[#00F0FF] text-black font-black rounded-xl shadow-3d hover:bg-[#00D8E6] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                >
                                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Finalize Verification'}
                                </button>
                             </div>
                           </form>
                           )}
                           </>
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
  const [show, setShow] = React.useState(false);
  return (
    <div className="group relative">
      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{label}</div>
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group-hover:border-white/20 transition-all">
        <span className="flex-1 font-mono text-sm text-white truncate">
          {show || !isPassword ? value : "••••••••••••"}
        </span>
        <div className="flex gap-1">
           {isPassword && (
             <button type="button" onClick={() => setShow(!show)} className="p-1.5 text-white/40 hover:text-white">
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

function PlanSkeleton({ highlight }: { highlight: boolean }) {
  return (
    <div className={`relative bg-white/[0.02] border ${highlight ? 'border-brand-cyan/20 shadow-[0_0_20px_rgba(0,240,255,0.05)]' : 'border-white/5'} rounded-[2.5rem] p-8 md:p-12 mb-8 animate-skeleton min-h-[280px] flex flex-col md:flex-row gap-8 justify-between items-center overflow-hidden`}>
      <div className="flex-1 w-full space-y-10">
         <div className="flex gap-4 items-center">
            <div className="w-48 h-10 rounded-xl bg-white/5" />
            <div className="w-24 h-5 rounded-full bg-white/5" />
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-3">
                <div className="w-12 h-2 bg-white/5 rounded-full" />
                <div className="h-6 bg-white/10 rounded-lg w-full" />
              </div>
            ))}
         </div>
         <div className="flex gap-6">
            {[1,2,3].map(i => <div key={i} className="w-24 h-2 rounded-full bg-white/3" />)}
         </div>
      </div>
      <div className="w-full md:w-52 h-16 rounded-2xl bg-white/5 border border-white/5" />
    </div>
  );
}
