let ermTab = 'soap';
let selectedPatientIdx = 0;
let selectedTriase = 'kuning';
let showOdontogram = false;

const PATIENTS = [
  {
    no: '002',
    nama: 'Bpk. Andy Wijaya',
    rm: 'RM-2026-00192',
    ihs: 'P10002941801',
    umur: '38 Th (L)',
    unit: 'Poli Umum',
    alergi: 'Tidak Ada',
    lastVisit: '12 Okt 2026 (Kunjungan ke-4)',
    ttv: { td: '120/80', suhu: '37.8', nadi: '84', rr: '20', spo2: '98', bb: '68', tb: '170' },
    soap: {
      s: 'Demam sejak 2 hari lalu, batuk kering, nyeri menelan.',
      o: 'Faring hiperemis (+), tonsil T1/T1, suara napas vesikuler (+/+).',
      icd10: 'J02.9 — Acute pharyngitis, unspecified',
      icd9: '89.03 — Interview and evaluation (Konsultasi)'
    },
    rx: [
      { nama: 'Paracetamol 500mg Tab', signa: '3 x 1 Tab sesudah makan', qty: '10 Tab' },
      { nama: 'Ambroxol 30mg Tab', signa: '3 x 1 Tab sesudah makan', qty: '10 Tab' },
    ]
  },
  {
    no: '006',
    nama: 'Ibu Maya Lestari',
    rm: 'RM-2026-00388',
    ihs: 'P10008112044',
    umur: '29 Th (P)',
    unit: 'IGD',
    alergi: 'Penisilin',
    lastVisit: 'Pasien IGD (Masuk 06:10 WIB)',
    ttv: { td: '100/70', suhu: '38.9', nadi: '104', rr: '24', spo2: '96', bb: '54', tb: '158' },
    soap: {
      s: 'Demam tinggi mendadak 3 hari, nyeri kepala, mual dan muntah 2x sejak pagi.',
      o: 'Tampak lemah, akral hangat, uji tourniquet (+), nyeri tekan epigastrium (+).',
      icd10: 'A91 — Dengue haemorrhagic fever',
      icd9: '99.18 — Injection or infusion of electrolytes'
    },
    rx: [
      { nama: 'Infus Ringer Laktat 500ml', signa: '20 tpm intravena', qty: '2 Kolf' },
      { nama: 'Paracetamol 1g Infus', signa: 'Bila suhu >= 38.5°C', qty: '1 Botol' },
      { nama: 'Ondansetron 4mg Inj', signa: '2 x 1 Ampul IV', qty: '2 Ampul' },
    ]
  },
  {
    no: 'VIP-01',
    nama: 'Tn. Rahmat Hidayat',
    rm: 'RM-2026-00210',
    ihs: 'P10005519203',
    umur: '52 Th (L)',
    unit: 'Rawat Inap (VIP Mawar)',
    alergi: 'Tidak Ada',
    lastVisit: 'Hari Rawat ke-3 (Visite Pagi)',
    ttv: { td: '130/80', suhu: '36.8', nadi: '78', rr: '18', spo2: '99', bb: '72', tb: '168' },
    soap: {
      s: 'Demam sudah turun, nafsu makan membaik, tidak ada keluhan sesak atau nyeri dada.',
      o: 'KU baik, compos mentis, cor/pulmo dalam batas normal, bising usus (+) normal.',
      icd10: 'I10 — Essential (primary) hypertension',
      icd9: '89.03 — Interview and evaluation (Visite)'
    },
    rx: [
      { nama: 'Amlodipine 5mg Tab', signa: '1 x 1 Tab pagi hari', qty: '10 Tab' },
    ]
  }
];

const ICD10_LIST = [
  'J02.9 — Acute pharyngitis, unspecified',
  'A09 — Infectious gastroenteritis and colitis',
  'I10 — Essential (primary) hypertension',
  'K29.7 — Gastritis, unspecified',
  'J06.9 — Acute upper respiratory infection',
  'A91 — Dengue haemorrhagic fever',
];

let icd10Query = '';
let labOrders = [];

let bodyMarkers = [
  { x: 112, y: 122, label: 'Luka lecet lengan kanan (3 cm)' }
];

let teethStatus = { '16': 'karies', '36': 'tambalan' };

let cpptLogs = [
  {
    waktu: '17 Nov, 07:30',
    ppa: 'Dokter',
    nama: 'dr. Herman S.Pd',
    s: 'Demam turun, nafsu makan membaik',
    o: 'KU baik, S 36.8°C, TD 130/80',
    a: 'Observasi DHF hari ke-3 (Membaik)',
    p: 'Lanjutkan RL 20 tpm, cek trombosit ulang sore ini',
    verified: true
  },
  {
    waktu: '17 Nov, 06:00',
    ppa: 'Perawat',
    nama: 'Ns. Sari Rahayu',
    s: 'Pasien tidur nyenyak semalam',
    o: 'TD 130/80, N 78x/m, Balance +150 ml',
    a: 'Keseimbangan cairan adekuat',
    p: 'Monitor TTV tiap 4 jam & injeksi sesuai MAR',
    verified: true
  },
  {
    waktu: '17 Nov, 05:30',
    ppa: 'Apoteker',
    nama: 'Apt. Budi Santoso',
    s: 'Tidak ada keluhan mual pasca obat',
    o: 'Kepatuhan terapi 100%',
    a: 'Tidak ada DRP / interaksi obat',
    p: 'Teruskan terapi antibiotik sesuai jadwal',
    verified: false
  },
];

let marLogs = [
  { jam: '06:00', obat: 'Ceftriaxone 1g IV', rute: 'Intravena', status: 'Diberikan', oleh: 'Ns. Sari' },
  { jam: '08:00', obat: 'Omeprazole 40mg IV', rute: 'Intravena', status: 'Diberikan', oleh: 'Ns. Sari' },
  { jam: '12:00', obat: 'Paracetamol 1g Infus', rute: 'Infus Drip', status: 'Terjadwal', oleh: '—' },
];

function renderERM() {
  const p = PATIENTS[selectedPatientIdx];
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs + Compact Patient Switcher on One Clean Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 px-1">
        <div class="flex items-center gap-6 overflow-x-auto text-[13px]">
          ${[
            { id: 'soap', label: 'Pemeriksaan (SOAP & Odontogram)' },
            { id: 'triase', label: 'Asesmen TTV & Triase IGD' },
            { id: 'ranap', label: 'Rawat Inap (CPPT, Kurva TTV & MAR)' },
            { id: 'resume', label: 'Resume Pulang & Surat' },
          ].map(t => {
            const active = ermTab === t.id;
            return `
              <button onclick="ermTab='${t.id}'; renderERM();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
                ${t.label}
              </button>
            `;
          }).join('')}
        </div>

        <div class="flex items-center gap-2 pb-2">
          <span class="text-[11px] text-slate-400">Pasien:</span>
          <select onchange="selectedPatientIdx=Number(this.value); icd10Query=''; renderERM();" aria-label="Pilih Pasien" class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-teal">
            ${PATIENTS.map((pt, i) => `<option value="${i}" ${i === selectedPatientIdx ? 'selected' : ''}>${pt.no} — ${pt.nama} (${pt.unit})</option>`).join('')}
          </select>
        </div>
      </div>

      ${ermTab === 'soap' ? viewSOAP(p) : ''}
      ${ermTab === 'triase' ? viewTriase(p) : ''}
      ${ermTab === 'ranap' ? viewRanapERM(p) : ''}
      ${ermTab === 'resume' ? viewResumePulang(p) : ''}
    </div>
  `;
}

// ==========================================
// TAB 1: SOAP, ICD-10/9, ODONTOGRAM & E-PRESCRIBING
// ==========================================
function viewSOAP(p) {
  const icdMatches = icd10Query.trim()
    ? ICD10_LIST.filter(c => c.toLowerCase().includes(icd10Query.toLowerCase()))
    : [];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: SOAP Form & Odontogram -->
      <div class="xl:col-span-8 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">${p.nama} <span class="font-normal text-slate-400 text-xs">• ${p.umur}</span></h2>
            <p class="text-[11px] text-slate-500 mt-0.5">
              <span class="font-mono">${p.rm}</span> • ${p.unit} • Alergi:
              <span class="${p.alergi === 'Tidak Ada' ? 'text-slate-600' : 'text-rose-600 font-semibold'}">${p.alergi}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="showToast('Menampilkan riwayat kunjungan ${p.nama}.', 'info')" class="h-8 px-3 rounded-lg text-[11px] font-medium text-brand-blue hover:bg-slate-50">
              Riwayat Kunjungan
            </button>
            <button onclick="showOdontogram=!showOdontogram; renderERM();" class="h-8 px-3 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50">
              ${showOdontogram ? 'Tutup Odontogram' : 'Odontogram'}
            </button>
          </div>
        </div>

        <!-- Crisp Vital Signs Summary Strip (Prominent clinical data) -->
        <div class="grid grid-cols-4 gap-3 py-2.5 px-3 border-l-2 border-brand-teal bg-slate-50/50 text-xs">
          <div>
            <p class="text-[10px] text-slate-400">Tekanan Darah</p>
            <p class="font-semibold text-slate-800 font-mono">${p.ttv.td} <span class="font-sans font-normal text-slate-400 text-[10px]">mmHg</span></p>
          </div>
          <div>
            <p class="text-[10px] text-slate-400">Suhu Tubuh</p>
            <p class="font-semibold font-mono ${Number(p.ttv.suhu) >= 38 ? 'text-rose-600' : 'text-slate-800'}">${p.ttv.suhu} <span class="font-sans font-normal text-slate-400 text-[10px]">°C</span></p>
          </div>
          <div>
            <p class="text-[10px] text-slate-400">Nadi</p>
            <p class="font-semibold font-mono ${Number(p.ttv.nadi) >= 100 ? 'text-amber-600' : 'text-slate-800'}">${p.ttv.nadi} <span class="font-sans font-normal text-slate-400 text-[10px]">x/m</span></p>
          </div>
          <div>
            <p class="text-[10px] text-slate-400">Saturasi SpO2</p>
            <p class="font-semibold text-slate-800 font-mono">${p.ttv.spo2}<span class="font-sans font-normal text-slate-400 text-[10px]">%</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Subjective (Keluhan Utama)</label>
            <textarea rows="3" class="w-full p-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal">${p.soap.s}</textarea>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Objective (Pemeriksaan Fisik)</label>
            <textarea rows="3" class="w-full p-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal">${p.soap.o}</textarea>
          </div>
        </div>

        <!-- ICD-10 Autocomplete & ICD-9-CM -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="relative">
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Assessment — Kode Diagnosis (ICD-10)</label>
            <input type="text" value="${icd10Query || p.soap.icd10}" oninput="icd10Query=this.value; renderERM();" placeholder="Ketik kode atau nama penyakit (mis. J02)..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal" />
            ${icdMatches.length ? `
              <div class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 divide-y divide-slate-100 max-h-40 overflow-y-auto">
                ${icdMatches.map(m => `
                  <button onclick="PATIENTS[selectedPatientIdx].soap.icd10='${m}'; icd10Query=''; renderERM();" class="w-full text-left px-3 py-2 text-[11px] text-slate-700 hover:bg-slate-50">${m}</button>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Plan — Prosedur Tindakan (ICD-9-CM)</label>
            <input type="text" value="${p.soap.icd9}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal" />
          </div>
        </div>

        ${labOrders.length ? `
          <div class="text-[11px] text-slate-600 border-t border-slate-100 pt-3 flex flex-wrap items-center gap-3">
            <span class="font-medium text-slate-400">Order Penunjang:</span>
            ${labOrders.map((o, i) => `
              <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                ${o}
                <button onclick="labOrders.splice(${i},1); renderERM();" class="text-slate-400 hover:text-rose-600">×</button>
              </span>
            `).join('')}
          </div>
        ` : ''}

        ${showOdontogram ? renderOdontogramSection() : ''}

        <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4 text-[12px]">
            <button onclick="addLabOrder('Lab: Darah Lengkap (CBC)')" class="font-medium text-brand-blue hover:underline">+ Order Lab</button>
            <button onclick="addLabOrder('Radiologi: Thorax AP')" class="font-medium text-brand-blue hover:underline">+ Order Radiologi</button>
          </div>
          <button onclick="showToast('SOAP & Resep ${p.nama} tersimpan. Diteruskan ke Apotek & Kasir.', 'success')" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan SOAP &amp; Kirim Resep
          </button>
        </div>
      </div>

      <!-- Right: Resep Elektronik -->
      <div class="xl:col-span-4 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-[15px] font-semibold text-slate-800">Resep Elektronik</h3>
          <span class="text-[11px] font-medium text-slate-400">${p.rx.length} Item</span>
        </div>

        <div class="divide-y divide-slate-100 text-xs">
          ${p.rx.map((rx, idx) => `
            <div class="py-2.5 flex items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-slate-800">${rx.nama}</p>
                <p class="text-[11px] text-slate-500">${rx.signa} • ${rx.qty}</p>
              </div>
              <button onclick="PATIENTS[selectedPatientIdx].rx.splice(${idx}, 1); renderERM();" class="text-[11px] text-slate-400 hover:text-rose-600">Hapus</button>
            </div>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <input id="rx-name" type="text" placeholder="Nama obat (KFA) / Racikan..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
          <div class="flex gap-2">
            <input id="rx-signa" type="text" placeholder="Aturan (3x1)" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
            <input id="rx-qty" type="text" placeholder="Qty" class="w-20 h-9 px-2.5 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
            <button onclick="addPrescription()" class="h-9 px-3.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 shrink-0 transition">
              + Tambah
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function addLabOrder(label) {
  if (!labOrders.includes(label)) {
    labOrders.push(label);
    renderERM();
  }
}

function renderOdontogramSection() {
  const upper = ['18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28'];
  const lower = ['48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38'];
  const renderRow = (arr) => arr.map(t => {
    const st = teethStatus[t] || 'normal';
    const cls = st === 'karies' ? 'border-rose-400 bg-rose-50 text-rose-700' : st === 'tambalan' ? 'border-brand-blue bg-brand-blueLight text-brand-blue' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-teal';
    return `<button onclick="cycleTooth('${t}')" title="Gigi ${t}: ${st}" class="h-8 rounded-md border text-[10px] font-semibold transition ${cls}">${t}</button>`;
  }).join('');

  return `
    <div class="pt-4 border-t border-slate-100 space-y-2.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="font-semibold text-slate-700">Odontogram Interaktif (Klik gigi untuk ubah status)</span>
        <span class="text-slate-400">Putih: Normal • Merah: Karies • Biru: Tambalan</span>
      </div>
      <div class="grid grid-cols-8 sm:grid-cols-16 gap-1">${renderRow(upper)}</div>
      <div class="grid grid-cols-8 sm:grid-cols-16 gap-1">${renderRow(lower)}</div>
    </div>
  `;
}

function cycleTooth(code) {
  const order = ['normal', 'karies', 'tambalan'];
  const cur = teethStatus[code] || 'normal';
  teethStatus[code] = order[(order.indexOf(cur) + 1) % order.length];
  renderERM();
}

function addPrescription() {
  const nama = document.getElementById('rx-name')?.value.trim();
  const signa = document.getElementById('rx-signa')?.value.trim() || '3 x 1 sesudah makan';
  const qty = document.getElementById('rx-qty')?.value.trim() || '10 Tab';
  if (!nama) {
    showToast('Masukkan nama obat terlebih dahulu.', 'info');
    return;
  }
  PATIENTS[selectedPatientIdx].rx.push({ nama, signa, qty });
  renderERM();
}

// ==========================================
// TAB 2: ASESMEN TTV & TRIASE IGD + BODY MAP
// ==========================================
function viewTriase(p) {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Asesmen Awal Keperawatan (TTV) -->
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Asesmen Awal Keperawatan &amp; Triase IGD</h2>
          <p class="text-[12px] text-slate-400">Otomatis menyematkan kode LOINC &amp; SNOMED-CT untuk SATUSEHAT</p>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-slate-600 mb-1.5">Kategori Triase IGD</label>
          <div class="grid grid-cols-4 gap-2 text-xs">
            ${[
              { id: 'merah', label: 'Merah (Resusitasi)', active: 'bg-rose-600 border-rose-600 text-white' },
              { id: 'kuning', label: 'Kuning (Urgent)', active: 'bg-amber-500 border-amber-500 text-white' },
              { id: 'hijau', label: 'Hijau (Non-Urgent)', active: 'bg-brand-teal border-brand-teal text-white' },
              { id: 'hitam', label: 'Hitam (DOA)', active: 'bg-slate-800 border-slate-800 text-white' },
            ].map(tr => `
              <button onclick="selectedTriase='${tr.id}'; renderERM();" class="h-9 px-2 rounded-lg border text-[11px] font-medium transition ${selectedTriase === tr.id ? tr.active : 'border-slate-200 text-slate-600 hover:bg-slate-50'}">
                ${tr.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Tekanan Darah (mmHg)</label>
            <input type="text" value="${p.ttv.td}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Suhu Tubuh (°C)</label>
            <input type="text" value="${p.ttv.suhu}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Nadi (x/menit)</label>
            <input type="text" value="${p.ttv.nadi}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Saturasi SpO2 (%)</label>
            <input type="text" value="${p.ttv.spo2}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Pernapasan (x/menit)</label>
            <input type="text" value="${p.ttv.rr}" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Berat / Tinggi (kg/cm)</label>
            <input type="text" value="${p.ttv.bb} kg / ${p.ttv.tb} cm" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Skala Nyeri (0–10)</label>
            <input type="number" min="0" max="10" value="3" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Risiko Jatuh</label>
            <select class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs">
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button onclick="showToast('Asesmen TTV & Triase tersimpan (kode LOINC tersemat) dan diteruskan ke Dokter.', 'success')" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan Asesmen &amp; Teruskan ke Dokter
          </button>
        </div>
      </div>

      <!-- Right: Body Map Visual Interaktif -->
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">Body Map Visual (IGD)</h3>
            <p class="text-[11px] text-slate-400">Klik pada gambar tubuh untuk menandai lokasi luka/trauma</p>
          </div>
          <button onclick="bodyMarkers=[]; renderERM();" class="text-[11px] text-slate-400 hover:text-rose-600">Reset</button>
        </div>

        <div class="flex justify-center">
          <svg onclick="addBodyMarker(event)" viewBox="0 0 180 260" class="w-44 h-60 cursor-crosshair select-none">
            <!-- Minimalist Anatomical Silhouette -->
            <circle cx="90" cy="28" r="18" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" />
            <path d="M62 54 C62 48 118 48 118 54 L126 118 L112 120 L108 78 L108 145 L114 240 L96 240 L90 165 L84 240 L66 240 L72 145 L72 78 L68 120 L54 118 Z" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" stroke-linejoin="round" />
            ${bodyMarkers.map((m, i) => `
              <circle cx="${m.x}" cy="${m.y}" r="5" fill="#E11D48" stroke="#FFFFFF" stroke-width="1.5" />
              <text x="${m.x + 8}" y="${m.y + 3}" fill="#1E293B" font-size="9" font-weight="600">${i + 1}</text>
            `).join('')}
          </svg>
        </div>

        <div class="divide-y divide-slate-100 text-[11px]">
          ${bodyMarkers.length ? bodyMarkers.map((m, i) => `
            <div class="py-2 flex items-center justify-between">
              <span class="text-slate-700"><strong>#${i + 1}</strong> ${m.label}</span>
              <button onclick="bodyMarkers.splice(${i},1); renderERM();" class="text-slate-400 hover:text-rose-600">Hapus</button>
            </div>
          `).join('') : `<p class="py-2 text-center text-slate-400">Belum ada penandaan lokasi luka.</p>`}
        </div>
      </div>

    </div>
  `;
}

function addBodyMarker(e) {
  const svg = e.currentTarget;
  const rect = svg.getBoundingClientRect();
  const x = Math.round(((e.clientX - rect.left) / rect.width) * 180);
  const y = Math.round(((e.clientY - rect.top) / rect.height) * 260);
  bodyMarkers.push({ x, y, label: `Titik trauma (${x}, ${y})` });
  renderERM();
}

// ==========================================
// TAB 3: RAWAT INAP (CPPT, KURVA TTV & MAR)
// ==========================================
function viewRanapERM() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: CPPT Kolaboratif (Structured Clinical Table) -->
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">CPPT (Catatan Perkembangan Pasien Terintegrasi)</h2>
            <p class="text-[12px] text-slate-400">Lembar kolaboratif PPA dengan verifikasi DPJP</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${cpptLogs.length} Entri</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2.5 font-medium w-28">Waktu &amp; PPA</th>
                <th class="pb-2.5 font-medium">Asesmen &amp; Instruksi (S-O-A-P)</th>
                <th class="pb-2.5 font-medium text-right w-24">DPJP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${cpptLogs.map((c, idx) => `
                <tr class="align-top">
                  <td class="py-3 pr-3">
                    <p class="font-semibold text-slate-800">${c.ppa}</p>
                    <p class="text-[11px] text-slate-500">${c.nama}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">${c.waktu}</p>
                  </td>
                  <td class="py-3 pr-3 space-y-0.5 text-[11px] text-slate-600 leading-relaxed">
                    <p><strong class="text-slate-700">S:</strong> ${c.s}</p>
                    <p><strong class="text-slate-700">O:</strong> ${c.o}</p>
                    <p><strong class="text-slate-700">A:</strong> ${c.a}</p>
                    <p><strong class="text-slate-700">P:</strong> ${c.p}</p>
                  </td>
                  <td class="py-3 text-right">
                    ${c.verified
                      ? `<span class="text-[11px] font-medium text-brand-teal">Terverifikasi</span>`
                      : `<button onclick="verifyCppt(${idx})" class="text-[11px] font-semibold text-brand-blue hover:underline">Verifikasi</button>`
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Structured CPPT Entry Bar -->
        <div class="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Input Catatan PPA Baru</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select id="cppt-ppa" class="h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700">
              <option value="Dokter">Dokter Visite</option>
              <option value="Perawat">Perawat Shift</option>
              <option value="Apoteker">Apoteker</option>
              <option value="Ahli Gizi">Ahli Gizi</option>
            </select>
            <input id="cppt-a" type="text" placeholder="Assessment (A)..." class="sm:col-span-2 h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input id="cppt-so" type="text" placeholder="Subjective &amp; Objective (S/O)..." class="h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
            <div class="flex gap-2">
              <input id="cppt-p" type="text" placeholder="Plan / Instruksi (P)..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
              <button onclick="addCppt()" class="h-9 px-4 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark shrink-0">Simpan</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Kurva TTV (SVG) & MAR -->
      <div class="xl:col-span-5 space-y-6">
        
        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-[15px] font-semibold text-slate-800">Kurva Suhu &amp; Fluid Balance</h3>
              <p class="text-[11px] text-slate-400">Masuk: 1.200 ml • Keluar: 1.050 ml • Balance: +150 ml</p>
            </div>
          </div>
          ${renderTtvCurveSvg()}
        </div>

        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
          <h3 class="text-[15px] font-semibold text-slate-800 mb-3">Medication Administration Record (MAR)</h3>
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2 font-medium">Jam</th>
                <th class="pb-2 font-medium">Obat</th>
                <th class="pb-2 font-medium">Status</th>
                <th class="pb-2 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${marLogs.map((m, i) => `
                <tr>
                  <td class="py-2.5 font-mono text-slate-600">${m.jam}</td>
                  <td class="py-2.5">
                    <p class="font-medium text-slate-700">${m.obat}</p>
                    <p class="text-[10px] text-slate-400">${m.rute}</p>
                  </td>
                  <td class="py-2.5 text-[11px] ${m.status === 'Diberikan' ? 'text-brand-teal font-medium' : 'text-slate-500'}">${m.status}</td>
                  <td class="py-2.5 text-right">
                    ${m.status === 'Terjadwal' ? `
                      <button onclick="confirmMar(${i})" class="text-[11px] font-semibold text-brand-teal hover:underline">Konfirmasi</button>
                    ` : `<span class="text-[11px] text-slate-400">${m.oleh}</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `;
}

function addCppt() {
  const ppa = document.getElementById('cppt-ppa')?.value || 'Dokter';
  const a = document.getElementById('cppt-a')?.value.trim() || 'Perkembangan stabil';
  const so = document.getElementById('cppt-so')?.value.trim();
  const p = document.getElementById('cppt-p')?.value.trim() || 'Lanjutkan terapi sesuai instruksi';
  if (!so) {
    showToast('Isi Subjective & Objective (S/O) terlebih dahulu.', 'info');
    return;
  }
  const staffMap = {
    'Dokter': 'dr. Herman S.Pd',
    'Perawat': 'Ns. Sari Rahayu',
    'Apoteker': 'Apt. Budi Santoso',
    'Ahli Gizi': 'Siti Nurhaliza, S.Gz'
  };
  cpptLogs.unshift({
    waktu: '17 Nov, 07:10',
    ppa,
    nama: staffMap[ppa],
    s: so,
    o: 'TTV dalam batas terkontrol',
    a,
    p,
    verified: ppa === 'Dokter'
  });
  showToast('Catatan CPPT terstruktur tersimpan.', 'success');
  renderERM();
}

function verifyCppt(idx) {
  cpptLogs[idx].verified = true;
  showToast(`CPPT ${cpptLogs[idx].ppa} (${cpptLogs[idx].nama}) diverifikasi oleh DPJP.`, 'success');
  renderERM();
}

function confirmMar(idx) {
  marLogs[idx].status = 'Diberikan';
  marLogs[idx].oleh = 'Ns. Sari';
  showToast(`Pemberian ${marLogs[idx].obat} pukul ${marLogs[idx].jam} dikonfirmasi.`, 'success');
  renderERM();
}

function renderTtvCurveSvg() {
  const pts = [
    { t: '00:00', s: 38.4 },
    { t: '04:00', s: 37.9 },
    { t: '08:00', s: 37.2 },
    { t: '12:00', s: 36.8 },
    { t: '16:00', s: 36.7 },
  ];
  const w = 420, h = 115, padL = 32, padR = 14, padT = 12, padB = 22;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const minS = 36, maxS = 40;
  const coords = pts.map((p, i) => ({
    x: padL + (i / (pts.length - 1)) * plotW,
    y: padT + plotH - ((p.s - minS) / (maxS - minS)) * plotH,
    ...p
  }));
  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return `
    <svg viewBox="0 0 ${w} ${h}" class="w-full h-32 overflow-visible">
      ${[36, 38, 40].map(v => {
        const y = padT + plotH - ((v - minS) / (maxS - minS)) * plotH;
        return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="3 3" /><text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="#94A3B8" font-size="9">${v}°</text>`;
      }).join('')}
      <path d="${pathD}" fill="none" stroke="#009BA4" stroke-width="2" />
      ${coords.map(c => `
        <circle cx="${c.x}" cy="${c.y}" r="3.5" fill="#FFFFFF" stroke="#009BA4" stroke-width="2" />
        <text x="${c.x}" y="${h - 4}" text-anchor="middle" fill="#64748B" font-size="9.5">${c.t}</text>
      `).join('')}
    </svg>
  `;
}

// ==========================================
// TAB 4: RESUME PULANG & SURAT KETERANGAN
// ==========================================
function viewResumePulang(p) {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 max-w-4xl space-y-5">
      <div class="pb-3 border-b border-slate-100">
        <h2 class="text-[16px] font-semibold text-slate-800">Resume Medis Pulang &amp; Surat Keterangan</h2>
        <p class="text-[12px] text-slate-400">Pasien: ${p.nama} (${p.rm}) • Terkirim sebagai Composition FHIR ke SATUSEHAT</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block text-[11px] font-medium text-slate-600 mb-1">Diagnosis Akhir (ICD-10)</label>
          <input type="text" value="A91 — Dengue haemorrhagic fever (Membaik)" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-slate-600 mb-1">Jadwal Kontrol Ulang</label>
          <input type="date" value="2026-11-24" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-medium text-slate-600 mb-1">Ringkasan Perawatan &amp; Instruksi Pulang</label>
          <textarea rows="3" class="w-full p-3 rounded-lg border border-slate-300/80 text-xs">Pasien bebas demam 24 jam, trombosit meningkat 168.000/µL. Teruskan minum cukup air dan habiskan obat pulang.</textarea>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-4 text-[12px]">
          <button onclick="showToast('Surat Keterangan Sakit PDF dicetak.', 'info')" class="font-medium text-brand-blue hover:underline">Cetak Surat Sakit</button>
          <button onclick="showToast('Surat Rujukan FKTL PDF dicetak.', 'info')" class="font-medium text-brand-blue hover:underline">Cetak Surat Rujukan</button>
        </div>
        <button onclick="showToast('Resume Medis Pulang tersimpan & Composition FHIR dikirim ke SATUSEHAT.', 'success')" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
          Simpan &amp; Cetak Resume PDF
        </button>
      </div>
    </div>
  `;
}

initLayout('erm');
renderERM();
