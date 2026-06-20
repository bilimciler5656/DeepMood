import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limit for base64 file and audio inputs
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Common payload analysis utilizing Gemini 3.5-flash
 */
async function analyzeSentimentWithGemini(contentPart: any, isAudio: boolean = false) {
  const model = "gemini-3.5-flash";

  const systemInstruction = `Sen profesyonel bir Türkçe Duygu Analizi ve Metin Madenciliği uzmanısın.
Gönderilen girdiyi (metin veya konuşma ses kaydı) en ince detayına kadar duygu, tonlama, öfke/keder/neşe oranları ve anahtar ifadeler açısından analiz etmelisin.
Analiz ettiğin dile göre çıkarımlar yap fakat özet, önerilen cevap ve tüm açıklamaları TÜRKÇE olarak geri bildir.
Eğer girdi bir ses kaydı ise, sesin içindeki konuşmaları tam bir doğrulukla deşifre edip 'transcription' alanına yaz. Ses kalitesi kötüyse veya sessizse bunu özetinde belirt.
Eğer girdi düz metin ise girdi metnini doğrudan 'transcription' alanına kopyala.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      sentiment: {
        type: Type.STRING,
        description: "Ana duygu kategorisi. Yalnızca şu değerlerden biri olmalıdır: 'Pozitif', 'Nötr', 'Negatif'.",
      },
      score: {
        type: Type.NUMBER,
        description: "-1.0 (tamamen negatif) ile 1.0 (tamamen pozitif) arasında bir sayısal duygu skoru.",
      },
      emotions: {
        type: Type.OBJECT,
        properties: {
          joy: { type: Type.NUMBER, description: "Neşe, coşku, tatmin oranı (0.0 - 1.0 arası)" },
          sadness: { type: Type.NUMBER, description: "Üzüntü, hayal kırıklığı, keder oranı (0.0 - 1.0 arası)" },
          anger: { type: Type.NUMBER, description: "Öfke, sinir, tepki oranı (0.0 - 1.0 arası)" },
          fear: { type: Type.NUMBER, description: "Korku, kaygı, bıkkınlık oranı (0.0 - 1.0 arası)" },
          surprise: { type: Type.NUMBER, description: "Şaşkınlık, şok, merak oranı (0.0 - 1.0 arası)" },
        },
        required: ["joy", "sadness", "anger", "fear", "surprise"],
      },
      intensity: {
        type: Type.STRING,
        description: "Duygu yoğunluğu seviyesi: 'Çok Düşük', 'Düşük', 'Orta', 'Yüksek', 'Çok Yüksek'."
      },
      summary: {
        type: Type.STRING,
        description: "Maksimum iki cümlelik, Türkçe analiz yorumu ve tespiti."
      },
      keyPhrases: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Yazıdan veya sesten çıkarılan en önemli 3 ila 5 adet anahtar ifade."
      },
      suggestedResponse: {
        type: Type.STRING,
        description: "Müşteriye veya kullanıcıya verilebilecek en sempatik, profesyonel, yapıcı ve çözüm odaklı Türkçe yanıt önerisi."
      },
      topics: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Konu etiketleri. Örneğin: 'Kargo Servisi', 'Fiyatlandırma', 'Müşteri Desteği', 'Genel Memnuniyet', 'Ürün İadesi', 'Arayüz Tasarımı'."
      },
      detectedLanguage: {
        type: Type.STRING,
        description: "Girdinin dili (örn. 'Türkçe', 'İngilizce', 'Almanca')."
      },
      transcription: {
        type: Type.STRING,
        description: "Ses dosyası ise tam transkript dökümü, düz metin ise orijinal metnin kendisi."
      }
    },
    required: [
      "sentiment",
      "score",
      "emotions",
      "intensity",
      "summary",
      "keyPhrases",
      "suggestedResponse",
      "topics",
      "detectedLanguage",
      "transcription"
    ]
  };

  const promptText = isAudio 
    ? "Lütfen bu ses dosyasını dinle, deşifre et ve detaylı duygu analizini şemaya uygun şekilde Türkçe JSON olarak hazırla."
    : "Lütfen bu metni derinlemesine analiz et ve detaylı duygu analizini şemaya uygun şekilde Türkçe JSON olarak hazırla.";

  const contents = [contentPart, { text: promptText }];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    }
  });

  if (!response.text) {
    throw new Error("Yapay zekadan boş bir yanıt alındı.");
  }

  return JSON.parse(response.text.trim());
}

// REST API Endpoints

// 1. Text Sentiment Analysis
app.post("/api/sentiment/analyze", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Lütfen analiz için geçerli bir metin girin." });
    }

    const payloadPart = { text };
    const analysis = await analyzeSentimentWithGemini(payloadPart, false);
    return res.json(analysis);
  } catch (error: any) {
    console.error("Metin analiz hatası:", error);
    return res.status(500).json({ error: error.message || "Analiz sırasında bir sorun oluştu." });
  }
});

// 2. Audio/Voice & Document Analyzer (Base64 wrapper API)
app.post("/api/sentiment/analyze-media", async (req, res) => {
  try {
    const { base64Data, mimeType, isAudio } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "Gerekli dosya verisi (base64) eksik." });
    }

    const contentPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || (isAudio ? "audio/webm" : "text/plain")
      }
    };

    const analysis = await analyzeSentimentWithGemini(contentPart, isAudio);
    return res.json(analysis);
  } catch (error: any) {
    console.error("Medya/Dosya analiz hatası:", error);
    return res.status(500).json({ error: error.message || "Dosya analizi başarısız oldu." });
  }
});

// Setup dev and prod servers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Configure Vite for Express middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production state
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Duygu Analizi] Server started. Listening on http://localhost:${PORT}`);
  });
}

startServer();
