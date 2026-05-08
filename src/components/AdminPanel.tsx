import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Profile, PortfolioItem, Skill, Certificate, Experience, OperationType } from "../types";
import { handleFirestoreError } from "../utils/error-handler";
import { LogIn, LogOut, Plus, Trash2, Save, ChevronRight, Image as ImageIcon, Link as LinkIcon, PlusCircle, Trash, RefreshCcw, Home, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [isAdminStatus, setIsAdminStatus] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "skills" | "certs" | "experience" | "education">("profile");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("is_portfolio_admin") === "true";
    setIsAdminStatus(savedAdmin);
  }, []);

  const clearGlobalError = () => setGlobalError(null);
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    // 严格匹配您提供的账号密码
    if (email === "zzkacytm@gmail.com" && password === "zzk980824") {
      setIsAdminStatus(true);
      localStorage.setItem("is_portfolio_admin", "true");
      setIsLoggingIn(false);
    } else {
      setLoginError("账号或密码不正确。");
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAdminStatus(false);
    localStorage.removeItem("is_portfolio_admin");
  };

  if (isAdminStatus === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-bento-cyan border-t-transparent rounded-full animate-spin"></div>
          <div className="text-2xl font-display font-black animate-pulse uppercase italic tracking-tighter text-bento-dark">Initializing...</div>
        </div>
      </div>
    );
  }

  if (!isAdminStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bento-cyan/10 p-6">
        <div className="bg-white brutal-border brutal-shadow p-12 rounded-[40px] max-w-md w-full text-center">
          <div className="w-20 h-20 bg-bento-rose rounded-full mx-auto mb-8 flex items-center justify-center text-white border-4 border-bento-dark shadow-[4px_4px_0px_0px_rgba(45,48,71,1)]">
            <LogIn size={40} />
          </div>
          <h1 className="text-4xl font-display mb-8 uppercase italic tracking-tighter">Admin Access</h1>
          
          {loginError && (
            <div className="mb-6 p-4 bg-red-100 border-4 border-red-500 text-red-600 font-sans font-bold text-xs uppercase rounded-xl text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-6 text-left">
            <div>
              <label className="block font-display font-black text-sm uppercase mb-2">Account (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border-4 border-bento-dark p-4 rounded-2xl font-bold focus:outline-none focus:ring-4 ring-bento-cyan/20 transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block font-display font-black text-sm uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border-4 border-bento-dark p-4 rounded-2xl font-bold focus:outline-none focus:ring-4 ring-bento-cyan/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className={`w-full flex items-center justify-center gap-4 py-5 font-display font-black text-xl rounded-2xl border-4 border-bento-dark shadow-[8px_8px_0px_0px_rgba(45,48,71,1)] transition-all group ${
                isLoggingIn ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-bento-cyan text-bento-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
              }`}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border-2 border-transparent group-hover:border-bento-dark transition-all">
                 {isLoggingIn ? <RefreshCcw className="animate-spin text-bento-dark" /> : <LogIn className="text-bento-dark" />}
              </div>
              {isLoggingIn ? "LOGGING IN..." : "SIGN IN"}
            </button>
          </form> 

          <div className="pt-6 mt-8 border-t-4 border-bento-dark/10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 font-black uppercase text-sm tracking-widest text-bento-dark/50 hover:text-bento-dark transition-colors"
            >
              <Home size={18} />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white brutal-border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="font-display font-black text-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-dopamine-green rounded-full border-2 border-black flex items-center justify-center">🛠️</div>
          ADMIN DASHBOARD
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg hover:bg-bento-cyan transition-colors font-bold text-sm" title="Back to Home">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">HOME</span>
          </Link>
          <span className="hidden md:block font-sans font-bold opacity-60">zzkacytm@gmail.com</span>
          <button 
            onClick={handleLogout}
            className="p-2 bg-slate-100 rounded-lg hover:bg-red-100 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-6 h-6" />
          </button>
          <Link to="/" className="px-6 py-2 bg-bento-cyan font-display font-black rounded-lg border-2 border-bento-dark shadow-[4px_4px_0px_0px_rgba(45,48,71,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase italic">VIEW SITE</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence>
          {globalError && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 bg-red-100 border-4 border-red-500 p-6 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Trash2 className="text-red-500" />
                <div className="font-display font-black text-red-600 uppercase">
                  ERROR: {globalError}
                </div>
              </div>
              <button 
                onClick={clearGlobalError}
                className="p-2 hover:bg-red-200 rounded-lg transition-colors"
              >
                CLOSE
              </button>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-dopamine-green brutal-border brutal-shadow p-4 rounded-xl flex items-center gap-3"
            >
              <Save size={20} />
              <div className="font-display font-bold uppercase">{successMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "projects", label: "Projects", icon: "🚀" },
            { id: "skills", label: "Skills", icon: "💡" },
            { id: "experience", label: "Career", icon: "💼" },
            { id: "education", label: "School", icon: "🎓" },
            { id: "certs", label: "Certs", icon: "📜" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-display font-bold rounded-xl brutal-border transition-all ${
                activeTab === tab.id ? "bg-dopamine-pink text-white brutal-shadow-sm -translate-y-1" : "bg-white hover:bg-slate-100"
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white brutal-border brutal-shadow-sm rounded-3xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && <ProfileEditor key="profile" onError={setGlobalError} onSuccess={showSuccess} />}
            {activeTab === "projects" && <ListEditor key="projects" collectionPath="projects" type="project" onError={setGlobalError} onSuccess={showSuccess} />}
            {activeTab === "skills" && <ListEditor key="skills" collectionPath="skills" type="skill" onError={setGlobalError} onSuccess={showSuccess} />}
            {activeTab === "certs" && <ListEditor key="certs" collectionPath="certificates" type="cert" onError={setGlobalError} onSuccess={showSuccess} />}
            {activeTab === "experience" && <ListEditor key="experience" collectionPath="experience" type="experience" onError={setGlobalError} onSuccess={showSuccess} />}
            {activeTab === "education" && <ListEditor key="education" collectionPath="education" type="education" onError={setGlobalError} onSuccess={showSuccess} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ onError, onSuccess }: { onError: (msg: string) => void, onSuccess: (msg: string) => void }) {
  const [profile, setProfile] = useState<Profile>({ name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, "profile", "config"), (snapshot) => {
      if (snapshot.exists()) setProfile(snapshot.data() as Profile);
    }, (error) => {
      onError(error.message);
    });
  }, [onError]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "profile", "config"), profile);
      onSuccess("Profile updated!");
    } catch (error: any) {
      onError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSocial = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-display uppercase tracking-tight">Main Settings</h2>
        <button 
          onClick={save} 
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-dopamine-green font-display font-bold text-xl rounded-xl brutal-border brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="animate-spin" /> : <Save />} {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Full Name" value={profile.name} onChange={(v) => update("name", v)} />
        <Field label="Hero Tagline (e.g. DESIGN)" value={profile.tagline || ""} onChange={(v) => update("tagline", v)} />
        <Field label="Contact Email" value={profile.contactEmail || ""} onChange={(v) => update("contactEmail", v)} />
        <Field label="Contact Phone" value={profile.contactPhone || ""} onChange={(v) => update("contactPhone", v)} />
        <Field label="Location" value={profile.location || ""} onChange={(v) => update("location", v)} icon={<MapPin className="w-5 h-5"/>} />
        <Field label="Resume PDF URL" value={profile.resumeUrl || ""} onChange={(v) => update("resumeUrl", v)} icon={<LinkIcon className="w-5 h-5"/>} />
        <Field label="Mood Emojis (逗号分隔)" value={profile.moodEmojis?.join(",") || ""} onChange={(v) => update("moodEmojis", v.split(",").map(e => e.trim()))} />
        <Field label="Banner Image URL" value={profile.bannerUrl || ""} onChange={(v) => update("bannerUrl", v)} icon={<ImageIcon className="w-5 h-5"/>} />
      </div>

      <div>
        <label className="block font-display font-black text-lg mb-2 uppercase italic">About Me (Hero Section)</label>
        <textarea 
          value={profile.aboutMe || ""} 
          onChange={(e) => update("aboutMe", e.target.value)}
          className="w-full bg-slate-50 border-4 border-bento-dark p-6 rounded-[30px] min-h-[150px] font-bold text-lg focus:outline-none focus:ring-8 ring-bento-cyan/20 transition-all"
          placeholder="Detailed intro for the hero section..."
        />
      </div>

      <div className="col-span-full">
        <label className="block font-display font-black text-lg mb-2 uppercase italic">Bio (Footer Section / Brief)</label>
        <textarea 
          value={profile.bio || ""} 
          onChange={(e) => update("bio", e.target.value)}
          className="w-full bg-slate-50 border-4 border-bento-dark p-6 rounded-[30px] min-h-[120px] font-bold text-lg focus:outline-none focus:ring-8 ring-bento-rose/20 transition-all"
          placeholder="Short bio for the footer..."
        />
      </div>

      <div className="border-t-4 border-bento-dark pt-12 mt-12">
        <h3 className="text-3xl font-display font-black mb-8 uppercase italic">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Field label="WeChat ID / Link" value={profile.socialLinks?.wechat || ""} onChange={(v) => updateSocial("wechat", v)} />
          <Field label="LinkedIn URL" value={profile.socialLinks?.linkedin || ""} onChange={(v) => updateSocial("linkedin", v)} />
          <Field label="Email Address" value={profile.socialLinks?.email || ""} onChange={(v) => updateSocial("email", v)} />
          <Field label="Instagram URL" value={profile.socialLinks?.instagram || ""} onChange={(v) => updateSocial("instagram", v)} />
        </div>
      </div>
    </motion.div>
  );
}

function ListEditor({ collectionPath, type, onError, onSuccess }: { collectionPath: string, type: string, onError: (msg: string) => void, onSuccess: (msg: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [addingDoc, setAddingDoc] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionPath), orderBy("order", "asc"));
    return onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(newItems);
      
      // Initialize drafts for new items only if not already editing
      setDrafts(prev => {
        const next = { ...prev };
        newItems.forEach(item => {
          if (!next[item.id]) {
            next[item.id] = item;
          }
        });
        return next;
      });
      
      setLoading(false);
    }, (error) => {
      onError(error.message);
      setLoading(false);
    });
  }, [collectionPath, onError]);

  const add = async () => {
    if (addingDoc) return;
    setAddingDoc(true);
    
    // Calculate next order more reliably
    const maxOrder = items.reduce((max, item) => {
      const val = typeof item.order === 'number' ? item.order : parseInt(item.order) || 0;
      return Math.max(max, val);
    }, -1);
    
    const newItem: any = { order: maxOrder + 1 };
    if (type === 'project') Object.assign(newItem, { title: "New Project", description: "Project description", imageUrls: ["https://placehold.co/600x400"], category: "Web" });
    if (type === 'skill') Object.assign(newItem, { name: "New Skill", level: "Intermediate" });
    if (type === 'cert') Object.assign(newItem, { name: "New Certificate", issuer: "Issuer" });
    if (type === 'experience') Object.assign(newItem, { jobTitle: "New Role", company: "Company", period: "2024 - Present", description: "Responsibilities..." });
    if (type === 'education') Object.assign(newItem, { school: "University Name", degree: "Bachelor's", field: "Field of Study", period: "2020 - 2024", description: "Studies..." });

    try {
      await addDoc(collection(db, collectionPath), newItem);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setAddingDoc(false);
    }
  };

  const remove = async (id: string) => {
    if (deletingId !== id) {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
      return;
    }
    try {
      await deleteDoc(doc(db, collectionPath, id));
      setDeletingId(null);
      setDrafts(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error: any) {
      onError(error.message);
    }
  };

  const saveItem = async (id: string) => {
    const data = drafts[id];
    if (!data) return;
    
    setSavingIds(prev => ({ ...prev, [id]: true }));
    try {
      // Remove id from the data object before saving to Firestore
      const { id: _, ...saveData } = data;
      await updateDoc(doc(db, collectionPath, id), saveData);
      onSuccess("Item updated successfully!");
    } catch (error: any) {
      onError(error.message);
    } finally {
      setSavingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  const updateDraft = (id: string, updates: any) => {
    setDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  if (loading) return <div className="text-center font-display animate-pulse">LOADING...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-display uppercase tracking-tight">MANAGE {collectionPath}</h2>
      </div>

      <div className="space-y-12">
        {items.map((item) => {
          const draft = drafts[item.id] || item;
          const isSaving = savingIds[item.id] || false;
          const hasChanges = JSON.stringify(draft) !== JSON.stringify(item);

          return (
            <div key={item.id} className="bg-slate-50 brutal-border p-8 rounded-3xl group relative transition-all hover:bg-white">
              <div className="flex flex-col gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {type === 'project' && (
                      <>
                        <Field label="Title" value={draft.title} onChange={(v) => updateDraft(item.id, { title: v })} />
                        <Field label="Category" value={draft.category || ""} onChange={(v) => updateDraft(item.id, { category: v })} />
                        <Field label="Order" value={draft.order.toString()} onChange={(v) => updateDraft(item.id, { order: parseInt(v) || 0 })} />
                        <div className="col-span-full">
                           <Field label="Description" value={draft.description} onChange={(v) => updateDraft(item.id, { description: v })} />
                        </div>
                        <div className="col-span-full space-y-4">
                           <label className="text-sm font-display font-bold uppercase mb-2 block">Project Images (Local Upload)</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {(draft.imageUrls || []).map((url: string, imgIdx: number) => (
                                <div key={imgIdx} className="flex gap-4 items-center bg-white p-4 rounded-xl border-2 border-bento-dark shadow-sm">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-bento-dark shrink-0 bg-white">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const newUrls = draft.imageUrls.filter((_: any, idx: number) => idx !== imgIdx);
                                      updateDraft(item.id, { imageUrls: newUrls });
                                    }}
                                    className="p-3 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                                  >
                                    <Trash size={18} />
                                  </button>
                                </div>
                              ))}
                              
                              <label className="flex flex-col items-center justify-center gap-2 border-4 border-dashed border-slate-300 p-6 rounded-2xl hover:border-bento-cyan hover:bg-bento-cyan/5 transition-all cursor-pointer group">
                                <PlusCircle className="w-8 h-8 text-slate-400 group-hover:text-bento-cyan transition-colors" />
                                <span className="font-black text-[10px] uppercase italic">Add Image</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const reader = new FileReader();
                                        reader.onload = async (event) => {
                                          const img = new Image();
                                          img.src = event.target?.result as string;
                                          img.onload = () => {
                                            const canvas = document.createElement('canvas');
                                            const MAX_WIDTH = 800;
                                            const scale = Math.min(1, MAX_WIDTH / img.width);
                                            canvas.width = img.width * scale;
                                            canvas.height = img.height * scale;
                                            const ctx = canvas.getContext('2d');
                                            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                            const base64 = canvas.toDataURL('image/jpeg', 0.5);
                                            const newUrls = [...(draft.imageUrls || []), base64];
                                            updateDraft(item.id, { imageUrls: newUrls });
                                          };
                                        };
                                        reader.readAsDataURL(file);
                                      } catch (err) {
                                        console.error("Upload failed", err);
                                      }
                                    }
                                  }} 
                                />
                              </label>
                           </div>
                           <Field label="External Project Link" value={draft.link || ""} onChange={(v) => updateDraft(item.id, { link: v })} icon={<LinkIcon className="w-5 h-5" />} />
                        </div>
                      </>
                    )}
                    {type === 'skill' && (
                      <>
                        <Field label="Skill Name" value={draft.name} onChange={(v) => updateDraft(item.id, { name: v })} />
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-display font-bold uppercase">Level</label>
                          <select 
                            value={draft.level} 
                            onChange={(e) => updateDraft(item.id, { level: e.target.value })}
                            className="bg-white brutal-border p-3 rounded-lg font-sans h-[58px]"
                          >
                            {["Beginner", "Intermediate", "Advanced", "Expert"].map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        <Field label="Order" value={draft.order.toString()} onChange={(v) => updateDraft(item.id, { order: parseInt(v) || 0 })} />
                      </>
                    )}
                    {type === 'cert' && (
                      <>
                        <Field label="Name" value={draft.name} onChange={(v) => updateDraft(item.id, { name: v })} />
                        <Field label="Issuer" value={draft.issuer} onChange={(v) => updateDraft(item.id, { issuer: v })} />
                        <Field label="Order" value={draft.order.toString()} onChange={(v) => updateDraft(item.id, { order: parseInt(v) || 0 })} />
                      </>
                    )}
                    {type === 'experience' && (
                      <>
                        <Field label="Job Title" value={draft.jobTitle} onChange={(v) => updateDraft(item.id, { jobTitle: v })} />
                        <Field label="Company" value={draft.company} onChange={(v) => updateDraft(item.id, { company: v })} />
                        <Field label="Period" value={draft.period} onChange={(v) => updateDraft(item.id, { period: v })} />
                        <div className="col-span-full">
                           <label className="text-sm font-display font-bold uppercase mb-2 block">Description</label>
                           <textarea 
                             value={draft.description || ""} 
                             onChange={(e) => updateDraft(item.id, { description: e.target.value })}
                             className="w-full bg-white brutal-border p-4 rounded-xl min-h-[100px] font-bold"
                           />
                        </div>
                        <Field label="Order" value={draft.order.toString()} onChange={(v) => updateDraft(item.id, { order: parseInt(v) || 0 })} />
                      </>
                    )}
                    {type === 'education' && (
                      <>
                        <Field label="School" value={draft.school} onChange={(v) => updateDraft(item.id, { school: v })} />
                        <Field label="Degree" value={draft.degree} onChange={(v) => updateDraft(item.id, { degree: v })} />
                        <Field label="Field" value={draft.field} onChange={(v) => updateDraft(item.id, { field: v })} />
                        <Field label="Period" value={draft.period} onChange={(v) => updateDraft(item.id, { period: v })} />
                        <div className="col-span-full">
                           <label className="text-sm font-display font-bold uppercase mb-2 block">Description</label>
                           <textarea 
                             value={draft.description || ""} 
                             onChange={(e) => updateDraft(item.id, { description: e.target.value })}
                             className="w-full bg-white brutal-border p-4 rounded-xl min-h-[100px] font-bold"
                           />
                        </div>
                        <Field label="Order" value={draft.order.toString()} onChange={(v) => updateDraft(item.id, { order: parseInt(v) || 0 })} />
                      </>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-bento-dark/10">
                    <button 
                      onClick={() => saveItem(item.id)}
                      disabled={isSaving || !hasChanges}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold brutal-border brutal-shadow-sm transition-all ${
                        !hasChanges ? 'opacity-40 grayscale cursor-not-allowed' : 'bg-dopamine-green hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                      }`}
                    >
                      {isSaving ? <RefreshCcw className="animate-spin" /> : <Save />}
                      {isSaving ? "SAVING..." : hasChanges ? "SAVE ENTRY" : "NO CHANGES"}
                    </button>

                    <button 
                      onClick={() => remove(item.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold brutal-border brutal-shadow-sm transition-all ${
                        deletingId === item.id 
                          ? "bg-red-500 text-white animate-pulse" 
                          : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      <Trash size={20} />
                      {deletingId === item.id ? "CONFIRM DELETE?" : "DELETE"}
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-12">
        <button 
          onClick={add}
          disabled={addingDoc}
          className={`group flex items-center gap-4 px-12 py-5 bg-dopamine-yellow font-display font-black text-2xl rounded-2xl border-4 border-bento-dark shadow-[8px_8px_0px_0px_rgba(45,48,71,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {addingDoc ? (
            <RefreshCcw className="animate-spin" />
          ) : (
            <PlusCircle className="group-hover:rotate-90 transition-transform duration-300" />
          )}
          {addingDoc ? "ADDING..." : `ADD NEW ${type.toUpperCase()}`}
        </button>
      </div>
    </motion.div>
  );
}

function Field({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: any }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-display font-bold uppercase opacity-60">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white brutal-border p-3 rounded-lg font-sans focus:outline-none focus:ring-4 ring-dopamine-cyan/30 transition-all ${icon ? "pl-12" : ""}`}
        />
      </div>
    </div>
  );
}
