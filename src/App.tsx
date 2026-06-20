import React, { useState, useEffect } from "react";
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
  Activity
} from "lucide-react";

export default function App() {
  const [history, setHistory] = useState<SentimentAnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "text" | "audio">("dashboard");
  const [selectedResult, setSelectedResult] = useState<SentimentAnalysisResult | null>(null);
  const [currentTime, setCurrentTime] = useState("");

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
  };

  const handleSelectSample = (item: SentimentAnalysisResult) => {
    setSelectedResult(item);
  };

  const activeResult = selectedResult || history[0] || null;

  return (
    <div className="min-h-screen bg-[#fbf9f1] flex flex-col justify-between font-sans" id="master-app-wrapper">
      {/* 1. Header Navigation and Logo Bar */}
      <header className="bg-white border-b border-[#e4e3db] sticky top-0 z-40 transition-all px-4 sm:px-6 py-4 shadow-xs" id="app-header-nav">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Brand/Product Identity Block */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#36637e] flex items-center justify-center text-white shadow-xs">
              <BrainCircuit className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-[#1b1c17]">Duygu Analizörü</h1>
                <span className="text-[10px] font-extrabold bg-[#4b6547] text-[#cdebc5] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  v3.5 Flash
                </span>
              </div>
              <p className="text-xs text-[#72787d]">Müşteri Geri Bildirimi & Ses Tonlama Analiz Portalı</p>
            </div>
          </div>

          {/* Quick Stats Clock and Live Connection Tracker */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#72787d]" id="dashboard-header-right">
            <div className="flex items-center gap-1.5 bg-[#fbf9f1] px-3 py-1.5 rounded-lg border border-[#e4e3db]" id="clock-container">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="font-mono text-[11px] text-[#1b1c17]">{currentTime || "11:58:10"}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#092009] bg-[#cdebc5]/60 border border-[#b1cfaa] px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4b6547]" />
              <span>Sistem Aktif (Gemini Secure API)</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8" id="primary-app-stage">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#e4e3db] pb-4 mb-6 gap-4" id="view-tabs-navigation">
          <div className="flex gap-2 p-1 bg-[#f0eee6] rounded-xl border border-[#e4e3db]" id="navigation-btn-group">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#36637e] text-white shadow-xs"
                  : "text-[#72787d] hover:bg-white/80 hover:text-[#1b1c17]"
              }`}
              id="tab-dashboard"
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
              id="tab-text"
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
              id="tab-audio"
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

        {/* 3. Main Dynamic Content Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-dynamic-layout">
          {/* Main Working Module Column (8 Cols if Dashboard, or full width dependent on active views) */}
          <div className="lg:col-span-8 space-y-6" id="working-module-area">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
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
                  key="text"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <DocumentAnalyzer onAnalysisComplete={handleAddNewAnalysis} />
                </motion.div>
              )}

              {activeTab === "audio" && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <AudioAnalyzer onAnalysisComplete={handleAddNewAnalysis} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Selected Result Visualization Column (4 Cols if Dashboard, otherwise side-by-side) */}
          <div className="lg:col-span-4 space-y-6" id="selected-entity-visualizer-sidebar">
            <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm sticky top-24" id="side-charts-box">
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
      </main>

      {/* 4. Footer credits bar */}
      <footer className="bg-white border-t border-[#e4e3db] py-6 px-4" id="app-footer">
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
  );
}
