let kasirTab = 'openbill';
let selectedBillIdx = 0;
let payMethod = 'QRIS';
let cashTendered = 200000;

let openBills = [
  {
    id: 'INV-2026-0412',
    pasien: 'Bpk. Andy Wijaya',
    rm: 'RM-2026-00192',
    unit: 'Poli Umum (Rajal)',
    penjamin: 'Umum / Mandiri',
    deposit: 0,
    status: 'Open Bill',
    items: [
      { nama: 'Konsultasi Dokter Umum', sumber: 'Poli Umum', qty: 1, harga: 75000 },
      { nama: 'Darah Lengkap (CBC)', sumber: 'Laboratorium', qty: 1, harga: 85000 },
      { nama: 'Paracetamol 500mg Tab', sumber: 'Farmasi', qty: 10, harga: 15000 },
      { nama: 'Ambroxol 30mg Tab', sumber: 'Farmasi', qty: 10, harga: 22000 },
    ]
  },
  {
    id: 'INV-2026-0398',
    pasien: 'Tn. Rahmat Hidayat',
    rm: 'RM-2026-00210',
    unit: 'Rawat Inap (VIP-01)',
    penjamin: 'Umum / Mandiri',
    deposit: 1500000,
    status: 'Open Bill',
    items: [
      { nama: 'Sewa Kamar VIP Mawar (Argo 12:00)', sumber: 'Rawat Inap', qty: 3, harga: 2250000 },
      { nama: 'Visite Dokter Spesialis / Umum', sumber: 'Bangsal', qty: 3, harga: 450000 },
      { nama: 'Tindakan Pemasangan Infus & BMHP', sumber: 'Keperawatan', qty: 1, harga: 185000 },
      { nama: 'Ceftriaxone 1g Inj & RL 500ml', sumber: 'Farmasi', qty: 6, harga: 420000 },
      { nama: 'Trombosit Serial', sumber: 'Laboratorium', qty: 2, harga: 115000 },
    ]
  },
  {
    id: 'INV-2026-0405',
    pasien: 'Ny. Kartini',
    rm: 'RM-2026-00301',
    unit: 'Rawat Inap (K1-01)',
    penjamin: 'BPJS Kesehatan',
    deposit: 1000000,
    status: 'Open Bill',
    items: [
      { nama: 'Sewa Kamar Kelas 1 Melati', sumber: 'Rawat Inap', qty: 2, harga: 900000 },
      { nama: 'Visite Dokter & Asuhan Keperawatan', sumber: 'Bangsal', qty: 2, harga: 300000 },
      { nama: 'Obat & Alkes Harian', sumber: 'Farmasi', qty: 1, harga: 240000 },
    ]
  }
];

let depositLogs = [
  { tgl: '17 Nov, 06:15', pasien: 'Ny. Kartini (K1-01)', metode: 'Debit BCA', nominal: 1000000 },
  { tgl: '14 Nov, 10:20', pasien: 'Tn. Rahmat Hidayat (VIP-01)', metode: 'Transfer Bank', nominal: 1500000 },
];

let claims = [
  { no: 'KLM-BPJS-112', pasien: 'Bpk. Agus Salim', penjamin: 'BPJS Kesehatan', tgl: '16 Nov 2026', nominal: 425000, status: 'Diajukan' },
  { no: 'KLM-ASR-089', pasien: 'Ibu Dewi Sartika', penjamin: 'Asuransi Mandiri Inhealth', tgl: '15 Nov 2026', nominal: 1280000, status: 'Diajukan' },
  { no: 'KLM-BPJS-104', pasien: 'Tn. Wahyu', penjamin: 'BPJS Kesehatan', tgl: '12 Nov 2026', nominal: 890000, status: 'Cair / Lunas' },
];

const MEDICAL_FEES = [
  { nama: 'dr. Herman S.Pd', profesi: 'Dokter Umum / IGD', jumlah: '28 Kunjungan + 4 Visite', nominal: 2450000, status: 'Masuk Payroll' },
  { nama: 'dr. Ratna Dewi, Sp.A', profesi: 'Dokter Anak & KIA', jumlah: '16 Kunjungan', nominal: 1920000, status: 'Masuk Payroll' },
  { nama: 'drg. Nadia Putri', profesi: 'Dokter Gigi', jumlah: '9 Tindakan', nominal: 1150000, status: 'Masuk Payroll' },
  { nama: 'Ns. Sari Rahayu', profesi: 'Perawat Bangsal', jumlah: '14 Tindakan Keperawatan', nominal: 560000, status: 'Masuk Payroll' },
];

function renderKasir() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'openbill', label: 'Open Bill & Checkout' },
          { id: 'deposit', label: 'Deposit Rawat Inap' },
          { id: 'klaim', label: 'Klaim & Piutang Asuransi' },
          { id: 'jasa', label: 'Rekap Jasa Medis' },
        ].map(t => {
          const active = kasirTab === t.id;
          return `
            <button onclick="kasirTab='${t.id}'; renderKasir();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${kasirTab === 'openbill' ? viewOpenBill() : ''}
      ${kasirTab === 'deposit' ? viewDeposit() : ''}
      ${kasirTab === 'klaim' ? viewKlaim() : ''}
      ${kasirTab === 'jasa' ? viewJasaMedis() : ''}
    </div>
  `;
}

// ==========================================
// TAB 1: CONSOLIDATED OPEN BILL & CHECKOUT
// ==========================================
function viewOpenBill() {
  const bill = openBills[selectedBillIdx];
  const total = bill.items.reduce((s, it) => s + it.harga, 0);
  const sisa = Math.max(0, total - bill.deposit);
  const kembalian = Math.max(0, cashTendered - sisa);

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Daftar Tagihan Berjalan -->
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Tagihan Berjalan (Open Bill)</h2>
            <p class="text-[12px] text-slate-400">Akumulasi otomatis tanpa input ulang</p>
          </div>
          <span class="text-[11px] font-medium text-slate-400">${openBills.length} Tagihan</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">No. Tagihan</th>
              <th class="pb-2.5 font-medium">Pasien &amp; Unit</th>
              <th class="pb-2.5 font-medium text-right">Sisa Tagihan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${openBills.map((b, idx) => {
              const t = b.items.reduce((s, it) => s + it.harga, 0);
              const rem = Math.max(0, t - b.deposit);
              const active = idx === selectedBillIdx;
              return `
                <tr onclick="selectedBillIdx=${idx}; cashTendered=${rem}; renderKasir();" class="cursor-pointer transition ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                  <td class="py-3 font-mono font-semibold ${active ? 'text-brand-teal' : 'text-slate-700'}">${b.id}</td>
                  <td class="py-3">
                    <p class="font-medium text-slate-800">${b.pasien}</p>
                    <p class="text-[10px] text-slate-400">${b.unit} • ${b.penjamin}</p>
                  </td>
                  <td class="py-3 text-right font-semibold ${b.status === 'Lunas' ? 'text-brand-teal' : 'text-slate-800'}">
                    ${b.status === 'Lunas' ? 'Lunas' : `Rp ${rem.toLocaleString('id-ID')}`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Right: Rincian Biaya (Itemized Invoice) & Pelunasan -->
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">${bill.id} — ${bill.pasien}</h3>
            <p class="text-[11px] text-slate-400">${bill.rm} • ${bill.unit} • ${bill.penjamin}</p>
          </div>
          <span class="text-[11px] font-semibold ${bill.status === 'Lunas' ? 'text-brand-teal' : 'text-brand-blue'}">${bill.status}</span>
        </div>

        <!-- Itemized Bill Table (Zero SOAP/diagnosis details per PRD privacy) -->
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2 font-medium">Item Layanan / Obat</th>
              <th class="pb-2 font-medium">Unit</th>
              <th class="pb-2 font-medium text-right">Qty</th>
              <th class="pb-2 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${bill.items.map(it => `
              <tr>
                <td class="py-2.5 font-medium text-slate-700">${it.nama}</td>
                <td class="py-2.5 text-[11px] text-slate-400">${it.sumber}</td>
                <td class="py-2.5 text-right text-slate-600">${it.qty}</td>
                <td class="py-2.5 text-right font-medium text-slate-800">Rp ${it.harga.toLocaleString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Summary Ledger -->
        <div class="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>Total Tagihan</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>Dikurangi Deposit Rawat Inap</span>
            <span>- Rp ${bill.deposit.toLocaleString('id-ID')}</span>
          </div>
          <div class="flex justify-between text-[15px] font-semibold text-slate-800 pt-1">
            <span>Sisa Harus Dibayar</span>
            <span>Rp ${sisa.toLocaleString('id-ID')}</span>
          </div>
        </div>

        ${bill.status !== 'Lunas' ? `
          <!-- Clean Labeled Payment Block -->
          <div class="pt-4 border-t border-slate-100 space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Metode Pembayaran</label>
                <select onchange="payMethod=this.value; renderKasir();" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs text-slate-700 focus:outline-none focus:border-brand-teal">
                  ${['QRIS', 'Tunai', 'Debit / Transfer', 'Piutang BPJS / Asuransi'].map(m => `<option value="${m}" ${payMethod === m ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">${payMethod === 'Tunai' ? 'Uang Diterima (Rp)' : 'Nominal Tagihan'}</label>
                ${payMethod === 'Tunai' ? `
                  <input id="cash-input" type="text" inputmode="numeric" value="${cashTendered}" oninput="updateCashChange(this.value, ${sisa})" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs text-slate-800 focus:outline-none focus:border-brand-teal" />
                ` : `
                  <input type="text" value="Rp ${sisa.toLocaleString('id-ID')}" readonly class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/80 font-mono text-xs text-slate-600" />
                `}
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Kembalian</label>
                <div id="kembalian-val" class="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/80 flex items-center font-mono text-xs font-semibold text-slate-800">
                  Rp ${(payMethod === 'Tunai' ? kembalian : 0).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-1">
              <button onclick="showToast('Draft Itemized Invoice ${bill.id} dibuka.', 'info')" class="h-9 px-4 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                Cetak Draft
              </button>
              <button onclick="settleBill()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
                Lunasi &amp; Cetak Invoice
              </button>
            </div>
          </div>
        ` : `
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-brand-teal font-medium">Pembayaran Lunas</span>
            <button onclick="showToast('Mencetak ulang Itemized Invoice ${bill.id}.', 'info')" class="font-medium text-brand-blue hover:underline">Cetak Ulang Invoice</button>
          </div>
        `}
      </div>

    </div>
  `;
}

function updateCashChange(raw, sisa) {
  const num = Number(String(raw).replace(/\D/g, '')) || 0;
  cashTendered = num;
  const k = Math.max(0, num - sisa);
  const el = document.getElementById('kembalian-val');
  if (el) el.textContent = `Rp ${k.toLocaleString('id-ID')}`;
}

function settleBill() {
  const bill = openBills[selectedBillIdx];
  bill.status = 'Lunas';
  showToast(`${bill.id} dilunasi via ${payMethod}! Itemized Invoice dicetak & status kunjungan selesai.`, 'success');
  renderKasir();
}

// ==========================================
// TAB 2: DEPOSIT RAWAT INAP
// ==========================================
function viewDeposit() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-[16px] font-semibold text-slate-800">Input Deposit Rawat Inap</h2>
          <p class="text-[12px] text-slate-400">Otomatis memotong sisa tagihan pada Open Bill pasien</p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Pasien Rawat Inap</label>
            <select id="dep-bill" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs">
              <option value="1">Tn. Rahmat Hidayat (VIP-01)</option>
              <option value="2">Ny. Kartini (K1-01)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Nominal Deposit (Rp)</label>
            <input id="dep-amount" type="number" value="500000" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Metode Pembayaran</label>
            <select id="dep-method" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs">
              <option>QRIS</option>
              <option>Tunai</option>
              <option>Debit BCA</option>
              <option>Transfer Bank</option>
            </select>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button onclick="addDeposit()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Simpan Deposit &amp; Cetak Bukti
          </button>
        </div>
      </div>

      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
        <h2 class="text-[16px] font-semibold text-slate-800 mb-4">Riwayat Deposit Masuk</h2>
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Waktu</th>
              <th class="pb-2.5 font-medium">Pasien &amp; Bed</th>
              <th class="pb-2.5 font-medium">Metode</th>
              <th class="pb-2.5 font-medium text-right">Nominal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${depositLogs.map(d => `
              <tr>
                <td class="py-3 text-slate-500">${d.tgl}</td>
                <td class="py-3 font-medium text-slate-800">${d.pasien}</td>
                <td class="py-3 text-slate-600">${d.metode}</td>
                <td class="py-3 text-right font-semibold text-brand-teal">Rp ${d.nominal.toLocaleString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

function addDeposit() {
  const billIdx = Number(document.getElementById('dep-bill')?.value || 1);
  const nominal = Number(document.getElementById('dep-amount')?.value || 0);
  const metode = document.getElementById('dep-method')?.value || 'QRIS';
  if (nominal <= 0) return;

  openBills[billIdx].deposit += nominal;
  depositLogs.unshift({
    tgl: '17 Nov, 07:26',
    pasien: `${openBills[billIdx].pasien}`,
    metode,
    nominal
  });
  showToast(`Deposit Rp ${nominal.toLocaleString('id-ID')} masuk ke ${openBills[billIdx].id}.`, 'success');
  renderKasir();
}

// ==========================================
// TAB 3: KLAIM & PIUTANG ASURANSI / BPJS
// ==========================================
function viewKlaim() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Klaim &amp; Piutang Asuransi / BPJS</h2>
          <p class="text-[12px] text-slate-400">Pelacakan tagihan piutang rekanan hingga pencairan</p>
        </div>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">No. Klaim</th>
            <th class="pb-2.5 font-medium">Pasien</th>
            <th class="pb-2.5 font-medium">Penjamin</th>
            <th class="pb-2.5 font-medium">Tanggal</th>
            <th class="pb-2.5 font-medium text-right">Nominal</th>
            <th class="pb-2.5 font-medium text-right">Status / Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${claims.map((c, idx) => `
            <tr>
              <td class="py-3 font-mono font-semibold text-slate-800">${c.no}</td>
              <td class="py-3 font-medium text-slate-700">${c.pasien}</td>
              <td class="py-3 text-slate-600">${c.penjamin}</td>
              <td class="py-3 text-slate-500">${c.tgl}</td>
              <td class="py-3 text-right font-semibold text-slate-800">Rp ${c.nominal.toLocaleString('id-ID')}</td>
              <td class="py-3 text-right">
                ${c.status === 'Diajukan' ? `
                  <button onclick="claims[${idx}].status='Cair / Lunas'; showToast('${c.no} ditandai Cair / Lunas.', 'success'); renderKasir();" class="text-[11px] font-semibold text-brand-teal hover:underline">Tandai Cair</button>
                ` : `<span class="text-[11px] text-slate-400">Cair / Lunas</span>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==========================================
// TAB 4: REKAPITULASI JASA MEDIS (medical_fees)
// ==========================================
function viewJasaMedis() {
  const totalFee = MEDICAL_FEES.reduce((s, f) => s + f.nominal, 0);

  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Rekapitulasi Jasa Medis (Periode November 2026)</h2>
          <p class="text-[12px] text-slate-400">Tercatat otomatis dari input tindakan dokter &amp; perawat menuju Payroll SDM</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] uppercase tracking-wider text-slate-400">Total Jasa Medis</p>
          <p class="text-[18px] font-semibold text-slate-800">Rp ${totalFee.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Nama Tenaga Medis</th>
            <th class="pb-2.5 font-medium">Profesi</th>
            <th class="pb-2.5 font-medium">Volume Layanan</th>
            <th class="pb-2.5 font-medium text-right">Komisi Jasa Medis</th>
            <th class="pb-2.5 font-medium text-right">Payroll</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${MEDICAL_FEES.map(f => `
            <tr>
              <td class="py-3 font-medium text-slate-800">${f.nama}</td>
              <td class="py-3 text-slate-600">${f.profesi}</td>
              <td class="py-3 text-slate-500">${f.jumlah}</td>
              <td class="py-3 text-right font-semibold text-slate-800">Rp ${f.nominal.toLocaleString('id-ID')}</td>
              <td class="py-3 text-right text-[11px] font-medium text-brand-teal">${f.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

initLayout('kasir');
renderKasir();
