import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Settings, 
  Database, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Server,
  X,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ArrowRight,
  Square,
  CheckSquare,
  Layers,
  CheckCircle
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

type View = 'dashboard' | 'plans' | 'assets' | 'transactions';

interface Transaction {
  id: string;
  utrId: string;
  upiId: string;
  email: string;
  username: string;
  planName: string;
  date: Timestamp;
  status: 'success' | 'failed';
  reason: string;
  isVerified: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  ram: string;
  cpu: string;
  storage: string;
  throughput: string;
  ports: string;
  type: 'minecraft' | 'vps';
  highlight: boolean;
  order: number;
}

interface Asset {
  id: string;
  key: string;
  label: string;
  url: string;
}

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [isEditingPlan, setIsEditingPlan] = useState<Plan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditingAsset, setIsEditingAsset] = useState<Asset | null>(null);
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Basic counts for dashboard
      const plansSnap = await getDocs(collection(db, 'plans'));
      const assetsSnap = await getDocs(collection(db, 'assets'));
      setPlans(plansSnap.docs.map(d => ({ id: d.id, ...d.data() } as Plan)).sort((a,b) => a.order - b.order));
      setAssets(assetsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Asset)));

      if (activeView === 'transactions' || activeView === 'dashboard') {
        const transSnap = await getDocs(query(collection(db, 'transactions'), orderBy('date', 'desc')));
        setTransactions(transSnap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      ram: formData.get('ram') as string,
      cpu: formData.get('cpu') as string,
      storage: formData.get('storage') as string,
      throughput: formData.get('throughput') as string,
      ports: formData.get('ports') as string,
      type: formData.get('type') as 'minecraft' | 'vps',
      highlight: formData.get('highlight') === 'on',
      order: Number(formData.get('order')),
    };

    try {
      if (isEditingPlan) {
        await updateDoc(doc(db, 'plans', isEditingPlan.id), planData);
      } else {
        await addDoc(collection(db, 'plans'), planData);
      }
      setIsEditingPlan(null);
      setIsAddingPlan(false);
      fetchData();
    } catch (err) {
      alert("Error saving plan. Check permissions.");
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'plans', id));
      setSelectedPlanIds(prev => prev.filter(pid => pid !== id));
      fetchData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedPlanIds.length} selected plans?`)) return;
    try {
      const batch = writeBatch(db);
      selectedPlanIds.forEach((id) => {
        batch.delete(doc(db, "plans", id));
      });
      await batch.commit();
      setSelectedPlanIds([]);
      fetchData();
    } catch (err) {
      alert("Bulk delete failed.");
    }
  };

  const handleBulkHighlight = async (highlight: boolean) => {
    try {
      const batch = writeBatch(db);
      selectedPlanIds.forEach((id) => {
        batch.update(doc(db, "plans", id), { highlight });
      });
      await batch.commit();
      setSelectedPlanIds([]);
      fetchData();
    } catch (err) {
      alert("Bulk highlight failed.");
    }
  };

  const handleSaveAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assetData = {
      key: formData.get('key') as string,
      label: formData.get('label') as string,
      url: formData.get('url') as string,
    };
    
    try {
      if (isEditingAsset) {
        await updateDoc(doc(db, 'assets', isEditingAsset.id), assetData);
      } else {
        await addDoc(collection(db, 'assets'), assetData);
      }
      setIsEditingAsset(null);
      setIsAddingAsset(false);
      fetchData();
    } catch (err) {
      alert("Save failed. Check admin permissions.");
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm("Remove this asset from global config?")) return;
    try {
      await deleteDoc(doc(db, 'assets', id));
      fetchData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (!auth.currentUser) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#080C14] border-r border-[#121B2B] flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/30">
            <Settings className="text-[#00F0FF]" size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">ADMIN<span className="text-[#00F0FF]">CORE</span></span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarButton 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')}
            icon={<BarChart3 size={18} />}
            label="Dashboard"
          />
          <SidebarButton 
            active={activeView === 'plans'} 
            onClick={() => setActiveView('plans')}
            icon={<Database size={18} />}
            label="Manage Plans"
          />
          <SidebarButton 
            active={activeView === 'assets'} 
            onClick={() => setActiveView('assets')}
            icon={<ImageIcon size={18} />}
            label="Website Assets"
          />
          <SidebarButton 
            active={activeView === 'transactions'} 
            onClick={() => setActiveView('transactions')}
            icon={<RefreshCw size={18} />}
            label="Transactions"
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-[#121B2B]">
          <div className="flex items-center gap-3 mb-6 p-2 bg-white/5 rounded-lg overflow-hidden">
            <img src={auth.currentUser.photoURL || ''} className="w-8 h-8 rounded-full border border-white/10" alt="" />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate">{auth.currentUser.displayName}</span>
              <span className="text-[var(--color-text-dim)] text-[10px] truncate">{auth.currentUser.email}</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full h-11 rounded-lg border border-white/10 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
          >
            <LogOut size={16} /> Exit Panel
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-black relative overflow-y-auto p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && (
              <div>
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Systems <span className="text-[#00F0FF]">Overview</span></h1>
                    <p className="text-[var(--color-text-dim)] font-medium">Real-time infrastructure and sales intelligence.</p>
                  </div>
                  <div className="flex gap-4">
                    <StatBox label="Live Plans" value={plans.length.toString()} delta="ACTIVE" color="#00F0FF" />
                    <StatBox label="Revenue" value={`₹${transactions.filter(t => t.isVerified).length * 500}`} delta="ESTIMATED" color="#10B981" />
                    <StatBox label="Verification Rate" value={`${Math.round((transactions.filter(t => t.isVerified).length / (transactions.length || 1)) * 100)}%`} delta="AI-VERIFIED" color="#00F0FF" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 bg-[#080C14] border border-[#121B2B] rounded-3xl p-8 h-[400px] shadow-3d relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#00F0FF]" /> Order Velocity
                       </h3>
                       <div className="flex gap-2">
                          {['1H', '24H', '7D'].map(t => <button key={t} className="px-3 py-1 rounded-md text-[10px] font-black bg-white/5 border border-white/10 text-white/60 hover:text-[#00F0FF]">{t}</button>)}
                       </div>
                    </div>
                    {/* Mock Chart Area */}
                    <div className="flex-1 border-b border-l border-white/10 relative flex items-end gap-1 p-2">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-[#00F0FF]/20 rounded-t-sm group relative"
                          style={{ height: `${Math.random() * 80 + 10}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#00F0FF] text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₹{Math.floor(Math.random() * 5000)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#080C14] border border-[#121B2B] rounded-3xl p-8 flex flex-col gap-6 shadow-3d">
                    <h3 className="font-bold text-lg text-white">Recent Alerts</h3>
                    <AlertItem type="warning" title="Node IND-01 high CPU usage" time="2m ago" />
                    <AlertItem type="success" title="New VPS Enterprise upgrade" time="15m ago" />
                    <AlertItem type="error" title="Payment rejection: UTR #4829..." time="45m ago" />
                    <AlertItem type="info" title="Scheduled backup successful" time="1h ago" />
                  </div>
                </div>
              </div>
            )}

            {activeView === 'plans' && (
              <div>
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Service <span className="text-[#00F0FF]">Architecture</span></h1>
                    <p className="text-[var(--color-text-dim)] font-medium">Define, edit, and scale your hosting offerings.</p>
                  </div>
                  <div className="flex gap-4">
                    {selectedPlanIds.length > 0 && (
                      <div className="flex items-center gap-2 px-6 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-xl mr-4">
                         <span className="text-[#00F0FF] text-[10px] font-black uppercase tracking-widest">{selectedPlanIds.length} Selected</span>
                         <div className="w-px h-4 bg-[#00F0FF]/20 mx-2" />
                         <button onClick={() => handleBulkHighlight(true)} className="p-2 text-[#00F0FF] hover:bg-[#00F0FF]/20 rounded-lg transition-all" title="Highlight All">
                            <Layers size={16} />
                         </button>
                         <button onClick={() => handleBulkHighlight(false)} className="p-2 text-[var(--color-text-dim)] hover:bg-white/5 rounded-lg transition-all" title="Unhighlight All">
                            <RefreshCw size={16} />
                         </button>
                         <button onClick={handleBulkDelete} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all" title="Delete Selected">
                            <Trash2 size={16} />
                         </button>
                         <button onClick={() => setSelectedPlanIds([])} className="p-2 text-white/40 hover:text-white" title="Clear Selection">
                            <X size={16} />
                         </button>
                      </div>
                    )}
                    <button 
                      onClick={() => setIsAddingPlan(true)}
                      className="h-12 px-8 bg-[#00F0FF] text-black font-black rounded-xl hover:bg-[#00D8E6] transition-all flex items-center gap-2 uppercase tracking-tighter"
                    >
                      <Plus size={20} /> Create Plan
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {plans.map(plan => (
                    <div 
                      key={plan.id} 
                      className={`bg-[#080C14] border rounded-3xl p-6 flex flex-col shadow-3d group transition-all relative overflow-hidden ${selectedPlanIds.includes(plan.id) ? 'border-[#00F0FF] ring-1 ring-[#00F0FF]' : 'border-[#121B2B] hover:border-[#00F0FF]/30'}`}
                    >
                      {/* Selection Overlay */}
                      <button 
                        onClick={() => setSelectedPlanIds(prev => prev.includes(plan.id) ? prev.filter(id => id !== plan.id) : [...prev, plan.id])}
                        className={`absolute top-4 left-4 z-10 p-1.5 rounded-lg transition-all ${selectedPlanIds.includes(plan.id) ? 'bg-[#00F0FF] text-black' : 'bg-white/5 text-white/40 hover:text-white group-hover:opacity-100 opacity-0'}`}
                      >
                        {selectedPlanIds.includes(plan.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>

                      <div className="flex justify-between items-start mb-6 pt-2">
                        <div className="flex items-center gap-2 pl-8">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${plan.type === 'minecraft' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'}`}>
                            {plan.type}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setIsEditingPlan(plan)} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeletePlan(plan.id)} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-1 truncate">{plan.name}</h4>
                      <p className="text-[#00F0FF] font-black text-2xl mb-6">₹{plan.price}<span className="text-[var(--color-text-dim)] text-xs font-medium ml-1">/month</span></p>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-t border-[#121B2B] pt-6 mb-6">
                        <PlanDetail label="RAM" value={plan.ram} />
                        <PlanDetail label="CPU" value={plan.cpu} />
                        <PlanDetail label="DISK" value={plan.storage} />
                        <PlanDetail label="INDEX" value={plan.order} />
                      </div>

                      {plan.highlight && (
                        <div className="mt-auto bg-[#00F0FF]/10 text-[#00F0FF] text-[10px] font-black tracking-widest uppercase py-2 text-center rounded-lg border border-[#00F0FF]/25 mb-4">
                          HIGHLIGHTED PLAN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'assets' && (
              <div>
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Visual <span className="text-[#00F0FF]">Assets</span></h1>
                    <p className="text-[var(--color-text-dim)] font-medium">Control headers, banners, and media links globally.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingAsset(true)}
                    className="h-12 px-8 bg-[#00F0FF] text-black font-black rounded-xl hover:bg-[#00D8E6] transition-all flex items-center gap-2 uppercase tracking-tighter"
                  >
                    <Plus size={20} /> Add Asset
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assets.map(asset => (
                    <div key={asset.id} className="bg-[#080C14] border border-[#121B2B] rounded-3xl p-8 flex flex-col group shadow-3d h-72 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 blur-sm scale-110 -z-10 bg-no-repeat bg-cover" style={{ backgroundImage: `url(${asset.url})` }} />
                      
                      <div className="flex justify-between items-start mb-auto">
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#00F0FF] mb-1 truncate">{asset.key}</h4>
                          <h3 className="text-xl font-bold text-white truncate">{asset.label}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsEditingAsset(asset)}
                            className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="p-2 bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10 truncate font-mono text-[10px] text-[var(--color-text-dim)] flex items-center gap-3">
                        <ArrowRight size={12} className="text-[#00F0FF]" />
                        {asset.url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeView === 'transactions' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-12">
                   <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Payment <span className="text-[#00F0FF]">Ledger</span></h1>
                   <p className="text-[var(--color-text-dim)] font-medium">Audit real-time payment verifications and system logs.</p>
                </div>

                <div className="bg-[#080C14] border border-[#121B2B] rounded-3xl overflow-hidden shadow-3d">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-white/5">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Timestamp</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">User / Plan</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">UTR / UPI</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Verification Detail</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                               <td className="px-6 py-4">
                                  <div className="text-xs font-bold text-white uppercase">{t.date?.toDate().toLocaleDateString()}</div>
                                  <div className="text-[10px] text-white/40">{t.date?.toDate().toLocaleTimeString()}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="text-xs font-bold text-[#00F0FF]">{t.username}</div>
                                  <div className="text-[10px] text-white/40">{t.email}</div>
                                  <div className="mt-1 text-[10px] font-black uppercase text-white/20">{t.planName}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="text-xs font-mono text-white/80">{t.utrId}</div>
                                  <div className="text-[10px] text-white/40">{t.upiId}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${t.isVerified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                     {t.isVerified ? <Check size={8}/> : <X size={8}/>}
                                     {t.isVerified ? 'Verified' : 'Failed'}
                                  </div>
                               </td>
                               <td className="px-6 py-4 max-w-xs">
                                  <p className="text-[10px] text-white/60 leading-relaxed italic line-clamp-2">{t.reason}</p>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {(isAddingPlan || isEditingPlan) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-24 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#080C14] border border-[#121B2B] rounded-[2.5rem] p-10 overflow-y-auto max-h-full shadow-3d-lg"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white tracking-widest uppercase">
                  {isEditingPlan ? 'Edit' : 'Create'} <span className="text-[#00F0FF]">Plan</span>
                </h3>
                <button onClick={() => { setIsEditingPlan(null); setIsAddingPlan(false); }} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Plan Name" name="name" defaultValue={isEditingPlan?.name} required />
                  <Input label="Price (₹)" name="price" type="number" defaultValue={isEditingPlan?.price} required />
                  <Input label="RAM" name="ram" defaultValue={isEditingPlan?.ram} />
                  <Input label="CPU" name="cpu" defaultValue={isEditingPlan?.cpu} />
                  <Input label="Storage" name="storage" defaultValue={isEditingPlan?.storage} />
                  <Input label="Throughput" name="throughput" defaultValue={isEditingPlan?.throughput} />
                  <Input label="Ports" name="ports" defaultValue={isEditingPlan?.ports} />
                  <Input label="Display Order" name="order" type="number" defaultValue={isEditingPlan?.order || 0} />
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-dim)]">Server Type</label>
                    <select name="type" defaultValue={isEditingPlan?.type} className="w-full bg-black/40 border border-[#121B2B] rounded-xl px-4 py-3 text-white focus:border-[#00F0FF] outline-none">
                      <option value="minecraft">Minecraft</option>
                      <option value="vps">VPS</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" name="highlight" defaultChecked={isEditingPlan?.highlight} className="w-5 h-5 accent-[#00F0FF]" />
                    <label className="text-sm font-bold text-white">Highlight this plan</label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 h-14 bg-[#00F0FF] text-black font-black rounded-2xl hover:bg-[#00D8E6] transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Save size={18} /> Save Deployment
                  </button>
                  <button type="button" onClick={() => { setIsEditingPlan(null); setIsAddingPlan(false); }} className="flex-1 h-14 bg-white/5 text-white/40 font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {(isAddingAsset || isEditingAsset) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#080C14] border border-[#121B2B] rounded-[2rem] p-10 shadow-3d-lg"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white tracking-widest uppercase">
                  {isEditingAsset ? 'Edit' : 'Create'} <span className="text-[#00F0FF]">Asset</span>
                </h3>
                <button onClick={() => { setIsEditingAsset(null); setIsAddingAsset(false); }} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAsset} className="space-y-6">
                <div className="space-y-4">
                  <Input label="Asset Key (e.g. HERO_BG)" name="key" defaultValue={isEditingAsset?.key} required readOnly={!!isEditingAsset} />
                  <Input label="Label (e.g. Hero Background)" name="label" defaultValue={isEditingAsset?.label} required />
                  <Input label="Image URL" name="url" defaultValue={isEditingAsset?.url} required placeholder="https://..." />
                </div>
                
                <div className="p-4 bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-xl flex items-start gap-3">
                   <AlertTriangle size={16} className="text-[#00F0FF] mt-1 shrink-0" />
                   <p className="text-[10px] text-[var(--color-text-dim)] leading-relaxed">Ensure the link is public and high-resolution. Changes will reflect instantly for all users.</p>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 h-14 bg-[#00F0FF] text-black font-black rounded-xl hover:bg-[#00D8E6] transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Check size={18} /> {isEditingAsset ? 'Update' : 'Create'} Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`h-12 w-full flex items-center gap-4 px-4 rounded-xl font-bold text-sm transition-all ${active ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatBox({ label, value, delta, color }: { label: string; value: string; delta: string; color: string }) {
  return (
    <div className="bg-[#080C14] border border-[#121B2B] p-4 px-6 rounded-2xl flex flex-col min-w-[160px] shadow-3d">
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)] mb-1">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-black text-white">{value}</span>
        <span className="text-[10px] pb-1 font-bold" style={{ color }}>{delta}</span>
      </div>
    </div>
  );
}

function AlertItem({ type, title, time }: { type: 'success' | 'warning' | 'error' | 'info', title: string, time: string }) {
  const colors = {
    success: 'text-green-500 bg-green-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
    error: 'text-red-500 bg-red-500/10',
    info: 'text-[#00F0FF] bg-[#00F0FF]/10',
  };
  return (
    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00F0FF]/25 transition-all cursor-pointer">
      <div className={`w-2 h-2 rounded-full shrink-0 ${colors[type].split(' ')[0]}`} />
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-white/80 font-medium truncate">{title}</span>
        <span className="text-[10px] text-[var(--color-text-dim)]">{time}</span>
      </div>
    </div>
  );
}

function PlanDetail({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-wider">{label}</span>
      <span className="text-white font-bold">{value || 'N/A'}</span>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-dim)]">{label}</label>
      <input {...props} className="w-full bg-black/40 border border-[#121B2B] rounded-xl px-4 py-3 text-white focus:border-[#00F0FF] outline-none transition-colors" />
    </div>
  );
}
