import { SentimentAnalysisResult } from "./types";

export const SAMPLE_ANALYSES: SentimentAnalysisResult[] = [
  {
    sentiment: "Pozitif",
    score: 0.85,
    emotions: {
      joy: 0.9,
      sadness: 0.05,
      anger: 0.0,
      fear: 0.02,
      surprise: 0.03
    },
    intensity: "Yüksek",
    summary: "Müşteri satın aldığı üründen son derece mutlu kalmış. Özellikle süper hızlı teslimatı ve özel kutu açılışından övgüyle bahsediyor.",
    keyPhrases: ["süper hızlı kargo", "şık paketleme", "kaliteli ürün", "kesinlikle tavsiye"],
    suggestedResponse: "Harika geri bildiriminiz için çok teşekkür ederiz! Beğeniniz bizim gücümüze güç katıyor. Mutlu alışverişler dileriz!",
    topics: ["Kargo Servisi", "Ürün Kalitesi", "Genel Memnuniyet"],
    detectedLanguage: "Türkçe",
    transcription: "Dün sipariş verdim, bugün sabah kapımdaydı! Paketleme inanılmaz şık yapılmış, kutuyu açarken premium bir his veriyor. Ürünün kalitesi de beklentimin çok üzerinde. Her kuruşuna değer, satıcıya çok teşekkür ederim, kesinlikle tavsiye ediyorum.",
    timestamp: "2026-06-20T11:15:00Z",
    textSnippet: "Dün sipariş verdim, bugün sabah kapımdaydı...",
    type: "Metin"
  },
  {
    sentiment: "Negatif",
    score: -0.92,
    emotions: {
      joy: 0.0,
      sadness: 0.45,
      anger: 0.85,
      fear: 0.15,
      surprise: 0.05
    },
    intensity: "Çok Yüksek",
    summary: "Ödeme işlemi sırasında çift çekim sorunu yaşanmış. Müşteri temsilcilerine ulaşamamaktan şikayetçi, son derece kızgın ve hayal kırıklığı yaşıyor.",
    keyPhrases: ["çift para çekildi", "müsaade edilmeyen işlem", "müşteri hizmetleri", "iade edilmiyor"],
    suggestedResponse: "Yaşanan aksaklık için gerçekten çok üzgünüz. Konuyu anında finans ekibimize ilettik. Çift çekilen tutarın 1 iş günü içinde hesabınıza iadesi için otomatik süreç başlattık. Anlayışınız için teşekkür ederiz.",
    topics: ["Fiyatlandırma", "Müşteri Desteği", "Ödeme Hatası"],
    detectedLanguage: "Türkçe",
    transcription: "Kredi kartımla ödeme yaparken sistem hata verdi ama hesabımdan iki kere para çekilmiş! Müşteri hizmetlerine yarım saattir bağlanmaya çalışıyorum, kimse açmıyor muhatap bulamıyorum! Bu kabul edilemez, acilen paramı iade edin yoksa yasal yollara başvuracağım!",
    timestamp: "2026-06-20T10:42:00Z",
    textSnippet: "Kredi kartımla ödeme yaparken sistem hata verdi...",
    type: "Metin"
  },
  {
    sentiment: "Nötr",
    score: 0.05,
    emotions: {
      joy: 0.2,
      sadness: 0.2,
      anger: 0.1,
      fear: 0.05,
      surprise: 0.4
    },
    intensity: "Orta",
    summary: "Ürünün işlevsel olarak yeterli olduğunu ancak tasarımının web sitesindekinden bir miktar farklılık gösterdiğini düşünüyor. Fiyat-performans dengesinde ortalama.",
    keyPhrases: ["fiyat performans", "kullanışlı ama", "renk farkı", "ortalama kalite"],
    suggestedResponse: "Görüşleriniz için teşekkür ederiz. Ürün görsellerindeki stüdyo ışığı rengi biraz farklı gösterebiliyor, fotoğrafları güncellemek için tasarım ekibimize bildirdik. Keyifle kullanmanızı dileriz.",
    topics: ["Ürün Kalitesi", "Arayüz Tasarımı"],
    detectedLanguage: "Türkçe",
    transcription: "Ürün elime geçti, kargo ortalama bir sürede geldi. Malzeme kalitesi fena değil, işini yapıyor ama rengi buradaki fotoğraftakine göre biraz daha soluk duruyor. Fiyatına göre ne iyi ne kötü diyebilirim, idare eder bir ürün.",
    timestamp: "2026-06-20T09:30:00Z",
    textSnippet: "Ürün elime geçti, kargo ortalama bir sürede...",
    type: "Metin"
  },
  {
    sentiment: "Negatif",
    score: -0.45,
    emotions: {
      joy: 0.05,
      sadness: 0.65,
      anger: 0.25,
      fear: 0.35,
      surprise: 0.1
    },
    intensity: "Düşük",
    summary: "Müşteri uygulamanın son güncelleme sonrası aşırı yavaş çalıştığını belirtiyor. Uygulamayı kullanamamaktan ötürü çaresiz ve kaygılı.",
    keyPhrases: ["güncelleme sonrası", "sürekli çöküyor", "erişemiyorum", "yardımcı olun lütfen"],
    suggestedResponse: "Güncelleme sonrası oluşan performans kaybı nedeniyle özür dileriz. Cihaz önbelleğinizi temizleyip tekrar denemenizi öneririz. Bu esnada ekibimiz acil bir düzeltme yaması hazırlıyor, gün içerisinde yayına alacağız.",
    topics: ["Uygulama Performansı", "Müşteri Desteği"],
    detectedLanguage: "Türkçe",
    transcription: "[Ses Kaydı Analizi] Merhaba, dün yaptığınız güncellemeden sonra uygulama telefonumda acayip kasmaya başladı. Bilgilerimi yüklerken dönüp duruyor ve bazen kapanıyor. İşlerimi yetiştiremiyorum, lütfeen bir an önce bakın ya...",
    timestamp: "2026-06-20T08:12:00Z",
    textSnippet: "[Ses Kaydı Analizi] Merhaba, dün yaptığınız güncellemeden...",
    type: "Ses"
  }
];

export const PRESET_INPUTS = [
  {
    label: "Şirket Teşekkürü (Pozitif)",
    text: "Müşteri temsilciniz Elif Hanım'a harika desteği için çok teşekkürler! Yaşadığım sorunu sadece 5 dakika içinde, son derece kibar ve profesyonel bir yaklaşım ile çözdü. Firmanızın bu kalitede çalışanlara sahip olması muhteşem!"
  },
  {
    label: "Teslimat Problemi (Negatif)",
    text: "Sitede 24 saatte kargoda yazıyordu ama 1 hafta oldu hala kargoya dahi verilmedi! İptal etmek istiyorum buton aktif değil, müşteri hizmetlerini arıyorum telesekreter kapatıyor. Paramızla rezil olduk dedikleri bu olsa gerek, rezalet!"
  },
  {
    label: "Nötr Değerlendirme (Nötr)",
    text: "Ürün sipariş ettikten 3 gün sonra ulaştı, paketleme standart bir karton kutu içindeydi. Çalışmasında herhangi bir sıkıntı yok ama plastik kasası biraz narin duruyor. Bu fiyata daha kaliteli beklerdim sanırım ama işimi görüyor."
  },
  {
    label: "Fiyat Şikayeti (Karışık/Öfkeli)",
    text: "Hizmet kalitesi fena değil fakat her ay düzenli zam yapılması artık can sıkıcı bir boyuta ulaştı. Kalite korunuyor evet ama bütçemizi son derece zorlamaya başladı. Bu gidişle aboneliğimi son çare iptal etmek zorunda kalacağım."
  }
];
