import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Volume2, Upload, AlertCircle, Sparkles, Wand2 } from "lucide-react";
import { SentimentAnalysisResult } from "../types";

interface AudioAnalyzerProps {
  onAnalysisComplete: (result: SentimentAnalysisResult) => void;
}

export default function AudioAnalyzer({ onAnalysisComplete }: AudioAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [micDenied, setMicDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Time tracker for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMsg(null);
    setMicDenied(false);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedBlob(audioBlob);
        
        // Stop all stream tracks to free mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingTime(0);
      setIsRecording(true);
    } catch (err: any) {
      console.warn("Mikrofon erişimi engellendi veya bulunamadı:", err);
      setMicDenied(true);
      setErrorMsg("Mikrofon erişimi sağlanamadı. İzin vermemiş olabilirsiniz veya sandbox kısıtlamaları mevcut. Ses yükleme sekmesini kullanabilir veya simülasyonu başlatabilirsiniz.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setErrorMsg(null);
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });
  };

  // Send to server for real Gemini voice analysis
  const analyzeAudio = async (blobToSend: Blob) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const base64Data = await blobToBase64(blobToSend);
      const response = await fetch("/api/sentiment/analyze-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Data,
          mimeType: blobToSend.type || "audio/webm",
          isAudio: true
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Ses analizi başarısız oldu.");
      }

      const result: SentimentAnalysisResult = await response.json();
      result.timestamp = new Date().toISOString();
      result.type = "Ses";
      result.textSnippet = `[Ses Kaydı Analizi] ${result.transcription?.slice(0, 40)}...`;

      onAnalysisComplete(result);
      clearRecording();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Mikrofon ses analizi yapılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  // Custom audio upload element
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setErrorMsg("Lütfen geçerli bir ses dosyası seçin (MP3, WAV, WEBM vb.).");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await analyzeAudio(file);
    } catch (error: any) {
      setErrorMsg(error.message || "Ses dosyası aktarımı veya analizi başarısız.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation mode for browser iframe sandbox issues
  const handleSimulation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    // Realistic turkish sound transcripts
    const simTranscripts = [
      "Merhaba, kargom hala gelmedi. Ürün fena değil ama kargo şirketinizin geciktirmesi siparişimin her şeyini mahvetti gerçekten çok üzgünüm.",
      "Selamlar! Ürünü satın aldım ve harika bir müşteri temsilcisiyle görüştüm. Muhteşem bir enerji, süper hizmet çok sağ olun!",
      "Arayüzünüz gerçekten çok karışık. Aradığım ayarı bulmam yarım saatimi alıyor. Lütfen uygulamayı sadeleştirin artık.",
    ];

    const randomText = simTranscripts[Math.floor(Math.random() * simTranscripts.length)];

    try {
      const response = await fetch("/api/sentiment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: randomText })
      });

      if (!response.ok) {
        throw new Error("Yapay zeka simülasyonu başarısız.");
      }

      const result: SentimentAnalysisResult = await response.json();
      result.timestamp = new Date().toISOString();
      result.type = "Ses";
      result.transcription = `[Konuşma Simülasyonu] ${result.transcription}`;
      result.textSnippet = `[Ses Analiz Simülatörü] ${result.transcription.slice(0, 42)}...`;

      onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMsg("Simülasyon işlemi tamamlanırken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format time (mm:ss)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e4e3db] shadow-sm" id="audio-analyzer-component">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b1c17] flex items-center gap-1.5">
            <Volume2 className="text-[#36637e] w-5 h-5" /> Ses Tonu & Konuşma Analizörü
          </h3>
          <p className="text-xs text-[#72787d] mt-0.5">
            Sesinizle kayıt alıp tonlama, hız ve kelime öbeklerinin duygusunu anında analiz edin.
          </p>
        </div>
        <button
          onClick={handleSimulation}
          className="bg-[#cdebc5] text-[#092009] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#b1cfaa] transition-colors shadow-xs"
          title="Mikrofon çalışmıyorsa yapay zeka ses analizini simüle edin"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ses Simüle Et
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 flex gap-2 items-start mb-4" id="audio-error-box">
          <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            {errorMsg}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="audio-interface-grid">
        {/* Left Side: Live Mic Interaction */}
        <div className="bg-[#fbf9f1] rounded-xl p-5 border border-[#e4e3db] flex flex-col justify-between" id="voice-recorder-interactive">
          <div className="text-center py-4 flex flex-col items-center justify-center">
            {/* Animating Waveform Area */}
            {isRecording ? (
              <div className="flex items-center gap-1 h-12 justify-center mb-4" id="live-recording-waves">
                <span className="waveform-bar w-1.5 bg-[#ba1a1a] rounded-full" style={{ animationDelay: "0.1s" }} />
                <span className="waveform-bar w-1.5 bg-[#eae8e0] rounded-full" style={{ animationDelay: "0.3s" }} />
                <span className="waveform-bar w-1.5 bg-[#36637e] rounded-full" style={{ animationDelay: "0.5s" }} />
                <span className="waveform-bar w-1.5 bg-[#4b6547] rounded-full" style={{ animationDelay: "0.2s" }} />
                <span className="waveform-bar w-1.5 bg-[#815252] rounded-full" style={{ animationDelay: "0.4s" }} />
                <span className="waveform-bar w-1.5 bg-[#ba1a1a] rounded-full" style={{ animationDelay: "0.6s" }} />
              </div>
            ) : recordedBlob ? (
              <div className="flex items-center gap-1 h-12 justify-center mb-4" id="finished-recording-waves">
                <span className="w-1.5 h-6 bg-[#36637e] rounded-full" />
                <span className="w-1.5 h-2 bg-[#36637e] rounded-full" />
                <span className="w-1.5 h-8 bg-[#36637e] rounded-full" />
                <span className="w-1.5 h-4 bg-[#36637e] rounded-full" />
                <span className="w-1.5 h-10 bg-[#36637e] rounded-full" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#eae8e0] flex items-center justify-center mb-4" id="idle-recording-circle">
                <Mic className="text-[#72787d] w-6 h-6" />
              </div>
            )}

            <div className="text-xl font-extrabold text-[#1b1c17] font-mono mb-1" id="timer-display">
              {formatTime(recordingTime)}
            </div>
            <div className="text-xs text-[#72787d]">
              {isRecording ? "Mikrofon aktif, konuşun..." : recordedBlob ? "Ses kaydı hazır." : "Kayıt başlatmak için butona basın."}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4" id="recorder-controls">
            {!isRecording && !recordedBlob ? (
              <button
                onClick={startRecording}
                disabled={isLoading}
                className="w-full bg-[#ba1a1a] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#93000a] transition-all disabled:opacity-50 shadow-xs"
              >
                <Mic className="w-4 h-4" /> Kaydı Başlat
              </button>
            ) : isRecording ? (
              <button
                onClick={stopRecording}
                className="w-full bg-[#1b1c17] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <Square className="w-4 h-4" /> Kaydı Bitir
              </button>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={clearRecording}
                  className="bg-[#f0eee6] text-[#1b1c17] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-[#e4e3db] hover:bg-[#e4e3db] transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#ba1a1a]" /> İptal
                </button>
                <button
                  onClick={() => analyzeAudio(recordedBlob!)}
                  disabled={isLoading}
                  className="bg-[#36637e] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#1b4b65] transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-rotate" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  {isLoading ? "Analiz..." : "Analiz Et"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Local File Upload Trigger */}
        <div className="bg-[#fbf9f1] rounded-xl p-5 border border-[#e4e3db] flex flex-col justify-between" id="voice-file-uploader">
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <div className="w-12 h-12 bg-[#36637e]/10 text-[#36637e] rounded-xl flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#1b1c17] mb-0.5">Kayıtlı Ses Belgesi Yükle</h4>
            <p className="text-xs text-[#72787d] max-w-xs leading-relaxed">
              Daha önceden alınmış çağrı merkezi kayıtlarını, .mp3, .wav veya .ogg ses dosyalarınızı sürükleyip bırakabilirsiniz.
            </p>
          </div>

          <div className="mt-4" id="upload-input-block">
            <label className="w-full bg-[#f0eee6] text-[#1b1c17] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-[#e4e3db] hover:bg-[#e4e3db] transition-all text-center text-xs shadow-xs">
              <Upload className="w-4 h-4 text-[#36637e]" /> Ses Dosyası Seç (.mp3, .wav, .webm)
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
