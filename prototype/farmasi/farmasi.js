let farmasiTab = 'resep';
let selectedRxIdx = 0;
let stockQuery = '';
let warehouseFilter = 'Semua';

let rxQueue = [
  {
    id: 'RX-089',
    pasien: 'Bpk. Andy Wijaya',
    rm: 'RM-2026-00192',
    unit: 'Poli Umum',
    dokter: 'dr. Herman S.Pd',
    waktu: '06:12 WIB',
    status: 'Siap Diserahkan',
    items: [
      { invId: 'INV-PCT', nama: 'Paracetamol 500mg Tab', aturan: '3 x 1 Tab sesudah makan', qty: 10, batch: 'B-812', harga: 15000 },
      { invId: 'INV-AMB', nama: 'Ambroxol 30mg Tab', aturan: '3 x 1 Tab sesudah makan', qty: 10, batch: 'B-502', harga: 22000 },
    ]
  },
  {
    id: 'RX-088',
    pasien: 'An. Rafa Pratama',
    rm: 'RM-2026-00401',
    unit: 'Poli Anak',
    dokter: 'dr. Ratna Dewi, Sp.A',
    waktu: '06:04 WIB',
    status: 'Racik Obat',
    items: [
      { invId: 'INV-PCT-SYR', nama: 'Paracetamol Syrup 60ml', aturan: '3 x 1 cth (5 ml) bila demam', qty: 1, batch: 'S-118', harga: 28000 },
    ]
  },
  {
    id: 'RX-087',
    pasien: 'Ibu Maya Lestari',
    rm: 'RM-2026-00388',
    unit: 'IGD',
    dokter: 'dr. Herman S.Pd',
    waktu: '05:55 WIB',
    status: 'Diserahkan',
    items: [
      { invId: 'INV-RL', nama: 'Infus Ringer Laktat 500ml', aturan: '20 tpm intravena', qty: 2, batch: 'RL-091', harga: 44000 },
    ]
  }
];

let inventory = [
  { id: 'INV-AMX', nama: 'Amoxicillin 500mg Kaplet', kfa: '93001029', gudang: 'Depo Apotek', batch: 'B-441', ed: '12 Des 2026', edDays: 24, hpp: 650, jual: 1200, stok: 120, satuan: 'Tab' },
  { id: 'INV-PCT', nama: 'Paracetamol 500mg Tab', kfa: '93000412', gudang: 'Depo Apotek', batch: 'B-812', ed: '18 Agu 2027', edDays: 274, hpp: 350, jual: 1500, stok: 1450, satuan: 'Tab' },
  { id: 'INV-AMB', nama: 'Ambroxol 30mg Tab', kfa: '93000881', gudang: 'Depo Apotek', batch: 'B-502', ed: '04 Okt 2027', edDays: 321, hpp: 800, jual: 2200, stok: 640, satuan: 'Tab' },
  { id: 'INV-PCT-SYR', nama: 'Paracetamol Syrup 60ml', kfa: '93000415', gudang: 'Depo Apotek', batch: 'S-118', ed: '22 Mei 2027', edDays: 186, hpp: 14000, jual: 28000, stok: 38, satuan: 'Btl' },
  { id: 'INV-RL', nama: 'Infus Ringer Laktat 500ml', kfa: '93002104', gudang: 'Gudang Utama', batch: 'RL-091', ed: '02 Nov 2027', edDays: 350, hpp: 11000, jual: 22000, stok: 210, satuan: 'Kolf' },
];

let poList = [
  { no: 'PO-2026-071', pbf: 'PT Kimia Farma Trading', item: 'Amoxicillin 500mg (10 Box)', total: 'Rp 650.000', status: 'Menunggu Kirim' },
  { no: 'PO-2026-070', pbf: 'PT Bina San Prima', item: 'Infus RL 500ml (5 Karton)', total: 'Rp 1.100.000', status: 'Diterima' },
];

let stockCardLogs = [
  { waktu: '06:10', obat: 'Infus RL 500ml (RL-091)', ket: 'Keluar Resep RX-087 (FEFO)', qty: '-2', sisa: 210 },
  { waktu: '05:30', obat: 'Paracetamol 500mg (B-812)', ket: 'Penerimaan PBF PO-2026-069', qty: '+500', sisa: 1450 },
];

function renderFarmasi() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'resep', label: 'Antrean E-Resep & Etiket' },
          { id: 'stok', label: 'Stok Gudang, FEFO & Kode KFA' },
          { id: 'po', label: 'Purchase Order (PBF) & Kartu Stok' },
        ].map(t => {
          const active = farmasiTab === t.id;
          return `
            <button onclick="farmasiTab='${t.id}'; renderFarmasi();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${farmasiTab === 'resep' ? viewResep() : ''}
      ${farmasiTab === 'stok' ? viewStok() : ''}
      ${farmasiTab === 'po' ? viewPO() : ''}
    </div>
  `;
}

// ==========================================
// TAB 1: ANTREAN E-RESEP & ETIKET (FR-ERP-01)
// ==========================================
function viewResep() {
  const rx = rxQueue[selectedRxIdx];
  const totalHarga = rx.items.reduce((acc, it) => acc + it.harga, 0);

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Antrean Resep Elektronik -->
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Antrean Resep Elektronik</h2>
            <p class="text-[12px] text-slate-400">Dari Rawat Jalan, IGD, &amp; Rawat Inap</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${rxQueue.length} Resep</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">No. Resep</th>
              <th class="pb-2.5 font-medium">Pasien &amp; Unit</th>
              <th class="pb-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${rxQueue.map((r, idx) => {
              const active = idx === selectedRxIdx;
              return `
                <tr onclick="selectedRxIdx=${idx}; renderFarmasi();" class="cursor-pointer transition ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                  <td class="py-3 font-mono font-semibold ${active ? 'text-brand-teal' : 'text-slate-700'}">${r.id}</td>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${r.pasien}</p>
                    <p class="text-[10px] text-slate-400">${r.unit} • ${r.waktu}</p>
                  </td>
                  <td class="py-3 text-right text-[11px] font-medium ${r.status === 'Diserahkan' ? 'text-brand-teal' : 'text-slate-500'}">${r.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Right: Verifikasi, Cetak Etiket & Serah Terima -->
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">${rx.id} — ${rx.pasien}</h3>
            <p class="text-[11px] text-slate-400">${rx.rm} • Peresep: ${rx.dokter} (${rx.unit})</p>
          </div>
          <span class="text-[11px] font-semibold ${rx.status === 'Diserahkan' ? 'text-brand-teal' : 'text-brand-blue'}">${rx.status}</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2 font-medium">Obat &amp; Aturan Pakai</th>
              <th class="pb-2 font-medium">Batch FEFO</th>
              <th class="pb-2 font-medium text-right">Qty</th>
              <th class="pb-2 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${rx.items.map(it => `
              <tr>
                <td class="py-3">
                  <p class="font-medium text-slate-800">${it.nama}</p>
                  <p class="text-[11px] text-slate-500">${it.aturan}</p>
                </td>
                <td class="py-3 font-mono text-[11px] text-slate-500">${it.batch}</td>
                <td class="py-3 text-right font-medium text-slate-700">${it.qty}</td>
                <td class="py-3 text-right font-medium text-slate-800">Rp ${it.harga.toLocaleString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-500">Total Tagihan Obat (Masuk Open Bill Kasir)</span>
          <span class="text-[15px] font-semibold text-slate-800">Rp ${totalHarga.toLocaleString('id-ID')}</span>
        </div>

        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button onclick="showToast('Etiket aturan pakai ${rx.id} dikirim ke printer thermal.', 'info')" class="h-9 px-4 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Cetak Etiket Thermal
          </button>
          <button onclick="dispenseRx()" ${rx.status === 'Diserahkan' ? 'disabled' : ''} class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition disabled:opacity-40">
            ${rx.status === 'Diserahkan' ? 'Sudah Diserahkan' : 'Serahkan Obat (Potong FEFO)'}
          </button>
        </div>
      </div>

    </div>
  `;
}

function dispenseRx() {
  const rx = rxQueue[selectedRxIdx];
  if (rx.status === 'Diserahkan') return;

  rx.items.forEach(it => {
    const inv = inventory.find(x => x.id === it.invId);
    if (inv) {
      inv.stok = Math.max(0, inv.stok - it.qty);
      stockCardLogs.unshift({
        waktu: '07:17',
        obat: `${inv.nama} (${inv.batch})`,
        ket: `Keluar Resep ${rx.id} (FEFO)`,
        qty: `-${it.qty}`,
        sisa: inv.stok
      });
    }
  });

  rx.status = 'Diserahkan';
  showToast(`${rx.id} diserahkan! Stok FEFO terpotong, tagihan masuk Kasir, & MedicationDispense KFA dikirim.`, 'success');
  renderFarmasi();
}

// ==========================================
// TAB 2: STOK GUDANG, FEFO & KODE KFA (FR-ERP-02)
// ==========================================
function viewStok() {
  const q = stockQuery.toLowerCase();
  const filtered = inventory.filter(i => {
    const matchQ = i.nama.toLowerCase().includes(q) || i.kfa.includes(q) || i.batch.toLowerCase().includes(q);
    const matchW = warehouseFilter === 'Semua' || i.gudang === warehouseFilter;
    return matchQ && matchW;
  });

  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Stok Obat &amp; BMHP (FEFO &amp; Mapping KFA)</h2>
          <p class="text-[12px] text-slate-400">Peringatan dini kedaluwarsa &lt; 30 hari &amp; HPP otomatis</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <input type="text" value="${stockQuery}" oninput="stockQuery=this.value; renderFarmasi();" placeholder="Cari obat, batch, atau KFA..." class="h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
          <select onchange="warehouseFilter=this.value; renderFarmasi();" class="h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700">
            <option ${warehouseFilter === 'Semua' ? 'selected' : ''}>Semua</option>
            <option ${warehouseFilter === 'Depo Apotek' ? 'selected' : ''}>Depo Apotek</option>
            <option ${warehouseFilter === 'Gudang Utama' ? 'selected' : ''}>Gudang Utama</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-3 font-medium">Nama Obat / Alkes</th>
              <th class="pb-3 font-medium">Kode KFA</th>
              <th class="pb-3 font-medium">Gudang</th>
              <th class="pb-3 font-medium">Batch &amp; Expired</th>
              <th class="pb-3 font-medium text-right">HPP / Jual</th>
              <th class="pb-3 font-medium text-right">Sisa Stok</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${filtered.map(i => `
              <tr>
                <td class="py-3 font-medium text-slate-800">${i.nama}</td>
                <td class="py-3 font-mono text-[11px] text-slate-500">${i.kfa}</td>
                <td class="py-3 text-slate-600">${i.gudang}</td>
                <td class="py-3">
                  <span class="font-mono text-[11px] text-slate-700">${i.batch}</span>
                  <span class="mx-1 text-slate-300">•</span>
                  <span class="text-[11px] ${i.edDays <= 30 ? 'text-rose-600 font-semibold' : 'text-slate-500'}">
                    ${i.ed} ${i.edDays <= 30 ? `(${i.edDays} hr)` : ''}
                  </span>
                </td>
                <td class="py-3 text-right text-[11px] text-slate-500">Rp ${i.hpp.toLocaleString('id-ID')} / <strong class="text-slate-700">Rp ${i.jual.toLocaleString('id-ID')}</strong></td>
                <td class="py-3 text-right font-semibold text-slate-800">${i.stok.toLocaleString('id-ID')} ${i.satuan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================
// TAB 3: PENERIMAAN PBF, PO & STOK OPNAME
// ==========================================
function viewPO() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Form Penerimaan PBF (Tambah Batch & Stok) + Daftar PO -->
      <div class="xl:col-span-6 space-y-6">
        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h2 class="text-[16px] font-semibold text-slate-800">Penerimaan Barang PBF (Tambah Stok)</h2>
            <p class="text-[12px] text-slate-400">Input batch baru, tanggal kedaluwarsa (FEFO), &amp; HPP per gudang</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Obat / Alkes</label>
              <select id="rcv-item" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700">
                ${inventory.map((it, i) => `<option value="${i}">${it.nama}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Gudang Tujuan</label>
              <select id="rcv-gudang" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700">
                <option value="Gudang Utama">Gudang Utama</option>
                <option value="Depo Apotek">Depo Apotek</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Nomor Batch</label>
              <input id="rcv-batch" type="text" placeholder="mis. B-905" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Tanggal Expired (FEFO)</label>
              <input id="rcv-ed" type="date" value="2027-11-30" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Jumlah Masuk</label>
              <input id="rcv-qty" type="number" min="1" value="500" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">HPP Satuan (Rp)</label>
              <input id="rcv-hpp" type="number" min="0" value="650" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-end">
            <button onclick="submitPenerimaan()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
              Simpan Penerimaan Stok
            </button>
          </div>
        </div>

        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
          <h3 class="text-[15px] font-semibold text-slate-800">Purchase Order (PO) ke PBF</h3>
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2 font-medium">No. PO</th>
                <th class="pb-2 font-medium">Supplier / Item</th>
                <th class="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${poList.map((po, idx) => `
                <tr>
                  <td class="py-3 font-mono font-semibold text-slate-800">${po.no}</td>
                  <td class="py-3">
                    <p class="font-medium text-slate-700">${po.pbf}</p>
                    <p class="text-[10px] text-slate-400">${po.item} • ${po.total}</p>
                  </td>
                  <td class="py-3 text-right">
                    ${po.status === 'Menunggu Kirim' ? `
                      <button onclick="receivePO(${idx})" class="text-[11px] font-semibold text-brand-teal hover:underline">Terima Barang</button>
                    ` : `<span class="text-[11px] text-slate-500">Diterima</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="pt-3 border-t border-slate-100 flex gap-2 text-xs">
            <input id="po-item" type="text" placeholder="Buat PO baru (mis. Paracetamol 10 Box)..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 text-xs focus:outline-none focus:border-brand-teal" />
            <button onclick="createPO()" class="h-9 px-4 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 shrink-0">Buat PO</button>
          </div>
        </div>
      </div>

      <!-- Right: Stok Opname & Kartu Stok Digital -->
      <div class="xl:col-span-6 space-y-6">
        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h2 class="text-[16px] font-semibold text-slate-800">Stok Opname (Penyesuaian Fisik)</h2>
            <p class="text-[12px] text-slate-400">Koreksi selisih audit gudang atau barang rusak/kedaluwarsa</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end">
            <div class="sm:col-span-5">
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Batch Obat</label>
              <select id="opn-batch" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700">
                ${inventory.map((it, i) => `<option value="${i}">${it.nama} (${it.batch} • ${it.stok})</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-3">
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Stok Fisik</label>
              <input id="opn-qty" type="number" min="0" value="120" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
            </div>
            <div class="sm:col-span-4">
              <button onclick="submitOpname()" class="w-full h-9 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition">
                Simpan Opname
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
          <div class="mb-4">
            <h2 class="text-[16px] font-semibold text-slate-800">Kartu Stok Digital</h2>
            <p class="text-[12px] text-slate-400">Mutasi masuk PBF, opname, &amp; keluar resep FEFO</p>
          </div>

          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th class="pb-2 font-medium">Jam</th>
                <th class="pb-2 font-medium">Item &amp; Keterangan</th>
                <th class="pb-2 font-medium text-right">Mutasi</th>
                <th class="pb-2 font-medium text-right">Sisa</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${stockCardLogs.map(l => `
                <tr>
                  <td class="py-2.5 font-mono text-slate-500">${l.waktu}</td>
                  <td class="py-2.5">
                    <p class="font-medium text-slate-700">${l.obat}</p>
                    <p class="text-[10px] text-slate-400">${l.ket}</p>
                  </td>
                  <td class="py-2.5 text-right font-mono font-semibold ${l.qty.startsWith('+') ? 'text-brand-teal' : 'text-slate-700'}">${l.qty}</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">${l.sisa}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function submitPenerimaan() {
  const idx = Number(document.getElementById('rcv-item')?.value || 0);
  const gudang = document.getElementById('rcv-gudang')?.value || 'Gudang Utama';
  const batch = document.getElementById('rcv-batch')?.value.trim() || `B-${Math.floor(100 + Math.random() * 899)}`;
  const ed = document.getElementById('rcv-ed')?.value || '2027-11-30';
  const qty = Number(document.getElementById('rcv-qty')?.value || 0);
  const hpp = Number(document.getElementById('rcv-hpp')?.value || 0);
  if (qty <= 0) return;

  const base = inventory[idx];
  inventory.unshift({
    id: `${base.id}-${batch}`,
    nama: base.nama,
    kfa: base.kfa,
    gudang,
    batch,
    ed,
    edDays: 365,
    hpp,
    jual: base.jual,
    stok: qty,
    satuan: base.satuan
  });
  stockCardLogs.unshift({
    waktu: '07:22',
    obat: `${base.nama} (${batch})`,
    ket: `Penerimaan PBF → ${gudang}`,
    qty: `+${qty}`,
    sisa: qty
  });
  showToast(`Penerimaan ${qty} ${base.satuan} (${batch}) masuk ${gudang} & tercatat di Kartu Stok.`, 'success');
  renderFarmasi();
}

function submitOpname() {
  const idx = Number(document.getElementById('opn-batch')?.value || 0);
  const fisik = Number(document.getElementById('opn-qty')?.value || 0);
  const item = inventory[idx];
  if (!item) return;
  const diff = fisik - item.stok;
  item.stok = fisik;
  stockCardLogs.unshift({
    waktu: '07:23',
    obat: `${item.nama} (${item.batch})`,
    ket: 'Stok Opname (Penyesuaian Fisik)',
    qty: diff >= 0 ? `+${diff}` : `${diff}`,
    sisa: fisik
  });
  showToast(`Stok opname ${item.batch} diperbarui menjadi ${fisik} ${item.satuan}.`, 'success');
  renderFarmasi();
}

function receivePO(idx) {
  poList[idx].status = 'Diterima';
  const amx = inventory.find(i => i.id === 'INV-AMX');
  if (amx) {
    amx.stok += 1000;
    stockCardLogs.unshift({ waktu: '07:18', obat: `${amx.nama} (${amx.batch})`, ket: `Penerimaan ${poList[idx].no}`, qty: '+1000', sisa: amx.stok });
  }
  showToast(`${poList[idx].no} diterima! Stok gudang & Kartu Stok diperbarui.`, 'success');
  renderFarmasi();
}

function createPO() {
  const item = document.getElementById('po-item')?.value.trim();
  if (!item) return;
  poList.unshift({
    no: `PO-2026-07${poList.length + 1}`,
    pbf: 'PT Kimia Farma Trading',
    item,
    total: 'Rp 450.000',
    status: 'Menunggu Kirim'
  });
  showToast('Purchase Order baru dibuat.', 'success');
  renderFarmasi();
}

initLayout('farmasi');
renderFarmasi();
