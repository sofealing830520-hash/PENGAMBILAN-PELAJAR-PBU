// ============================================================
// EXPORT.JS — Eksport Excel, PDF, Cetak
// Dashboard Pengambilan Pelajar — Politeknik Balik Pulau
// ============================================================

// ---- Eksport CSV (Excel-compatible) ----
function eksportExcel() {
  if (typeof dataFiltered === 'undefined' || dataFiltered.length === 0) {
    alert('Tiada data untuk dieksport.');
    return;
  }

  const headers = ['Bil', 'Nama Pelajar', 'Jantina', 'Program', 'Negeri', 'Status', 'Sesi', 'Gred SPM', 'Tarikh Mohon'];
  const rows = dataFiltered.map((p, i) => [
    i + 1,
    p.nama,
    p.jantina,
    p.program,
    p.negeri,
    p.status,
    p.sesi,
    p.gred_spm,
    p.tarikh_mohon,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF'; // BOM untuk Excel baca UTF-8 dengan betul
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const tarikh = new Date().toLocaleDateString('ms-MY').replace(/\//g, '-');
  a.href = url;
  a.download = `Pengambilan_Pelajar_PBP_${tarikh}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Eksport PDF ----
function eksportPDF() {
  if (typeof window.jspdf === 'undefined') {
    alert('Pustaka jsPDF tidak dimuatkan. Sila semak sambungan internet.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const tarikh = new Date().toLocaleDateString('ms-MY', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // Header
  doc.setFillColor(0, 48, 135);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('POLITEKNIK BALIK PULAU', 105, 11, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Laporan Dashboard Pengambilan Pelajar', 105, 18, { align: 'center' });
  doc.text(`Tarikh Cetak: ${tarikh}`, 105, 24, { align: 'center' });

  // KPI Summary
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN PENGAMBILAN', 14, 38);

  const kpiData = hitungKPI(dataFiltered);
  const kpiRows = [
    ['Jumlah Permohonan', kpiData.jumlah],
    ['Diterima', kpiData.diterima],
    ['Ditolak', kpiData.ditolak],
    ['Senarai Tunggu', kpiData.tunggu],
    ['Belum Daftar', kpiData.belumDaftar],
    ['Peratus Pengisian', `${kpiData.peratusKuota}%`],
  ];

  let y = 44;
  doc.setFontSize(10);
  kpiRows.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), 80, y);
    y += 7;
  });

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y + 2, 196, y + 2);
  y += 8;

  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SENARAI PELAJAR', 14, y);
  y += 6;

  const cols = ['Bil', 'Nama Pelajar', 'Program', 'Negeri', 'Status'];
  const colWidths = [10, 60, 45, 35, 28];
  let x = 14;

  doc.setFontSize(9);
  doc.setFillColor(0, 48, 135);
  doc.setTextColor(255, 255, 255);
  doc.rect(14, y - 4, 182, 7, 'F');
  cols.forEach((col, i) => {
    doc.text(col, x + 2, y);
    x += colWidths[i];
  });
  y += 4;

  // Table rows
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');
  const maxRows = Math.min(dataFiltered.length, 30);
  for (let i = 0; i < maxRows; i++) {
    const p = dataFiltered[i];
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const rowData = [i + 1, p.nama.substring(0, 30), p.program.substring(0, 22), p.negeri, p.status];
    if (i % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(14, y - 3, 182, 6, 'F');
    }
    x = 14;
    rowData.forEach((cell, ci) => {
      doc.text(String(cell), x + 2, y);
      x += colWidths[ci];
    });
    y += 6;
  }

  if (dataFiltered.length > 30) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`... dan ${dataFiltered.length - 30} rekod lagi. Sila eksport ke Excel untuk senarai penuh.`, 14, y + 4);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Halaman ${i} daripada ${pageCount} — Sistem Dashboard Pengambilan Pelajar, Politeknik Balik Pulau`, 105, 290, { align: 'center' });
  }

  doc.save(`Laporan_Pengambilan_PBP_${new Date().toLocaleDateString('ms-MY').replace(/\//g, '-')}.pdf`);
}

// ---- Mod Cetak ----
function modCetak() {
  window.print();
}
