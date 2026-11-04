// ============================================================
// CHARTS.JS — Visualisasi Chart.js
// Dashboard Pengambilan Pelajar — Politeknik Balik Pulau
// ============================================================

const WARNA_STATUS = {
  'Diterima':       '#22c55e',
  'Ditolak':        '#ef4444',
  'Senarai Tunggu': '#f59e0b',
  'Belum Daftar':   '#94a3b8',
};

const WARNA_PROGRAM = [
  '#003087', '#1e5fa8', '#3b82f6', '#60a5fa',
  '#FFD700', '#fbbf24', '#f59e0b', '#d97706',
];

let chartProgram = null;
let chartStatus  = null;
let chartNegeri  = null;
let chartTrend   = null;

// ---- Kira data carta ----

function kiraPerProgram(data) {
  const result = {};
  PROGRAM_LIST.forEach(p => result[p] = 0);
  data.forEach(d => { if (result[d.program] !== undefined) result[d.program]++; });
  return result;
}

function kiraPerStatus(data) {
  const result = {};
  STATUS_LIST.forEach(s => result[s] = 0);
  data.forEach(d => { if (result[d.status] !== undefined) result[d.status]++; });
  return result;
}

function kiraPerNegeri(data) {
  const result = {};
  data.forEach(d => {
    result[d.negeri] = (result[d.negeri] || 0) + 1;
  });
  // Isih mengikut nilai menurun
  return Object.fromEntries(
    Object.entries(result).sort((a, b) => b[1] - a[1])
  );
}

function kiraTrend(data) {
  const sesiKira = {};
  SESI_LIST.forEach(s => sesiKira[s] = 0);
  data.forEach(d => {
    if (sesiKira[d.sesi] !== undefined) sesiKira[d.sesi]++;
  });
  return sesiKira;
}

// ---- Bina / Kemaskini Carta ----

function binaCartaProgram(data) {
  const kira = kiraPerProgram(data);
  const labels = Object.keys(kira);
  const values = Object.values(kira);

  const ctx = document.getElementById('cartaProgram').getContext('2d');
  if (chartProgram) chartProgram.destroy();

  chartProgram = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Bilangan Permohonan',
        data: values,
        backgroundColor: WARNA_PROGRAM,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} permohonan`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Bilangan' },
        },
        x: {
          ticks: { maxRotation: 30, font: { size: 11 } },
        },
      },
    },
  });
}

function binaCartaStatus(data) {
  const kira = kiraPerStatus(data);
  const labels = Object.keys(kira);
  const values = Object.values(kira);
  const colors = labels.map(l => WARNA_STATUS[l]);

  const ctx = document.getElementById('cartaStatus').getContext('2d');
  if (chartStatus) chartStatus.destroy();

  chartStatus = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, font: { size: 12 } },
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} pelajar`,
          },
        },
      },
    },
  });
}

function binaCartaNegeri(data) {
  const kira = kiraPerNegeri(data);
  const labels = Object.keys(kira);
  const values = Object.values(kira);

  const ctx = document.getElementById('cartaNegeri').getContext('2d');
  if (chartNegeri) chartNegeri.destroy();

  chartNegeri = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Bilangan Pelajar',
        data: values,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} pelajar`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Bilangan' },
        },
      },
    },
  });
}

function binaCartaTrend(data) {
  const kira = kiraTrend(data);
  const labels = Object.keys(kira);
  const values = Object.values(kira);

  const ctx = document.getElementById('cartaTrend').getContext('2d');
  if (chartTrend) chartTrend.destroy();

  chartTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Jumlah Permohonan',
        data: values,
        borderColor: '#003087',
        backgroundColor: 'rgba(0, 48, 135, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#003087',
        pointRadius: 5,
        tension: 0.3,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} permohonan`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Bilangan' },
        },
      },
    },
  });
}

function refreshCharts(data) {
  binaCartaProgram(data);
  binaCartaStatus(data);
  binaCartaNegeri(data);
  binaCartaTrend(data);
}
