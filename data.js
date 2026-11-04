// ============================================================
// DATA DUMMY — Dashboard Pengambilan Pelajar
// Politeknik Balik Pulau
// ============================================================

const PROGRAM_LIST = [
  'Kejuruteraan Awam',
  'Kejuruteraan Mekanikal',
  'Kejuruteraan Elektrik',
  'Teknologi Maklumat',
  'Perakaunan',
  'Pengurusan Perniagaan',
  'Hospitaliti',
  'Reka Bentuk Grafik',
];

const NEGERI_LIST = [
  'Pulau Pinang',
  'Kedah',
  'Perak',
  'Selangor',
  'Johor',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Melaka',
  'Negeri Sembilan',
  'Perlis',
  'Sabah',
  'Sarawak',
];

const STATUS_LIST = ['Diterima', 'Ditolak', 'Senarai Tunggu', 'Belum Daftar'];
const SESI_LIST = ['2025/2026 Sem 1', '2025/2026 Sem 2', '2026/2027 Sem 1'];
const JANTINA_LIST = ['Lelaki', 'Perempuan'];

const NAMA_LELAKI = [
  'Ahmad Faris', 'Muhammad Haziq', 'Amirul Hafiz', 'Muhamad Izzat',
  'Hafizuddin', 'Noor Akmal', 'Zulhilmi', 'Khairul Anwar',
  'Faizal Rahim', 'Ridhwan Aziz', 'Syafiq Noor', 'Azlan Shah',
  'Hafiz Idris', 'Imran Hakimi', 'Luqmanul Hakim', 'Suhaimi Daud',
  'Rashdan Yusof', 'Ezwan Nizam', 'Farhan Asyraf', 'Haiqal Syazwan',
  'Irfan Danial', 'Jefri Nadzri', 'Kamarul Ariff', 'Lokman Nul',
  'Nazirul Ikhwan',
];

const NAMA_PEREMPUAN = [
  'Nurul Ain', 'Siti Hajar', 'Farah Nabilah', 'Nur Izzati',
  'Anis Syahirah', 'Hafizah Rahim', 'Syafiqa Husna', 'Zulaikha Noor',
  'Hanis Amira', 'Liyana Mahfuz', 'Maisarah Daud', 'Nadia Sofea',
  'Izzatul Husna', 'Rabiatul Adawiyah', 'Ummu Kulthum', 'Fatimah Zahra',
  'Khairunissa', 'Nurul Hidayah', 'Sharifah Zulaikha', 'Tengku Nabilah',
  'Azlina Hasrini', 'Balkis Hamdan', 'Cahaya Nadia', 'Dalilah Syafiqah',
  'Emilia Sofea',
];

const GRED_SPM = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D'];

function rawat(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function janaNombor(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Jana 80 rekod pelajar dummy
const dataPelajar = (function () {
  const senarai = [];
  for (let i = 1; i <= 80; i++) {
    const jantina = rawat(JANTINA_LIST);
    const nama = jantina === 'Lelaki' ? rawat(NAMA_LELAKI) : rawat(NAMA_PEREMPUAN);
    const program = rawat(PROGRAM_LIST);
    const negeri = rawat(NEGERI_LIST);
    const status = rawat(STATUS_LIST);
    const sesi = rawat(SESI_LIST);
    const gred = rawat(GRED_SPM);
    const umur = janaNombor(17, 22);

    senarai.push({
      id: i,
      nama: `${nama} bin/binti ${rawat(['Abdullah', 'Yusof', 'Ibrahim', 'Hassan', 'Othman', 'Razak', 'Hamid', 'Ismail'])}`,
      jantina,
      program,
      negeri,
      status,
      sesi,
      gred_spm: gred,
      umur,
      no_ic: `${janaNombor(900101, 991231)}-${janaNombor(10, 99)}-${janaNombor(1000, 9999)}`,
      tarikh_mohon: `${janaNombor(1, 28)}/${janaNombor(1, 12)}/2026`,
    });
  }
  return senarai;
})();

// Kuota setiap program
const kuotaProgram = {
  'Kejuruteraan Awam': 30,
  'Kejuruteraan Mekanikal': 30,
  'Kejuruteraan Elektrik': 25,
  'Teknologi Maklumat': 35,
  'Perakaunan': 25,
  'Pengurusan Perniagaan': 25,
  'Hospitaliti': 20,
  'Reka Bentuk Grafik': 20,
};

const KUOTA_JUMLAH = Object.values(kuotaProgram).reduce((a, b) => a + b, 0);
