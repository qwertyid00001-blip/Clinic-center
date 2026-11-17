let cfgTab = 'profil';

const MASTER_TARIF = [
  { kode: 'TR-01', nama: 'Konsultasi Dokter Umum', unit: 'Poli Umum', tarif: 75000 },
  { kode: 'TR-02', nama: 'Konsultasi Dokter Gigi / Tambal', unit: 'Poli Gigi', tarif: 150000 },
  { kode: 'TR-03', nama: 'Visite Dokter Rawat Inap', unit: 'Bangsal Ranap', tarif: 150000 },
  { kode: 'TR-04', nama: 'Paket MCU Dasar (Darah + Urin + EKG)', unit: 'MCU', tarif: 350000 },
];

const BACKUP_LOGS = [
  { tgl: '17 Nov 2026, 02:00 WIB', file: 'klinik_db_20261117.sql.gz.enc', size: '48.2 MB', status: 'Tersimpan di S3' },
  { tgl: '16 Nov 2026, 02:00 WIB', file: 'klinik_db_20261116.sql.gz.enc', size: '47.9 MB', status: 'Tersimpan di S3' },
  { tgl: '15 Nov 2026, 02:00 WIB', file: 'klinik_db_20261115.sql.gz.enc', size: '47.4 MB', status: 'Tersimpan di S3' },
];

function renderPengaturan() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'profil', label: 'Profil Klinik, Domain & WhatsApp' },
          { id: 'master', label: 'Master Tarif & Layanan' },
          { id: 'backup', label: 'Infrastruktur & Backup S3' },
        ].map(t => {
          const active = cfgTab === t.id;
          return `
            <button onclick="cfgTab='${t.id}'; renderPengaturan();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${cfgTab === 'profil' ? viewProfil() : ''}
      ${cfgTab === 'master' ? viewMasterTarif() : ''}
      ${cfgTab === 'backup' ? viewBackup() : ''}
    </div>
  `;
}

function viewProfil() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Profil Klinik &amp; Domain Resmi</h2>
          <p class="text-[12px] text-slate-400">Terhubung ke Website Publik, ERP Internal, &amp; Layar TV Antrean</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Nama Faskes / Klinik</label>
            <input type="text" value="Klinik Pratama Cahaya Medika" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Jam Operasional</label>
            <input type="text" value="24 Jam (IGD & Rawat Inap)" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Domain Website Publik</label>
            <input type="text" value="klinikanda.id" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Subdomain ERP &amp; TV Antrean</label>
            <input type="text" value="erp.klinikanda.id • antrean.klinikanda.id" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button onclick="showToast('Profil klinik & konfigurasi domain tersimpan.', 'success')" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan Pengaturan
          </button>
        </div>
      </div>

      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-[15px] font-semibold text-slate-800">WhatsApp Gateway</h3>
          <p class="text-[11px] text-slate-400">Pengiriman otomatis tiket booking, QR check-in, &amp; pengingat kontrol</p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Provider API</label>
            <select class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs">
              <option>Fonnte API (Aktif)</option>
              <option>Wablas API</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">API Token (Masked)</label>
            <input type="text" value="••••••••••••••••9012" readonly class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/80 font-mono text-xs text-slate-500" />
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button onclick="showToast('Pesan uji coba WhatsApp berhasil dikirim.', 'success')" class="h-9 px-4 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Test Kirim WhatsApp
          </button>
        </div>
      </div>

    </div>
  `;
}

function viewMasterTarif() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Master Data Tarif Layanan &amp; Paket MCU</h2>
          <p class="text-[12px] text-slate-400">Digunakan otomatis oleh Consolidated Open Bill di Kasir</p>
        </div>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Kode</th>
            <th class="pb-2.5 font-medium">Nama Layanan</th>
            <th class="pb-2.5 font-medium">Unit</th>
            <th class="pb-2.5 font-medium text-right">Tarif</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${MASTER_TARIF.map(t => `
            <tr>
              <td class="py-3 font-mono text-slate-500">${t.kode}</td>
              <td class="py-3 font-medium text-slate-800">${t.nama}</td>
              <td class="py-3 text-slate-600">${t.unit}</td>
              <td class="py-3 text-right font-semibold text-slate-800">Rp ${t.tarif.toLocaleString('id-ID')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function viewBackup() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Kedaulatan Data &amp; Automated Daily Backup</h2>
          <p class="text-[12px] text-slate-400">Biznet Gio Cloud Indonesia (ISO/IEC 27001) • Permenkes No. 24/2022 &amp; PP No. 71/2019</p>
        </div>
        <button onclick="showToast('Backup manual terenkripsi dijalankan ke NEO Object Storage S3.', 'success')" class="h-9 px-4 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
          Jalankan Backup Sekarang
        </button>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Waktu (02:00 WIB)</th>
            <th class="pb-2.5 font-medium">Berkas Backup Terenkripsi</th>
            <th class="pb-2.5 font-medium">Ukuran</th>
            <th class="pb-2.5 font-medium text-right">Status S3</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${BACKUP_LOGS.map(b => `
            <tr>
              <td class="py-3 text-slate-600">${b.tgl}</td>
              <td class="py-3 font-mono text-[11px] text-slate-800">${b.file}</td>
              <td class="py-3 text-slate-500">${b.size}</td>
              <td class="py-3 text-right text-[11px] font-medium text-brand-teal">${b.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

initLayout('pengaturan');
renderPengaturan();
