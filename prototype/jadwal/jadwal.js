let jadwalTab = 'dokter';

let doctorSchedules = [
  { dokter: 'dr. Herman S.Pd', poli: 'Poli Umum', hari: 'Senin – Sabtu', jam: '08:00 – 13:00', kuota: 25, terisi: 17, hadir: true },
  { dokter: 'drg. Nadia Putri', poli: 'Poli Gigi', hari: 'Senin – Jumat', jam: '09:00 – 14:00', kuota: 15, terisi: 10, hadir: true },
  { dokter: 'dr. Ratna Dewi, Sp.A', poli: 'Poli Anak & KIA', hari: 'Senin, Rabu, Jumat', jam: '14:00 – 19:00', kuota: 20, terisi: 14, hadir: false },
];

const SHIFT_ROSTER = [
  { shift: 'Shift Pagi', jam: '07:00 – 14:00 WIB', staf: 'dr. Herman S.Pd, Ns. Sari Rahayu, Apt. Budi, Admisi Rina', status: 'Aktif Sekarang' },
  { shift: 'Shift Siang', jam: '14:00 – 21:00 WIB', staf: 'dr. Ratna Dewi, Ns. Dani Pratama, Apt. Citra, Kasir Dodi', status: 'Terjadwal' },
  { shift: 'Shift Malam', jam: '21:00 – 07:00 WIB', staf: 'dr. Jaga IGD, Ns. Eko, Ns. Tika (Bangsal Ranap)', status: 'Terjadwal' },
];

let shiftRequests = [
  { tgl: '18 Nov 2026', pemohon: 'Ns. Dani Pratama', jenis: 'Tukar Shift', ket: 'Tukar Shift Siang ↔ Pagi dengan Ns. Eko', status: 'Menunggu Persetujuan' },
  { tgl: '20 Nov 2026', pemohon: 'Apt. Budi Santoso', jenis: 'Cuti Tahunan', ket: 'Izin keperluan keluarga (1 hari)', status: 'Disetujui' },
];

function renderJadwal() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'dokter', label: 'Jadwal Praktik & Kuota Dokter' },
          { id: 'roster', label: 'Roster 3 Shift (24 Jam)' },
          { id: 'cuti', label: 'Pengajuan Cuti & Tukar Shift' },
        ].map(t => {
          const active = jadwalTab === t.id;
          return `
            <button onclick="jadwalTab='${t.id}'; renderJadwal();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${jadwalTab === 'dokter' ? viewJadwalDokter() : ''}
      ${jadwalTab === 'roster' ? viewRoster() : ''}
      ${jadwalTab === 'cuti' ? viewCuti() : ''}
    </div>
  `;
}

function viewJadwalDokter() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Jadwal Praktik Dokter &amp; Kuota Booking Online</h2>
          <p class="text-[12px] text-slate-400">Otomatis tersinkron ke Website Publik (klinikanda.id) &amp; Layar TV Ruang Tunggu</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Dokter &amp; Poliklinik</th>
              <th class="pb-2.5 font-medium">Hari &amp; Jam Praktik</th>
              <th class="pb-2.5 font-medium">Kuota Online</th>
              <th class="pb-2.5 font-medium">Status Kehadiran (TV)</th>
              <th class="pb-2.5 font-medium text-right">Ubah Kuota</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${doctorSchedules.map((d, idx) => `
              <tr>
                <td class="py-3">
                  <p class="font-medium text-slate-800">${d.dokter}</p>
                  <p class="text-[10px] text-slate-400">${d.poli}</p>
                </td>
                <td class="py-3 text-slate-600">${d.hari} • ${d.jam}</td>
                <td class="py-3 font-medium text-slate-700">${d.terisi} / ${d.kuota} Pasien</td>
                <td class="py-3 text-[11px] font-medium ${d.hadir ? 'text-brand-teal' : 'text-slate-400'}">
                  ${d.hadir ? 'Dokter Sudah Hadir' : 'Belum Clock-In'}
                </td>
                <td class="py-3 text-right">
                  <button onclick="addQuota(${idx})" class="text-[11px] font-medium text-brand-blue hover:underline">+5 Kuota</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function addQuota(idx) {
  doctorSchedules[idx].kuota += 5;
  showToast(`Kuota ${doctorSchedules[idx].dokter} ditambah menjadi ${doctorSchedules[idx].kuota} (Sinkron ke Website Publik).`, 'success');
  renderJadwal();
}

function viewRoster() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div>
        <h2 class="text-[16px] font-semibold text-slate-800">Roster 3 Shift Operasional 24 Jam</h2>
        <p class="text-[12px] text-slate-400">Menentukan jendela aktif Smart Shift Lock untuk perawat, IGD, farmasi, &amp; kasir</p>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Shift</th>
            <th class="pb-2.5 font-medium">Jam Operasional</th>
            <th class="pb-2.5 font-medium">Tim Bertugas</th>
            <th class="pb-2.5 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${SHIFT_ROSTER.map(s => `
            <tr>
              <td class="py-3.5 font-semibold text-slate-800">${s.shift}</td>
              <td class="py-3.5 font-mono text-[11px] text-slate-600">${s.jam}</td>
              <td class="py-3.5 text-slate-600">${s.staf}</td>
              <td class="py-3.5 text-right text-[11px] font-medium ${s.status === 'Aktif Sekarang' ? 'text-brand-teal' : 'text-slate-400'}">${s.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function viewCuti() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div>
        <h2 class="text-[16px] font-semibold text-slate-800">Pengajuan Izin, Cuti &amp; Tukar Shift</h2>
        <p class="text-[12px] text-slate-400">Persetujuan HRD / Manager langsung memperbarui roster aktif</p>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Tanggal</th>
            <th class="pb-2.5 font-medium">Pemohon</th>
            <th class="pb-2.5 font-medium">Jenis &amp; Keterangan</th>
            <th class="pb-2.5 font-medium text-right">Status / Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${shiftRequests.map((r, idx) => `
            <tr>
              <td class="py-3 font-mono text-[11px] text-slate-500">${r.tgl}</td>
              <td class="py-3 font-medium text-slate-800">${r.pemohon}</td>
              <td class="py-3 text-slate-600"><strong>${r.jenis}</strong> — ${r.ket}</td>
              <td class="py-3 text-right">
                ${r.status === 'Menunggu Persetujuan' ? `
                  <button onclick="shiftRequests[${idx}].status='Disetujui'; showToast('Pengajuan ${r.pemohon} disetujui.', 'success'); renderJadwal();" class="text-[11px] font-semibold text-brand-teal hover:underline">Setujui</button>
                ` : `<span class="text-[11px] text-slate-400">${r.status}</span>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

initLayout('jadwal');
renderJadwal();
