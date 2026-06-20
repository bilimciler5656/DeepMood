import React from "react";
import { SentimentAnalysisResult } from "../types";
import { TrendingUp, MessageSquare, Award, ThumbsUp, HelpCircle, FileText } from "lucide-react";

interface StatsProps {
  history: SentimentAnalysisResult[];
  onSelectSample: (item: SentimentAnalysisResult) => void;
  activeResultID: string | undefined;
}

export default function SentimentStats({ history, onSelectSample, activeResultID }: StatsProps) {
  // Calculate total, averages, status ratios
  const totalCount = history.length;
  const avgScore = totalCount > 0 
    ? history.reduce((sum, item) => sum + item.score, 0) / totalCount 
    : 0;

  const sentimentCount = history.reduce(
    (acc, item) => {
      if (item.sentiment === "Pozitif") acc.positive++;
      else if (item.sentiment === "Negatif") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Extract all topics and count occurrences
  const topicCounts = history.reduce((acc, item) => {
    item.topics.forEach((t) => {
      acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  // Visual class helpers
  const getScoreDirectionLabel = (score: number) => {
    if (score > 0.1) return "Genel Durum Pozitif (Olumlu)";
    if (score < -0.1) return "Genel Durum Negatif (Düzeltme Gerekli)";
    return "Dengeli / Nötr Duygu Hakim";
  };

  const getScoreBg = (score: number) => {
    if (score > 0.1) return "bg-[#cdebc5]/50 border-[#b1cfaa]";
    if (score < -0.1) return "bg-red-50 border-red-200";
    return "bg-amber-50 border-amber-200";
  };

  return (
    <div className="space-y-6" id="sentiment-stats-section">
      {/* 1. Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="stat-cards-row">
        {/* Card: Total Analyzed */}
        <div className="bg-white rounded-2xl p-5 border border-[#e4e3db] shadow-sm flex items-center gap-4" id="stat-card-total-analyzed">
          <div className="w-12 h-12 rounded-xl bg-[#36637e]/10 flex items-center justify-center text-[#36637e]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#72787d] font-bold uppercase tracking-wider block">Toplam İnceleme</span>
            <span className="text-2xl font-extrabold text-[#1b1c17] font-mono">{totalCount} Adet</span>
            <span className="text-[11px] text-[#72787d] block mt-0.5">Metin & Ses kayıtları</span>
          </div>
        </div>

        {/* Card: Avg Net Score */}
        <div className="bg-white rounded-2xl p-5 border border-[#e4e3db] shadow-sm flex items-center gap-4" id="stat-card-average-index">
          <div className="w-12 h-12 rounded-xl bg-[#4b6547]/10 flex items-center justify-center text-[#4b6547]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#72787d] font-bold uppercase tracking-wider block">Ortalama Ürün Memnuniyeti</span>
            <span className="text-2xl font-extrabold text-[#36637e] font-mono">
              {avgScore > 0 ? `+${avgScore.toFixed(2)}` : avgScore.toFixed(2)}
            </span>
            <span className="text-[11px] text-[#72787d] block mt-0.5">Ölçek: -1.00 ile +1.00 arası</span>
          </div>
        </div>

        {/* Card: Distribution Percentages */}
        <div className="bg-white rounded-2xl p-5 border border-[#e4e3db] shadow-sm sm:col-span-2 lg:col-span-1" id="stat-card-distribution">
          <span className="text-xs text-[#72787d] font-bold uppercase tracking-wider block mb-1.5">Mevcut Dağılım</span>
          <div className="flex items-center gap-1.5 h-3 rounded-full overflow-hidden w-full bg-[#1b1c17]/5" id="distribution-split-bar">
            {totalCount > 0 ? (
              <>
                <div 
                  className="bg-[#4b6547] h-full" 
                  style={{ width: `${(sentimentCount.positive / totalCount) * 100}%` }}
                  title={`Pozitif: ${sentimentCount.positive}`}
                />
                <div 
                  className="bg-[#815252] h-full" 
                  style={{ width: `${(sentimentCount.neutral / totalCount) * 100}%` }}
                  title={`Nötr: ${sentimentCount.neutral}`}
                />
                <div 
                  className="bg-[#ba1a1a] h-full" 
                  style={{ width: `${(sentimentCount.negative / totalCount) * 100}%` }}
                  title={`Negatif: ${sentimentCount.negative}`}
                />
              </>
            ) : (
              <div className="bg-[#e4e3db] h-full w-full" />
            )}
          </div>
          <div className="flex justify-between items-center mt-2 text-xs font-semibold text-[#72787d]" id="distribution-labels-box">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#4b6547]" /> %{totalCount > 0 ? Math.round((sentimentCount.positive / totalCount) * 100) : 0} Pozitif</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#815252]" /> %{totalCount > 0 ? Math.round((sentimentCount.neutral / totalCount) * 100) : 0} Nötr</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> %{totalCount > 0 ? Math.round((sentimentCount.negative / totalCount) * 100) : 0} Negatif</span>
          </div>
        </div>
      </div>

      {/* 2. Headline Summary Badge */}
      <div className={`p-4 rounded-xl border ${getScoreBg(avgScore)} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2`} id="overall-index-direction-indicator">
        <div>
          <h4 className="font-bold text-sm text-[#1b1c17] flex items-center gap-1.5">
            🎯 {getScoreDirectionLabel(avgScore)}
          </h4>
          <p className="text-xs text-[#41484d] mt-0.5">
            Yapılan son testler ve arşiv dokümanlarına göre müşteri hissiyatı ağırlıklı olarak bu yönde şekillenmektedir.
          </p>
        </div>
        <div className="text-xs font-mono font-bold bg-[#1b1c17]/10 px-3 py-1.5 rounded-lg text-[#1b1c17]">
          Kayıt Sayısı: {totalCount}
        </div>
      </div>

      {/* 3. Prevalent Topics Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-details-row">
        {/* Left 2 Cols: Interactive Feedback Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm" id="analysis-records-stream">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1b1c17]">İnceleme Kayıt Havuzu</h3>
            <span className="text-xs text-[#72787d]">Seçmek İçin Kartlara Tıklayın</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1" id="history-scroller">
            {history.map((item, idx) => {
              const isActive = activeResultID === item.timestamp || (activeResultID === undefined && idx === 0);
              const isPos = item.sentiment === "Pozitif";
              const isNeg = item.sentiment === "Negatif";

              return (
                <div
                  key={item.timestamp || idx}
                  onClick={() => onSelectSample(item)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#36637e]/5 border-[#36637e] shadow-xs"
                      : "bg-[#fbf9f1] border-[#e4e3db] hover:border-[#36637e]/40"
                  }`}
                  id={`history-card-${idx}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isPos ? "bg-[#cdebc5] text-[#092009]" : isNeg ? "bg-[#ffdad6] text-[#93000a]" : "bg-[#f0eee6] text-[#41484d]"
                      }`}>
                        {item.sentiment}
                      </span>
                      <span className="text-[11px] bg-[#36637e]/15 text-[#001e2e] font-semibold px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#72787d]">
                      {new Date(item.timestamp).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p className="text-xs text-[#1b1c17] line-clamp-2 mt-2 font-medium leading-relaxed">
                    {item.transcription}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] bg-[#1b1c17]/5 text-[#72787d] px-1.5 py-0.5 rounded font-medium">
                        #{topic}
                      </span>
                    ))}
                    <span className="text-[10px] ml-auto font-mono font-bold text-[#1b1c17]">
                      Skor: {item.score > 0 ? `+${item.score.toFixed(1)}` : item.score.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Sentiment Word Tags */}
        <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm flex flex-col justify-between" id="topics-frequency-box">
          <div>
            <h3 className="text-lg font-bold text-[#1b1c17] mb-1">Popüler Başlıklar</h3>
            <p className="text-xs text-[#72787d] leading-relaxed">
              Müşteri şikayet veya memnuniyetlerinde en çok geçen konular.
            </p>
          </div>

          <div className="space-y-3.5 my-4 overflow-y-auto max-h-[280px] pr-1" id="topic-freq-list">
            {sortedTopics.length > 0 ? (
              sortedTopics.map(([topic, cnt]) => {
                const limit = history.length || 1;
                const pct = Math.round((cnt / limit) * 100);
                return (
                  <div key={topic} className="space-y-1 block" id={`topic-occurrence-${topic}`}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1b1c17]">{topic}</span>
                      <span className="text-[#72787d] font-mono">{cnt} Adet (%{pct})</span>
                    </div>
                    <div className="h-2 w-full bg-[#f0eee6] rounded-full overflow-hidden">
                      <div 
                        className="bg-[#36637e] h-full rounded-full" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-center py-10 text-[#72787d]" id="no-topics-fallback">
                Konu etiketleri çıkarılmaktadır.
              </div>
            )}
          </div>

          <div className="bg-[#fbf9f1] rounded-xl p-3 border border-[#e4e3db]" id="help-box">
            <h5 className="text-xs font-bold text-[#1b1c17] flex items-center gap-1.5">
              💡 Süreç Önerisi
            </h5>
            <p className="text-[11px] text-[#72787d] leading-relaxed mt-1">
              Negatif yoğunluğu %50'yi aşan başlıklar için destek ekiplerine otomatik bilet ataması yapılması önerilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
