let admisiTab = 'registrasi';
let patientMode = 'lama'; // 'lama' | 'baru'
let nikVerified = true;
let selectedUnit = 'umum';
let selectedConsentType = 'general';
let consentSigned = false;

const UNIT_OPTIONS = {
  umum: { label: 'Rawat Jalan — Poli Umum', doctor: 'dr. Herman S.Pd', prefix: 'PU-012', quota: '8 tersisa' },
  gigi: { label: 'Rawat Jalan — Poli Gigi', doctor: 'drg. Nadia Putri', prefix: 'PG-005', quota: '5 tersisa' },
  kia:  { label: 'Rawat Jalan — Poli Anak & KIA', doctor: 'dr. Ratna Dewi, Sp.A', prefix: 'PA-003', quota: '6 tersisa' },
  igd:  { label: 'IGD — Gawat Darurat (24 Jam)', doctor: 'Tim Jaga IGD', prefix: 'IGD-002', quota: 'Siaga 24 Jam' },
};

let bookings = [
  { kode: 'BK-901', nama: 'Ibu Dewi Sartika', nik: '3273014402900002', poli: 'Poli KIA • dr. Ratna', jam: '09:00', sumber: 'Website', status: 'Menunggu' },
  { kode: 'BK-902', nama: 'Bpk. Agus Salim', nik: '3273011908850007', poli: 'Poli Umum • dr. Herman', jam: '09:30', sumber: 'WhatsApp', status: 'Check-In (PU-011)' },
  { kode: 'BK-903', nama: 'Sdr. Dimas Putra', nik: '3273010511990001', poli: 'Poli Gigi • drg. Nadia', jam: '10:00', sumber: 'Website', status: 'Menunggu' },
];

let spriQueue = [
  { id: 'SPRI-041', nama: 'Ibu Maya Lestari', rm: 'RM-2026-00388', asal: 'IGD', dokter: 'dr. Herman', diagnosa: 'Observasi Febris / DHF', status: 'Menunggu Bed' },
];

let availableBeds = [
  { code: 'VIP-02', kelas: 'VIP Mawar', tarif: 'Rp 750.000/mlm' },
  { code: 'K1-02', kelas: 'Kelas 1 Melati', tarif: 'Rp 450.000/mlm' },
  { code: 'K1-04', kelas: 'Kelas 1 Melati', tarif: 'Rp 450.000/mlm' },
  { code: 'K2-06', kelas: 'Kelas 2 Anggrek', tarif: 'Rp 300.000/mlm' },
  { code: 'K3-06', kelas: 'Kelas 3 Kenanga', tarif: 'Rp 175.000/mlm' },
  { code: 'ISO-02', kelas: 'Ruang Isolasi', tarif: 'Rp 500.000/mlm' },
];

let activeInpatients = [
  { bed: 'VIP-01', nama: 'Tn. Rahmat Hidayat', rm: 'RM-2026-00210', masuk: '14 Nov 2026', deposit: 'Rp 1.500.000', status: 'Dirawat' },
  { bed: 'K1-01', nama: 'Ny. Kartini', rm: 'RM-2026-00301', masuk: '15 Nov 2026', deposit: 'Rp 1.000.000', status: 'Dirawat' },
  { bed: 'K1-03', nama: 'Tn. Bambang', rm: 'RM-2026-00344', masuk: '16 Nov 2026', deposit: 'Rp 1.000.000', status: 'Dirawat' },
];

let cleaningBeds = [
  { bed: 'K2-04', kelas: 'Kelas 2 Anggrek', petugas: 'Petugas Kebersihan' }
];

function renderAdmisi() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'registrasi', label: 'Registrasi, Rajal & IGD' },
          { id: 'ranap', label: 'Admisi Rawat Inap (ADT)' },
          { id: 'booking', label: 'Booking Online (Web & WA)' },
          { id: 'consent', label: 'Digital Consent' },
        ].map(t => {
          const active = admisiTab === t.id;
          return `
            <button onclick="setAdmisiTab('${t.id}')" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${admisiTab === 'registrasi' ? viewRegistrasi() : ''}
      ${admisiTab === 'ranap' ? viewRanapADT() : ''}
      ${admisiTab === 'booking' ? viewBookingOnline() : ''}
      ${admisiTab === 'consent' ? viewDigitalConsent() : ''}
    </div>
  `;

  if (admisiTab === 'consent') {
    initSignaturePad();
  }
}

function setAdmisiTab(tab) {
  admisiTab = tab;
  renderAdmisi();
}

// ==========================================
// TAB 1: REGISTRASI NIK, RAJAL & IGD
// ==========================================
function viewRegistrasi() {
  const unit = UNIT_OPTIONS[selectedUnit];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Form Registrasi (Sharp, Ergonomic Clinical Layout) -->
      <div class="xl:col-span-8 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        
        <!-- Header + Clean Mode Switch -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Pendaftaran Kunjungan</h2>
            <p class="text-[12px] text-slate-400">Input NIK 16 digit untuk sinkronisasi Patient IHS SATUSEHAT</p>
          </div>
          <div class="inline-flex border border-slate-200 rounded-lg p-0.5 text-[11px] bg-slate-50">
            <button onclick="setPatientMode('lama')" class="px-3 py-1 rounded-md transition ${patientMode === 'lama' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-700'}">Pasien Lama</button>
            <button onclick="setPatientMode('baru')" class="px-3 py-1 rounded-md transition ${patientMode === 'baru' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-700'}">Pasien Baru</button>
          </div>
        </div>

        <!-- Section 1: Identitas Pasien -->
        <div class="pt-4 pb-5 border-b border-slate-100 space-y-3.5">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">1. Identitas Pasien</p>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3.5 text-xs">
            <div class="sm:col-span-7">
              <label class="block text-[11px] font-medium text-slate-600 mb-1">NIK KTP (16 Digit)</label>
              <div class="flex rounded-lg border border-slate-300/80 overflow-hidden focus-within:border-brand-teal transition">
                <input id="nik-input" type="text" maxlength="16" value="${patientMode === 'lama' ? '3273011205880004' : ''}" placeholder="Masukkan 16 digit NIK..." class="w-full h-9 px-3 text-xs font-mono text-slate-700 focus:outline-none" />
                <button onclick="verifyNik()" class="px-3.5 h-9 bg-slate-50 border-l border-slate-200 text-[11px] font-semibold text-brand-teal hover:bg-teal-50 shrink-0 transition">
                  Cek IHS
                </button>
              </div>
            </div>
            <div class="sm:col-span-5">
              <label class="block text-[11px] font-medium text-slate-600 mb-1">No. Rekam Medis</label>
              <input type="text" value="${patientMode === 'lama' ? 'RM-2026-00412' : 'Otomatis saat simpan'}" readonly class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/80 text-xs font-mono text-slate-500" />
            </div>
          </div>

          ${patientMode === 'lama' && nikVerified ? `
            <!-- Compact Key-Value Summary Strip (No puffy banner) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-1 px-3 border-l-2 border-brand-teal bg-slate-50/50 text-[11px]">
              <div>
                <p class="text-slate-400 text-[10px]">Nama Pasien</p>
                <p class="font-semibold text-slate-800">Bpk. Heri Kurniawan</p>
              </div>
              <div>
                <p class="text-slate-400 text-[10px]">Lahir / JK</p>
                <p class="font-medium text-slate-700">12 Mei 1988 (L)</p>
              </div>
              <div>
                <p class="text-slate-400 text-[10px]">Patient IHS ID</p>
                <p class="font-mono font-medium text-slate-700">P10004829102</p>
              </div>
              <div>
                <p class="text-slate-400 text-[10px]">BPJS Kesehatan</p>
                <p class="font-medium text-brand-teal">00018294011 • Aktif</p>
              </div>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap Sesuai KTP</label>
                <input type="text" placeholder="Contoh: Siti Rahmawati" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Jenis Kelamin</label>
                <select class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs focus:outline-none focus:border-brand-teal">
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
            </div>
          `}
        </div>

        <!-- Section 2: Tujuan Kunjungan & Penjamin -->
        <div class="pt-4 pb-5 space-y-3.5">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">2. Tujuan Layanan &amp; Penjamin</p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Unit Pelayanan</label>
              <select onchange="selectedUnit=this.value; renderAdmisi();" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700 focus:outline-none focus:border-brand-teal">
                <option value="umum" ${selectedUnit === 'umum' ? 'selected' : ''}>Poli Umum</option>
                <option value="gigi" ${selectedUnit === 'gigi' ? 'selected' : ''}>Poli Gigi</option>
                <option value="kia" ${selectedUnit === 'kia' ? 'selected' : ''}>Poli Anak &amp; KIA</option>
                <option value="igd" ${selectedUnit === 'igd' ? 'selected' : ''}>IGD (24 Jam)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Penjamin / Cara Bayar</label>
              <select class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700 focus:outline-none focus:border-brand-teal">
                <option>BPJS Kesehatan</option>
                <option>Umum / Mandiri</option>
                <option>Asuransi Rekanan</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">No. WhatsApp (Tiket Antrean)</label>
              <input type="text" value="0812-2345-8890" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal" />
            </div>
          </div>
        </div>

        <!-- Clean Action Bar -->
        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4 text-[12px]">
            <button onclick="setAdmisiTab('consent')" class="font-medium ${consentSigned ? 'text-brand-teal' : 'text-brand-blue hover:underline'}">
              ${consentSigned ? '✓ General Consent Tersimpan' : 'Tanda Tangan Consent →'}
            </button>
            <button onclick="showToast('Kartu Berobat & Label Barcode RM dicetak.', 'info')" class="text-slate-500 hover:text-slate-700 font-medium">
              Cetak Kartu / Label
            </button>
          </div>
          <button onclick="submitRegistration()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Daftarkan &amp; Cetak Antrean
          </button>
        </div>
      </div>

      <!-- Right Column: Antrean & Kuota Poli Hari Ini -->
      <div class="xl:col-span-4 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">Antrean &amp; Kuota Poli</h3>
            <p class="text-[11px] text-slate-400">Nomor berikutnya untuk unit terpilih</p>
          </div>
          <span class="text-[11px] font-medium text-brand-teal">TV Aktif</span>
        </div>

        <!-- Compact Next Ticket Summary (No dashed box) -->
        <div class="py-4 flex items-center justify-between gap-3 border-b border-slate-100">
          <div>
            <p class="text-[11px] text-slate-400">${unit.label}</p>
            <p class="text-xs font-medium text-slate-700 mt-0.5">${unit.doctor}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Kuota: ${unit.quota}</p>
          </div>
          <span class="text-[30px] font-light text-slate-800 tabular-nums leading-none">${unit.prefix}</span>
        </div>

        <!-- Clean Table of All Polyclinic Queues -->
        <table class="w-full text-left text-xs mt-3">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2 font-medium">Poli / Unit</th>
              <th class="pb-2 font-medium">Saat Ini</th>
              <th class="pb-2 font-medium text-right">Kuota</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${[
              { key: 'umum', name: 'Poli Umum', now: 'PU-011', kuota: '8' },
              { key: 'gigi', name: 'Poli Gigi', now: 'PG-004', kuota: '5' },
              { key: 'kia', name: 'Poli Anak & KIA', now: 'PA-002', kuota: '6' },
              { key: 'igd', name: 'IGD 24 Jam', now: 'IGD-001', kuota: 'Siaga' },
            ].map(r => `
              <tr onclick="selectedUnit='${r.key}'; renderAdmisi();" class="cursor-pointer hover:bg-slate-50/80 transition ${selectedUnit === r.key ? 'font-semibold text-slate-800' : 'text-slate-600'}">
                <td class="py-2.5">${r.name}</td>
                <td class="py-2.5 font-mono text-[11px] ${selectedUnit === r.key ? 'text-brand-teal' : 'text-slate-500'}">${r.now}</td>
                <td class="py-2.5 text-right text-[11px] text-slate-500">${r.kuota}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

function setPatientMode(mode) {
  patientMode = mode;
  renderAdmisi();
}

function verifyNik() {
  const val = document.getElementById('nik-input')?.value || '';
  if (val.length !== 16) {
    showToast('NIK harus tepat 16 digit.', 'info');
    return;
  }
  nikVerified = true;
  showToast('NIK valid! Patient IHS ID: P10004829102 ditemukan.', 'success');
  renderAdmisi();
}

function submitRegistration() {
  const unit = UNIT_OPTIONS[selectedUnit];
  showToast(`Pasien terdaftar (${unit.prefix}). Open Bill dibuka & Encounter: Arrived dikirim ke SATUSEHAT.`, 'success');
}

// ==========================================
// TAB 2: ADMISI RAWAT INAP / ADT
// ==========================================
function viewRanapADT() {
  const spri = spriQueue[0];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Form Admisi Rawat Inap (SPRI) -->
      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="pb-4 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Admisi Rawat Inap (SPRI)</h2>
          <p class="text-[12px] text-slate-400">Penempatan bed kosong, deposit awal, &amp; cetak gelang barcode</p>
        </div>

        ${spri ? `
          <div class="py-4 border-b border-slate-100">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">1. Surat Pengantar Rawat Inap (${spri.id})</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <p class="text-slate-400 text-[10px]">Pasien</p>
                <p class="font-semibold text-slate-800">${spri.nama}</p>
              </div>
              <div>
                <p class="text-slate-400 text-[10px]">No. RM &amp; Asal</p>
                <p class="font-medium text-slate-700">${spri.rm} • ${spri.asal}</p>
              </div>
              <div>
                <p class="text-slate-400 text-[10px]">DPJP &amp; Diagnosa</p>
                <p class="font-medium text-slate-700">${spri.dokter} • ${spri.diagnosa}</p>
              </div>
            </div>
          </div>
        ` : `
          <div class="py-4 border-b border-slate-100 text-xs text-slate-500">
            Semua SPRI telah ditempatkan ke kamar rawat inap.
          </div>
        `}

        <div class="py-4 space-y-3.5 text-xs">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">2. Penempatan Kamar &amp; Deposit</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Kelas &amp; Bed Kosong</label>
              <select id="adt-bed-select" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700 focus:outline-none focus:border-brand-teal">
                ${availableBeds.map(b => `<option value="${b.code}">${b.code} — ${b.kelas} (${b.tarif})</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Deposit Awal</label>
              <input id="adt-deposit-input" type="text" value="Rp 1.000.000" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal" />
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4 text-[12px]">
            <button onclick="setAdmisiTab('consent')" class="font-medium text-brand-blue hover:underline">Informed Consent →</button>
            <button onclick="showToast('Gelang identitas barcode pasien rawat inap dicetak.', 'info')" class="font-medium text-slate-500 hover:text-slate-700">Cetak Gelang</button>
          </div>
          <button onclick="admitInpatient()" ${!spri || !availableBeds.length ? 'disabled' : ''} class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition disabled:opacity-40">
            Resmikan Admisi
          </button>
        </div>
      </div>

      <!-- Right: Daftar Pasien Rawat Inap & Kamar Dibersihkan -->
      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Pasien Rawat Inap Aktif</h2>
          <p class="text-[12px] text-slate-400">Mutasi pindah kamar (Transfer) &amp; pemulangan (Discharge)</p>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Bed</th>
              <th class="pb-2.5 font-medium">Pasien</th>
              <th class="pb-2.5 font-medium">Masuk</th>
              <th class="pb-2.5 font-medium">Deposit</th>
              <th class="pb-2.5 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${activeInpatients.map(p => `
              <tr>
                <td class="py-3 font-semibold text-slate-800">${p.bed}</td>
                <td class="py-3">
                  <p class="font-medium text-slate-700">${p.nama}</p>
                  <p class="text-[10px] text-slate-400 font-mono">${p.rm}</p>
                </td>
                <td class="py-3 text-slate-500 text-[11px]">${p.masuk}</td>
                <td class="py-3 text-slate-700 font-medium text-[11px]">${p.deposit}</td>
                <td class="py-3 text-right">
                  <button onclick="showToast('Form Mutasi Pindah Kamar ${p.bed} dibuka.', 'info')" class="text-[11px] font-medium text-brand-blue hover:underline">Pindah</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${cleaningBeds.length ? `
          <div class="pt-3 border-t border-slate-100">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Kamar Masih Dibersihkan</p>
            <div class="divide-y divide-slate-100 text-xs">
              ${cleaningBeds.map((c, i) => `
                <div class="py-2 flex items-center justify-between gap-2">
                  <div>
                    <span class="font-semibold text-slate-800">${c.bed}</span>
                    <span class="text-slate-400 mx-1.5">•</span>
                    <span class="text-slate-500">${c.kelas} (${c.petugas})</span>
                  </div>
                  <button onclick="markBedClean(${i})" class="text-[11px] font-semibold text-brand-teal hover:underline">Tandai Kosong</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

    </div>
  `;
}

function admitInpatient() {
  if (!spriQueue.length || !availableBeds.length) return;
  const bedCode = document.getElementById('adt-bed-select')?.value;
  const deposit = document.getElementById('adt-deposit-input')?.value || 'Rp 1.000.000';
  const spri = spriQueue.shift();
  const bedIdx = availableBeds.findIndex(b => b.code === bedCode);
  if (bedIdx !== -1) availableBeds.splice(bedIdx, 1);

  activeInpatients.unshift({
    bed: bedCode,
    nama: spri.nama,
    rm: spri.rm,
    masuk: '17 Nov 2026',
    deposit,
    status: 'Dirawat'
  });

  showToast(`${spri.nama} resmi masuk ${bedCode}. Kuota Web Publik -1 & argo kamar aktif.`, 'success');
  renderAdmisi();
}

function markBedClean(idx) {
  const c = cleaningBeds.splice(idx, 1)[0];
  availableBeds.push({ code: c.bed, kelas: c.kelas, tarif: 'Rp 300.000/mlm' });
  showToast(`${c.bed} selesai dibersihkan → Status Kosong (Kuota Web Publik +1).`, 'success');
  renderAdmisi();
}

// ==========================================
// TAB 3: BOOKING ONLINE (WEB & WA)
// ==========================================
function viewBookingOnline() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Daftar Booking Online (Website &amp; WhatsApp)</h2>
          <p class="text-[12px] text-slate-400">Konversi QR Check-In menjadi nomor antrean Poliklinik &amp; TV ruang tunggu</p>
        </div>
        <button onclick="showToast('Scanner QR Check-In siap digunakan.', 'info')" class="h-9 px-4 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50">
          Scan QR Check-In
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-3 font-medium">Kode</th>
              <th class="pb-3 font-medium">Pasien &amp; NIK</th>
              <th class="pb-3 font-medium">Poli &amp; Jam</th>
              <th class="pb-3 font-medium">Sumber</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${bookings.map((b, idx) => `
              <tr>
                <td class="py-3.5 font-mono font-semibold text-slate-800">${b.kode}</td>
                <td class="py-3.5">
                  <p class="font-medium text-slate-700">${b.nama}</p>
                  <p class="text-[10px] text-slate-400 font-mono">${b.nik}</p>
                </td>
                <td class="py-3.5 text-slate-600">${b.poli} • ${b.jam}</td>
                <td class="py-3.5 text-slate-500">${b.sumber}</td>
                <td class="py-3.5 font-medium ${b.status === 'Menunggu' ? 'text-slate-500' : 'text-brand-teal'}">${b.status}</td>
                <td class="py-3.5 text-right">
                  ${b.status === 'Menunggu' ? `
                    <button onclick="checkInBooking(${idx})" class="h-7 px-3 rounded-md bg-brand-teal text-white text-[11px] font-medium hover:bg-brand-tealDark">Check-In</button>
                  ` : `<span class="text-[11px] text-slate-400">Tercetak</span>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function checkInBooking(idx) {
  bookings[idx].status = 'Check-In (PU-013)';
  showToast(`${bookings[idx].nama} berhasil Check-In! Nomor antrean PU-013 masuk layar TV.`, 'success');
  renderAdmisi();
}

// ==========================================
// TAB 4: DIGITAL CONSENT
// ==========================================
function viewDigitalConsent() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Dokumen Persetujuan Digital</h2>
            <p class="text-[12px] text-slate-400">Permenkes No. 24 Tahun 2022 &amp; Pelepasan Data SATUSEHAT</p>
          </div>
          <select onchange="selectedConsentType=this.value; renderAdmisi();" class="h-9 px-3 rounded-lg border border-slate-300/80 text-xs bg-white">
            <option value="general" ${selectedConsentType === 'general' ? 'selected' : ''}>General Consent (Persetujuan Umum)</option>
            <option value="informed" ${selectedConsentType === 'informed' ? 'selected' : ''}>Informed Consent (Tindakan / Ranap)</option>
          </select>
        </div>

        <div class="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs text-slate-600 leading-relaxed space-y-2">
          <p class="font-semibold text-slate-800">${selectedConsentType === 'general' ? 'PERSETUJUAN UMUM (GENERAL CONSENT)' : 'PERSETUJUAN TINDAKAN MEDIS / RAWAT INAP (INFORMED CONSENT)'}</p>
          <p>Saya yang bertanda tangan di bawah ini menyatakan telah menerima informasi yang jelas mengenai hak dan kewajiban pasien, tata tertib klinik, perkiraan biaya layanan, serta menyetujui pelepasan data rekam medis elektronik secara aman ke platform <strong>SATUSEHAT Kemenkes RI</strong> sesuai peraturan yang berlaku.</p>
        </div>
      </div>

      <div class="lg:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div>
          <h3 class="text-[15px] font-semibold text-slate-800">Touchscreen Signature Pad</h3>
          <p class="text-[11px] text-slate-400">Goreskan tanda tangan pasien atau wali pada area di bawah ini</p>
        </div>
        <canvas id="sig-canvas" width="380" height="170" class="w-full h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 cursor-crosshair touch-none"></canvas>
        <div class="flex items-center justify-between gap-2">
          <button onclick="clearSignaturePad()" class="h-9 px-3.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">Hapus</button>
          <button onclick="saveSignature()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark">Simpan Tanda Tangan</button>
        </div>
      </div>
    </div>
  `;
}

function initSignaturePad() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#1E293B';

  let drawing = false;
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const start = (e) => {
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const stop = () => { drawing = false; };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);
  canvas.addEventListener('touchstart', start);
  canvas.addEventListener('touchmove', move);
  canvas.addEventListener('touchend', stop);
}

function clearSignaturePad() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
  consentSigned = true;
  showToast('Tanda tangan digital tersimpan ke rekam medis pasien.', 'success');
}

initLayout('admisi');
renderAdmisi();
