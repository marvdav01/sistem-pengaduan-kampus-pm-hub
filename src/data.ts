import { Complaint, TrelloCard, ProjectRisk, GanttTask, ProjectMember, BudgetItem, PMChapter } from "./types";

export const initialComplaints: Complaint[] = [
  {
    id: "COMP-101",
    title: "Koneksi WiFi Lab Komputer Lambat dan Sering Terputus",
    category: "IT",
    description: "Saat praktikum Pemrograman Web, koneksi internet di Lab Komputer 3 lantai 2 sangat tidak stabil. Mahasiswa kesulitan mendownload package npm dan mengupload tugas ke repositori kampus. Mohon ditingkatkan bandwidth-nya.",
    location: "Gedung B, Lantai 2, Ruang Lab 3",
    status: "Diproses",
    createdAt: "2026-06-18T10:00:00Z",
    reporterName: "Aditya Pratama",
    priority: "Tinggi",
    comments: [
      {
        id: "c1",
        author: "Admin Kampus",
        role: "Admin",
        text: "Laporan telah diverifikasi dan diteruskan ke Unit IT & Infrastruktur.",
        createdAt: "2026-06-18T14:30:00Z"
      },
      {
        id: "c2",
        author: "Budi Santoso",
        role: "Petugas IT",
        text: "Kami sedang melakukan pengecekan router access point di Ruang Lab 3. Kemungkinan ada overheat pada perangkat.",
        createdAt: "2026-06-19T09:15:00Z"
      }
    ]
  },
  {
    id: "COMP-102",
    title: "AC Ruang Kuliah 402 Bocor dan Mengeluarkan Bunyi Bising",
    category: "Fasilitas",
    description: "AC sebelah kanan di Ruang 402 mengeluarkan air terus-menerus sehingga lantai menjadi licin dan berbahaya. Selain itu, bunyinya sangat bising dan mengganggu konsentrasi belajar selama perkuliahan.",
    location: "Gedung Utama, Lantai 4, Ruang 402",
    status: "Diverifikasi",
    createdAt: "2026-06-20T08:12:00Z",
    reporterName: "Siti Rahmawati",
    priority: "Sedang",
    comments: [
      {
        id: "c3",
        author: "Admin Kampus",
        role: "Admin",
        text: "Laporan diverifikasi. Menunggu penugasan teknisi dari Unit Sarana & Prasarana.",
        createdAt: "2026-06-20T11:00:00Z"
      }
    ]
  },
  {
    id: "COMP-103",
    title: "Keterlambatan Input Nilai UAS Mata Kuliah Basis Data",
    category: "Akademik",
    description: "Sampai saat ini, nilai UAS untuk mata kuliah Basis Data Kelas A belum terinput di portal akademik. Padahal batas akhir penginputan nilai dari bagian administrasi sudah lewat 3 hari yang lalu. Mohon konfirmasinya.",
    location: "Portal Akademik / Fakultas Ilmu Komputer",
    status: "Diajukan",
    createdAt: "2026-06-22T15:45:00Z",
    reporterName: "Edisyah Putra Waruwu",
    priority: "Tinggi",
    comments: []
  },
  {
    id: "COMP-104",
    title: "Tumpukan Sampah di Kantin Belakang Dekat Gazebo",
    category: "Kebersihan",
    description: "Tempat sampah di area gazebo belakang kantin sudah penuh sejak kemarin sore dan belum diangkut. Bau sampah menyengat ke area makan mahasiswa dan mengundang lalat. Sangat tidak higienis.",
    location: "Kantin Area Gazebo Belakang",
    status: "Selesai",
    createdAt: "2026-06-15T11:20:00Z",
    reporterName: "Dewi Lestari",
    priority: "Rendah",
    comments: [
      {
        id: "c4",
        author: "Admin Kampus",
        role: "Admin",
        text: "Laporan diverifikasi dan diteruskan ke tim Kebersihan (CS).",
        createdAt: "2026-06-15T12:00:00Z"
      },
      {
        id: "c5",
        author: "Supriadi",
        role: "Petugas Kebersihan",
        text: "Sampah sudah diangkut seluruhnya dan area sekitar gazebo telah disterilkan menggunakan karbol. Terima kasih.",
        createdAt: "2026-06-15T14:40:00Z"
      }
    ]
  },
  {
    id: "COMP-105",
    title: "Helm Hilang di Parkiran Motor Samping Gedung C",
    category: "Keamanan",
    description: "Saya kehilangan helm KYT merah di parkiran motor samping Gedung C pada hari Senin sekitar jam 13.00 - 15.00 WIB. Apakah bisa dibantu untuk melihat rekaman CCTV di area parkir tersebut?",
    location: "Parkir Motor Gedung C",
    status: "Ditolak",
    createdAt: "2026-06-16T16:00:00Z",
    reporterName: "Farhan Mahendra",
    priority: "Sedang",
    comments: [
      {
        id: "c6",
        author: "Admin Kampus",
        role: "Admin",
        text: "Laporan ditolak. Berdasarkan tata tertib parkir kampus, kehilangan atribut pribadi seperti helm di luar tanggung jawab pengelola parkir jika tidak dititipkan di loker resmi. Namun, Anda dapat berkoordinasi langsung dengan pihak Keamanan (Security) di pos utama untuk pengecekan mandiri CCTV.",
        createdAt: "2026-06-17T09:00:00Z"
      }
    ]
  }
];

export const initialTrelloCards: TrelloCard[] = [
  {
    id: "CARD-01",
    name: "Membuat Form Pengaduan",
    description: "Merancang fitur input pengaduan mahasiswa, meliputi field judul, kategori, deskripsi, lokasi, dan upload bukti gambar.",
    label: "Prioritas Tinggi",
    dueDate: "Minggu ke-5",
    checklist: [
      { text: "Desain UI Form Pengaduan", done: true },
      { text: "Implementasi validasi input", done: true },
      { text: "Inisialisasi handler upload gambar", done: false },
      { text: "Integrasi database schema pengaduan", done: false }
    ],
    pic: "Programmer (Andi)",
    status: "In Progress"
  },
  {
    id: "CARD-02",
    name: "Penyusunan Project Charter",
    description: "Menyusun dokumen Project Charter formal sebagai dasar inisiasi proyek bersama pimpinan kampus.",
    label: "Prioritas Tinggi",
    dueDate: "Minggu ke-1",
    checklist: [
      { text: "Identifikasi latar belakang & tujuan", done: true },
      { text: "Pendefinisian scope awal", done: true },
      { text: "Persetujuan tanda tangan sponsor", done: true }
    ],
    pic: "Project Manager (Rian)",
    status: "Done"
  },
  {
    id: "CARD-03",
    name: "Identifikasi Kebutuhan & Stakeholder",
    description: "Melakukan interview dan penyebaran kuisioner kepada mahasiswa dan admin unit untuk mengumpulkan kebutuhan fungsional dan non-fungsional.",
    label: "Prioritas Tinggi",
    dueDate: "Minggu ke-2",
    checklist: [
      { text: "Interview perwakilan mahasiswa", done: true },
      { text: "Focus Group Discussion (FGD) dengan admin unit", done: true },
      { text: "Penyusunan dokumen SRS (Spesifikasi Kebutuhan)", done: true }
    ],
    pic: "System Analyst (Indra)",
    status: "Done"
  },
  {
    id: "CARD-04",
    name: "Desain Database & Alur Pengaduan",
    description: "Merancang skema database relasional (table complaints, users, comments, categories) dan membuat activity diagram alur penanganan aduan.",
    label: "Prioritas Sedang",
    dueDate: "Minggu ke-4",
    checklist: [
      { text: "Membuat ERD (Entity Relationship Diagram)", done: true },
      { text: "Merancang alur verifikasi & distribusi", done: true },
      { text: "Review skema oleh tim developer", done: true }
    ],
    pic: "Database Designer (Siti)",
    status: "Done"
  },
  {
    id: "CARD-05",
    name: "Pengujian Modul Pengaduan",
    description: "Melakukan unit testing dan integration testing pada formulir pengaduan mahasiswa untuk memastikan data tersimpan dengan benar.",
    label: "Prioritas Tinggi",
    dueDate: "Minggu ke-7",
    checklist: [
      { text: "Membuat test plan modul pengaduan", done: false },
      { text: "Eksekusi pengujian input teks & validasi", done: false },
      { text: "Uji batas ukuran file gambar (max 5MB)", done: false }
    ],
    pic: "Tester (Lina)",
    status: "To Do"
  },
  {
    id: "CARD-06",
    name: "Modul Dashboard & Laporan Pimpinan",
    description: "Mengembangkan tampilan grafik rekapitulasi pengaduan bulanan untuk mempermudah pimpinan mengevaluasi kinerja unit pelayanan kampus.",
    label: "Prioritas Sedang",
    dueDate: "Minggu ke-6",
    checklist: [
      { text: "Desain layout bento grid dashboard", done: false },
      { text: "Implementasi grafik filter mingguan/bulanan", done: false },
      { text: "Fungsi export laporan format PDF", done: false }
    ],
    pic: "Programmer (Andi)",
    status: "Backlog"
  }
];

export const initialGanttTasks: GanttTask[] = [
  { id: "T1", name: "Inisiasi Proyek & Project Charter", startWeek: 1, endWeek: 1, progress: 100, resources: ["PM"] },
  { id: "T2", name: "Identifikasi Kebutuhan & Stakeholder", startWeek: 2, endWeek: 2, progress: 100, resources: ["SA", "PM"] },
  { id: "T3", name: "Penyusunan Scope, WBS, & Risiko", startWeek: 3, endWeek: 3, progress: 100, resources: ["PM", "SA"] },
  { id: "T4", name: "Penjadwalan, Sumber Daya, & Anggaran", startWeek: 4, endWeek: 4, progress: 100, resources: ["PM"] },
  { id: "T5", name: "Perancangan Database & UI/UX", startWeek: 5, endWeek: 5, progress: 80, resources: ["UI/UX", "DB"] },
  { id: "T6", name: "Simulasi Pengembangan Modul Utama", startWeek: 6, endWeek: 6, progress: 40, resources: ["Prog", "DB"] },
  { id: "T7", name: "Rencana Integrasi, Pengujian, & Monitoring", startWeek: 7, endWeek: 7, progress: 10, resources: ["Tester", "Prog"] },
  { id: "T8", name: "Evaluasi Proyek, Laporan Akhir, & Presentasi", startWeek: 8, endWeek: 8, progress: 0, resources: ["PM", "All"] }
];

export const projectMembers: ProjectMember[] = [
  {
    role: "Project Manager (PM)",
    name: "Rian (Mahasiswa)",
    responsibilities: [
      "Mengelola jadwal, ruang lingkup, risiko, komunikasi, dan evaluasi proyek secara keseluruhan.",
      "Memimpin pertemuan rutin tim dan koordinasi dengan sponsor kampus.",
      "Menyusun laporan status proyek mingguan."
    ]
  },
  {
    role: "System Analyst (SA)",
    name: "Indra",
    responsibilities: [
      "Menganalisis kebutuhan pengguna (mahasiswa, admin, petugas, pimpinan).",
      "Menyusun dokumen System Requirement Specification (SRS).",
      "Membuat pemodelan proses bisnis (DFD/UML/Activity Diagram)."
    ]
  },
  {
    role: "UI/UX Designer",
    name: "Kania",
    responsibilities: [
      "Membuat wireframe dan prototipe interaktif halaman web SIPELAK.",
      "Melakukan pengujian usabilitas rancangan antarmuka kepada perwakilan mahasiswa.",
      "Menyediakan aset visual siap pakai untuk developer."
    ]
  },
  {
    role: "Programmer",
    name: "Andi",
    responsibilities: [
      "Mengembangkan modul frontend berbasis React & Tailwind CSS.",
      "Mengintegrasikan API backend Express dan logika model AI Chatbot.",
      "Melakukan debugging dan optimasi performa kode aplikasi."
    ]
  },
  {
    role: "Database Designer (DB)",
    name: "Siti",
    responsibilities: [
      "Merancang struktur ERD dan skema database relasional.",
      "Melakukan optimasi kueri dan memastikan integritas data keluhan mahasiswa.",
      "Mengatur konfigurasi keamanan data."
    ]
  },
  {
    role: "Tester",
    name: "Lina",
    responsibilities: [
      "Menyusun skenario pengujian unit, integrasi, dan sistem secara komprehensif.",
      "Melakukan manual testing serta menuliskan laporan bug (bug tracking log).",
      "Memastikan aplikasi memenuhi semua kriteria penerimaan (acceptance criteria)."
    ]
  }
];

export const initialBudget: BudgetItem[] = [
  { id: 1, component: "Analisis Kebutuhan (Survey, Interview, FGD)", cost: 750000 },
  { id: 2, component: "Perancangan Sistem (Database ERD & UI/UX Figma Prototype)", cost: 1000000 },
  { id: 3, component: "Pengembangan Modul Sistem (Coding Frontend & Backend)", cost: 4000000 },
  { id: 4, component: "Pengujian Sistem (Manual Testing, Bug Fixing, Security Check)", cost: 1000000 },
  { id: 5, component: "Dokumentasi Laporan dan Pelatihan Pengguna (SOP)", cost: 750000 },
  { id: 6, component: "Hosting VPS dan Domain Kampus (Simulasi Deployment)", cost: 500000 },
  { id: 7, component: "Cadangan Risiko Proyek (Contingency Buffer)", cost: 1000000 }
];

export const projectRisks: ProjectRisk[] = [
  {
    id: 1,
    name: "Kebutuhan pengguna berubah di tengah jalan",
    category: "Scope",
    impact: "Tinggi",
    probability: "Sedang",
    mitigation: "Membuat dokumen kebutuhan yang disetujui (sign-off) sejak awal oleh perwakilan mahasiswa dan administrasi kampus sebelum coding dimulai."
  },
  {
    id: 2,
    name: "Jadwal pengembangan modul utama terlambat",
    category: "Waktu",
    impact: "Tinggi",
    probability: "Tinggi",
    mitigation: "Menentukan skala prioritas pengerjaan fitur utama (MVP - Minimum Viable Product) seperti modul pengaduan terlebih dahulu, menunda fitur opsional."
  },
  {
    id: 3,
    name: "Data pengaduan tidak lengkap atau tidak valid",
    category: "Data",
    impact: "Sedang",
    probability: "Sedang",
    mitigation: "Menentukan format input wajib (mandatory fields) pada form seperti kategori, deskripsi detail, lokasi spesifik, dan minimal satu bukti foto."
  },
  {
    id: 4,
    name: "Miskomunikasi antarperan tim proyek",
    category: "Komunikasi",
    impact: "Tinggi",
    probability: "Sedang",
    mitigation: "Membuat rencana komunikasi teratur seperti koordinasi via Trello setiap 2 hari sekali dan stand-up meeting singkat mingguan."
  },
  {
    id: 5,
    name: "Adanya bug kritis pada fitur status pengaduan",
    category: "Teknis",
    impact: "Tinggi",
    probability: "Sedang",
    mitigation: "Melakukan pengujian berlapis (unit, integration, system) di lokal sebelum menyatukan kode di branch utama (CI/CD simulation)."
  },
  {
    id: 6,
    name: "Pengguna (terutama petugas unit) sulit memahami sistem baru",
    category: "User Experience",
    impact: "Sedang",
    probability: "Sedang",
    mitigation: "Membuat panduan antarmuka sesederhana mungkin dan mengadakan sesi training kilat (30 menit) serta memberikan buku panduan PDF singkat."
  },
  {
    id: 7,
    name: "Keterbatasan anggaran untuk lisensi hosting/cloud",
    category: "Biaya",
    impact: "Sedang",
    probability: "Rendah",
    mitigation: "Memilih skema hosting lokal universitas yang gratis atau cloud tier gratis/murah selama masa uji coba sistem."
  },
  {
    id: 8,
    name: "Risiko kebocoran data pribadi pengadu (mahasiswa)",
    category: "Keamanan",
    impact: "Tinggi",
    probability: "Sedang",
    mitigation: "Menerapkan hak akses berbasis peran (RBAC) yang ketat, enkripsi password, dan validasi token login."
  }
];

export const projectTests = [
  {
    id: 1,
    module: "Login & Autentikasi",
    scenario: "Pengguna (Mahasiswa/Admin/Petugas) memasukkan username dan password yang terdaftar secara benar.",
    expected: "Sistem berhasil memverifikasi akun dan mengarahkan pengguna ke halaman dashboard utama sesuai dengan hak akses (role) masing-masing."
  },
  {
    id: 2,
    module: "Form Pengaduan",
    scenario: "Mahasiswa mengisi form laporan dengan memasukkan Judul, Kategori 'Fasilitas', Deskripsi detail, Lokasi Gedung B, mengunggah bukti foto JPG, lalu menekan tombol Kirim.",
    expected: "Data laporan berhasil disimpan ke database lokal, mahasiswa diarahkan kembali ke riwayat laporan mereka, dan status awal diset otomatis sebagai 'Diajukan'."
  },
  {
    id: 3,
    module: "Verifikasi Pengaduan",
    scenario: "Admin membuka tab Kelola Laporan, memeriksa rincian pengaduan baru, lalu mengklik tombol 'Verifikasi & Setujui'.",
    expected: "Status keluhan di database terupdate menjadi 'Diverifikasi' dan mahasiswa pengadu langsung menerima notifikasi status di panel akunnya."
  },
  {
    id: 4,
    module: "Distribusi & Respon Petugas",
    scenario: "Petugas dari Unit IT membuka laporan dengan status 'Diverifikasi' berkategori IT, mengubah statusnya ke 'Diproses', kemudian menginput komentar 'Sedang diperbaiki'.",
    expected: "Sistem mengubah status menjadi 'Diproses', mengikat laporan ke petugas bersangkutan, dan merender komentar tanggapan petugas di linimasa keluhan."
  },
  {
    id: 5,
    module: "Dashboard & Laporan Periodik",
    scenario: "Pimpinan Kampus mengklik opsi periode laporan 'Bulanan' di panel admin untuk melihat grafik statistik keluhan.",
    expected: "Sistem merender visualisasi ringkasan jumlah keluhan berdasarkan kategori akademik/fasilitas/IT secara grafis beserta angka persentase penyelesaian."
  }
];

export const initialChapters: PMChapter[] = [
  {
    id: "chap1",
    sectionCode: "BAB 1",
    title: "Pendahuluan",
    content: `### 1.1 Latar Belakang Masalah
Universitas saat ini membutuhkan sistem informasi berbasis web yang modern dan terpadu untuk mengelola segala keluhan pelayanan kampus. Selama ini, penyampaian aduan mahasiswa terkait fasilitas kelas, kendala akademik, administrasi perkuliahan, masalah jaringan internet kampus, kebersihan toilet, serta keamanan parkir masih dilakukan melalui berbagai saluran non-terpusat seperti grup WhatsApp, email, atau pengaduan manual langsung ke loket. 

Akibat metode konvensional tersebut, beberapa kendala timbul:
1. Status penyelesaian aduan tidak dapat dilacak secara transparan oleh pelapor.
2. Unit terkait kesulitan dalam menyusun skala prioritas keluhan yang mendesak.
3. Tidak ada rekapitulasi data pengaduan berkala untuk evaluasi pimpinan.

### 1.2 Identifikasi Masalah
Berdasarkan latar belakang tersebut, diidentifikasi masalah-masalah utama sebagai berikut:
- **Pelacakan yang Buruk**: Mahasiswa tidak mengetahui apakah laporan mereka sedang dibaca, diproses, atau bahkan ditolak.
- **Keterlambatan Penanganan**: Kurangnya notifikasi instan membuat respon petugas lambat.
- **Kesulitan Evaluasi**: Pimpinan tidak memiliki dashboard laporan statistik untuk mengevaluasi kualitas sarana dan prasarana kampus.

### 1.3 Tujuan Proyek
Tujuan utama dari proyek pengembangan sistem ini adalah:
1. Menyediakan platform pengaduan pelayanan kampus satu pintu (terpusat).
2. Memberikan transparansi status pelaporan bagi mahasiswa secara real-time.
3. Membantu mempercepat koordinasi distribusi keluhan ke unit sarana yang tepat.
4. Menyajikan ringkasan laporan performa pelayanan bagi pimpinan kampus.

### 1.4 Manfaat Proyek
- **Bagi Mahasiswa**: Memberikan wadah pengaduan yang mudah diakses kapan saja dan dapat dipantau langsung.
- **Bagi Petugas Layanan**: Mempermudah penyaringan tugas, koordinasi penanganan, dan respon komentar dalam satu tempat.
- **Bagi Manajemen Kampus**: Meningkatkan kredibilitas kampus serta menyediakan data akurat untuk perencanaan peningkatan fasilitas.`
  },
  {
    id: "chap2",
    sectionCode: "BAB 2",
    title: "Identifikasi Kebutuhan Sistem",
    content: `### 2.1 Kebutuhan Fungsional (Functional Requirements)
Kebutuhan fungsional menggambarkan fungsi spesifik yang harus disediakan oleh sistem informasi pengaduan ini:
- **Sistem Login**: Akses multi-role untuk Mahasiswa, Admin, Petugas Unit, dan Pimpinan.
- **Form Pengaduan**: Input data keluhan mahasiswa berupa judul, kategori aduan, deskripsi, lokasi, dan unggah foto.
- **Verifikasi & Distribusi**: Admin dapat meninjau laporan, memverifikasi kebenaran informasi, dan mendistribusikan ke unit teknis terkait.
- **Pengelolaan Status**: Petugas dapat mengubah status penyelesaian laporan (Diajukan -> Diverifikasi -> Diproses -> Selesai / Ditolak).
- **Notifikasi & Interaksi**: Notifikasi perubahan status keluhan dan modul komentar interaktif antara pelapor dan petugas.

### 2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Keamanan**: Autentikasi berbasis token, perlindungan password dengan enkripsi, dan pembatasan hak akses menu (RBAC).
- **Usabilitas**: Antarmuka responsif yang nyaman diakses melalui perangkat seluler maupun desktop.
- **Kinerja**: Waktu muat halaman dashboard statistik kurang dari 2 detik.
- **Ketersediaan**: Sistem beroperasi 24/7 di server hosting kampus.`
  },
  {
    id: "chap3",
    sectionCode: "BAB 3",
    title: "Project Charter",
    content: `### 3.1 Pendefinisian Project Charter
Project Charter merupakan dokumen inisiasi proyek yang memberikan wewenang kepada tim untuk memulai aktivitas proyek. Dokumen ini mendefinisikan manajer proyek, batas waktu, anggaran total, daftar stakeholder, dan risiko utama yang diantisipasi.

Berikut merupakan rincian Project Charter formal dari **Sistem Informasi Pengaduan Layanan Kampus**:`,
    interactiveComponent: "charter"
  },
  {
    id: "chap4",
    sectionCode: "BAB 4",
    title: "Work Breakdown Structure (WBS)",
    content: `### 4.1 Dekomposisi Pekerjaan (WBS)
Work Breakdown Structure (WBS) adalah dekomposisi hierarkis dari total ruang lingkup pekerjaan yang harus diselesaikan oleh tim proyek untuk mencapai tujuan proyek dan menghasilkan deliverable yang diperlukan. WBS ini dirancang hingga level aktivitas operasional agar mudah ditugaskan ke setiap anggota tim:`,
    interactiveComponent: "wbs"
  },
  {
    id: "chap5",
    sectionCode: "BAB 5",
    title: "Jadwal Proyek & Gantt Chart",
    content: `### 5.1 Estimasi Durasi dan Linimasa
Proyek ini direncanakan berjalan secara efisien selama **8 minggu** (sesuai batasan akademik). Linimasa proyek disusun berdasarkan pembagian fase-fase penting pada WBS, dimulai dari inisiasi di Minggu 1 hingga penutupan dan presentasi di Minggu 8. 

Visualisasi Gantt Chart interaktif berikut menunjukkan keterkaitan waktu, pencapaian target, dan pembagian penanggung jawab (PIC) untuk setiap tahapan utama:`,
    interactiveComponent: "gantt"
  },
  {
    id: "chap6",
    sectionCode: "BAB 6",
    title: "Perencanaan Sumber Daya",
    content: `### 6.1 Analisis Peran Tim Proyek
Untuk mendukung keberhasilan implementasi dalam batas waktu 8 minggu, tim pengembang disusun secara ramping namun fungsional. Anggota tim proyek merupakan simulasi kolaborasi akademis mandiri.

Berikut pembagian peran, tanggung jawab, dan personel yang terlibat dalam proyek:`,
    interactiveComponent: "resources"
  },
  {
    id: "chap7",
    sectionCode: "BAB 7",
    title: "Estimasi Anggaran Proyek",
    content: `### 7.1 Rencana Penggunaan Anggaran (RAB)
Estimasi anggaran disusun secara realistis berdasarkan lingkup pengembangan sistem informasi berbasis web skala kampus menengah. Total anggaran dialokasikan sebesar **Rp9.000.000 (Sembilan Juta Rupiah)** dengan pembagian pos pengeluaran sebagai berikut:`,
    interactiveComponent: "budget"
  },
  {
    id: "chap8",
    sectionCode: "BAB 8",
    title: "Penggunaan Tools Manajemen Proyek",
    content: `### 8.1 Manajemen Tugas Menggunakan Trello Board
Dalam pelaksanaan proyek nyata, kolaborasi harian dikelola menggunakan metode **Kanban Board** via **Trello**. Board dibagi menjadi 5 kolom utama untuk mempermudah visualisasi status pengerjaan:
1. **Backlog**: Semua daftar pekerjaan/fitur dalam rencana besar.
2. **To Do**: Pekerjaan yang siap ditarik untuk dikerjakan dalam waktu dekat.
3. **In Progress**: Pekerjaan yang sedang aktif dikerjakan oleh PIC.
4. **Review/Testing**: Hasil pekerjaan yang sedang diverifikasi kualitasnya oleh Tester.
5. **Done**: Pekerjaan yang sudah dinyatakan selesai dan lolos pengujian.

Berikut adalah papan Trello interaktif simulasi proyek kami. Anda dapat mencoba memindahkan tugas-tugas untuk melihat visualisasi progres proyek nyata:`,
    interactiveComponent: "trello"
  },
  {
    id: "chap9",
    sectionCode: "BAB 9",
    title: "Analisis Risiko dan Mitigasi",
    content: `### 9.1 Matriks Risiko Proyek
Manajemen risiko yang proaktif sangat menentukan keberhasilan proyek. Tim telah mengidentifikasi minimal 8 risiko potensial yang dikelompokkan berdasarkan parameter Dampak (Impact), Probabilitas (Probability), serta menyusun strategi Mitigasi konkret agar proyek tetap berjalan lancar:`,
    interactiveComponent: "risks"
  },
  {
    id: "chap10",
    sectionCode: "BAB 10",
    title: "Monitoring dan Laporan Status Proyek",
    content: `### 10.1 Laporan Status Mingguan (Progress Report)
Sistem monitoring proyek dilakukan berkala. Laporan status dibuat untuk memberikan rangkuman kinerja proyek pada titik tertentu (contoh laporan di bawah ini dibuat pada akhir **Minggu ke-4** dengan kemajuan kumulatif proyek mencapai **50%**):`,
    interactiveComponent: "status"
  },
  {
    id: "chap11",
    sectionCode: "BAB 11",
    title: "Rencana Integrasi dan Pengujian Awal",
    content: `### 11.1 Skenario Pengujian Sistem (Test Suite)
Untuk menjamin keandalan sistem sebelum dideploy di server produksi kampus, tim QA/Tester merancang dokumen Rencana Pengujian Awal menggunakan metode Black-Box Testing pada 5 modul krusial:`,
    interactiveComponent: "tests"
  },
  {
    id: "chap12",
    sectionCode: "BAB 12",
    title: "Inovasi Proyek",
    content: `### 12.1 Nilai Tambah Sistem (Project Innovation)
Agar Sistem Informasi Pengaduan Layanan Kampus ini memiliki daya saing dan keunikan akademis, tim menambahkan 3 pilar inovasi fungsional dalam rancangan proyek ini:`,
    interactiveComponent: "innovations"
  }
];
