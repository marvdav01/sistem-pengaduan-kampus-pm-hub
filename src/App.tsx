import React, { useState, useEffect } from "react";
import { Compass, Clock } from "lucide-react";
import PortalDemo from "./components/PortalDemo";

export default function App() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Dynamic real-time ticking clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) + " WIB");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-teal-500/10 selection:text-teal-900">
      
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20">
              <Compass className="w-5.5 h-5.5 text-white animate-spin-slow" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm md:text-base">SIPELAK</span>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm">V2.0</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">Sistem Pengaduan Layanan Kampus</span>
            </div>
          </div>

          {/* Quick Header Widget */}
          <div className="flex items-center space-x-4 text-right">
            <div className="hidden md:block">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Waktu Lokal Sistem</span>
              <span className="text-xs text-slate-600 font-mono font-medium flex items-center justify-end">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {currentTime}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Stage Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Mode Renderer */}
        <PortalDemo onAddLog={() => {}} />

      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <p>© 2026 SIPELAK - Sistem Informasi Pengaduan Layanan Kampus.</p>
      </footer>

    </div>
  );
}
