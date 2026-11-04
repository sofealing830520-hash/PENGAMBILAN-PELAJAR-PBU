// ============================================================
// APP.JS — Logik Utama, KPI, Penapis, Jadual
// Dashboard Pengambilan Pelajar — Politeknik Balik Pulau
// ============================================================

let dataFiltered = [...dataPelajar];
let halamanSemasa = 1;
const REKOD_PER_HALAMAN = 10;
let sortLajur = null;
let sortArah = 'asc';
let carian = '';

// ============================================================
// KPI
// ============================================================

function hitungKPI(data) {
  const jumlah = data.length;
  const diterima = data.filter(d => d.status === 'Diterima').length;
  const ditolak = data.filter(d => d.status === 'Ditolak').length;
  const tunggu = data.filter(d => d.status === 'Senarai Tunggu').length;
  const belumDaftar = data.filter(d => d.status === 'Belum Daftar').length;
  const peratusKuota = KUOTA_JUMLAH > 0 ? Math.round((diterima / KUOTA_JUMLAH) * 100) : 0;
  return { jumlah, diterima, ditolak, tunggu, belumDaftar, peratusKuota };
}

function kemasKiniKPI(data) {
  const kpi = hitungKPI(data);
  document.getElementById('kpiJumlah').textContent = kpi.jumlah;
  document.getElementById('kpiDiterima').textContent = kpi.diterima;
  document.getElementById('kpiDitolak').textContent = kpi.ditolak;
  document.getElementById('kpiTunggu').textContent = kpi.tunggu;
  document.getElementById('kpiBelumDaftar').textContent = kpi.belumDaftar;
  document.getElementById('kpiKuota').textContent = kpi.peratusKuota + '%';

  // Bar pengisian kuota
  const bar = document.getElementById('kuotaBar');
  if (bar) {
    bar.style.width = Math.min(kpi.peratusKuota, 100) + '%';
    bar.style.backgroundColor = kpi.peratusKuota >= 80 ? '#22c55e' : kpi.peratusKuota >= 50 ? '#f59e0b' : '#ef4444';
  }
}

// ============================================================
// PENAPIS
// ============================================================

function isiDropdown() {
  const sesiSel = document.getElementById('filterSesi');
  const progSel = document.getElementById('filterProgram');
  const negeriSel = document.getElementById('filterNegeri');
  const statusSel = document.getElementById('filterStatus');
  const jantinaSel = document.getElementById('filterJantina');

  SESI_LIST.forEach(s => sesiSel.add(new Option(s, s)));
  PROGRAM_LIST.forEach(p => progSel.add(new Option(p, p)));
  NEGERI_LIST.sort().forEach(n => negeriSel.add(new Option(n, n)));
  STATUS_LIST.forEach(s => statusSel.add(new Option(s, s)));
  JANTINA_LIST.forEach(j => jantinaSel.add(new Option(j, j)));
}

function gunakanPenapis() {
  const sesi = document.getElementById('filterSesi').value;
  const program = document.getElementById('filterProgram').value;
  const negeri = document.getElementById('filterNegeri').value;
  const status = document.getElementById('filterStatus').value;
  const jantina = document.getElementById('filterJantina').value;

  dataFiltered = dataPelajar.filter(d => {
    return (!sesi || d.sesi === sesi) &&
           (!program || d.program === program) &&
           (!negeri || d.negeri === negeri) &&
           (!status || d.status === status) &&
           (!jantina || d.jantina === jantina) &&
           (!carian || d.nama.toLowerCase().includes(carian.toLowerCase()));
  });

  halamanSemasa = 1;
  kemasKiniLabel(sesi, program, negeri, status, jantina);
  kemasKiniKPI(dataFiltered);
  refreshCharts(dataFiltered);
  renderJadual();
}

function kemasKiniLabel(sesi, program, negeri, status, jantina) {
  const aktif = [sesi, program, negeri, status, jantina].filter(Boolean);
  const el = document.getElementById('labelPenapis');
  if (aktif.length === 0) {
    el.textContent = '';
    el.style.display = 'none';
  } else {
    el.textContent = 'Penapis aktif: ' + aktif.join(' | ');
    el.style.display = 'inline-block';
  }
}

function setSemulapenapis() {
  ['filterSesi', 'filterProgram', 'filterNegeri', 'filterStatus', 'filterJantina'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('carian').value = '';
  carian = '';
  dataFiltered = [...dataPelajar];
  halamanSemasa = 1;
  document.getElementById('labelPenapis').textContent = '';
  document.getElementById('labelPenapis').style.display = 'none';
  kemasKiniKPI(dataFiltered);
  refreshCharts(dataFiltered);
  renderJadual();
}

// ============================================================
// JADUAL
// ============================================================

function renderJadual() {
  let data = [...dataFiltered];

  // Isih
  if (sortLajur) {
    data.sort((a, b) => {
      const va = String(a[sortLajur]).toLowerCase();
      const vb = String(b[sortLajur]).toLowerCase();
      const cmp = va.localeCompare(vb);
      return sortArah === 'asc' ? cmp : -cmp;
    });
  }

  // Pagination
  const jumlah = data.length;
  const jumlahHalaman = Math.max(1, Math.ceil(jumlah / REKOD_PER_HALAMAN));
  if (halamanSemasa > jumlahHalaman) halamanSemasa = jumlahHalaman;

  const mula = (halamanSemasa - 1) * REKOD_PER_HALAMAN;
  const halaman = data.slice(mula, mula + REKOD_PER_HALAMAN);

  const tbody = document.getElementById('jadualBody');
  tbody.innerHTML = '';

  if (halaman.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:2rem;">Tiada rekod dijumpai.</td></tr>';
  } else {
    halaman.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.className = `baris-${p.status.toLowerCase().replace(' ', '-')}`;
      tr.innerHTML = `
        <td>${mula + i + 1}</td>
        <td>${p.nama}</td>
        <td>${p.jantina}</td>
        <td>${p.program}</td>
        <td>${p.negeri}</td>
        <td><span class="badge badge-${statusKelas(p.status)}">${p.status}</span></td>
        <td>${p.sesi}</td>
        <td>${p.gred_spm}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Info rekod
  document.getElementById('infoRekod').textContent =
    jumlah === 0
      ? 'Tiada rekod'
      : `Menunjukkan ${mula + 1}–${Math.min(mula + REKOD_PER_HALAMAN, jumlah)} daripada ${jumlah} rekod`;

  renderPagination(jumlahHalaman);
  kemasKiniSortIkon();
}

function statusKelas(status) {
  const map = {
    'Diterima': 'hijau',
    'Ditolak': 'merah',
    'Senarai Tunggu': 'kuning',
    'Belum Daftar': 'kelabu',
  };
  return map[status] || 'kelabu';
}

function renderPagination(jumlahHalaman) {
  const el = document.getElementById('pagination');
  el.innerHTML = '';

  const btnPrev = document.createElement('button');
  btnPrev.textContent = '← Sebelum';
  btnPrev.disabled = halamanSemasa === 1;
  btnPrev.onclick = () => { halamanSemasa--; renderJadual(); };
  el.appendChild(btnPrev);

  // Papar nombor halaman (max 5 butang)
  const range = halamanJulat(halamanSemasa, jumlahHalaman);
  range.forEach(h => {
    const btn = document.createElement('button');
    btn.textContent = h;
    btn.className = h === halamanSemasa ? 'aktif' : '';
    btn.onclick = () => { halamanSemasa = h; renderJadual(); };
    el.appendChild(btn);
  });

  const btnNext = document.createElement('button');
  btnNext.textContent = 'Seterusnya →';
  btnNext.disabled = halamanSemasa === jumlahHalaman;
  btnNext.onclick = () => { halamanSemasa++; renderJadual(); };
  el.appendChild(btnNext);
}

function halamanJulat(semasa, jumlah) {
  const radius = 2;
  let mula = Math.max(1, semasa - radius);
  let akhir = Math.min(jumlah, semasa + radius);
  if (akhir - mula < radius * 2) {
    if (mula === 1) akhir = Math.min(jumlah, mula + radius * 2);
    else mula = Math.max(1, akhir - radius * 2);
  }
  const arr = [];
  for (let i = mula; i <= akhir; i++) arr.push(i);
  return arr;
}

function sortMengikutLajur(lajur) {
  if (sortLajur === lajur) {
    sortArah = sortArah === 'asc' ? 'desc' : 'asc';
  } else {
    sortLajur = lajur;
    sortArah = 'asc';
  }
  halamanSemasa = 1;
  renderJadual();
}

function kemasKiniSortIkon() {
  document.querySelectorAll('th[data-sort]').forEach(th => {
    const lajur = th.dataset.sort;
    const ikon = th.querySelector('.sort-ikon');
    if (!ikon) return;
    if (sortLajur === lajur) {
      ikon.textContent = sortArah === 'asc' ? ' ▲' : ' ▼';
    } else {
      ikon.textContent = ' ↕';
    }
  });
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  isiDropdown();
  kemasKiniKPI(dataFiltered);
  refreshCharts(dataFiltered);
  renderJadual();

  // Carian
  document.getElementById('carian').addEventListener('input', function () {
    carian = this.value;
    halamanSemasa = 1;
    gunakanPenapis();
  });

  // Butang penapis
  document.getElementById('btnGunakanPenapis').addEventListener('click', gunakanPenapis);
  document.getElementById('btnSetSemula').addEventListener('click', setSemulapenapis);

  // Butang eksport
  document.getElementById('btnEksportExcel').addEventListener('click', eksportExcel);
  document.getElementById('btnEksportPDF').addEventListener('click', eksportPDF);
  document.getElementById('btnCetak').addEventListener('click', modCetak);

  // Sort lajur
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => sortMengikutLajur(th.dataset.sort));
  });
});
