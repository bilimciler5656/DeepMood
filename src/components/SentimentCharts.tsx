import React from "react";
import { SentimentAnalysisResult } from "../types";
import { Smile, Frown, Meh, Percent, Brain } from "lucide-react";

interface ChartsProps {
  currentResult: SentimentAnalysisResult | null;
  history: SentimentAnalysisResult[];
}

export default function SentimentCharts({ currentResult, history }: ChartsProps) {
  // Use current selected or fallback to latest in history
  const active = currentResult || history[0] || null;

  if (!active) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-[#72787d] border border-[#e4e3db]" id="no-chart-data">
        <Brain className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse text-[#36637e]" />
        <h4 className="font-semibold text-lg">Görsel Veri Hazırlanıyor</h4>
        <p className="text-sm mt-1">Lütfen analiz edilmek üzere bir metin girin veya geçmişten bir kayıt seçin.</p>
      </div>
    );
  }

  // Calculate coordinates for gauge needle (score is -1.0 to 1.0)
  // Angle goes from -90 degrees (Negative) to 90 degrees (Positive)
  const angleDeg = active.score * 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  
  // Needle coordinates on 100x100 grid centered at (50, 50)
  const needleLength = 35;
  const needleX = 50 + needleLength * Math.sin(angleRad);
  const needleY = 50 - needleLength * Math.cos(angleRad);

  // Map emotions to human labels & colors
  const emotionConfig = [
    { key: "joy", label: "Neşe / Mutluluk", color: "bg-[#4b6547] text-[#eae8e0]", barColor: "#4b6547", emoji: "😊" },
    { key: "sadness", label: "Üzüntü / Keder", color: "bg-[#36637e] text-white", barColor: "#36637e", emoji: "😢" },
    { key: "anger", label: "Öfke / Tepki", color: "bg-[#ba1a1a] text-white", barColor: "#ba1a1a", emoji: "😡" },
    { key: "fear", label: "Kaygı / Korku", color: "bg-[#815252] text-white", barColor: "#815252", emoji: "😰" },
    { key: "surprise", label: "Şaşkınlık / Merak", color: "bg-[#febfbf] text-[#331112]", barColor: "#815252", emoji: "😲" },
  ] as const;

  // Determine emoticon based on sentiment
  const getLargeEmoticon = () => {
    if (active.sentiment === "Pozitif") {
      return <Smile className="w-10 h-10 text-[#4b6547] animate-bounce" id="emoji-pozitif" />;
    } else if (active.sentiment === "Negatif") {
      return <Frown className="w-10 h-10 text-[#ba1a1a]" id="emoji-negatif" />;
    } else {
      return <Meh className="w-10 h-10 text-[#815252]" id="emoji-notr" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.1) return "text-[#4b6547]";
    if (score < -0.1) return "text-[#ba1a1a]";
    return "text-[#815252]";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sentiment-charts-grid">
      {/* Container Left: Sentiment Needle & Capsule summary */}
      <div className="bg-[#fbf9f1] rounded-2xl p-6 border border-[#e4e3db] flex flex-col justify-between" id="score-gauge-box">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#72787d] uppercase block mb-1">Duygu İndeksi</span>
          <h3 className="text-lg font-bold text-[#1b1c17]">Yoğunluk ve Derece Analizi</h3>
        </div>

        {/* Dynamic SVG Speedometer Gauge */}
        <div className="relative flex flex-col items-center justify-center my-4" id="svg-speedometer-container">
          <svg className="w-48 h-28" viewBox="0 0 100 55" id="gauge-svg">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ba1a1a" /> {/* red */}
                <stop offset="50%" stopColor="#eae8e0" /> {/* neutral grey/sand */}
                <stop offset="100%" stopColor="#4b6547" /> {/* positive green */}
              </linearGradient>
            </defs>
            
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#e4e3db"
              strokeWidth="10"
              strokeLinecap="round"
            />
            
            {/* Color Gradient Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Scale markings */}
            <line x1="50" y1="10" x2="50" y2="15" stroke="#1b1c17" strokeWidth="1" />
            <line x1="18" y1="30" x2="22" y2="33" stroke="#1b1c17" strokeWidth="1" />
            <line x1="82" y1="30" x2="78" y2="33" stroke="#1b1c17" strokeWidth="1" />

            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2={needleX}
              y2={needleY}
              stroke="#1b1c17"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Center Pin */}
            <circle cx="50" cy="50" r="5" fill="#1b1c17" />
            <circle cx="50" cy="50" r="2" fill="#fff" />
          </svg>

          {/* Value callouts */}
          <div className="text-center mt-2" id="gauge-numerical-stats">
            <div className="flex items-center justify-center gap-2">
              {getLargeEmoticon()}
              <span className={`text-2xl font-extrabold ${getScoreColor(active.score)} font-mono`}>
                {active.score > 0 ? `+${active.score.toFixed(2)}` : active.score.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-[#1b1c17] px-2 py-0.5 bg-[#eae8e0] rounded-full">
                {active.sentiment}
              </span>
              <span className="text-xs text-[#72787d]">
                Yoğunluk: <strong className="text-[#1b1c17]">{active.intensity}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Insights capsule */}
        <div className="border-t border-[#e4e3db] pt-4 mt-2" id="analyzed-summary-insight">
          <p className="text-xs text-[#72787d] font-bold mb-1">Yapay Zeka Özet Yorumu</p>
          <p className="text-sm text-[#1b1c17] leading-relaxed italic">
            "{active.summary}"
          </p>
        </div>
      </div>

      {/* Container Right: Radar/List of detailed emotional parts */}
      <div className="bg-[#fbf9f1] rounded-2xl p-6 border border-[#e4e3db] flex flex-col justify-between" id="emotions-spectrum-box">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#72787d] uppercase block mb-1">Alt Kırılımlar</span>
          <h3 className="text-lg font-bold text-[#1b1c17]">Duygusal Spektrum Seviyesi</h3>
        </div>

        <div className="space-y-3.5 my-4" id="emotions-bar-list">
          {emotionConfig.map(({ key, label, barColor, emoji }) => {
            const rawVal = active.emotions[key] || 0;
            const percent = Math.min(Math.round(rawVal * 100), 100);
            
            return (
              <div key={key} className="space-y-1" id={`emotion-row-${key}`}>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#1b1c17]">
                    <span role="img" aria-label={label}>{emoji}</span> {label}
                  </span>
                  <span className="text-[#72787d] font-mono">{percent}%</span>
                </div>
                
                {/* Visual Bar Frame */}
                <div className="h-2.5 w-full bg-[#f0eee6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Category Labels */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#e4e3db]" id="topics-and-lang-bar">
          <div className="text-xs text-[#72787d] font-bold w-full mb-1">Sınıflandırma ve Etiketler</div>
          <span className="bg-[#7da9c7]/20 text-[#1b4b65] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            🗺️ {active.detectedLanguage}
          </span>
          {active.topics.map((topic, idx) => (
            <span
              key={idx}
              className="bg-[#cdebc5] text-[#092009] text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              🏷️ {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
