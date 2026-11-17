let sdmTab = 'pegawai';
let clockedIn = true;

let employees = [
  { nama: 'dr. Herman S.Pd', nik: '3273011001800001', role: 'Dokter Umum', ihs: '10009842112', sip: 'SIP-440/102/2023', sipDays: 540, feePct: '40%' },
  { nama: 'dr. Ratna Dewi, Sp.A', nik: '3273015504840003', role: 'Dokter Anak', ihs: '10007721904', sip: 'SIP-440/088/2022', sipDays: 21, feePct: '45%' },
  { nama: 'Ns. Sari Rahayu, S.Kep', nik: '3273016209930005', role: 'Perawat Bangsal', ihs: '10006612098', sip: 'SIPP-440/211/2024', sipDays: 720, feePct: '10%' },
  { nama: 'Apt. Budi Santoso, S.Farm', nik: '3273011407910002', role: 'Apoteker', ihs: '10005591021', sip: 'SIPA-440/045/2024', sipDays: 410, feePct: '—' },
];

let attendances = [
  { nama: 'dr. Herman S.Pd', shift: 'Pagi (07:00–14:00)', masuk: '06:55 WIB', pulang: '—', jarak: '12 m', selfie: 'Terverifikasi' },
  { nama: 'Ns. Sari Rahayu, S.Kep', shift: 'Pagi (07:00–14:00)', masuk: '06:50 WIB', pulang: '—', jarak: '8 m', selfie: 'Terverifikasi' },
  { nama: 'Apt. Budi Santoso, S.Farm', shift: 'Pagi (07:00–14:00)', masuk: '06:58 WIB', pulang: '—', jarak: '19 m', selfie: 'Terverifikasi' },
];

const PAYROLL_DATA = [
  { nama: 'dr. Herman S.Pd', role: 'Dokter Umum', pokok: 5500000, tunjangan: 600000, jasaMedis: 2450000 },
  { nama: 'dr. Ratna Dewi, Sp.A', role: 'Dokter Anak', pokok: 6500000, tunjangan: 500000, jasaMedis: 1920000 },
  { nama: 'Ns. Sari Rahayu, S.Kep', role: 'Perawat Bangsal', pokok: 3800000, tunjangan: 750000, jasaMedis: 560000 },
  { nama: 'Apt. Budi Santoso, S.Farm', role: 'Apoteker', pokok: 4500000, tunjangan: 400000, jasaMedis: 0 },
];

function renderSDM() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'pegawai', label: 'Direktori Nakes & STR/SIP' },
          { id: 'absensi', label: 'Absensi GPS & Live Selfie' },
          { id: 'payroll', label: 'Payroll & Slip Gaji' },
        ].map(t => {
          const active = sdmTab === t.id;
          return `
            <button onclick="sdmTab='${t.id}'; renderSDM();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${sdmTab === 'pegawai' ? viewPegawai() : ''}
      ${sdmTab === 'absensi' ? viewAbsensi() : ''}
      ${sdmTab === 'payroll' ? viewPayroll() : ''}
    </div>
  `;
}

// ==========================================
// TAB 1: DIREKTORI PEGAWAI, STR/SIP & IHS
// ==========================================
function viewPegawai() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Tabel Nakes -->
      <div class="xl:col-span-8 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Data Pegawai &amp; Tenaga Kesehatan</h2>
            <p class="text-[12px] text-slate-400">Pemantauan masa berlaku STR/SIP &amp; Practitioner IHS ID</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${employees.length} Staf Aktif</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2.5 font-medium">Nama &amp; Role</th>
                <th class="pb-2.5 font-medium">Practitioner IHS</th>
                <th class="pb-2.5 font-medium">No. &amp; Masa SIP</th>
                <th class="pb-2.5 font-medium text-right">Fee Jasa</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${employees.map(e => `
                <tr>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${e.nama}</p>
                    <p class="text-[10px] text-slate-400">${e.role}</p>
                  </td>
                  <td class="py-3 font-mono text-[11px] text-slate-600">${e.ihs}</td>
                  <td class="py-3">
                    <p class="text-[11px] text-slate-700">${e.sip}</p>
                    <p class="text-[10px] ${e.sipDays <= 30 ? 'text-rose-600 font-semibold' : 'text-slate-400'}">
                      ${e.sipDays <= 30 ? `Berakhir ${e.sipDays} hari lagi` : `Aktif (${e.sipDays} hr)`}
                    </p>
                  </td>
                  <td class="py-3 text-right font-medium text-slate-700">${e.feePct}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Tambah Pegawai Baru + Tarik IHS -->
      <div class="xl:col-span-4 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-[15px] font-semibold text-slate-800">Tambah Staf / Nakes Baru</h3>
          <p class="text-[11px] text-slate-400">Otomatis tarik Practitioner IHS via NIK KTP</p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap &amp; Gelar</label>
            <input id="emp-name" type="text" placeholder="mis. Ns. Dani Pratama, S.Kep" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">NIK KTP (16 Digit)</label>
            <input id="emp-nik" type="text" maxlength="16" placeholder="327301..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Role RBAC</label>
              <select id="emp-role" class="w-full h-9 px-2 rounded-lg border border-slate-300/80 bg-white text-xs">
                <option>Perawat Bangsal</option>
                <option>Dokter Umum</option>
                <option>Apoteker</option>
                <option>Admisi / Kasir</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">PIN TTE (6 Digit)</label>
              <input type="password" maxlength="6" value="123456" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button onclick="addEmployee()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan &amp; Tarik IHS
          </button>
        </div>
      </div>

    </div>
  `;
}

function addEmployee() {
  const nama = document.getElementById('emp-name')?.value.trim();
  const nik = document.getElementById('emp-nik')?.value.trim() || '3273019901010008';
  const role = document.getElementById('emp-role')?.value || 'Perawat Bangsal';
  if (!nama) {
    showToast('Masukkan nama staf terlebih dahulu.', 'info');
    return;
  }
  const newIhs = `1000${Math.floor(1000000 + Math.random() * 8999999)}`;
  employees.unshift({ nama, nik, role, ihs: newIhs, sip: 'SIP-440/NEW/2026', sipDays: 365, feePct: '10%' });
  showToast(`${nama} ditambahkan! Practitioner IHS ${newIhs} ditarik dari SATUSEHAT.`, 'success');
  renderSDM();
}

// ==========================================
// TAB 2: ABSENSI GPS GEOFENCING & LIVE SELFIE
// ==========================================
function viewAbsensi() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Clock-In / Clock-Out Pegawai</h2>
          <p class="text-[12px] text-slate-400">Validasi radius GPS ≤ 50 m &amp; membuka kunci Smart Shift Lock</p>
        </div>

        <div class="grid grid-cols-2 gap-3 py-2.5 px-3 border-l-2 ${clockedIn ? 'border-brand-teal' : 'border-slate-300'} bg-slate-50/50 text-[11px]">
          <div>
            <p class="text-slate-400 text-[10px]">Jarak GPS dari Klinik</p>
            <p class="font-semibold text-slate-800">12 meter (Valid ≤ 50 m)</p>
          </div>
          <div>
            <p class="text-slate-400 text-[10px]">Smart Shift Lock</p>
            <p class="font-semibold ${clockedIn ? 'text-brand-teal' : 'text-slate-500'}">${clockedIn ? 'Terbuka (Shift Pagi)' : 'Terkunci'}</p>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">Live Selfie tersimpan di NEO S3</span>
          <button onclick="toggleClockIn()" class="h-9 px-5 rounded-lg ${clockedIn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-brand-teal hover:bg-brand-tealDark'} text-white text-xs font-medium transition">
            ${clockedIn ? 'Clock-Out (Akhiri Shift)' : 'Clock-In + Live Selfie'}
          </button>
        </div>
      </div>

      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <h2 class="text-[16px] font-semibold text-slate-800 mb-4">Log Kehadiran Hari Ini</h2>
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Pegawai</th>
              <th class="pb-2.5 font-medium">Shift</th>
              <th class="pb-2.5 font-medium">Masuk / Pulang</th>
              <th class="pb-2.5 font-medium">GPS</th>
              <th class="pb-2.5 font-medium text-right">Selfie</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${attendances.map(a => `
              <tr>
                <td class="py-3 font-medium text-slate-800">${a.nama}</td>
                <td class="py-3 text-slate-500 text-[11px]">${a.shift}</td>
                <td class="py-3 font-mono text-[11px] text-slate-700">${a.masuk} / ${a.pulang}</td>
                <td class="py-3 text-slate-600">${a.jarak}</td>
                <td class="py-3 text-right text-[11px] font-medium text-brand-teal">${a.selfie}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

function toggleClockIn() {
  clockedIn = !clockedIn;
  if (clockedIn) {
    attendances[0].pulang = '—';
    showToast('Clock-In berhasil (12 m). Smart Shift Lock terbuka.', 'success');
  } else {
    attendances[0].pulang = '07:49 WIB';
    showToast('Clock-Out tercatat. Akses transaksi klinis dikunci.', 'info');
  }
  renderSDM();
}

// ==========================================
// TAB 3: PAYROLL & SLIP GAJI
// ==========================================
function viewPayroll() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Rekapitulasi Payroll &amp; Jasa Medis (November 2026)</h2>
          <p class="text-[12px] text-slate-400">Gaji pokok + tunjangan shift malam + komisi Jasa Medis otomatis</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Nama Pegawai</th>
              <th class="pb-2.5 font-medium text-right">Gaji Pokok</th>
              <th class="pb-2.5 font-medium text-right">Tunjangan Shift</th>
              <th class="pb-2.5 font-medium text-right">Jasa Medis</th>
              <th class="pb-2.5 font-medium text-right">Total Gaji</th>
              <th class="pb-2.5 font-medium text-right">Slip</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${PAYROLL_DATA.map(p => {
              const total = p.pokok + p.tunjangan + p.jasaMedis;
              return `
                <tr>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${p.nama}</p>
                    <p class="text-[10px] text-slate-400">${p.role}</p>
                  </td>
                  <td class="py-3 text-right text-slate-600">Rp ${p.pokok.toLocaleString('id-ID')}</td>
                  <td class="py-3 text-right text-slate-600">Rp ${p.tunjangan.toLocaleString('id-ID')}</td>
                  <td class="py-3 text-right text-brand-teal font-medium">Rp ${p.jasaMedis.toLocaleString('id-ID')}</td>
                  <td class="py-3 text-right font-semibold text-slate-800">Rp ${total.toLocaleString('id-ID')}</td>
                  <td class="py-3 text-right">
                    <button onclick="showToast('Slip Gaji PDF ${p.nama} dicetak.', 'info')" class="text-[11px] font-medium text-brand-blue hover:underline">Cetak PDF</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

initLayout('sdm');
renderSDM();
