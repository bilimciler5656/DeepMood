import React, { useState } from "react";
import { SentimentAnalysisResult } from "../types";
import { MessageSquareCode, Copy, Check, FileCheck, RefreshCw, Send, Sparkles } from "lucide-react";

interface SmartResponseProps {
  currentResult: SentimentAnalysisResult | null;
}

export default function SmartResponse({ currentResult }: SmartResponseProps) {
  const [copied, setCopied] = useState(false);
  const [toneMode, setToneMode] = useState<"standard" | "formal" | "empathetic" | "concise">("standard");
  const [isPolishing, setIsPolishing] = useState(false);
  const [customResponse, setCustomResponse] = useState<string | null>(null);

  if (!currentResult) return null;

  const originalResponse = currentResult.suggestedResponse;
  const activeResponse = customResponse || originalResponse;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live clientside simulation for adjusting response tone utilizing natural flow
  const handleToneAdjust = async (mode: "formal" | "empathetic" | "concise") => {
    setToneMode(mode);
    setIsPolishing(true);

    try {
      // Prompt micro-polishing on the server side using Gemini to keep keys hidden!
      const instructions = {
        formal: "Bu yanıtı daha resmi, kurumsal ve saygın bir dil kullanarak yeniden ifade et. Türkçe olsun.",
        empathetic: "Bu yanıtı çok daha cana yakın, yoğun anlayış ve empati gösteren, tatlı dilli bir üslupla yeniden ifade et. Türkçe olsun.",
        concise: "Bu yanıtı sadece can alıcı kısımları barındıracak şekilde son derece kısa ve öz bir kılavuz haline getir. Türkçe olsun."
      };

      const response = await fetch("/api/sentiment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Aşağıdaki müşteri yanıt taslağını şu kurala göre yeniden yaz:\nKural: ${instructions[mode]}\n\nTaslak:\n"${originalResponse}"`
        }),
      });

      if (!response.ok) throw new Error("Yeniden yazım başarısız.");
      
      const result = await response.json();
      setCustomResponse(result.transcription || result.summary || originalResponse);
    } catch (err) {
      // Fallback adjustments if server issue
      let fallbackText = originalResponse;
      if (mode === "formal") {
        fallbackText = `Değerli Kullanıcımız, ${originalResponse.replace("Teşekkür ederiz!", "Saygılarımızla teşekkürlerimizi sunarız.")}`;
      } else if (mode === "empathetic") {
        fallbackText = `Sizi çok iyi anlıyoruz. 🌸 ${originalResponse}`;
      } else {
        fallbackText = originalResponse.split(".")[0] + ".";
      }
      setCustomResponse(fallbackText);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleReset = () => {
    setToneMode("standard");
    setCustomResponse(null);
  };

  const isNeg = currentResult.sentiment === "Negatif";
  const isPos = currentResult.sentiment === "Pozitif";

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-xs mt-6" id="smart-response-co-pilot">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#72787d] uppercase block mb-0.5">Yapay Zeka Yardımcı Pilotu</span>
          <h3 className="text-lg font-bold text-[#1b1c17] flex items-center gap-1.5">
            <MessageSquareCode className="text-[#815252] w-5 h-5" /> Müşteri İlişkileri & Akıllı Yanıt Taslağı
          </h3>
        </div>

        {/* Tone Adjusters */}
        <div className="flex gap-1.5 overflow-x-auto" id="tone-switches">
          <button
            onClick={handleReset}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              toneMode === "standard"
                ? "bg-[#1b1c17] text-white"
                : "bg-white text-[#1b1c17] border border-[#e4e3db] hover:bg-[#f0eee6]"
            }`}
          >
            Varsayılan
          </button>
          <button
            onClick={() => handleToneAdjust("formal")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              toneMode === "formal"
                ? "bg-[#1b1c17] text-white"
                : "bg-white text-[#1b1c17] border border-[#e4e3db] hover:bg-[#f0eee6]"
            }`}
          >
            Resmi Yap
          </button>
          <button
            onClick={() => handleToneAdjust("empathetic")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              toneMode === "empathetic"
                ? "bg-[#1b1c17] text-white"
                : "bg-white text-[#1b1c17] border border-[#e4e3db] hover:bg-[#f0eee6]"
            }`}
          >
            Empatik Yap
          </button>
          <button
            onClick={() => handleToneAdjust("concise")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              toneMode === "concise"
                ? "bg-[#1b1c17] text-white"
                : "bg-white text-[#1b1c17] border border-[#e4e3db] hover:bg-[#f0eee6]"
            }`}
          >
            Özetle / Kısa Yap
          </button>
        </div>
      </div>

      <div className="bg-[#fbf9f1] rounded-xl p-5 border border-[#e4e3db] relative" id="response-text-container">
        {/* Dynamic header depending on sentiment context */}
        <div className="flex justify-between items-center mb-3 text-xs font-bold text-[#72787d]" id="draft-box-header">
          <span className="flex items-center gap-1.5 uppercase">
            {isNeg ? "🛑 Çözüm Önerili Destek Mesajı" : isPos ? "📬 Teşekkür ve Sadakat Yanıtı" : "📨 Genel Bilgilendirme Yanıtı"}
          </span>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 uppercase">
            Taslak Dökümanı
          </span>
        </div>

        {isPolishing ? (
          <div className="h-28 flex flex-col items-center justify-center text-center py-6" id="polishing-loading">
            <RefreshCw className="w-5 h-5 text-[#36637e] animate-spin mb-2" />
            <p className="text-xs text-[#72787d] font-semibold">Tonlama yeniden ayarlanıyor, lütfen bekleyin...</p>
          </div>
        ) : (
          <p className="text-sm text-[#1b1c17] leading-relaxed font-medium whitespace-pre-wrap italic">
            "{activeResponse}"
          </p>
        )}

        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-[#e4e3db]" id="response-actions">
          <button
            onClick={handleCopy}
            className="bg-[#36637e] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#1b4b65] transition-colors shadow-sm"
            id="copy-to-clipboard-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-300" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Yanıtı Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-[#72787d] mt-2 italic pl-1" id="response-co-pilot-advice">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Tavsiye: Yanıtı kopyalayıp doğrudan e-posta istemcinize veya canlı yardım alanına yapıştırabilirsiniz.</span>
      </div>
    </div>
  );
}
