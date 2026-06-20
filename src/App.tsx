import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  SAMPLE_ANALYSES 
} from "./data";
import { SentimentAnalysisResult } from "./types";
import SentimentCharts from "./components/SentimentCharts";
import SentimentStats from "./components/SentimentStats";
import AudioAnalyzer from "./components/AudioAnalyzer";
import DocumentAnalyzer from "./components/DocumentAnalyzer";
import SmartResponse from "./components/SmartResponse";
import { 
  LayoutDashboard, 
  FileText, 
  Volume2, 
  BrainCircuit, 
  Compass, 
  Sparkle, 
  CheckCircle2, 
  History,
  Activity,
  Play,
  MonitorPlay,
  ExternalLink,
  Upload,
  ChevronRight,
  Info,
  ListTodo,
  FileVideo,
  Sparkles,
  Home,
  Menu,
  Briefcase,
  X
} from "lucide-react";

export default function App() {
  // Navigation & Data States
  const [history, setHistory] = useState<SentimentAnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "text" | "audio">("dashboard");
  const [sidebarTab, setSidebarTab] = useState<"portal" | "video" | "presentation" | "commercial">("portal");
  const [selectedResult, setSelectedResult] = useState<SentimentAnalysisResult | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Video Player States
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [videoPlaySpeed, setVideoPlaySpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Populate list history with rich, premade Turkish analyses on mount
  useEffect(() => {
    setHistory(SAMPLE_ANALYSES);
    setSelectedResult(SAMPLE_ANALYSES[0]); // Select first item as default visual
    
    // Dynamic Clock in exact localized format
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("tr-TR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Callback to append new analyzed items to the session history log
  const handleAddNewAnalysis = (result: SentimentAnalysisResult) => {
    setHistory((prev) => [result, ...prev]);
    setSelectedResult(result);
    setActiveTab("dashboard"); // Go back and center on dashboard view plot!
    setSidebarTab("portal"); // Switch to portal view automatically
  };

  const handleSelectSample = (item: SentimentAnalysisResult) => {
    setSelectedResult(item);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    setVideoPlaySpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const activeResult = selectedResult || history[0] || null;

  return (
    <div className="min-h-screen bg-[#fbf9f1] flex flex-col md:flex-row text-[#1b1c17] font-sans" id="master-app-wrapper">
      
      {/* 2. Responsive Side Panel Menu (Matching Sleek Theme) */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#f0eee6] border-r border-[#e4e3db] flex flex-col justify-between transition-transform duration-300 transform md:transform-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`} 
        id="theme-sidebar-navigation"
      >
        <div className="p-6">
          {/* Sidebar Logo & Branding Block */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-[#36637e]">
              <div className="w-9 h-9 bg-[#36637e] rounded-xl flex items-center justify-center text-white">
                <BrainCircuit className="w-5.2 h-5.2" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-[#1b1c17]">DuyguAnaliz</span>
                <p className="text-[10px] text-[#72787d] font-bold uppercase tracking-wider block">Portalı v3.5</p>
              </div>
            </div>
            {/* Close Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="md:hidden text-[#72787d] hover:text-[#1b1c17] p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <p className="text-[10px] font-bold text-[#72787d] uppercase tracking-widest mb-3 pl-1">Menü & Sekmeler</p>
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setSidebarTab("portal");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                sidebarTab === "portal"
                  ? "bg-[#36637e] text-white shadow-sm"
                  : "text-[#72787d] hover:bg-[#eae8e0] hover:text-[#1b1c17]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4.5 h-4.5" />
                <span>Ana Ekran</span>
              </div>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">Aktif</span>
            </button>

            <button
              onClick={() => {
                setSidebarTab("video");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                sidebarTab === "video"
                  ? "bg-[#36637e] text-white shadow-sm"
                  : "text-[#72787d] hover:bg-[#eae8e0] hover:text-[#1b1c17]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileVideo className="w-4.5 h-4.5" />
                <span>Tanıtım Videosu</span>
              </div>
              {uploadedVideoUrl ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <span className="text-[9px] bg-[#36637e]/10 text-[#36637e] px-1.5 py-0.5 rounded font-bold">1</span>
              )}
            </button>

            <button
              onClick={() => {
                setSidebarTab("presentation");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                sidebarTab === "presentation"
                  ? "bg-[#36637e] text-white shadow-sm"
                  : "text-[#72787d] hover:bg-[#eae8e0] hover:text-[#1b1c17]"
              }`}
            >
              <div className="flex items-center gap-3">
                <MonitorPlay className="w-4.5 h-4.5" />
                <span>Proje Sunumu</span>
              </div>
              <span className="text-[9px] bg-amber-600/10 text-amber-700 px-1.5 py-0.5 rounded font-bold">Canva</span>
            </button>

            <button
              onClick={() => {
                setSidebarTab("commercial");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                sidebarTab === "commercial"
                  ? "bg-[#36637e] text-white shadow-sm"
                  : "text-[#72787d] hover:bg-[#eae8e0] hover:text-[#1b1c17]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4.5 h-4.5" />
                <span>Ticari Sunum</span>
              </div>
              <span className="text-[9px] bg-sky-600/10 text-sky-700 px-1.5 py-0.5 rounded font-bold">Gamma</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Info Banner at Footer */}
        <div className="p-6">
          <div className="bg-[#e4e3db] rounded-xl p-4 border border-[#dcdad2] shadow-xs">
            <p className="text-[10px] font-extrabold text-[#36637e] uppercase tracking-widest mb-1">PRO ENTEGRASYON</p>
            <p className="text-xs text-[#72787d] leading-relaxed mb-3">
              Müşteri hizmetleri ve çağrı kayıtları için tam otomatik analiz akışı hazırlandı.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1b1c17]">
              <span>Güvenli AI Bağlantısı</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
        </div>
      </aside>

      {/* Background Overlay for Mobile Sidebar */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0" id="master-content-pane">
        
        {/* Top Header Bar */}
        <header className="h-18 bg-white border-b border-[#e4e3db] flex items-center justify-between px-4 sm:px-8 shadow-xs sticky top-0 z-30" id="global-header-bar">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#f0eee6] text-[#1b1c17] active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#72787d] uppercase tracking-widest hidden sm:block">Duygu Analizörü</span>
              <span className="text-[#e4e3db] hidden sm:block">/</span>
              <h2 className="text-sm sm:text-base font-bold text-[#1b1c17]">
                {sidebarTab === "portal" && "Müşteri Geri Bildirim Analizi"}
                {sidebarTab === "video" && "Tanıtım Videosu ve Özellik İncelemesi"}
                {sidebarTab === "presentation" && "Proje Tanıtım Sunumu (Canva)"}
                {sidebarTab === "commercial" && "Ticari Sunum (Gamma)"}
              </h2>
            </div>
          </div>

          {/* Right Header Status Widgets */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#fbf9f1] px-3 py-1.5 rounded-lg border border-[#e4e3db]" id="clock-container">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-[#1b1c17]">{currentTime || "11:58:10"}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#092009] bg-[#cdebc5]/60 border border-[#b1cfaa] px-2.5 py-1 rounded-full font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4b6547]" />
              <span>Sistem Aktif (Gemini Secure API)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Stage */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto" id="dynamic-inner-stage">
          
          <AnimatePresence mode="wait">
            {/* TAB 1: ANA EKRAN PORTALI */}
            {sidebarTab === "portal" && (
              <motion.div
                key="portal-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Embedded Navbar for Portal sub-tabs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e4e3db] pb-4 gap-4" id="view-tabs-navigation">
                  <div className="flex gap-2 p-1 bg-[#f0eee6] rounded-xl border border-[#e4e3db]" id="navigation-btn-group">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                        activeTab === "dashboard"
                          ? "bg-[#36637e] text-white shadow-xs"
                          : "text-[#72787d] hover:bg-white/80 hover:text-[#1b1c17]"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Panel & İnceleme Geçmişi</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("text")}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                        activeTab === "text"
                          ? "bg-[#36637e] text-white shadow-xs"
                          : "text-[#72787d] hover:bg-white/80 hover:text-[#1b1c17]"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Metin & Döküman İncele</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("audio")}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                        activeTab === "audio"
                          ? "bg-[#36637e] text-white shadow-xs"
                          : "text-[#72787d] hover:bg-white/80 hover:text-[#1b1c17]"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Ses & Konuşma Analizi</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#72787d]" id="tracker-summary-header">
                    <Compass className="w-4 h-4 text-[#815252]" />
                    <span>Aktif İnceleme: <strong className="text-[#1b1c17]">{activeResult ? activeResult.sentiment : "Yok"}</strong></span>
                  </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-dynamic-layout">
                  
                  {/* Left Column: Interactive analytics tools & history */}
                  <div className="lg:col-span-8 space-y-6" id="working-module-area">
                    <AnimatePresence mode="wait">
                      {activeTab === "dashboard" && (
                        <motion.div
                          key="dashboard-sub-view"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SentimentStats 
                            history={history} 
                            onSelectSample={handleSelectSample} 
                            activeResultID={activeResult?.timestamp} 
                          />
                        </motion.div>
                      )}

                      {activeTab === "text" && (
                        <motion.div
                          key="text-sub-view"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DocumentAnalyzer onAnalysisComplete={handleAddNewAnalysis} />
                        </motion.div>
                      )}

                      {activeTab === "audio" && (
                        <motion.div
                          key="audio-sub-view"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AudioAnalyzer onAnalysisComplete={handleAddNewAnalysis} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Visualization details & AI Co-pilot */}
                  <div className="lg:col-span-4 space-y-6" id="selected-entity-visualizer-sidebar">
                    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm" id="side-charts-box">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e4e3db]" id="side-charts-header">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#36637e] animate-ping" />
                          <h3 className="font-extrabold text-sm text-[#1b1c17]">Detaylı Karar Hücresi</h3>
                        </div>
                        {activeResult && (
                          <span className="text-[10px] font-mono font-bold bg-[#1b1c17] text-white px-2 py-0.5 rounded-md">
                            {activeResult.type} Analizi
                          </span>
                        )}
                      </div>

                      {activeResult ? (
                        <div className="space-y-6" id="active-plotting-block">
                          <SentimentCharts currentResult={activeResult} history={history} />
                          
                          {/* Embedded Input Transcript review block */}
                          <div className="bg-[#fbf9f1] rounded-xl p-4 border border-[#e4e3db]" id="transcript-quote-box">
                            <h5 className="text-xs font-bold text-[#1b1c17] flex items-center gap-1 mb-1.5">
                              <History className="w-3.5 h-3.5" /> Analiz Edilen Kayıt İncelemesi
                            </h5>
                            <p className="text-xs text-[#72787d] leading-relaxed max-h-[140px] overflow-y-auto pr-1 whitespace-pre-wrap font-medium">
                              "{activeResult.transcription}"
                            </p>
                          </div>

                          <SmartResponse currentResult={activeResult} />
                        </div>
                      ) : (
                        <div className="py-20 text-center text-[#72787d]" id="no-active-detail-fallback">
                          <p className="text-sm">Analiz sonuçları burada dinamik olarak grafiklerle canlandırılacaktır.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 2: TANITIM VİDEOSU SEKMESİ */}
            {sidebarTab === "video" && (
              <motion.div
                key="video-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Main Video Screen (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Dynamic Custom Video Frame Player Container */}
                  <div className="bg-white rounded-2xl border border-[#e4e3db] p-4 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <h3 className="font-bold text-base text-[#1b1c17]">Duygu Analizörü Tanıtım & Sunum Videosu</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#cdebc5] text-[#092009] px-2 py-0.5 rounded">
                          MP4 Player
                        </span>
                      </div>
                    </div>

                    {/* Styled Player Viewport */}
                    <div className="w-full aspect-video bg-[#1b1c17] rounded-xl overflow-hidden relative group flex flex-col justify-center items-center">
                      {uploadedVideoUrl ? (
                        <video 
                          ref={videoRef}
                          src={uploadedVideoUrl} 
                          controls
                          className="w-full h-full object-contain"
                          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                        />
                      ) : (
                        /* Placeholder when no local video is uploaded */
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-radial from-[#36637e]/30 to-[#1b1c17]">
                          
                          {/* Visual mockup overlapping like in presentation frames */}
                          <div className="w-24 h-16 bg-[#36637e] rounded-xl flex items-center justify-center text-white mb-4 animate-bounce shrink-0 shadow-lg">
                            <Play className="w-10 h-10 fill-white ml-1" />
                          </div>

                          <h4 className="text-white font-extrabold text-lg mb-1 tracking-tight">Tanıtım Videonuzu Buraya Sürükleyin veya Seçin</h4>
                          <p className="text-white/60 text-xs max-w-sm mb-4">
                            Konuşmacının ve arayüz animasyonlarının bulunduğu tanıtım videonuzu playera yükleyerek bu alanda doğrudan oynatabilirsiniz.
                          </p>

                          {/* Quick File Selection Button */}
                          <label className="bg-[#36637e] hover:bg-[#2b4f65] text-white text-xs font-bold py-2.5 px-5 rounded-lg cursor-pointer transition-all flex items-center gap-2 shadow-md">
                            <Upload className="w-4 h-4" /> Tanıtım Videosunu Seç
                            <input 
                              type="file" 
                              accept="video/*" 
                              onChange={handleVideoUpload} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                      )}

                      {/* Video speed controller overlays (renders only when video loaded) */}
                      {uploadedVideoUrl && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-2 text-[10px] text-white font-mono z-10 transition-opacity">
                          <button onClick={() => setPlaybackSpeed(0.75)} className={`hover:text-amber-400 ${videoPlaySpeed === 0.75 ? "text-amber-400 font-bold" : ""}`}>0.75x</button>
                          <span>•</span>
                          <button onClick={() => setPlaybackSpeed(1)} className={`hover:text-amber-400 ${videoPlaySpeed === 1 ? "text-amber-400 font-bold" : "text-white/80"}`}>1.0x</button>
                          <span>•</span>
                          <button onClick={() => setPlaybackSpeed(1.5)} className={`hover:text-amber-400 ${videoPlaySpeed === 1.5 ? "text-amber-400 font-bold" : "text-white/80"}`}>1.5x</button>
                          <span>•</span>
                          <button onClick={() => setPlaybackSpeed(2)} className={`hover:text-amber-400 ${videoPlaySpeed === 2 ? "text-amber-400 font-bold" : "text-white/80"}`}>2x</button>
                        </div>
                      )}
                    </div>

                    {/* Local info banner below the media screen */}
                    <div className="mt-4 p-4 bg-[#fbf9f1] border border-[#e4e3db] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#36637e]" />
                        <span className="text-xs text-[#72787d] font-bold">
                          {uploadedVideoUrl ? "✓ Video Başarıyla Yüklendi" : "💡 İpucu: Mikrofon ve demo ekran özelliklerini anlatan sunum videonuzu seçebilirsiniz."}
                        </span>
                      </div>
                      {uploadedVideoUrl && (
                        <button 
                          onClick={() => setUploadedVideoUrl(null)} 
                          className="text-[10px] text-[#ba1a1a] hover:underline font-bold"
                        >
                          Videoyu Kaldır / Yenisini Seç
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Highlights and system specs from video */}
                  <div className="bg-white rounded-2xl border border-[#e4e3db] p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> Videodaki Öne Çıkan Sistem Yenilikleri
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold bg-[#36637e]/10 text-[#36637e] w-6 h-6 rounded-full flex items-center justify-center">1</span>
                          <h4 className="font-bold text-sm">Ultra-Hassas Tonlama Tespiti</h4>
                        </div>
                        <p className="text-xs text-[#72787d] leading-relaxed">
                          Saniyede 60 framelik dalga analizi frekansıyla, konuşanın ses tonundaki duyguyu (pozitif, negatif, heyecanlı, stresli) anında ayrıştırır.
                        </p>
                      </div>

                      <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold bg-[#36637e]/10 text-[#36637e] w-6 h-6 rounded-full flex items-center justify-center">2</span>
                          <h4 className="font-bold text-sm">Doğal Dil Kelime Duyarlılığı</h4>
                        </div>
                        <p className="text-xs text-[#72787d] leading-relaxed">
                          Türkçe dökümanlar ve müşteri e-postalarındaki gizli imaları, ironiyi ve memnuniyet seviyelerini akıllıca skorlar.
                        </p>
                      </div>

                      <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold bg-[#36637e]/10 text-[#36637e] w-6 h-6 rounded-full flex items-center justify-center">3</span>
                          <h4 className="font-bold text-sm">Akıllı Co-Pilot Cevap Üretici</h4>
                        </div>
                        <p className="text-xs text-[#72787d] leading-relaxed">
                          Tespit edilen problem seviyesine göre empatik, resmi veya doğrudan çözüm odaklı yanıt taslakları hazırlar ve kopyalatır.
                        </p>
                      </div>

                      <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold bg-[#36637e]/10 text-[#36637e] w-6 h-6 rounded-full flex items-center justify-center">4</span>
                          <h4 className="font-bold text-sm">Tarihsel Trend Raporlama</h4>
                        </div>
                        <p className="text-xs text-[#72787d] leading-relaxed">
                          Müşteri ilişkileri ekibinin performans trendlerini, ortalama memnuniyet değişim grafiklerini gerçek zamanlı günceller.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Video Playback Sidebar details (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Video Presentation Info Sheet */}
                  <div className="bg-[#f0eee6] rounded-2xl p-6 border border-[#e4e3db] shadow-xs">
                    <div className="text-xs font-bold text-[#36637e] uppercase tracking-wider mb-1.5">SUNUM DETAYLARI</div>
                    <h3 className="font-bold text-lg text-[#1b1c17] mb-2">Video Akış Planı</h3>
                    <p className="text-xs text-[#72787d] leading-relaxed mb-4">
                      Tanıtım videosu boyunca analiz edilen ekranın tasarım evreleri ve teknik detayları adım adım ele alınmaktadır:
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white/90 rounded-xl p-3 border border-white flex justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#1b1c17]">Giriş & Motivasyon</p>
                          <p className="text-[11px] text-[#72787d]">Neden müşteri duygu analizi?</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#36637e]">00:00</span>
                      </div>

                      <div className="bg-white/90 rounded-xl p-3 border border-white flex justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#1b1c17]">Uygulama Arayüz Tasarımı</p>
                          <p className="text-[11px] text-[#72787d] italic">Sleek, minimalist ve modern çizgiler</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#36637e]">00:01</span>
                      </div>

                      <div className="bg-white/90 rounded-xl p-3 border border-white flex justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#1b1c17]">Canlı Ses Analiz Demo</p>
                          <p className="text-[11px] text-[#72787d]">Mikrofon frekans ve metin algısı</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#36637e]">00:03</span>
                      </div>

                      <div className="bg-white/90 rounded-xl p-3 border border-white flex justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-[#1b1c17]">Co-Pilot Akıllı Cevap Algoritması</p>
                          <p className="text-[11px] text-[#72787d]">Geri bildirime göre otomatik şablon</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#36637e]">00:05</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSidebarTab("portal")}
                      className="w-full mt-5 py-2.5 bg-[#36637e] text-white rounded-xl text-xs font-bold hover:bg-[#1b4b65] transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      Ana Ekranı Keşfetmeye Başla <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick video spec specs */}
                  <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm">
                    <h4 className="font-bold text-xs text-[#1b1c17] uppercase tracking-wider mb-2">Video Kalitesi</h4>
                    <p className="text-xs text-[#72787d] leading-relaxed mb-4">
                      Sistem 4K Ultra-HD çözünürlükteki sunum ve ses senkronizasyonunu destekler.
                    </p>
                    <div className="text-[10px] font-mono text-[#72787d] space-y-1">
                      <div>• Çözünürlük: MP4 H.264 / WebM</div>
                      <div>• Ses: Stereo AAC formatı</div>
                      <div>• Uyumluluk: Tüm modern tarayıcılar</div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: PROJE SUNUMU (CANVA) SEKMESİ */}
            {sidebarTab === "presentation" && (
              <motion.div
                key="presentation-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* Canva main layout header card */}
                <div className="bg-white rounded-2xl border border-[#e4e3db] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1b1c17]">Canva Sunum Platform Entegrasyonu</h3>
                    <p className="text-xs text-[#72787d] mt-1">
                      Projenin fikir aşamasından kodlama tamamlama sürecine kadarki yolculuğu içeren güncel Canva slayt dosyası.
                    </p>
                  </div>
                  <a 
                    href="https://canva.link/r6csl3xqvli356x" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer" 
                    className="bg-[#36637e] hover:bg-[#1b4b65] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-sm"
                  >
                    <span>Sunumu Yeni Sekmede Aç</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Canva Presentation Slide Sandbox and backup visual panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Presentation Frame (8 Cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-[#e4e3db] p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-[#72787d] uppercase tracking-widest block">SLAYT GÖRÜNTÜLEYİCİ</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      </div>

                      {/* We embed Canva via standard design embed layout */}
                      <div className="w-full aspect-video bg-[#fbf9f1] rounded-xl overflow-hidden border border-[#e4e3db] relative">
                        <iframe 
                          src="https://canva.link/r6csl3xqvli356x"
                          title="Canva Proje Sunumu Slaytları"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                        />
                        {/* Overlay with advice in case Canva restricts standard preview within frame-ancestors block */}
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                      </div>

                      {/* Advice capsule */}
                      <p className="text-[11px] text-[#72787d] mt-3 leading-relaxed text-center">
                        * Tarayıcınız Canva'nın çerçeve içi yüklemesini kısıtlarsa, yukarıdaki <strong>"Sunumu Yeni Sekmede Aç"</strong> butonunu kullanarak slaytlara kusursuzca erişebilirsiniz.
                      </p>
                    </div>

                    {/* Slides outline contents (bento layout) */}
                    <div className="bg-white rounded-2xl border border-[#e4e3db] p-6 shadow-sm">
                      <h4 className="font-bold text-sm text-[#1b1c17] mb-4 flex items-center gap-1.5">
                        <ListTodo className="w-4.5 h-4.5 text-[#36637e]" /> Proje Sunumu Slayt İçerikleri Özeti
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[10px] font-bold text-[#72787d] uppercase block mb-1">BÖLÜM 1</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1.5">Problem & Fikir</h5>
                          <p className="text-[11px] text-[#72787d] leading-relaxed">
                            Müşteri merkezli iletişimde ses tonlamalarındaki duygusal anomalilerin tespiti ve hızlı müdahale kurgusu.
                          </p>
                        </div>

                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[10px] font-bold text-[#72787d] uppercase block mb-1">BÖLÜM 2</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1.5">Mimari & AI Altyapısı</h5>
                          <p className="text-[11px] text-[#72787d] leading-relaxed">
                            V3.5 Flash modeliyle entegre Türkçe duygu modeli analizi, tonlama matrisi ve spektral dağılım.
                          </p>
                        </div>

                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[10px] font-bold text-[#72787d] uppercase block mb-1">BÖLÜM 3</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1.5">Sonuç & Katma Değer</h5>
                          <p className="text-[11px] text-[#72787d] leading-relaxed">
                            Ekiplerin çağrı süreçlerinde %30 tasarruf, hızlı çözüm atamaları ve yapay zeka cevap taslakları ile anında destek.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Canva Presentation Sidebar (4 Cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#f0eee6] rounded-2xl p-6 border border-[#e4e3db] shadow-xs">
                      <span className="text-[10px] font-bold text-[#36637e] uppercase tracking-wider block mb-1">BİLGİ KARTI</span>
                      <h4 className="font-bold text-base text-[#1b1c17] mb-2">Sunum Bilgileri</h4>
                      <p className="text-xs text-[#72787d] leading-relaxed mb-4">
                        Bu sunum, Duygu Analizörü platformunun işletmelere olan faydalarını, entegrasyon hiyerarşisini ve gelecek planlarını ele alır.
                      </p>

                      <div className="space-y-2 text-xs font-semibold text-[#1b1c17]" id="sunum-labels">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4b6547]" />
                          <span>Proje Adı: Duygu Analizörü v3.5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4b6547]" />
                          <span>Slayt Sayısı: 8 Premium Tasarım</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4b6547]" />
                          <span>Çözünürlük: Aspect Ratio 16:9</span>
                        </div>
                      </div>

                      <div className="border-t border-[#e4e3db] pt-4 mt-5">
                        <p className="text-xs text-[#72787d] italic leading-relaxed">
                          💬 "Doğru duygu analizi, doğru müşteri bağı sağlar." tagline'lı detaylar bu sunumda anlatılmaktadır.
                        </p>
                      </div>
                    </div>

                    {/* Useful links panel */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm">
                      <h4 className="font-extrabold text-xs text-[#1b1c17] uppercase tracking-wider mb-2">Klavye Kısayolları</h4>
                      <p className="text-xs text-[#72787d] leading-relaxed mb-3">
                        Canva üzerinde gezinirken daha rahat sunmak için kullanabileceğiniz standart komutlar:
                      </p>
                      <ul className="text-xs text-[#72787d] space-y-1 font-mono">
                        <li>• Boşluk / Sağ Yön: Sonraki Slayt</li>
                        <li>• Sol Yön: Önceki Slayt</li>
                        <li>• F: Tam Ekran Modu</li>
                      </ul>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 4: TİCARİ SUNUM (GAMMA DOCUMENT) SEKMESİ */}
            {sidebarTab === "commercial" && (
              <motion.div
                key="commercial-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* Gamma main layout header card */}
                <div className="bg-white rounded-2xl border border-[#e4e3db] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1b1c17]">Ticari Sunum ve Pazar Uygunluğu</h3>
                    <p className="text-xs text-[#72787d] mt-1">
                      Uygulamanın ticari potansiyeli, hedef kitlesi ve pazardaki büyüme planlarını içeren Gamma dökümanı.
                    </p>
                  </div>
                  <a 
                    href="https://gamma.app/docs/Duygu-Analizi-Platformu-ofqrfebi980al3r?mode=doc" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer" 
                    className="bg-[#36637e] hover:bg-[#1b4b65] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-sm"
                  >
                    <span>Ticari Sunumu Yeni Sekmede Aç</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Gamma Presentation Sandbox & custom statistics cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Gamma Document Frame (8 Cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-[#e4e3db] p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-[#72787d] uppercase tracking-widest block">INTERAKTIF BELGE GÖRÜNTÜLEYİCİ</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      {/* Embed the Gamma document in an iframe */}
                      <div className="w-full aspect-video bg-[#fbf9f1] rounded-xl overflow-hidden border border-[#e4e3db] relative">
                        <iframe 
                          src="https://gamma.app/docs/Duygu-Analizi-Platformu-ofqrfebi980al3r?mode=doc"
                          title="Duygu Analizi Platformu Ticari Sunumu"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                      </div>

                      {/* Advice capsule */}
                      <p className="text-[11px] text-[#72787d] mt-3 leading-relaxed text-center">
                        * Gamma platformu çerçeve içi erişimi sınırlandırırsa, yukarıdaki <strong>"Ticari Sunumu Yeni Sekmede Aç"</strong> bağlantısıyla tam belge moduna anında ulaşabilirsiniz.
                      </p>
                    </div>

                    {/* Commercial market metrics card */}
                    <div className="bg-white rounded-2xl border border-[#e4e3db] p-6 shadow-sm">
                      <h4 className="font-bold text-sm text-[#1b1c17] mb-4 flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-amber-500" /> Platform Ticari Değeri ve Pazar Hedefleri
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[#36637e] text-lg font-black block mb-1">%34+</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1">Müşteri Memnuniyeti</h5>
                          <p className="text-[10px] text-[#72787d] leading-normal">
                            Geri bildirimlerde doğru empati ve hızlı yanıt ile sağlanan müşteri sadakati artışı.
                          </p>
                        </div>

                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[#36637e] text-lg font-black block mb-1">10 Kat</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1">Cevaplama Hızı</h5>
                          <p className="text-[10px] text-[#72787d] leading-normal">
                            AI Co-Pilot tonlama üreticisi ile şikayet veya taleplere yanıt yazma süresi kısalır.
                          </p>
                        </div>

                        <div className="p-4 bg-[#fbf9f1] rounded-xl border border-[#e4e3db]">
                          <span className="text-[#36637e] text-lg font-black block mb-1">60%</span>
                          <h5 className="font-bold text-xs text-[#1b1c17] mb-1">Maliyet Tasarrufu</h5>
                          <p className="text-[10px] text-[#72787d] leading-normal">
                            Destek biletlerinin öncelikli olarak yapay zeka süzgecinden geçirilmesiyle sağlanan operasyon tasarrufu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gamma Presentation Sidebar (4 Cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#f0eee6] rounded-2xl p-6 border border-[#e4e3db] shadow-xs">
                      <span className="text-[10px] font-bold text-[#36637e] uppercase tracking-wider block mb-1">TİCARİ FİZİBİLİTE</span>
                      <h4 className="font-bold text-base text-[#1b1c17] mb-2">Platform Fizibilitesi</h4>
                      <p className="text-xs text-[#72787d] leading-relaxed mb-4">
                        Gamma üzerinde hazırlanan ticari döküman, projenin SaaS modeli gelir kurgusunu, kurumsal entegrasyon API'larını ve genişleme stratejilerini detaylandırır.
                      </p>

                      <div className="space-y-2 text-xs font-semibold text-[#1b1c17]" id="commercial-labels">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#36637e]" />
                          <span>Gelir Modeli: SaaS / Aylık Abonelik</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#36637e]" />
                          <span>Hedef Kitle: CRM & Çağrı Merkezleri</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#36637e]" />
                          <span>Teknoloji: Google V3.5 Flash API</span>
                        </div>
                      </div>

                      <div className="border-t border-[#e4e3db] pt-4 mt-5">
                        <p className="text-xs text-[#72787d] italic leading-relaxed">
                          📈 "Pazardaki en hafif ve hızlı Türkçe duygu analiz motoru olmaya aday altyapı."
                        </p>
                      </div>
                    </div>

                    {/* Value Prop Panel */}
                    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm">
                      <h4 className="font-extrabold text-xs text-[#1b1c17] uppercase tracking-wider mb-2">Büyüme Kanalları</h4>
                      <p className="text-xs text-[#72787d] leading-relaxed mb-3">
                        Hangi platformlara kolayca entegre edilebilir?
                      </p>
                      <ul className="text-xs text-[#72787d] space-y-1 font-mono">
                        <li>• WhatsApp Business API API</li>
                        <li>• Zendesk & Salesforce CRM</li>
                        <li>• Kurumsal E-Posta İstemcileri</li>
                      </ul>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Global Footer (Matching Sleek Theme) */}
        <footer className="bg-white border-t border-[#e4e3db] py-6 px-4 sm:px-8" id="app-footer">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#72787d]">
            <div className="flex items-center gap-1.5 font-semibold">
              <Sparkle className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "3s" }} />
              <span>Yapay Zeka Destekli Türkçe Duygu Analizi Portal Tasarımı</span>
            </div>
            <div>
              <span>Google AI Studio Build &copy; 2026. Tüm hakları saklıdır.</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
