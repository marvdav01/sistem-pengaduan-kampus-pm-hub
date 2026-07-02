import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

import {
  initialChapters,
  projectMembers,
  initialBudget,
  projectRisks,
  initialGanttTasks,
  initialTrelloCards,
  projectTests
} from '../src/data';

// ─── Configuration ───────────────────────────────────────────────────
const STUDENT_NAME = 'Edisyah Putra Waruwu';
const STUDENT_NIM = '411231179';
const STUDENT_CLASS = 'Manajemen Proyek Perangkat Lunak - Kelas Sore';
const UNIV_NAME = 'Universitas Dira';
const ACADEMIC_YEAR = '2026/2027';

// ─── Helpers ─────────────────────────────────────────────────────────
const PAGE_WIDTH = 595.28; // A4 width in points
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function stripMarkdown(text: string): string {
  return text
    .replace(/### (.*)/g, '\n$1\n')
    .replace(/## (.*)/g, '\n$1\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/- /g, '  • ');
}

// ─── Build PDF ───────────────────────────────────────────────────────
const doc = new PDFDocument({
  size: 'A4',
  margin: MARGIN,
  info: {
    Title: 'Laporan Akhir Tugas Besar - MPPL - SIPELAK',
    Author: STUDENT_NAME,
    Subject: 'Manajemen Proyek Perangkat Lunak',
    Creator: 'SIPELAK PDF Generator'
  }
});

const outputPath = path.join(process.cwd(), 'Laporan_Proyek_Sipelak.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// ═════════════════════════════════════════════════════════════════════
//  HALAMAN SAMPUL (COVER PAGE)
// ═════════════════════════════════════════════════════════════════════
doc.moveDown(6);
doc.fontSize(22).font('Helvetica-Bold').text('LAPORAN AKHIR TUGAS BESAR', { align: 'center' });
doc.fontSize(20).text('MANAJEMEN PROYEK PERANGKAT LUNAK', { align: 'center' });
doc.moveDown(2);

// Garis dekoratif
doc.moveTo(MARGIN + 80, doc.y).lineTo(PAGE_WIDTH - MARGIN - 80, doc.y).lineWidth(2).stroke('#0d9488');
doc.moveDown(2);

doc.fontSize(16).font('Helvetica-Bold').fillColor('#0d9488')
  .text('RANCANGAN PENGEMBANGAN', { align: 'center' })
  .text('SISTEM INFORMASI PENGADUAN', { align: 'center' })
  .text('LAYANAN KAMPUS (SIPELAK)', { align: 'center' });
doc.fillColor('#000000');
doc.moveDown(4);

doc.fontSize(12).font('Helvetica-Bold').text('Disusun Oleh:', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text(`Nama     : ${STUDENT_NAME}`, { align: 'center' });
doc.text(`NIM      : ${STUDENT_NIM}`, { align: 'center' });
doc.text(`Kelas    : ${STUDENT_CLASS}`, { align: 'center' });
doc.text(`Instansi : ${UNIV_NAME}`, { align: 'center' });
doc.text(`Tahun Akademik : ${ACADEMIC_YEAR}`, { align: 'center' });

// ═════════════════════════════════════════════════════════════════════
//  DAFTAR ISI
// ═════════════════════════════════════════════════════════════════════
doc.addPage();
doc.fontSize(18).font('Helvetica-Bold').text('DAFTAR ISI', { align: 'center' });
doc.moveDown(1);
doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).lineWidth(1).stroke('#cbd5e1');
doc.moveDown(1);

initialChapters.forEach((chapter, index) => {
  doc.fontSize(11).font('Helvetica')
    .text(`${chapter.sectionCode}  ${chapter.title}`, MARGIN, doc.y, {
      continued: false,
      width: CONTENT_WIDTH
    });
  doc.moveDown(0.3);
});

// ═════════════════════════════════════════════════════════════════════
//  HALAMAN BAB-BAB KONTEN
// ═════════════════════════════════════════════════════════════════════

// Helper: safe check page space, add page if needed
function ensureSpace(needed: number) {
  if (doc.y + needed > 750) {
    doc.addPage();
  }
}

// Helper: draw simple table
function drawTable(headers: string[], rows: string[][], colWidths: number[]) {
  const ROW_PADDING = 6;
  const FONT_SIZE = 9;

  // Header
  ensureSpace(30);
  let x = MARGIN;
  doc.fontSize(FONT_SIZE).font('Helvetica-Bold');
  const headerY = doc.y;
  doc.rect(MARGIN, headerY, CONTENT_WIDTH, 22).fill('#f1f5f9').stroke('#e2e8f0');
  doc.fillColor('#334155');
  headers.forEach((h, i) => {
    doc.text(h, x + 4, headerY + ROW_PADDING, { width: colWidths[i] - 8, height: 16 });
    x += colWidths[i];
  });
  doc.y = headerY + 22;

  // Data rows
  doc.font('Helvetica').fillColor('#1e293b');
  rows.forEach((row) => {
    // Calculate dynamic row height
    let maxH = 14;
    row.forEach((cell, ci) => {
      const h = doc.heightOfString(cell, { width: colWidths[ci] - 8 });
      if (h + ROW_PADDING * 2 > maxH) maxH = h + ROW_PADDING * 2;
    });

    ensureSpace(maxH + 4);
    const rowY = doc.y;

    // Row border
    doc.rect(MARGIN, rowY, CONTENT_WIDTH, maxH).stroke('#e2e8f0');

    x = MARGIN;
    row.forEach((cell, ci) => {
      doc.text(cell, x + 4, rowY + ROW_PADDING, { width: colWidths[ci] - 8 });
      x += colWidths[ci];
    });
    doc.y = rowY + maxH;
  });
  doc.moveDown(1);
}

initialChapters.forEach((chapter) => {
  doc.addPage();

  // ── Chapter Title ──
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f172a')
    .text(`${chapter.sectionCode} - ${chapter.title}`);
  doc.moveDown(0.3);
  doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).lineWidth(2).stroke('#0d9488');
  doc.moveDown(1);

  // ── Chapter Body Text ──
  const plainText = stripMarkdown(chapter.content);
  doc.fontSize(11).font('Helvetica').fillColor('#1e293b')
    .text(plainText, { align: 'justify', lineGap: 4 });
  doc.moveDown(1);

  // ════════════════════════════════════════════════════════════════
  //  DATA TABEL PER-BAB (Interactive Component Data)
  // ════════════════════════════════════════════════════════════════

  // ── BAB 3: Project Charter ──
  if (chapter.interactiveComponent === 'charter') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 3.1 Project Charter Formal');
    doc.moveDown(0.5);

    const charterData = [
      ['Nama Proyek', 'Sistem Informasi Pengaduan Layanan Kampus (SIPELAK)'],
      ['Organisasi Kampus', UNIV_NAME],
      ['Durasi Proyek', '8 Minggu'],
      ['Sponsor Utama', 'Wakil Rektor Bidang Sarana & Prasarana'],
      ['Pimpinan Proyek (PM)', `${STUDENT_NAME} (NIM: ${STUDENT_NIM})`],
      ['Tujuan Proyek', 'Membangun platform terpusat untuk pengelolaan pengaduan layanan kampus dengan transparansi status dan dashboard evaluasi pimpinan.'],
      ['Ruang Lingkup', 'Modul Login Multi-Role, Form Pengaduan, Verifikasi Admin, Distribusi Petugas, Dashboard Statistik Pimpinan.'],
      ['Anggaran Total', formatRupiah(9000000)],
      ['Stakeholder Utama', 'Mahasiswa, Admin Kampus, Petugas Unit, Pimpinan Kampus'],
      ['Risiko Utama', 'Perubahan kebutuhan di tengah jalan, keterlambatan jadwal, dan kebocoran data mahasiswa.'],
      ['Kriteria Keberhasilan', 'Sistem berjalan sepenuhnya dan mampu menangani minimal 6 kategori pengaduan, dengan waktu respons < 2 detik.']
    ];

    drawTable(
      ['Atribut Charter', 'Deskripsi / Nilai'],
      charterData,
      [CONTENT_WIDTH * 0.3, CONTENT_WIDTH * 0.7]
    );
  }

  // ── BAB 4: Work Breakdown Structure ──
  if (chapter.interactiveComponent === 'wbs') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 4.1 Work Breakdown Structure (WBS)');
    doc.moveDown(0.5);

    const wbsItems = [
      { code: '1', title: 'Proyek Sistem Informasi Pengaduan Layanan Kampus', desc: 'Keseluruhan siklus hidup proyek' },
      { code: '1.1', title: 'Inisiasi Proyek', desc: 'Identifikasi masalah, tujuan, Project Charter' },
      { code: '1.1.1', title: 'Identifikasi masalah layanan kampus', desc: 'Studi kelayakan' },
      { code: '1.1.2', title: 'Perumusan tujuan dan sasaran proyek', desc: 'Penyesuaian objektif' },
      { code: '1.1.3', title: 'Penyusunan Project Charter', desc: 'Sign-off formal dari rektorat' },
      { code: '1.2', title: 'Analisis Kebutuhan', desc: 'Spesifikasi SRS' },
      { code: '1.2.1', title: 'Interview dan FGD stakeholder', desc: 'Pengumpulan data primer' },
      { code: '1.2.2', title: 'Penyusunan kebutuhan fungsional & non-fungsional', desc: 'Matriks prioritas' },
      { code: '1.3', title: 'Perancangan Sistem', desc: 'ERD & Figma design' },
      { code: '1.3.1', title: 'Perancangan alur pengaduan & database', desc: 'Skema relasional' },
      { code: '1.3.2', title: 'Desain UI/UX (wireframe & prototipe)', desc: 'Mockup interaktif' },
      { code: '1.4', title: 'Pengembangan Sistem', desc: 'Fase coding utama' },
      { code: '1.4.1', title: 'Modul login & form pengaduan', desc: 'Frontend & backend' },
      { code: '1.4.2', title: 'Modul verifikasi & distribusi admin', desc: 'Workflow admin' },
      { code: '1.4.3', title: 'Modul respon & komentar petugas', desc: 'Interaksi dua arah' },
      { code: '1.4.4', title: 'Modul notifikasi status', desc: 'Real-time update' },
      { code: '1.4.5', title: 'Modul dashboard & laporan pimpinan', desc: 'Statistik visual' },
      { code: '1.5', title: 'Pengujian Sistem', desc: 'Quality assurance' },
      { code: '1.5.1', title: 'Pengujian unit & integrasi', desc: 'Unit test otomatis' },
      { code: '1.5.2', title: 'Pengujian input pengaduan & perubahan status', desc: 'Black-box testing' },
      { code: '1.6', title: 'Evaluasi dan Penutupan', desc: 'Serah terima final' },
      { code: '1.6.1', title: 'Penyusunan laporan akhir proyek', desc: 'Dokumentasi lengkap' },
      { code: '1.6.2', title: 'Presentasi dan evaluasi akhir', desc: 'Persetujuan sponsor' },
    ];

    drawTable(
      ['Kode WBS', 'Aktivitas / Deliverable', 'Keterangan'],
      wbsItems.map(w => [w.code, w.title, w.desc]),
      [CONTENT_WIDTH * 0.12, CONTENT_WIDTH * 0.50, CONTENT_WIDTH * 0.38]
    );
  }

  // ── BAB 5: Gantt Chart ──
  if (chapter.interactiveComponent === 'gantt') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 5.1 Jadwal Proyek (Gantt Chart)');
    doc.moveDown(0.5);

    // Table header
    const ganttHeaders = ['Aktivitas Utama', 'PIC', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', '%'];
    const wCol = CONTENT_WIDTH * 0.28;
    const picCol = CONTENT_WIDTH * 0.12;
    const weekCol = (CONTENT_WIDTH - wCol - picCol - CONTENT_WIDTH * 0.06) / 8;
    const pctCol = CONTENT_WIDTH * 0.06;
    const ganttColWidths = [wCol, picCol, ...Array(8).fill(weekCol), pctCol] as number[];

    const ganttRows = initialGanttTasks.map(t => {
      const weeks = Array.from({ length: 8 }, (_, i) => {
        const week = i + 1;
        return week >= t.startWeek && week <= t.endWeek ? '█' : '';
      });
      return [t.name, t.resources.join(', '), ...weeks, `${t.progress}%`];
    });

    drawTable(ganttHeaders, ganttRows, ganttColWidths);

    doc.fontSize(9).font('Helvetica-Oblique').fillColor('#64748b')
      .text('Keterangan: █ menandakan minggu aktif pengerjaan. PIC = Penanggung Jawab.', { align: 'left' });
    doc.fillColor('#1e293b');
  }

  // ── BAB 6: Sumber Daya / Tim Proyek ──
  if (chapter.interactiveComponent === 'resources') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 6.1 Struktur Tim Proyek');
    doc.moveDown(0.5);

    const resRows = projectMembers.map((m, i) => [
      m.role,
      i === 0 ? `${STUDENT_NAME} (NIM: ${STUDENT_NIM})` : m.name,
      m.responsibilities.map((r, ri) => `${ri + 1}. ${r}`).join('\n')
    ]);

    drawTable(
      ['Peran', 'Nama Anggota', 'Tanggung Jawab Utama'],
      resRows,
      [CONTENT_WIDTH * 0.22, CONTENT_WIDTH * 0.22, CONTENT_WIDTH * 0.56]
    );
  }

  // ── BAB 7: Anggaran ──
  if (chapter.interactiveComponent === 'budget') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 7.1 Rencana Anggaran Biaya (RAB)');
    doc.moveDown(0.5);

    let total = 0;
    const budgetRows = initialBudget.map(b => {
      total += b.cost;
      return [String(b.id), b.component, formatRupiah(b.cost)];
    });
    budgetRows.push(['', 'Total Estimasi Anggaran Proyek', formatRupiah(total)]);

    drawTable(
      ['No', 'Komponen Pengeluaran', 'Biaya (Rp)'],
      budgetRows,
      [CONTENT_WIDTH * 0.06, CONTENT_WIDTH * 0.64, CONTENT_WIDTH * 0.30]
    );
  }

  // ── BAB 8: Trello Board ──
  if (chapter.interactiveComponent === 'trello') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 8.1 Status Tugas Kanban Board (Trello)');
    doc.moveDown(0.5);

    const trelloRows = initialTrelloCards.map(c => {
      const checkDone = c.checklist.filter(x => x.done).length;
      const checkTotal = c.checklist.length;
      return [
        c.id,
        c.name,
        c.pic,
        c.status,
        c.label,
        `${checkDone}/${checkTotal} selesai`,
        c.dueDate
      ];
    });

    drawTable(
      ['ID', 'Nama Tugas', 'PIC', 'Status', 'Prioritas', 'Checklist', 'Deadline'],
      trelloRows,
      [
        CONTENT_WIDTH * 0.08,
        CONTENT_WIDTH * 0.22,
        CONTENT_WIDTH * 0.14,
        CONTENT_WIDTH * 0.12,
        CONTENT_WIDTH * 0.14,
        CONTENT_WIDTH * 0.12,
        CONTENT_WIDTH * 0.10
      ]
    );

    // Deskripsi masing-masing kartu
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica-Bold').text('Detail Deskripsi Tugas:');
    doc.moveDown(0.3);
    initialTrelloCards.forEach(c => {
      ensureSpace(50);
      doc.fontSize(9).font('Helvetica-Bold').text(`${c.id} - ${c.name}:`);
      doc.font('Helvetica').text(c.description, { indent: 10 });
      if (c.checklist.length > 0) {
        c.checklist.forEach(item => {
          doc.text(`  ${item.done ? '☑' : '☐'} ${item.text}`, { indent: 10 });
        });
      }
      doc.moveDown(0.3);
    });
  }

  // ── BAB 9: Risiko ──
  if (chapter.interactiveComponent === 'risks') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 9.1 Matriks Analisis Risiko Proyek');
    doc.moveDown(0.5);

    const riskRows = projectRisks.map(r => [
      String(r.id),
      r.name,
      r.category,
      r.impact,
      r.probability,
      r.mitigation
    ]);

    drawTable(
      ['No', 'Nama Risiko', 'Kategori', 'Dampak', 'Probabilitas', 'Strategi Mitigasi'],
      riskRows,
      [
        CONTENT_WIDTH * 0.04,
        CONTENT_WIDTH * 0.20,
        CONTENT_WIDTH * 0.10,
        CONTENT_WIDTH * 0.08,
        CONTENT_WIDTH * 0.10,
        CONTENT_WIDTH * 0.48
      ]
    );
  }

  // ── BAB 10: Monitoring / Laporan Status ──
  if (chapter.interactiveComponent === 'status') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 10.1 Laporan Status Proyek (Minggu ke-4)');
    doc.moveDown(0.5);

    const statusData = [
      ['Periode Pelaporan', 'Akhir Minggu ke-4'],
      ['Status Keseluruhan', 'On Track (Sesuai Jadwal)'],
      ['Kemajuan Kumulatif', '50%'],
      ['Milestone Tercapai', 'Project Charter, SRS, WBS, Jadwal, & RAB telah selesai disusun.'],
      ['Aktivitas Berjalan', 'Perancangan Database (ERD) & desain UI/UX sedang dalam proses finalisasi.'],
      ['Risiko Aktif', 'Potensi keterlambatan jadwal modul utama (mitigasi: prioritisasi MVP).'],
      ['Anggaran Terpakai', `${formatRupiah(3500000)} dari total ${formatRupiah(9000000)} (38.9%)`],
      ['Catatan PM', 'Komunikasi tim berjalan baik melalui Trello. Perlu perhatian khusus pada fase coding M5-M6.'],
      ['Rencana Minggu Depan', 'Memulai fase coding modul login dan form pengaduan (Sprint 1).']
    ];

    drawTable(
      ['Atribut Status', 'Keterangan'],
      statusData,
      [CONTENT_WIDTH * 0.30, CONTENT_WIDTH * 0.70]
    );

    // Progress bar textual
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('Ringkasan Progres Per Fase:');
    doc.moveDown(0.3);
    initialGanttTasks.forEach(t => {
      ensureSpace(20);
      doc.fontSize(9).font('Helvetica')
        .text(`  ▸ ${t.name}: ${t.progress}% selesai (Minggu ${t.startWeek}-${t.endWeek}, PIC: ${t.resources.join(', ')})`);
    });
  }

  // ── BAB 11: Pengujian ──
  if (chapter.interactiveComponent === 'tests') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 11.1 Skenario Pengujian Sistem (Black-Box Testing)');
    doc.moveDown(0.5);

    const testRows = projectTests.map(t => [
      String(t.id),
      t.module,
      t.scenario,
      t.expected
    ]);

    drawTable(
      ['No', 'Modul', 'Skenario Pengujian', 'Hasil yang Diharapkan'],
      testRows,
      [
        CONTENT_WIDTH * 0.04,
        CONTENT_WIDTH * 0.16,
        CONTENT_WIDTH * 0.40,
        CONTENT_WIDTH * 0.40
      ]
    );
  }

  // ── BAB 12: Inovasi ──
  if (chapter.interactiveComponent === 'innovations') {
    ensureSpace(200);
    doc.fontSize(12).font('Helvetica-Bold').text('Tabel 12.1 Nilai Tambah dan Inovasi Proyek');
    doc.moveDown(0.5);

    const innovationData = [
      [
        '1',
        'Chatbot AI Asisten Pengaduan',
        'Integrasi model AI (Gemini) untuk membantu mahasiswa mengisi form pengaduan secara otomatis dan menjawab FAQ terkait layanan kampus.',
        'Efisiensi pengisian form meningkat, mahasiswa mendapat respons instan 24/7 tanpa bergantung pada jam kerja admin.'
      ],
      [
        '2',
        'Dashboard Analitik Real-time',
        'Panel visualisasi statistik interaktif berbasis grafik (bar chart, distribusi kategori, persentase penyelesaian) untuk pimpinan kampus.',
        'Pimpinan dapat memonitor dan mengevaluasi performa penanganan keluhan layanan kampus secara berkala dan akurat.'
      ],
      [
        '3',
        'Sistem Notifikasi & Transparansi Status',
        'Mekanisme pelacakan status pengaduan real-time (Diajukan → Diverifikasi → Diproses → Selesai) yang dapat diakses langsung oleh mahasiswa pelapor.',
        'Transparansi meningkat, mahasiswa tidak perlu lagi bertanya ke loket, dan kepuasan terhadap layanan kampus meningkat secara keseluruhan.'
      ]
    ];

    drawTable(
      ['No', 'Nama Inovasi', 'Deskripsi', 'Manfaat'],
      innovationData,
      [
        CONTENT_WIDTH * 0.04,
        CONTENT_WIDTH * 0.18,
        CONTENT_WIDTH * 0.42,
        CONTENT_WIDTH * 0.36
      ]
    );
  }
});

// ═════════════════════════════════════════════════════════════════════
//  HALAMAN PENUTUP
// ═════════════════════════════════════════════════════════════════════
doc.addPage();
doc.fontSize(16).font('Helvetica-Bold').text('PENUTUP', { align: 'center' });
doc.moveDown(1);
doc.moveTo(MARGIN, doc.y).lineTo(PAGE_WIDTH - MARGIN, doc.y).lineWidth(1).stroke('#cbd5e1');
doc.moveDown(1);

doc.fontSize(11).font('Helvetica').fillColor('#1e293b').text(
  'Demikian laporan akhir proyek Manajemen Proyek Perangkat Lunak ini disusun sebagai dokumentasi lengkap dari seluruh proses perencanaan, perancangan, pengembangan, dan pengujian Sistem Informasi Pengaduan Layanan Kampus (SIPELAK).\n\n' +
  'Proyek ini telah mencakup seluruh aspek manajemen proyek perangkat lunak, mulai dari penyusunan Project Charter, identifikasi kebutuhan fungsional dan non-fungsional, dekomposisi pekerjaan melalui Work Breakdown Structure (WBS), penjadwalan menggunakan Gantt Chart, perencanaan sumber daya dan anggaran, manajemen tugas menggunakan Trello Board, analisis dan mitigasi risiko, hingga perencanaan pengujian sistem.\n\n' +
  'Sistem SIPELAK dirancang sebagai solusi terpusat untuk mengelola keluhan mahasiswa terhadap layanan kampus (fasilitas, IT, akademik, kebersihan, keamanan, dan administrasi) dengan menekankan transparansi status, kecepatan penanganan, dan kemudahan evaluasi oleh pimpinan kampus.\n\n' +
  'Dengan adanya sistem ini, diharapkan komunikasi antara mahasiswa sebagai pelapor dan unit-unit pelayanan kampus menjadi lebih efisien, terstruktur, dan dapat dipertanggungjawabkan.\n\n' +
  'Penulis menyadari bahwa laporan ini masih memiliki keterbatasan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan demi perbaikan di masa yang akan datang.',
  { align: 'justify', lineGap: 5 }
);

doc.moveDown(4);
doc.fontSize(11).font('Helvetica').text(`${UNIV_NAME}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'right' });
doc.moveDown(0.5);
doc.text('Penyusun,', { align: 'right' });
doc.moveDown(3);
doc.font('Helvetica-Bold').text(STUDENT_NAME, { align: 'right', underline: true });
doc.font('Helvetica').text(`NIM: ${STUDENT_NIM}`, { align: 'right' });

// ═════════════════════════════════════════════════════════════════════
doc.end();

console.log('✅ PDF Laporan Lengkap berhasil di-generate!');
console.log('📄 Lokasi: ' + outputPath);
console.log('📊 Jumlah BAB: ' + initialChapters.length);
console.log('📋 Tabel data: Charter, WBS, Gantt, Sumber Daya, Anggaran, Trello, Risiko, Monitoring, Pengujian, Inovasi');
