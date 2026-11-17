let penunjangTab = 'lab';
let selectedLabIdx = 0;
let selectedRadIdx = 0;

let labOrders = [
  {
    id: 'LAB-2026-114',
    pasien: 'Ibu Maya Lestari',
    rm: 'RM-2026-00388',
    unit: 'IGD',
    dokter: 'dr. Herman S.Pd',
    panel: 'Darah Lengkap (CBC) + NS1',
    waktu: '06:18 WIB',
    status: 'Menunggu Hasil',
    params: [
      { nama: 'Hemoglobin', nilai: 13.4, satuan: 'g/dL', min: 12.0, max: 16.0 },
      { nama: 'Leukosit', nilai: 3400, satuan: '/µL', min: 4000, max: 10000 },
      { nama: 'Trombosit', nilai: 92000, satuan: '/µL', min: 150000, max: 450000 },
      { nama: 'Hematokrit', nilai: 44, satuan: '%', min: 37, max: 47 },
    ]
  },
  {
    id: 'LAB-2026-112',
    pasien: 'Bpk. Andy Wijaya',
    rm: 'RM-2026-00192',
    unit: 'Poli Umum',
    dokter: 'dr. Herman S.Pd',
    panel: 'Darah Lengkap (CBC)',
    waktu: '06:05 WIB',
    status: 'Menunggu Hasil',
    params: [
      { nama: 'Hemoglobin', nilai: 14.2, satuan: 'g/dL', min: 13.0, max: 17.0 },
      { nama: 'Leukosit', nilai: 11800, satuan: '/µL', min: 4000, max: 10000 },
      { nama: 'Trombosit', nilai: 245000, satuan: '/µL', min: 150000, max: 450000 },
    ]
  },
  {
    id: 'LAB-2026-109',
    pasien: 'Tn. Rahmat Hidayat',
    rm: 'RM-2026-00210',
    unit: 'VIP-01',
    dokter: 'dr. Herman S.Pd',
    panel: 'Trombosit Serial',
    waktu: '05:40 WIB',
    status: 'Selesai',
    params: [
      { nama: 'Trombosit', nilai: 168000, satuan: '/µL', min: 150000, max: 450000 },
      { nama: 'Hematokrit', nilai: 41, satuan: '%', min: 40, max: 50 },
    ]
  }
];

let radOrders = [
  {
    id: 'RAD-2026-046',
    pasien: 'Ibu Maya Lestari',
    rm: 'RM-2026-00388',
    unit: 'IGD',
    modalitas: 'Foto Thorax AP',
    waktu: '06:22 WIB',
    status: 'Menunggu Ekspertise',
    file: '',
    kesan: ''
  },
  {
    id: 'RAD-2026-045',
    pasien: 'Bpk. Heri Kurniawan',
    rm: 'RM-2026-00412',
    unit: 'Poli Umum',
    modalitas: 'EKG 12-Lead',
    waktu: '05:50 WIB',
    status: 'Selesai (S3)',
    file: 'ekg_heri_2026045.pdf',
    kesan: 'Sinus rhythm 78 bpm, tidak tampak iskemia atau aritmia akut.'
  }
];

function renderPenunjang() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'lab', label: 'Antrean & Hasil Laboratorium' },
          { id: 'rad', label: 'Radiologi, USG & EKG (S3)' },
        ].map(t => {
          const active = penunjangTab === t.id;
          return `
            <button onclick="penunjangTab='${t.id}'; renderPenunjang();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${penunjangTab === 'lab' ? viewLab() : viewRadiologi()}
    </div>
  `;
}

// ==========================================
// TAB 1: LABORATORIUM (FR-LAB-01 & FR-LAB-02)
// ==========================================
function viewLab() {
  const order = labOrders[selectedLabIdx];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Antrean Order Lab Real-Time -->
      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Daftar Order Laboratorium</h2>
            <p class="text-[12px] text-slate-400">Klik baris order untuk mengisi parameter hasil</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${labOrders.length} Order</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">No. Order</th>
              <th class="pb-2.5 font-medium">Pasien &amp; Unit</th>
              <th class="pb-2.5 font-medium">Pemeriksaan</th>
              <th class="pb-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${labOrders.map((o, idx) => {
              const active = idx === selectedLabIdx;
              return `
                <tr onclick="selectedLabIdx=${idx}; renderPenunjang();" class="cursor-pointer transition ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                  <td class="py-3 font-mono font-semibold ${active ? 'text-brand-teal' : 'text-slate-700'}">${o.id}</td>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${o.pasien}</p>
                    <p class="text-[10px] text-slate-400">${o.unit} • ${o.waktu}</p>
                  </td>
                  <td class="py-3 text-slate-600">${o.panel}</td>
                  <td class="py-3 text-right text-[11px] font-medium ${o.status === 'Selesai' ? 'text-brand-teal' : 'text-slate-500'}">${o.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Right: Input Hasil & Penanda Nilai Rujukan Otomatis -->
      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">${order.pasien} — ${order.panel}</h3>
            <p class="text-[11px] text-slate-400">${order.id} • Pengirim: ${order.dokter} (${order.unit})</p>
          </div>
          <span class="text-[11px] font-medium ${order.status === 'Selesai' ? 'text-brand-teal' : 'text-slate-500'}">${order.status}</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2 font-medium">Parameter</th>
              <th class="pb-2 font-medium w-28">Hasil</th>
              <th class="pb-2 font-medium">Rujukan</th>
              <th class="pb-2 font-medium text-right">Flag</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${order.params.map((pr, pIdx) => {
              const flag = getLabFlag(pr.nilai, pr.min, pr.max);
              return `
                <tr>
                  <td class="py-2.5 font-medium text-slate-700">${pr.nama}</td>
                  <td class="py-2.5">
                    <div class="flex items-center gap-1.5">
                      <input type="number" step="any" value="${pr.nilai}" onchange="updateLabParam(${pIdx}, this.value)" class="w-20 h-8 px-2 rounded-lg border border-slate-300/80 font-mono text-xs text-slate-800 focus:outline-none focus:border-brand-teal" />
                      <span class="text-[10px] text-slate-400">${pr.satuan}</span>
                    </div>
                  </td>
                  <td class="py-2.5 text-[11px] text-slate-500 font-mono">${pr.min}–${pr.max}</td>
                  <td class="py-2.5 text-right text-[11px] font-semibold ${flag.cls}">${flag.label}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button onclick="showToast('Hasil Lab ${order.id} dicetak sebagai PDF resmi.', 'info')" class="text-xs font-medium text-brand-blue hover:underline">
            Cetak Hasil PDF
          </button>
          <button onclick="validateLabOrder()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan &amp; Validasi Analis
          </button>
        </div>
      </div>

    </div>
  `;
}

function getLabFlag(val, min, max) {
  const num = Number(val);
  if (num < min) return { label: 'Rendah (L)', cls: 'text-rose-600' };
  if (num > max) return { label: 'Tinggi (H)', cls: 'text-rose-600' };
  return { label: 'Normal', cls: 'text-slate-500 font-normal' };
}

function updateLabParam(paramIdx, val) {
  labOrders[selectedLabIdx].params[paramIdx].nilai = Number(val);
  renderPenunjang();
}

function validateLabOrder() {
  labOrders[selectedLabIdx].status = 'Selesai';
  showToast(`Hasil ${labOrders[selectedLabIdx].id} divalidasi. Terkirim ke ERM Dokter & Open Bill Kasir.`, 'success');
  renderPenunjang();
}

// ==========================================
// TAB 2: RADIOLOGI & PENUNJANG (S3 STORAGE)
// ==========================================
function viewRadiologi() {
  const rad = radOrders[selectedRadIdx];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Order Radiologi, USG &amp; EKG</h2>
            <p class="text-[12px] text-slate-400">Berkas gambar/PDF disimpan di NEO Object Storage S3</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${radOrders.length} Order</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">No. Order</th>
              <th class="pb-2.5 font-medium">Pasien &amp; Unit</th>
              <th class="pb-2.5 font-medium">Modalitas</th>
              <th class="pb-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${radOrders.map((r, idx) => {
              const active = idx === selectedRadIdx;
              return `
                <tr onclick="selectedRadIdx=${idx}; renderPenunjang();" class="cursor-pointer transition ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                  <td class="py-3 font-mono font-semibold ${active ? 'text-brand-teal' : 'text-slate-700'}">${r.id}</td>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${r.pasien}</p>
                    <p class="text-[10px] text-slate-400">${r.unit} • ${r.waktu}</p>
                  </td>
                  <td class="py-3 text-slate-600">${r.modalitas}</td>
                  <td class="py-3 text-right text-[11px] font-medium ${r.status.includes('Selesai') ? 'text-brand-teal' : 'text-slate-500'}">${r.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="xl:col-span-6 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-[15px] font-semibold text-slate-800">${rad.pasien} — ${rad.modalitas}</h3>
          <p class="text-[11px] text-slate-400">${rad.id} • ${rad.rm} (${rad.unit})</p>
        </div>

        <div class="text-xs space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Unggah Berkas (JPG / PNG / DICOM / PDF → NEO S3)</label>
            <input type="file" onchange="attachRadFile(this)" class="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-slate-200 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" />
            ${rad.file ? `<p class="text-[11px] text-brand-teal font-mono mt-1.5">Terlampir di S3: ${rad.file}</p>` : ''}
          </div>

          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Kesan / Ekspertise Radiologi</label>
            <textarea id="rad-kesan" rows="3" placeholder="Tuliskan hasil bacaan / ekspertise..." class="w-full p-3 rounded-lg border border-slate-300/80 text-xs text-slate-700 focus:outline-none focus:border-brand-teal">${rad.kesan}</textarea>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button onclick="showToast('Membuka preview berkas penunjang dari S3.', 'info')" class="text-xs font-medium text-brand-blue hover:underline">Lihat Berkas</button>
          <button onclick="saveRadResult()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan ke S3 &amp; Kirim ke ERM
          </button>
        </div>
      </div>

    </div>
  `;
}

function attachRadFile(input) {
  if (input.files && input.files[0]) {
    radOrders[selectedRadIdx].file = input.files[0].name;
    renderPenunjang();
  }
}

function saveRadResult() {
  const kesan = document.getElementById('rad-kesan')?.value.trim();
  if (kesan) radOrders[selectedRadIdx].kesan = kesan;
  radOrders[selectedRadIdx].status = 'Selesai (S3)';
  if (!radOrders[selectedRadIdx].file) radOrders[selectedRadIdx].file = `${radOrders[selectedRadIdx].id.toLowerCase()}.jpg`;
  showToast(`Hasil ${radOrders[selectedRadIdx].id} tersimpan ke NEO S3 & diteruskan ke ERM.`, 'success');
  renderPenunjang();
}

initLayout('penunjang');
renderPenunjang();
