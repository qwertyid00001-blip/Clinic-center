let queueFilter = 'semua';
let chartRange = '7d';
let bedFilter = 'semua';
let selectedBed = { code: 'VIP-01', ward: 'VIP Mawar', status: 'terisi', detail: 'Tn. Rahmat (Hari ke-3) • dr. Herman' };

let queueList = [
  { no: '002', name: 'Bpk. Andy', poli: 'Poli Umum', time: '08:05', status: 'Diperiksa', state: 'active', type: 'poli' },
  { no: '003', name: 'Bpk. Heri', poli: 'Poli Umum', time: '08:12', status: 'Menunggu', state: 'waiting', type: 'poli' },
  { no: '004', name: 'Ibu Siti Aminah', poli: 'Poli Gigi', time: '08:18', status: 'Menunggu', state: 'waiting', type: 'poli' },
  { no: '005', name: 'An. Rafa Pratama', poli: 'Farmasi', time: '08:22', status: 'Racik Obat', state: 'info', type: 'apotek' },
  { no: '006', name: 'Ibu Maya Lestari', poli: 'IGD', time: '08:25', status: 'Observasi', state: 'urgent', type: 'poli' },
];

const CHART_DATA = {
  '7d': [
    { label: 'Sen', rajal: 68, ranap: 14 },
    { label: 'Sel', rajal: 82, ranap: 18 },
    { label: 'Rab', rajal: 74, ranap: 16 },
    { label: 'Kam', rajal: 90, ranap: 20 },
    { label: 'Jum', rajal: 64, ranap: 17 },
    { label: 'Sab', rajal: 95, ranap: 22 },
    { label: 'Min', rajal: 52, ranap: 12 },
  ],
  '30d': [
    { label: 'M1', rajal: 102, ranap: 24 },
    { label: 'M2', rajal: 114, ranap: 28 },
    { label: 'M3', rajal: 96, ranap: 21 },
    { label: 'M4', rajal: 118, ranap: 26 },
  ]
};

const WARD_DATA = [
  {
    name: 'VIP Mawar',
    rate: 'Rp 750rb',
    beds: [
      { code: 'V1', full: 'VIP-01', status: 'terisi', detail: 'Tn. Rahmat (Hari ke-3) • dr. Herman' },
      { code: 'V2', full: 'VIP-02', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 750rb/mlm' },
    ]
  },
  {
    name: 'Kelas 1',
    rate: 'Rp 450rb',
    beds: [
      { code: '1A', full: 'K1-01', status: 'terisi', detail: 'Ny. Kartini (Hari ke-2) • dr. Ratna' },
      { code: '1B', full: 'K1-02', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 450rb/mlm' },
      { code: '1C', full: 'K1-03', status: 'terisi', detail: 'Tn. Bambang (Hari ke-1) • dr. Herman' },
      { code: '1D', full: 'K1-04', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 450rb/mlm' },
    ]
  },
  {
    name: 'Kelas 2',
    rate: 'Rp 300rb',
    beds: [
      { code: '2A', full: 'K2-01', status: 'terisi', detail: 'An. Fajar (Hari ke-2)' },
      { code: '2B', full: 'K2-02', status: 'terisi', detail: 'Ny. Yuni (Hari ke-4)' },
      { code: '2C', full: 'K2-03', status: 'terisi', detail: 'Tn. Dedi (Hari ke-1)' },
      { code: '2D', full: 'K2-04', status: 'steril', detail: 'Sedang Dibersihkan (Petugas Kebersihan)' },
      { code: '2E', full: 'K2-05', status: 'terisi', detail: 'Ny. Rina (Hari ke-2)' },
      { code: '2F', full: 'K2-06', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 300rb/mlm' },
    ]
  },
  {
    name: 'Kelas 3',
    rate: 'Rp 175rb',
    beds: [
      { code: '3A', full: 'K3-01', status: 'terisi', detail: 'Tn. Wahyu (Hari ke-2)' },
      { code: '3B', full: 'K3-02', status: 'terisi', detail: 'Ny. Lilis (Hari ke-3)' },
      { code: '3C', full: 'K3-03', status: 'terisi', detail: 'Tn. Arif (Hari ke-1)' },
      { code: '3D', full: 'K3-04', status: 'terisi', detail: 'Ny. Sari (Hari ke-2)' },
      { code: '3E', full: 'K3-05', status: 'terisi', detail: 'Sdr. Hendra (Hari ke-1)' },
      { code: '3F', full: 'K3-06', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 175rb/mlm' },
    ]
  },
  {
    name: 'Isolasi',
    rate: 'Rp 500rb',
    beds: [
      { code: 'IS1', full: 'ISO-01', status: 'terisi', detail: 'Tn. Joko (Observasi Isolasi)' },
      { code: 'IS2', full: 'ISO-02', status: 'kosong', detail: 'Kosong & Siap Pakai • Rp 500rb/mlm' },
    ]
  }
];

function renderDashboard() {
  const main = document.getElementById('main-content');
  const filteredQueue = queueFilter === 'semua' ? queueList : queueList.filter(q => q.type === queueFilter);
  const allBeds = WARD_DATA.flatMap(w => w.beds);
  const totalBeds = allBeds.length;
  const terisiCount = allBeds.filter(b => b.status === 'terisi').length;
  const kosongCount = allBeds.filter(b => b.status === 'kosong').length;
  const sterilCount = allBeds.filter(b => b.status === 'steril').length;
  const borPct = Math.round(((terisiCount + sterilCount) / totalBeds) * 100);

  main.innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left/Center Column (8 cols on XL) -->
      <div class="xl:col-span-8 space-y-6">
        
        <!-- KPI Cards Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="teal-kpi-card rounded-[22px] p-4 text-white shadow-teal relative overflow-hidden">
            <div class="w-9 h-9 rounded-xl bg-white/95 text-brand-teal flex items-center justify-center mb-3 shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </div>
            <p class="text-[12px] font-normal text-white/90">Total Kunjungan</p>
            <div class="flex items-baseline gap-1.5 mt-0.5">
              <span class="text-[34px] font-light leading-none tracking-tight">172</span>
              <span class="text-[12px] font-light text-white/90">Jiwa</span>
            </div>
          </div>

          <div class="teal-kpi-card rounded-[22px] p-4 text-white shadow-teal relative overflow-hidden">
            <div class="w-9 h-9 rounded-xl bg-white/95 text-brand-teal flex items-center justify-center mb-3 shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            </div>
            <p class="text-[12px] font-normal text-white/90">Dalam Penanganan</p>
            <div class="flex items-baseline gap-1.5 mt-0.5">
              <span class="text-[34px] font-light leading-none tracking-tight">10</span>
              <span class="text-[12px] font-light text-white/90">Jiwa</span>
            </div>
          </div>

          <div class="teal-kpi-card rounded-[22px] p-4 text-white shadow-teal relative overflow-hidden cursor-pointer hover:brightness-105 transition" onclick="navigateTo('admisi')">
            <div class="w-9 h-9 rounded-xl bg-white/95 text-brand-teal flex items-center justify-center mb-3 shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            </div>
            <p class="text-[12px] font-normal text-white/90">Bed Kosong (Ranap)</p>
            <div class="flex items-baseline gap-1.5 mt-0.5">
              <span class="text-[34px] font-light leading-none tracking-tight">${kosongCount}</span>
              <span class="text-[12px] font-light text-white/90">/ ${totalBeds} Bed</span>
            </div>
          </div>

          <div class="teal-kpi-card rounded-[22px] p-4 text-white shadow-teal relative overflow-hidden cursor-pointer hover:brightness-105 transition" onclick="navigateTo('kasir')">
            <div class="w-9 h-9 rounded-xl bg-white/95 text-brand-teal flex items-center justify-center mb-3 shadow-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <p class="text-[12px] font-normal text-white/90">Pendapatan Hari Ini</p>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-[28px] font-light leading-none tracking-tight">28,4</span>
              <span class="text-[12px] font-light text-white/90">Jt</span>
            </div>
          </div>
        </div>

        <!-- Middle Section: Precision Chart & Ward Bed Matrix -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
            <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h2 class="text-[15px] font-semibold text-slate-800">Tren Kunjungan</h2>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[12px] font-semibold text-slate-700">${chartRange === '7d' ? '644' : '529'} kunjungan</span>
                  <span class="text-[11px] text-emerald-600 font-medium">+12,4% vs periode lalu</span>
                </div>
              </div>
              <div class="inline-flex bg-slate-100 p-0.5 rounded-lg text-[11px]">
                <button onclick="setChartRange('7d')" class="px-2.5 py-1 rounded-md font-medium transition ${chartRange === '7d' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}">7 Hari</button>
                <button onclick="setChartRange('30d')" class="px-2.5 py-1 rounded-md font-medium transition ${chartRange === '30d' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}">4 Pekan</button>
              </div>
            </div>

            ${renderKunjunganSvgChart()}

            <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-[3px] bg-brand-teal"></span> Rawat Jalan &amp; IGD</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-[3px] bg-brand-blue"></span> Rawat Inap</span>
              </div>
              <span id="chart-hover-readout" class="text-slate-400 font-medium">Arahkan kursor ke batang</span>
            </div>
          </div>

          <div class="lg:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h2 class="text-[15px] font-semibold text-slate-800">Mapping Kamar &amp; Bed</h2>
                  <p class="text-[11px] text-slate-400">BOR <strong class="text-slate-700">${borPct}%</strong> • Sinkron Web Publik</p>
                </div>
                <span class="text-[10px] font-medium text-slate-400">${totalBeds} Total</span>
              </div>

              <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex mb-3">
                <div style="width: ${(terisiCount / totalBeds) * 100}%" class="bg-brand-blue" title="${terisiCount} Sudah Terisi"></div>
                <div style="width: ${(sterilCount / totalBeds) * 100}%" class="bg-amber-400" title="${sterilCount} Masih Dibersihkan"></div>
                <div style="width: ${(kosongCount / totalBeds) * 100}%" class="bg-brand-teal/35" title="${kosongCount} Kosong"></div>
              </div>

              <div class="flex items-center justify-between border-b border-slate-100 mb-2 text-[11px]">
                ${[
                  { id: 'semua', label: 'Semua', count: totalBeds },
                  { id: 'terisi', label: 'Terisi', count: terisiCount },
                  { id: 'kosong', label: 'Kosong', count: kosongCount },
                  { id: 'steril', label: 'Dibersihkan', count: sterilCount },
                ].map(t => {
                  const active = bedFilter === t.id;
                  return `
                    <button onclick="setBedFilter('${t.id}')" class="pb-2 -mb-px border-b-2 transition whitespace-nowrap ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-600 font-normal'}">
                      ${t.label} <span class="${active ? 'text-brand-teal' : 'text-slate-300'} ml-0.5">${t.count}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <div class="divide-y divide-slate-100 text-xs">
                ${WARD_DATA.map(w => {
                  const visibleBeds = bedFilter === 'semua' ? w.beds : w.beds.filter(b => b.status === bedFilter);
                  return `
                  <div class="py-2 flex items-center justify-between gap-2">
                    <div class="min-w-[82px]">
                      <p class="font-medium text-slate-700 leading-tight">${w.name}</p>
                      <p class="text-[10px] text-slate-400">${w.rate}/mlm</p>
                    </div>
                    <div class="flex flex-wrap justify-end gap-1">
                      ${visibleBeds.length ? visibleBeds.map(b => {
                        const isSelected = selectedBed.code === b.full;
                        const style = b.status === 'kosong'
                          ? 'bg-white border-brand-teal text-brand-teal hover:bg-teal-50'
                          : b.status === 'steril'
                          ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100'
                          : 'bg-brand-blue border-brand-blue text-white hover:opacity-90';
                        return `
                          <button onclick="selectBed('${b.full}', '${w.name}', '${b.status}', '${b.detail}')" title="${b.full}: ${b.detail}" class="px-1.5 py-0.5 rounded-md border text-[10px] font-semibold transition ${style} ${isSelected ? 'ring-2 ring-offset-1 ring-slate-400' : ''}">
                            ${b.code}
                          </button>
                        `;
                      }).join('') : `<span class="text-[10px] text-slate-300 italic">—</span>`}
                    </div>
                  </div>
                `;
                }).join('')}
              </div>
            </div>

            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
              <div class="truncate">
                <span class="font-semibold text-slate-700">${selectedBed.code}</span>
                <span class="text-slate-400 mx-1">•</span>
                <span class="text-slate-500">${selectedBed.detail}</span>
              </div>
              ${selectedBed.status === 'steril' ? `
                <button onclick="updateBedStatus('${selectedBed.code}', 'kosong')" class="shrink-0 px-2 py-0.5 rounded-md bg-brand-teal text-white text-[10px] font-medium hover:bg-brand-tealDark transition">
                  Tandai Kosong
                </button>
              ` : selectedBed.status === 'terisi' ? `
                <button onclick="updateBedStatus('${selectedBed.code}', 'steril')" class="shrink-0 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 text-[10px] font-medium hover:bg-slate-50 transition">
                  Pulangkan
                </button>
              ` : `
                <span class="shrink-0 text-[10px] font-medium text-brand-teal">Siap Pakai</span>
              `}
            </div>
          </div>
        </div>

        <!-- Bottom Section: SATUSEHAT Summary & Operational Table -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <h2 class="text-[15px] font-semibold text-slate-800">SATUSEHAT FHIR R4</h2>
                <button onclick="navigateTo('satusehat')" class="text-[11px] font-medium text-brand-blue hover:underline">Log →</button>
              </div>
              <div class="flex items-baseline gap-2 mt-3">
                <span class="text-[32px] font-light text-slate-800 leading-none tracking-tight">98,4%</span>
                <span class="text-[12px] text-slate-400">168 dari 172 terkirim</span>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <div class="min-w-0">
                <p class="font-medium text-slate-700 truncate">ENC-0891 • MedicationDispense</p>
                <p class="text-[11px] text-slate-400 truncate">Gagal validasi KFA • 3 antrean pending</p>
              </div>
              <button onclick="showToast('Antrean ENC-0891 dikirim ulang ke Redis Worker.', 'success')" class="shrink-0 px-3 py-1.5 rounded-full bg-brand-teal text-white text-[11px] font-medium hover:bg-brand-tealDark transition">
                Kirim Ulang
              </button>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-5">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-[15px] font-semibold text-slate-800">Tindak Lanjut Operasional</h2>
              <span class="text-[11px] text-slate-400">Hari Ini</span>
            </div>
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th class="pb-2 font-medium">Item</th>
                  <th class="pb-2 font-medium">Keterangan</th>
                  <th class="pb-2 font-medium text-right">Menu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="py-2.5 font-medium text-slate-700">Amoxicillin 500mg</td>
                  <td class="py-2.5 text-slate-500">Batch B-441 • ED 24 hari</td>
                  <td class="py-2.5 text-right"><button onclick="navigateTo('farmasi')" class="text-[11px] font-medium text-brand-blue hover:underline">Farmasi →</button></td>
                </tr>
                <tr>
                  <td class="py-2.5 font-medium text-slate-700">dr. Ratna Dewi, Sp.A</td>
                  <td class="py-2.5 text-slate-500">SIP berakhir 21 hari lagi</td>
                  <td class="py-2.5 text-right"><button onclick="navigateTo('sdm')" class="text-[11px] font-medium text-brand-blue hover:underline">SDM →</button></td>
                </tr>
                <tr>
                  <td class="py-2.5 font-medium text-slate-700">Shift Siang (14:00)</td>
                  <td class="py-2.5 text-slate-500">2 Dokter, 3 Perawat terjadwal</td>
                  <td class="py-2.5 text-right"><button onclick="navigateTo('jadwal')" class="text-[11px] font-medium text-brand-blue hover:underline">Jadwal →</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: ANTREAN PANEL -->
      <div class="xl:col-span-4 bg-white rounded-[28px] border border-slate-200/80 shadow-card p-6 flex flex-col min-h-[540px]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[20px] font-medium text-slate-800">Antrean</h2>
          <button onclick="callNextQueue()" class="text-[11px] font-medium px-3 py-1.5 rounded-full bg-brand-teal text-white hover:bg-brand-tealDark transition shadow-xs">
            + Panggil Berikutnya
          </button>
        </div>

        <div class="flex items-center gap-5 border-b border-slate-100 mb-2 text-[12px]">
          ${[
            { id: 'semua', label: 'Semua' },
            { id: 'poli', label: 'Poli & IGD' },
            { id: 'apotek', label: 'Apotek' }
          ].map(f => {
            const active = queueFilter === f.id;
            return `
              <button onclick="setQueueFilter('${f.id}')" class="pb-2.5 -mb-px border-b-2 transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-600 font-normal'}">
                ${f.label}
              </button>
            `;
          }).join('')}
        </div>

        <div class="divide-y divide-slate-100 flex-1 overflow-y-auto">
          ${filteredQueue.map(q => {
            const stateStyle = q.state === 'active'
              ? 'text-brand-teal font-semibold'
              : q.state === 'urgent'
              ? 'text-rose-600 font-medium'
              : q.state === 'info'
              ? 'text-brand-blue font-medium'
              : 'text-slate-400 font-normal';
            return `
              <div class="py-3.5 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition cursor-pointer rounded-lg" onclick="showToast('Membuka rekam medis antrean ${q.no} (${q.name})', 'info')">
                <div class="flex items-center gap-3.5 min-w-0">
                  <span class="text-[22px] font-light tabular-nums leading-none ${q.state === 'active' ? 'text-brand-teal font-normal' : 'text-slate-800'}">${q.no}</span>
                  <div class="min-w-0">
                    <p class="text-[13px] font-medium text-slate-700 truncate">${q.name}</p>
                    <p class="text-[11px] text-slate-400">${q.poli} • ${q.time}</p>
                  </div>
                </div>
                <span class="text-[11px] shrink-0 ${stateStyle}">${q.status}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>TV Ruang Tunggu • TTS Aktif</span>
          <button onclick="showToast('Simulasi suara TTS: Nomor antrean 003, Bpk. Heri, silakan menuju Poli Umum.', 'info')" class="text-brand-blue font-medium hover:underline">Tes Suara TV</button>
        </div>
      </div>

    </div>
  `;
}

function setQueueFilter(f) {
  queueFilter = f;
  renderDashboard();
}

function callNextQueue() {
  const waiting = queueList.find(q => q.state === 'waiting');
  if (waiting) {
    waiting.status = 'Diperiksa';
    waiting.state = 'active';
    showToast(`Memanggil antrean ${waiting.no} (${waiting.name}) ke ${waiting.poli}`, 'success');
    renderDashboard();
  } else {
    showToast('Tidak ada pasien berstatus Menunggu.', 'info');
  }
}

function setChartRange(r) {
  chartRange = r;
  renderDashboard();
}

function updateChartReadout(text) {
  const el = document.getElementById('chart-hover-readout');
  if (el) el.textContent = text;
}

function selectBed(code, ward, status, detail) {
  selectedBed = { code, ward, status, detail };
  renderDashboard();
}

function setBedFilter(f) {
  bedFilter = f;
  renderDashboard();
}

function updateBedStatus(fullCode, newStatus) {
  for (const w of WARD_DATA) {
    const bed = w.beds.find(b => b.full === fullCode);
    if (bed) {
      bed.status = newStatus;
      bed.detail = newStatus === 'kosong'
        ? `Kosong & Siap Pakai • ${w.rate}/mlm`
        : 'Sedang Dibersihkan (Petugas Kebersihan)';
      selectedBed = { code: bed.full, ward: w.name, status: bed.status, detail: bed.detail };
      showToast(
        newStatus === 'kosong'
          ? `${fullCode} selesai dibersihkan → Status Kosong (Kuota Web Publik +1).`
          : `${fullCode} ditandai Masih Dibersihkan.`,
        'success'
      );
      renderDashboard();
      return;
    }
  }
}

function renderKunjunganSvgChart() {
  const data = CHART_DATA[chartRange];
  const maxVal = 120;
  const chartW = 460;
  const chartH = 155;
  const padL = 30;
  const padR = 12;
  const padT = 12;
  const padB = 24;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const step = plotW / data.length;
  const barW = Math.min(18, step * 0.28);

  const ticks = [0, 40, 80, 120];
  const gridLines = ticks.map(t => {
    const y = padT + plotH - (t / maxVal) * plotH;
    return `
      <line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="#E2E8F0" stroke-width="1" ${t > 0 ? 'stroke-dasharray="3 3"' : ''} />
      <text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="#94A3B8" font-size="9.5" font-family="Poppins, sans-serif">${t}</text>
    `;
  }).join('');

  const bars = data.map((d, i) => {
    const cx = padL + step * i + step / 2;
    const hRajal = (d.rajal / maxVal) * plotH;
    const hRanap = (d.ranap / maxVal) * plotH;
    const yRajal = padT + plotH - hRajal;
    const yRanap = padT + plotH - hRanap;
    const readout = `${d.label}: ${d.rajal} Rajal/IGD, ${d.ranap} Ranap`;

    return `
      <g class="cursor-pointer group" onmouseenter="updateChartReadout('${readout}')" onmouseleave="updateChartReadout('Arahkan kursor ke batang')">
        <rect x="${cx - step / 2}" y="${padT}" width="${step}" height="${plotH}" fill="transparent" />
        <rect x="${cx - barW - 2}" y="${yRajal}" width="${barW}" height="${hRajal}" rx="3" fill="#009BA4" class="transition-opacity group-hover:opacity-80" />
        <rect x="${cx + 2}" y="${yRanap}" width="${barW}" height="${hRanap}" rx="3" fill="#38729D" class="transition-opacity group-hover:opacity-80" />
        <text x="${cx}" y="${chartH - 6}" text-anchor="middle" fill="#64748B" font-size="10" font-weight="500" font-family="Poppins, sans-serif">${d.label}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="w-full">
      <svg viewBox="0 0 ${chartW} ${chartH}" class="w-full h-44 overflow-visible">
        ${gridLines}
        ${bars}
      </svg>
    </div>
  `;
}

initLayout('dashboard');
renderDashboard();
