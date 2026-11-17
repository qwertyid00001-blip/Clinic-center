let selectedRoleIdx = 0;
let smartShiftLockEnabled = true;

const ROLES = [
  { name: 'Super Admin / Manajemen', users: 2, scope: 'Akses penuh seluruh modul & Audit Trail' },
  { name: 'HRD / Kepegawaian', users: 1, scope: 'SDM, STR/SIP, Shift, Absensi, Payroll (Tanpa SOAP)' },
  { name: 'Admisi / Front Office', users: 3, scope: 'Registrasi NIK, Antrean, ADT, Consent (Tanpa ERM/Resep)' },
  { name: 'Perawat (Rajal / IGD / Ranap)', users: 6, scope: 'Triase, TTV, Bed Map, CPPT, MAR (Tanpa Harga/Gudang)' },
  { name: 'Dokter (Poli / IGD / Visite)', users: 4, scope: 'SOAP, Odontogram, Body Map, E-Resep, Resume' },
  { name: 'Apoteker & Gudang Farmasi', users: 2, scope: 'Resep, Etiket, Stok FEFO, PO, KFA (Tanpa Diagnosis)' },
  { name: 'Analis Lab & Radiologi', users: 2, scope: 'Order & Input Hasil Penunjang, Upload S3' },
  { name: 'Kasir / Billing', users: 2, scope: 'Open Bill, Deposit, Checkout (Tanpa SOAP/Anamnesis)' },
  { name: 'Pasien / Publik', users: 0, scope: 'Website Publik, Live Bed, Booking Online' },
];

let roleMatrix = [
  { modul: 'Dashboard Analitik & BOR', view: true, create: false, edit: false, export: true },
  { modul: 'Admisi, Antrean & ADT', view: true, create: true, edit: true, export: false },
  { modul: 'Rekam Medis (SOAP / CPPT / MAR)', view: true, create: true, edit: true, export: true },
  { modul: 'Penunjang Medis (Lab & Rad)', view: true, create: true, edit: true, export: true },
  { modul: 'Farmasi & Gudang FEFO', view: true, create: true, edit: true, export: true },
  { modul: 'Kasir & Keuangan (Open Bill)', view: true, create: true, edit: true, export: true },
  { modul: 'Integrasi SATUSEHAT & Kredensial', view: true, create: true, edit: true, export: false },
  { modul: 'SDM, Absensi & Payroll', view: true, create: true, edit: true, export: true },
];

function renderHakAkses() {
  const main = document.getElementById('main-content');
  const role = ROLES[selectedRoleIdx];

  main.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: 9 Role List -->
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Daftar Role Pengguna (RBAC)</h2>
          <p class="text-[12px] text-slate-400">spatie/laravel-permission • Pilih role untuk atur izin</p>
        </div>

        <div class="divide-y divide-slate-100 text-xs">
          ${ROLES.map((r, idx) => {
            const active = idx === selectedRoleIdx;
            return `
              <div onclick="selectedRoleIdx=${idx}; renderHakAkses();" class="py-3 px-2 rounded-lg cursor-pointer transition flex items-start justify-between gap-2 ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                <div>
                  <p class="font-semibold ${active ? 'text-brand-teal' : 'text-slate-800'}">${idx + 1}. ${r.name}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">${r.scope}</p>
                </div>
                <span class="text-[10px] font-mono text-slate-400 shrink-0">${r.users > 0 ? `${r.users} akun` : 'Publik'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right: Permission Matrix + Smart Shift Lock -->
      <div class="xl:col-span-7 space-y-6">
        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-[15px] font-semibold text-slate-800">Matriks Izin: ${role.name}</h3>
              <p class="text-[11px] text-slate-400">${role.scope}</p>
            </div>
            <button onclick="showToast('Matriks izin ${role.name} diperbarui.', 'success')" class="h-8 px-4 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
              Simpan Izin
            </button>
          </div>

          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2.5 font-medium">Modul</th>
                <th class="pb-2.5 font-medium text-center">View</th>
                <th class="pb-2.5 font-medium text-center">Create</th>
                <th class="pb-2.5 font-medium text-center">Edit</th>
                <th class="pb-2.5 font-medium text-center">Export</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${roleMatrix.map((m, idx) => `
                <tr>
                  <td class="py-2.5 font-medium text-slate-700">${m.modul}</td>
                  ${['view', 'create', 'edit', 'export'].map(perm => `
                    <td class="py-2.5 text-center">
                      <input type="checkbox" ${m[perm] ? 'checked' : ''} onchange="roleMatrix[${idx}]['${perm}']=this.checked" class="w-4 h-4 accent-brand-teal cursor-pointer" />
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">Smart Shift Lock (Custom Shift Middleware)</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Mengunci input transaksi klinis/kasir di luar jam shift aktif &amp; radius GPS ≤ 50 m</p>
          </div>
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input type="checkbox" ${smartShiftLockEnabled ? 'checked' : ''} onchange="smartShiftLockEnabled=this.checked; showToast('Smart Shift Lock ' + (this.checked ? 'diaktifkan' : 'dinonaktifkan') + '.', 'info');" class="w-4 h-4 accent-brand-teal" />
            <span>Aktif</span>
          </label>
        </div>
      </div>

    </div>
  `;
}

initLayout('hak-akses');
renderHakAkses();
