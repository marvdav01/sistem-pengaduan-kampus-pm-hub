import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import apiRoutes from "./src/routes";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// API Routes
app.use('/api', apiRoutes);

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot will use mock fallback responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. FAQ Chatbot API Route
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Fallback answers for campus complaints if no API key is provided
      const lower = message.toLowerCase();
      let responseText = "Halo! Saya Asisten AI Sistem Informasi Pengaduan Layanan Kampus (SIPELAK). Ada yang bisa saya bantu terkait layanan akademik, IT, fasilitas, kebersihan, atau administrasi?";
      if (lower.includes("cara") && lower.includes("aduan")) {
        responseText = "Cara membuat pengaduan sangat mudah! \n1. Masuk ke halaman pengaduan di tab 'Sistem Pengaduan'.\n2. Klik tombol 'Buat Pengaduan'.\n3. Lengkapi formulir (Judul, Kategori, Lokasi, Deskripsi, dan Foto Bukti).\n4. Kirim pengaduan Anda. Anda dapat melacak perkembangannya secara langsung di dashboard Anda!";
      } else if (lower.includes("status")) {
        responseText = "Status pengaduan di SIPELAK terdiri dari:\n- **Diajukan**: Laporan baru masuk dan menunggu pemeriksaan.\n- **Diverifikasi**: Admin telah memverifikasi kelengkapan laporan Anda.\n- **Diproses**: Laporan diteruskan ke petugas unit terkait untuk ditindaklanjuti.\n- **Selesai**: Masalah telah diselesaikan oleh petugas.\n- **Ditolak**: Laporan ditolak karena tidak sesuai ketentuan.";
      } else if (lower.includes("fasilitas") || lower.includes("rusak") || lower.includes("AC")) {
        responseText = "Untuk keluhan fasilitas seperti AC rusak, kursi patah, atau lampu mati, silakan pilih kategori **Fasilitas** saat mengisi formulir pengaduan. Tuliskan lokasi ruangan secara detail agar petugas cepat mengidentifikasi lokasi!";
      } else if (lower.includes("trello") || lower.includes("wbs") || lower.includes("pm")) {
        responseText = "Di tab **PM Hub & Document Generator**, Anda dapat memantau simulasi Trello, jadwal Gantt Chart, Project Charter, WBS, hingga estimasi anggaran Rp9.000.000 untuk pengembangan sistem ini sesuai dokumen tugas akhir Anda!";
      }
      return res.json({ text: responseText, source: "mock-fallback" });
    }

    const ai = getGeminiClient();
    
    // Build context
    const systemInstruction = `
      Anda adalah "SIPELAK AI Assistant", sebuah chatbot cerdas untuk Sistem Informasi Pengaduan Layanan Kampus.
      Tugas utama Anda adalah:
      1. Menjawab pertanyaan mahasiswa atau staf mengenai cara menggunakan sistem pengaduan ini.
      2. Memberikan informasi umum mengenai kategori pengaduan (Akademik, Fasilitas, IT, Kebersihan, Keamanan, Administrasi).
      3. Membantu menjelaskan status pengaduan (Diajukan, Diverifikasi, Diproses, Selesai, Ditolak) serta alur distribusinya.
      4. Berperan ramah, solutif, profesional, dan menggunakan bahasa Indonesia yang santun dan jelas.
      5. Anda juga bisa memberikan penjelasan dasar mengenai manajemen proyek sistem ini (WBS, Gantt Chart, Project Charter, risiko) jika ditanya terkait materi tugas manajemen proyek.
    `;

    // Process with history if any, or a single call
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text || "Maaf, saya tidak mendapatkan tanggapan.", source: "gemini-api" });
  } catch (error: any) {
    console.error("Error in /api/chatbot:", error);
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
});

// 2. AI Document Generator API Route
app.post("/api/generate-docs", async (req, res) => {
  try {
    const { section, university, customPrompt } = req.body;
    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    const univName = university || "Universitas Contoh";
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.json({ 
        text: `[Teks ini digenerate sebagai fallback default karena GEMINI_API_KEY belum dikonfigurasi]\n\n### Kustomisasi Dokumen untuk ${univName}\n\nPengembangan Sistem Informasi Pengaduan Layanan Kampus di ${univName} bertujuan untuk menggantikan proses pelaporan pengaduan konvensional (melalui WhatsApp dan email) menjadi sistem terintegrasi yang transparan dan dapat dilacak real-time. Dengan batasan proyek selama 8 minggu dan estimasi anggaran Rp9.000.000, tim proyek (terdiri dari Project Manager, System Analyst, UI/UX Designer, Programmer, Database Designer, dan Tester) akan merancang, menguji, dan merilis sistem berbasis web ini untuk digunakan oleh seluruh civitas akademika ${univName}.`,
        source: "mock-fallback"
      });
    }

    const ai = getGeminiClient();
    const prompt = `
      Tolong buatkan draf detail/konten profesional berbahasa Indonesia untuk dokumen tugas besar Manajemen Proyek Perangkat Lunak.
      Fokus studi kasus: Pengembangan Sistem Informasi Pengaduan Layanan Kampus.
      Nama Kampus: ${univName}.
      
      Bagian yang diminta: ${section}.
      Kustomisasi tambahan: ${customPrompt || "Tulis secara profesional, komprehensif, dan siap dimasukkan ke dalam laporan akademik."}
      
      Gunakan informasi kontekstual berikut:
      - Durasi proyek: 8 minggu.
      - Total anggaran: Rp9.000.000 (Rincian: Analisis Rp750k, Desain Rp1jt, Dev Rp4jt, Testing Rp1jt, Dok & Training Rp750k, Hosting Rp500k, Cadangan Rp1jt).
      - Stakeholder: Mahasiswa, Admin, Petugas Unit Layanan, Pimpinan Kampus, PM, Tim Pengembang.
      - Fitur utama: Login, Form Pengaduan, Kategori, Verifikasi, Distribusi, Status, Komentar, Notifikasi, Dashboard, Laporan.
      
      Tolong buatkan draf akademis terstruktur yang sangat rapi dan lengkap untuk bagian ini, menggunakan format Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      }
    });

    return res.json({ text: response.text || "Gagal membuat draf dokumen.", source: "gemini-api" });
  } catch (error: any) {
    console.error("Error in /api/generate-docs:", error);
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
