import React, { useState, useRef } from "react";
import { PRESET_INPUTS } from "../data";
import { Text, FileText, Upload, Sparkles, Send, Sparkle, RefreshCw } from "lucide-react";
import { SentimentAnalysisResult } from "../types";

interface DocumentAnalyzerProps {
  onAnalysisComplete: (result: SentimentAnalysisResult) => void;
}

export default function DocumentAnalyzer({ onAnalysisComplete }: DocumentAnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = (idx: number) => {
    setActivePreset(idx);
    setInputText(PRESET_INPUTS[idx].text);
    setErrorMsg(null);
  };

  const clearForm = () => {
    setInputText("");
    setActivePreset(null);
    setErrorMsg(null);
  };

  // Submit plain text to our express api `/api/sentiment/analyze`
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText || inputText.trim().length === 0) {
      setErrorMsg("Lütfen analiz etmek için bir metin girin.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/sentiment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Metin analiz edilemedi.");
      }

      const result: SentimentAnalysisResult = await response.json();
      result.timestamp = new Date().toISOString();
      result.type = "Metin";
      result.textSnippet = inputText.length > 50 ? `${inputText.slice(0, 47)}...` : inputText;

      onAnalysisComplete(result);
      clearForm();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Analiz hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Drag & Drop reader for files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    // Only support text-readable files
    if (file.type && !file.type.match("text.*") && !file.name.endsWith(".txt") && !file.name.endsWith(".json")) {
      setErrorMsg("Sadece düz metin (.txt) veya JSON (.json) dosyaları yüklenebilir.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      if (fileContent && fileContent.trim().length > 0) {
        setInputText(fileContent);
        setErrorMsg(null);
        setActivePreset(null);
      } else {
        setErrorMsg("Yüklenen dosya boş görünüyor.");
      }
    };
    reader.readAsText(file);
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Word & character math
  const charCount = inputText.length;
  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm" id="document-analyzer-component">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#1b1c17] flex items-center gap-1.5">
          <Text className="text-[#36637e] w-5 h-5" /> Metin ve Döküman Süzgeci
        </h3>
        <p className="text-xs text-[#72787d] mt-0.5">
          Müşteri e-postaları, ürün yorumları veya şikayet metinlerini incelemek için metin kutusunu doldurun ya da dosya bırakın.
        </p>
      </div>

      {/* Preset Buttons Grid */}
      <div className="mb-4" id="preset-inputs-container">
        <span className="text-[11px] font-bold text-[#72787d] uppercase block mb-2 tracking-wider">Hızlı Örnek Senaryolar</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_INPUTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(idx)}
              className={`text-xs p-2 rounded-xl border text-left font-semibold transition-all duration-200 ${
                activePreset === idx
                  ? "bg-[#36637e] text-white border-[#36637e] shadow-xs"
                  : "bg-[#fbf9f1] text-[#1b1c17] border-[#e4e3db] hover:bg-[#f0eee6]"
              }`}
              id={`preset-btn-${idx}`}
            >
              <span className="line-clamp-1">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 mb-4 font-semibold" id="analyzer-error-msg">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Text Form & Drag Drop interface */}
      <form onSubmit={handleSubmit} className="space-y-4" id="text-analyzer-form">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 transition-all duration-200 ${
            isDragOver 
              ? "border-[#36637e] bg-[#36637e]/5" 
              : "border-dashed border-[#c1c7cd] bg-[#fbf9f1]"
          }`}
          id="text-drag-box"
        >
          {isDragOver && (
            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-xl z-10 pointer-events-none">
              <Upload className="w-10 h-10 text-[#36637e] animate-bounce mb-2" />
              <p className="text-sm font-bold text-[#36637e]">Dosyayı buraya bırakın</p>
            </div>
          )}

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setActivePreset(null);
              setErrorMsg(null);
            }}
            placeholder="Bir geri bildirim, e-posta veya mesaj yazın (ya da bir .txt belgesini sürükleyip bu alana bırakın)..."
            className="w-full min-h-[170px] p-4 bg-transparent border-0 focus:ring-0 focus:outline-hidden text-sm text-[#1b1c17] leading-relaxed resize-y font-medium"
            id="analyzer-textarea"
          />

          {/* Counts metrics footer on card */}
          <div className="flex justify-between items-center px-4 py-2 bg-[#f0eee6]/60 border-t border-[#e4e3db] rounded-b-xl" id="text-meta-counts">
            <span className="text-[11px] text-[#72787d] font-mono">
              Karakter: <strong>{charCount}</strong> | Kelime: <strong>{wordCount}</strong>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-[#36637e] hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Dosya Yükle (.txt)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Call-to-action bar */}
        <div className="flex justify-between items-center" id="text-action-row">
          <button
            type="button"
            onClick={clearForm}
            className="bg-[#f0eee6] text-[#1b1c17] border border-[#e4e3db] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#e4e3db] transition-colors"
          >
            Temizle
          </button>
          
          <button
            type="submit"
            disabled={isLoading || inputText.trim().length === 0}
            className="bg-[#36637e] text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1b4b65] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            id="submit-analysis-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analiz Başlatıldı...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Metni İncele</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
