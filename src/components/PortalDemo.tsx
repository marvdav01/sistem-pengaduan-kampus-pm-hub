import React, { useState, useEffect } from "react";
import { 
  FileText, PlusCircle, CheckCircle, AlertTriangle, Clock, 
  Send, User, ShieldAlert, Users, TrendingUp, BarChart3, 
  MapPin, Image as ImageIcon, MessageSquare, Tag, Check, X,
  Building, ChevronRight, AlertCircle, Sparkles,
  Lock, Mail, Eye, EyeOff, LogOut, Key
} from "lucide-react";
import { Complaint, Comment } from "../types";
import { initialComplaints } from "../data";
import FAQChatbot from "./FAQChatbot";

interface PortalDemoProps {
  onAddLog: (action: string) => void;
}

export default function PortalDemo({ onAddLog }: PortalDemoProps) {
  // Load or set complaints state
  const [complaints, setComplaints] = useState<any[]>([]);

  const fetchComplaints = async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("sipelak_token");
      const res = await fetch("/api/complaints", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        const formatted = data.data.map((c: any) => ({
          id: `COMP-${c.id}`,
          realId: c.id,
          title: c.title,
          category: c.category?.name || "Lainnya",
          description: c.description,
          location: c.location,
          imageUrl: c.attachmentUrl ? `/${c.attachmentUrl}` : getStockImage(c.category?.name || ""),
          status: c.status === "DIAJUKAN" ? "Diajukan" : 
                    c.status === "DIVERIFIKASI" ? "Diverifikasi" :
                    c.status === "DIPROSES" ? "Diproses" :
                    c.status === "SELESAI" ? "Selesai" : "Ditolak",
          createdAt: c.createdAt,
          reporterName: c.student?.name || "Mahasiswa",
          comments: (c.comments || []).map((comm: any) => ({
             id: `comm-${comm.id}`,
             author: comm.user?.name || "User",
             role: comm.user?.role === "MAHASISWA" ? "Mahasiswa" : comm.user?.role === "ADMIN" ? "Admin" : comm.user?.role === "PETUGAS" ? "Petugas" : "Pimpinan",
             text: comm.content,
             createdAt: comm.createdAt
          })),
          priority: c.priority === "TINGGI" ? "Tinggi" : c.priority === "RENDAH" ? "Rendah" : "Sedang"
        }));
        setComplaints(formatted);
      }
    } catch (e) {
      console.error("Failed to fetch complaints", e);
    }
  };



  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("sipelak_token"));
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("sipelak_user_session");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const currentRole = currentUser?.role 
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).toLowerCase() 
    : "Mahasiswa";

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerNim, setRegisterNim] = useState("");

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("sipelak_token", data.token);
        localStorage.setItem("sipelak_user_session", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        onAddLog(`Otentikasi Berhasil: ${data.user.name} masuk sebagai ${data.user.role}`);
        if (data.user.role === "PIMPINAN") setActiveTab("dashboard");
        else setActiveTab("daftar");
        return true;
      } else {
        setLoginError(data.message || "Gagal masuk");
        return false;
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan koneksi server");
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, name: registerName })
      });
      const data = await res.json();
      if (res.ok) {
        setLoginError("");
        alert("Pendaftaran berhasil! Silakan masuk menggunakan email dan sandi Anda.");
        setIsRegisterMode(false);
        onAddLog(`Pendaftaran Baru: ${registerName}`);
      } else {
        setLoginError(data.message || "Pendaftaran gagal");
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan koneksi server");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("sipelak_token");
    localStorage.removeItem("sipelak_user_session");
    onAddLog("Pengguna keluar dari sesi (Logout).");
  };

  // Sub-tab selection for active view
  const [activeTab, setActiveTab] = useState<"daftar" | "buat" | "dashboard" | "chatbot">("daftar");
  // For viewing individual complaint details modal/thread
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Login Form input state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form State for new complaint
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Complaint["category"]>("Fasilitas");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formPriority, setFormPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");

  // Comment state
  const [commentText, setCommentText] = useState("");

  // Filter complaints list
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Load complaints from API
  useEffect(() => {
    fetchComplaints();
  }, [isLoggedIn, currentRole, activeTab]);

  // Keep details panel up to date if complaints change
  useEffect(() => {
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    }
  }, [complaints]);

  // Simulate file upload with pre-set stock placeholders depending on category
  const getStockImage = (category: string) => {
    switch (category) {
      case "IT": return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"; // Server rack/cables
      case "Fasilitas": return "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"; // Leak/Broken wall
      case "Kebersihan": return "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"; // Trash bins
      case "Keamanan": return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80"; // CCTV / Helmet area
      default: return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"; // Documents/Academic
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim() || !formLocation.trim()) {
      alert("Harap lengkapi semua bidang isian wajib!");
      return;
    }
    
    // Category mapping
    const catMap: Record<string, number> = { "IT": 1, "Fasilitas": 2, "Akademik": 3 };
    const catId = catMap[formCategory] || 2;
    
    const formData = new FormData();
    formData.append("title", formTitle);
    formData.append("description", formDescription);
    formData.append("location", formLocation);
    formData.append("categoryId", String(catId));
    formData.append("priority", formPriority.toUpperCase());
    if (formImage) {
      formData.append("attachment", formImage);
    }

    try {
      const token = localStorage.getItem("sipelak_token");
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData // sending multipart/form-data
      });
      
      if (res.ok) {
        onAddLog(`Mahasiswa membuat pengaduan baru: "${formTitle}"`);
        setFormTitle("");
        setFormDescription("");
        setFormLocation("");
        setFormImage(null);
        setFormPriority("Sedang");
        setActiveTab("daftar");
        fetchComplaints();
      } else {
        alert("Gagal membuat pengaduan.");
      }
    } catch (e) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleAddComment = async (complaintId: string) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("sipelak_token");
      const realId = complaints.find(c => c.id === complaintId)?.realId;
      if (!realId) return;

      const res = await fetch(`/api/complaints/${realId}/comments`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: commentText })
      });
      if (res.ok) {
        setCommentText("");
        fetchComplaints();
        onAddLog(`${currentRole} menambahkan komentar pada ${complaintId}`);
      }
    } catch (e) {
      alert("Gagal mengirim komentar.");
    }
  };

  const handleUpdateStatus = async (complaintId: string, newStatus: Complaint["status"]) => {
    try {
      const token = localStorage.getItem("sipelak_token");
      const realId = complaints.find(c => c.id === complaintId)?.realId;
      if (!realId) return;

      let url = `/api/complaints/${realId}/status`;
      let body: any = { status: newStatus === "Selesai" ? "SELESAI" : newStatus === "Diproses" ? "DIPROSES" : newStatus.toUpperCase() };

      if (newStatus === "Diverifikasi" || newStatus === "Ditolak") {
        url = `/api/complaints/${realId}/verify`;
        body = { status: newStatus.toUpperCase() };
      } else if (newStatus === "Diproses") {
        url = `/api/complaints/${realId}/assign`;
        // For simple demo, hardcode unit assignment to IT (1) when processed
        body = { unitId: 1 };
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchComplaints();
        onAddLog(`${currentRole} mengubah status ${complaintId} menjadi "${newStatus}"`);
      }
    } catch (e) {
      alert("Gagal memperbarui status.");
    }
  };

  // Helper colors for status badges
  const getStatusStyle = (status: Complaint["status"]) => {
    switch (status) {
      case "Diajukan": return "bg-sky-50 text-sky-700 border-sky-100";
      case "Diverifikasi": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Diproses": return "bg-amber-50 text-amber-700 border-amber-100 animate-pulse";
      case "Selesai": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Ditolak": return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  const getStatusIcon = (status: Complaint["status"]) => {
    switch (status) {
      case "Diajukan": return <FileText className="w-3.5 h-3.5 mr-1" />;
      case "Diverifikasi": return <Check className="w-3.5 h-3.5 mr-1" />;
      case "Diproses": return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "Selesai": return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      case "Ditolak": return <X className="w-3.5 h-3.5 mr-1" />;
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchCat = filterCategory === "Semua" || c.category === filterCategory;
    const matchStat = filterStatus === "Semua" || c.status === filterStatus;
    return matchCat && matchStat;
  });

  // Calculate statistics for dashboard
  const totalCount = complaints.length;
  const selesaiCount = complaints.filter(c => c.status === "Selesai").length;
  const prosesCount = complaints.filter(c => c.status === "Diproses").length;
  const diajukanCount = complaints.filter(c => c.status === "Diajukan" || c.status === "Diverifikasi").length;
  const ditolakCount = complaints.filter(c => c.status === "Ditolak").length;
  const rateSelesai = totalCount > 0 ? Math.round((selesaiCount / totalCount) * 100) : 0;

  const categoryStats = {
    IT: complaints.filter(c => c.category === "IT").length,
    Fasilitas: complaints.filter(c => c.category === "Fasilitas").length,
    Kebersihan: complaints.filter(c => c.category === "Kebersihan").length,
    Keamanan: complaints.filter(c => c.category === "Keamanan").length,
    Akademik: complaints.filter(c => c.category === "Akademik").length,
    Administrasi: complaints.filter(c => c.category === "Administrasi").length,
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch font-sans">
          
          {/* Left Column: Brand & Info */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl border border-slate-800 relative overflow-hidden min-h-[350px]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-500/15 text-teal-400 p-2.5 rounded-2xl border border-teal-500/20">
                  <Building className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold tracking-widest text-teal-400 uppercase">SIPELAK KAMPUS</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black leading-tight text-white">
                  Media Pengaduan &amp; Evaluasi Kinerja Layanan Terpusat
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menjembatani mahasiswa dengan unit kerja sarana, akademik, IT, kebersihan, dan keamanan kampus demi transparansi dan kualitas pelayanan terbaik.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 relative z-10 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Autentikasi Aman 4 Hak Akses (RBAC)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Simulasi Hash Sandi &amp; Sesi JWT</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Interaktif Dashboard Visual &amp; Ekspor</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Form & Presets */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Form Login Portal</h3>
                <p className="text-xs text-slate-500 mt-1">Silakan masukkan email institusi Anda atau gunakan opsi akun uji coba di bawah.</p>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl p-4 text-xs flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Gagal Masuk:</span> {loginError}
                  </div>
                </div>
              )}

              <form onSubmit={isRegisterMode ? handleRegister : async (e) => {
                e.preventDefault();
                if (!loginEmail.trim() || !loginPassword) {
                  setLoginError("Email dan password wajib diisi!");
                  return;
                }
                await handleLogin(loginEmail, loginPassword);
              }} className="space-y-4">
                
                {isRegisterMode && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Nama Lengkap</label>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Nama Mahasiswa"
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800"
                      />
                    </div>
                  </>
                )}
                
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Alamat Email Institusi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="nim_atau_nama@undira.ac.id"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Kata Sandi (Password)</label>
                    <span className="text-[10px] text-teal-600 hover:underline cursor-pointer font-medium">Lupa sandi?</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 placeholder-slate-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 w-4 h-4"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">Ingat saya di perangkat ini</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">v1.2-Secure</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>{isRegisterMode ? "Daftar Akun Baru" : "Verifikasi & Masuk Portal"}</span>
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-500">
                    {isRegisterMode ? "Sudah punya akun? " : "Belum punya akun? "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setLoginError("");
                    }}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer hover:underline"
                  >
                    {isRegisterMode ? "Masuk di sini" : "Daftar Mahasiswa"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Role Session */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between shadow-xl border border-slate-800 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-900 rounded-xl p-2 font-mono font-bold text-xs uppercase tracking-wider">
            SESI AKTIF
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-sm text-slate-100">{currentUser?.name || currentRole}</h4>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {currentUser?.nim ? `NIM ${currentUser.nim}` : currentUser?.unit ? `Unit: ${currentUser.unit}` : "Akses Verifikator"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Sesi Masuk sebagai <strong className="text-teal-400 font-mono">{currentRole}</strong> • {currentUser?.email || "internal@sipelak.ac.id"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block px-3 mb-2 uppercase tracking-wider">SIPELAK Menu</span>
            
            <button
              onClick={() => setActiveTab("daftar")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "daftar"
                  ? "bg-teal-50 text-teal-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Riwayat & Daftar Aduan</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-mono">
                {complaints.length}
              </span>
            </button>

            {currentRole === "Mahasiswa" && (
              <button
                onClick={() => setActiveTab("buat")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "buat"
                    ? "bg-teal-50 text-teal-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-teal-600 mr-2" />
                <span>Buat Pengaduan Baru</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-teal-50 text-teal-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-600 mr-2" />
              <span>Dashboard Kinerja Layanan</span>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "chatbot"
                  ? "bg-teal-50 text-teal-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Asisten AI (FAQ Chatbot)</span>
              </div>
              <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-bold">
                AI
              </span>
            </button>
          </div>

          {/* Quick Notice Panel */}
          <div className="bg-teal-50/50 border border-teal-100/60 rounded-2xl p-4 text-teal-900 space-y-2">
            <div className="flex items-center space-x-1.5 text-teal-800">
              <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <h5 className="font-semibold text-xs uppercase tracking-wider">Info Alur Kerja</h5>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              Mahasiswa melaporkan keluhan → Admin memverifikasi kelengkapan → Laporan didelegasikan ke Petugas Unit → Petugas memproses & menyelesaikan masalah. Pimpinan melihat performa unit secara komprehensif.
            </p>
          </div>
        </div>

        {/* Center / Right Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === "daftar" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Riwayat Pengaduan Layanan Kampus</h3>
                  <p className="text-xs text-slate-500">Gunakan filter untuk mempersempit pencarian laporan keluhan.</p>
                </div>
                {/* Search Filters */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="IT">IT & Internet</option>
                    <option value="Fasilitas">Fasilitas & Sarpras</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Diajukan">Diajukan</option>
                    <option value="Diverifikasi">Diverifikasi</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              {/* Complaints List */}
              <div className="space-y-4">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl space-y-2">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-500 font-medium">Tidak ada pengaduan yang cocok dengan filter Anda.</p>
                  </div>
                ) : (
                  filteredComplaints.map((item) => (
                    <div 
                      key={item.id} 
                      className="border border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 rounded-xl p-5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(item.status)} flex items-center`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </span>
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
                            <Tag className="w-3 h-3 mr-1 text-slate-400" />
                            {item.category}
                          </span>
                          {item.priority && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.priority === "Tinggi" ? "bg-red-50 text-red-600 border border-red-100" :
                              item.priority === "Sedang" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                              Prio: {item.priority}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base hover:text-teal-600 cursor-pointer" onClick={() => setSelectedComplaint(item)}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-medium pt-1">
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-300" />
                            {item.location}
                          </span>
                          <span className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1 text-slate-300" />
                            {item.reporterName}
                          </span>
                          <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>

                      {/* Side Actions (Depends on role) */}
                      <div className="flex flex-col items-end shrink-0 gap-2">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt="Bukti fisik" 
                            className="w-16 h-16 rounded-lg object-cover border border-slate-100 shadow-2xs" 
                          />
                        )}
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          <button 
                            onClick={() => setSelectedComplaint(item)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Detail & Diskusi ({item.comments.length})</span>
                          </button>

                          {/* Admin Quick Action */}
                          {currentRole === "Admin" && item.status === "Diajukan" && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, "Diverifikasi")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              >
                                Verifikasi
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, "Ditolak")}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {/* Admin distribute action */}
                          {currentRole === "Admin" && item.status === "Diverifikasi" && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Diproses")}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              Tugaskan Unit
                            </button>
                          )}

                          {/* Petugas Action */}
                          {currentRole === "Petugas" && item.status === "Diproses" && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Selesai")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            >
                              Tandai Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "buat" && currentRole === "Mahasiswa" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Buat Formulir Pengaduan Baru</h3>
                <p className="text-xs text-slate-500">Sampaikan keluhan Anda secara beretika, jelas, dan sertakan bukti untuk mempermudah penanganan.</p>
              </div>

              <form onSubmit={handleCreateComplaint} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Kategori Keluhan <span className="text-red-500">*</span></label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Complaint["category"])}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="Fasilitas">Fasilitas (AC, Kursi, Meja, Toilet, Gedung)</option>
                      <option value="IT">IT (WiFi, Portal Akademik, PC Lab, Server)</option>
                      <option value="Kebersihan">Kebersihan (Kantin, Selasar, Kelas, Kebun)</option>
                      <option value="Keamanan">Keamanan (Parkiran, Helm, Kasus Pencurian)</option>
                      <option value="Akademik">Akademik (Dosen, Nilai, KRS, Jadwal Kuliah)</option>
                      <option value="Administrasi">Administrasi (Loket TU, Surat Keterangan, Pembayaran)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Tingkat Urgensi <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      {(["Tinggi", "Sedang", "Rendah"] as const).map((prio) => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setFormPriority(prio)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            formPriority === prio
                              ? prio === "Tinggi" ? "bg-red-50 border-red-300 text-red-700" :
                                prio === "Sedang" ? "bg-amber-50 border-amber-300 text-amber-700" :
                                "bg-slate-100 border-slate-400 text-slate-800"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Judul Pengaduan <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: AC Bocor di Ruang Kelas 402 Gedung A"
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Lokasi Kejadian / Spesifikasi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Contoh: Gedung B Lantai 3, sebelah toilet pria"
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Deskripsi Lengkap Masalah <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tuliskan secara detail: apa masalahnya, dampaknya, serta harapan tindak lanjutnya..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Real Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Foto Bukti Fisik</label>
                  <div className="border border-dashed border-slate-200 hover:border-teal-300 rounded-xl p-6 text-center cursor-pointer hover:bg-teal-50/10 transition-all flex flex-col items-center relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      {formImage ? formImage.name : "Tarik berkas atau Klik untuk mengunggah gambar"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Unggah foto sebagai bukti pendukung untuk laporan Anda.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("daftar")}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-teal-600/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pengaduan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Bento Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Pengaduan</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">{totalCount}</span>
                    <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">100% masuk</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Selesai Ditangani</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 font-mono">{selesaiCount}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">{rateSelesai}% Rate</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Sedang Diproses</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-mono">{prosesCount}</span>
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">On Progress</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Belum Ditangani</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl md:text-3xl font-extrabold text-slate-500 font-mono">{diajukanCount}</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Queue</span>
                  </div>
                </div>
              </div>

              {/* Graphical Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Custom SVG Bar Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Distribusi Keluhan Berdasarkan Kategori</h4>
                    <p className="text-xs text-slate-400">Jumlah pengaduan terdaftar per kategori layanan.</p>
                  </div>
                  <div className="space-y-3.5 pt-2">
                    {Object.entries(categoryStats).map(([cat, count]) => {
                      const max = Math.max(...Object.values(categoryStats), 1);
                      const widthPct = (count / max) * 100;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-700">{cat}</span>
                            <span className="font-mono font-bold text-slate-900">{count} aduan</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-600 rounded-full transition-all duration-500"
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Performance Gauge & Insights */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Efektivitas Penyelesaian Laporan</h4>
                    <p className="text-xs text-slate-400">Keberhasilan penuntasan masalah dalam 1 bulan terakhir.</p>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    {/* Circle SVG Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke="#f1f5f9"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke="#0d9488"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeDashoffset={2 * Math.PI * 56 * (1 - rateSelesai / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">{rateSelesai}%</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mt-1">Selesai</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Catatan Pimpinan:</strong> Unit Kebersihan dan IT memiliki respon paling aktif minggu ini. Penanganan AC bocor (Fasilitas) memerlukan atensi tambahan karena keterbatasan teknisi internal.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chatbot" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">FAQ Chatbot (Inovasi Chatbot AI)</h3>
                <p className="text-xs text-slate-500">Gunakan asisten kecerdasan buatan berbasis Gemini AI untuk memperoleh jawaban cepat tentang pengaduan layanan kampus Anda secara mandiri.</p>
              </div>
              <FAQChatbot />
            </div>
          )}

        </div>
      </div>

      {/* Individual Complaint Thread Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-400">{selectedComplaint.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(selectedComplaint.status)}`}>
                  {selectedComplaint.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">{selectedComplaint.category}</span>
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />{selectedComplaint.location}</span>
                  <span className="flex items-center"><User className="w-3.5 h-3.5 text-slate-400 mr-1" />{selectedComplaint.reporterName}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedComplaint.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.imageUrl && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Foto Bukti Terlampir</span>
                  <img 
                    src={selectedComplaint.imageUrl} 
                    alt="Bukti fisik keluhan" 
                    className="rounded-xl w-full max-h-56 object-cover border border-slate-100 shadow-2xs" 
                  />
                </div>
              )}

              {/* Comments Thread */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linimasa & Tanggapan ({selectedComplaint.comments.length})</span>
                
                {selectedComplaint.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4 border border-dashed border-slate-200 rounded-xl">
                    Belum ada tanggapan atau aktivitas terekam.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedComplaint.comments.map((comm) => (
                      <div key={comm.id} className={`p-3 rounded-xl border ${
                        comm.role === "System" 
                          ? "bg-sky-50/40 border-sky-100 text-sky-800" 
                          : comm.role === "Admin"
                            ? "bg-purple-50/40 border-purple-100 text-purple-900"
                            : comm.role === "Petugas"
                              ? "bg-amber-50/40 border-amber-100 text-amber-900"
                              : "bg-slate-50 border-slate-100 text-slate-800"
                      }`}>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {comm.author} ({comm.role})
                          </span>
                          <span>{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{comm.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer / Comment Input */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center space-x-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Beri tanggapan sebagai ${currentRole}...`}
                className="flex-1 text-xs border border-slate-200 bg-white rounded-xl px-4 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment(selectedComplaint.id);
                }}
              />
              <button 
                onClick={() => handleAddComment(selectedComplaint.id)}
                className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all shadow-md shadow-teal-600/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
