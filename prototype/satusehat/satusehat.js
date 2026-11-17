let ssTab = 'logs';
let logStatusFilter = 'Semua';
let selectedLogIdx = 0;

let fhirLogs = [
  {
    waktu: '06:12:41',
    encounter: 'ENC-2026-0891',
    pasien: 'Bpk. Andy Wijaya',
    resource: 'MedicationDispense',
    status: 'FAILED',
    retry: 2,
    error: 'Kode KFA 93000881 belum terpetakan di master organisasi.',
    payload: {
      resourceType: 'MedicationDispense',
      status: 'completed',
      medicationReference: { reference: 'Medication/93000881' },
      subject: { reference: 'Patient/P10002941801' },
      context: { reference: 'Encounter/ENC-2026-0891' }
    }
  },
  {
    waktu: '06:14:05',
    encounter: 'ENC-2026-0892',
    pasien: 'Ibu Maya Lestari',
    resource: 'Observation (LOINC)',
    status: 'PENDING',
    retry: 0,
    error: 'Dalam antrean Redis Worker...',
    payload: {
      resourceType: 'Observation',
      status: 'final',
      code: { coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body temperature' }] },
      valueQuantity: { value: 38.9, unit: 'C' }
    }
  },
  {
    waktu: '06:10:18',
    encounter: 'ENC-2026-0890',
    pasien: 'Tn. Rahmat Hidayat',
    resource: 'Encounter + Condition',
    status: 'SUCCESS',
    retry: 0,
    error: '200 OK — ID: 8a91c2-441b-90e1',
    payload: {
      resourceType: 'Encounter',
      status: 'in-progress',
      class: { code: 'IMP', display: 'inpatient encounter' },
      subject: { reference: 'Patient/P10005519203' },
      location: [{ location: { reference: 'Location/LOC-100294-VIP01' } }]
    }
  },
  {
    waktu: '05:58:02',
    encounter: 'ENC-2026-0889',
    pasien: 'Bpk. Agus Salim',
    resource: 'Composition (Resume)',
    status: 'SUCCESS',
    retry: 1,
    error: '200 OK — ID: 3f11d0-198a-77c2',
    payload: {
      resourceType: 'Composition',
      status: 'final',
      title: 'Resume Medis Rawat Jalan',
      subject: { reference: 'Patient/P10003319820' }
    }
  }
];

let locations = [
  { nama: 'Poli Umum', tipe: 'Rawat Jalan', kode: 'PU-01', locId: 'LOC-100294-PU01', status: 'Tersinkron' },
  { nama: 'Poli Gigi', tipe: 'Rawat Jalan', kode: 'PG-01', locId: 'LOC-100294-PG01', status: 'Tersinkron' },
  { nama: 'IGD 24 Jam', tipe: 'Gawat Darurat', kode: 'IGD-01', locId: 'LOC-100294-IGD01', status: 'Tersinkron' },
  { nama: 'Kamar VIP Mawar (VIP-01)', tipe: 'Rawat Inap', kode: 'VIP-01', locId: 'LOC-100294-VIP01', status: 'Tersinkron' },
  { nama: 'Ruang Isolasi (ISO-02)', tipe: 'Rawat Inap', kode: 'ISO-02', locId: '—', status: 'Belum Sinkron' },
];

let ihsLookupResult = null;
let credentialsUnlocked = false;
let payloadUnlocked = false;
let payloadAuditLogs = [
  '06:15 WIB • Herman S.Pd membuka payload ENC-2026-0891'
];
let connectionState = {
  connected: true,
  httpCode: '200 OK',
  orgName: 'Klinik Pratama Cahaya Medika',
  tokenExpiry: '07:55 WIB',
  latencyMs: 4,
  worker: 'Aktif (Redis)'
};

function renderSatusehat() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="space-y-5">
      
      <!-- Underline Tabs -->
      <div class="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[13px] px-1">
        ${[
          { id: 'logs', label: 'Log Pengiriman & Antrean Retry' },
          { id: 'lokasi', label: 'Ruangan & Location ID' },
          { id: 'kredensial', label: 'Kredensial & IHS Lookup' },
        ].map(t => {
          const active = ssTab === t.id;
          return `
            <button onclick="ssTab='${t.id}'; renderSatusehat();" class="pb-3 border-b-2 whitespace-nowrap transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'}">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      ${ssTab === 'logs' ? viewLogs() : ''}
      ${ssTab === 'lokasi' ? viewLokasi() : ''}
      ${ssTab === 'kredensial' ? viewKredensial() : ''}
    </div>
  `;
}

// ==========================================
// TAB 1: LOG MONITORING & RETRY (FR-SS-03)
// ==========================================
function viewLogs() {
  const filtered = logStatusFilter === 'Semua'
    ? fhirLogs
    : fhirLogs.filter(l => l.status === logStatusFilter);
  const current = fhirLogs[selectedLogIdx] || fhirLogs[0];

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Queue Log Table -->
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Antrean Pengiriman HL7 FHIR R4</h2>
            <p class="text-[12px] text-slate-400">Redis Queue Worker • Latensi ke server Kemenkes: 4 ms</p>
          </div>
          <button onclick="retryAllFailed()" class="h-9 px-4 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">
            Retry Semua Gagal
          </button>
        </div>

        <div class="flex items-center gap-5 border-b border-slate-100 text-[12px]">
          ${['Semua', 'FAILED', 'PENDING', 'SUCCESS'].map(st => {
            const active = logStatusFilter === st;
            return `
              <button onclick="logStatusFilter='${st}'; renderSatusehat();" class="pb-2.5 -mb-px border-b-2 transition ${active ? 'border-brand-teal text-slate-800 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-600'}">
                ${st}
              </button>
            `;
          }).join('')}
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
              <th class="pb-2.5 font-medium">Waktu</th>
              <th class="pb-2.5 font-medium">Encounter &amp; Resource</th>
              <th class="pb-2.5 font-medium">Status</th>
              <th class="pb-2.5 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${filtered.map(l => {
              const realIdx = fhirLogs.indexOf(l);
              const active = realIdx === selectedLogIdx;
              const stCls = l.status === 'SUCCESS' ? 'text-brand-teal' : l.status === 'FAILED' ? 'text-rose-600' : 'text-amber-600';
              return `
                <tr onclick="selectLogRow(${realIdx})" class="cursor-pointer transition ${active ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'}">
                  <td class="py-3 font-mono text-[11px] text-slate-500">${l.waktu}</td>
                  <td class="py-3">
                    <p class="font-mono font-semibold text-slate-800">${l.encounter}</p>
                    <p class="text-[11px] text-slate-500">${l.resource} • ${l.pasien}</p>
                  </td>
                  <td class="py-3 text-[11px] font-semibold ${stCls}">${l.status}</td>
                  <td class="py-3 text-right">
                    ${l.status === 'FAILED' ? `
                      <button onclick="event.stopPropagation(); retryOne(${realIdx});" class="text-[11px] font-semibold text-brand-teal hover:underline">Retry</button>
                    ` : `<span class="text-[11px] text-slate-400">Inspeksi →</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Right: Protected JSONB Payload Inspector -->
      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-[15px] font-semibold text-slate-800">Payload FHIR R4 (JSONB)</h3>
            <p class="text-[11px] text-slate-400">${current.encounter} • ${current.resource}</p>
          </div>
          <span class="text-[11px] font-mono text-slate-500">Retry: ${current.retry}x</span>
        </div>

        <p class="text-[11px] ${current.status === 'FAILED' ? 'text-rose-600' : 'text-slate-500'}">${current.error}</p>

        ${payloadUnlocked ? `
          <div class="space-y-3">
            <pre class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-700 overflow-x-auto leading-relaxed">${JSON.stringify(current.payload, null, 2)}</pre>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Akses tercatat di Audit Log</span>
              <button onclick="payloadUnlocked=false; renderSatusehat();" class="font-medium text-brand-blue hover:underline">Kunci Kembali</button>
            </div>
          </div>
        ` : `
          <div class="py-5 px-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
            <div>
              <p class="font-semibold text-slate-700">Payload Terkunci (Data Medis Sensitif)</p>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Isi JSON FHIR mengandung data RME pasien (Permenkes No. 24/2022). Masukkan PIN Super Admin untuk membuka dan mencatat di Audit Trail.</p>
            </div>
            <div class="flex gap-2">
              <input id="payload-pin" type="password" maxlength="6" placeholder="PIN Super Admin..." class="w-full h-9 px-3 rounded-lg border border-slate-300/80 bg-white font-mono text-xs focus:outline-none focus:border-brand-teal" />
              <button onclick="unlockPayload('${current.encounter}')" class="h-9 px-4 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 shrink-0">Buka Payload</button>
            </div>
          </div>
        `}

        <div class="pt-3 border-t border-slate-100 space-y-1 text-[10px] text-slate-400">
          <p class="font-semibold uppercase tracking-wider text-slate-400">Audit Trail Terbaru</p>
          ${payloadAuditLogs.slice(0, 2).map(a => `<p class="truncate">${a}</p>`).join('')}
        </div>
      </div>

    </div>
  `;
}

function selectLogRow(idx) {
  selectedLogIdx = idx;
  payloadUnlocked = false; // Auto-lock payload when switching patients/encounters
  renderSatusehat();
}

function unlockPayload(encounterId) {
  const pin = document.getElementById('payload-pin')?.value.trim() || '';
  if (pin.length < 4) {
    showToast('Masukkan PIN Super Admin (4–6 digit) untuk membuka payload.', 'info');
    return;
  }
  payloadUnlocked = true;
  payloadAuditLogs.unshift(`07:42 WIB • Herman S.Pd membuka payload ${encounterId}`);
  showToast(`Payload ${encounterId} dibuka & dicatat ke Audit Log.`, 'info');
  renderSatusehat();
}

function retryOne(idx) {
  fhirLogs[idx].status = 'SUCCESS';
  fhirLogs[idx].retry += 1;
  fhirLogs[idx].error = '200 OK — ID: 9c22a1-771e-44b0';
  showToast(`${fhirLogs[idx].encounter} berhasil dikirim ulang (200 OK).`, 'success');
  renderSatusehat();
}

function retryAllFailed() {
  let count = 0;
  fhirLogs.forEach(l => {
    if (l.status === 'FAILED') {
      l.status = 'SUCCESS';
      l.retry += 1;
      l.error = '200 OK — Retry Batch Berhasil';
      count++;
    }
  });
  showToast(count ? `${count} antrean gagal berhasil dikirim ulang.` : 'Tidak ada antrean FAILED.', count ? 'success' : 'info');
  renderSatusehat();
}

// ==========================================
// TAB 2: LOKASI & RUANGAN (Location ID)
// ==========================================
function viewLokasi() {
  return `
    <div class="bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[16px] font-semibold text-slate-800">Sinkronisasi Ruangan &amp; Location ID</h2>
          <p class="text-[12px] text-slate-400">Pemetaan Poliklinik, IGD, &amp; Kamar Rawat Inap ke Organization SATUSEHAT</p>
        </div>
      </div>

      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
            <th class="pb-2.5 font-medium">Nama Ruangan</th>
            <th class="pb-2.5 font-medium">Tipe Layanan</th>
            <th class="pb-2.5 font-medium">Kode Internal</th>
            <th class="pb-2.5 font-medium">SATUSEHAT Location ID</th>
            <th class="pb-2.5 font-medium text-right">Status / Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${locations.map((loc, idx) => `
            <tr>
              <td class="py-3 font-medium text-slate-800">${loc.nama}</td>
              <td class="py-3 text-slate-600">${loc.tipe}</td>
              <td class="py-3 font-mono text-slate-500">${loc.kode}</td>
              <td class="py-3 font-mono text-[11px] text-slate-700">${loc.locId}</td>
              <td class="py-3 text-right">
                ${loc.status === 'Belum Sinkron' ? `
                  <button onclick="syncLocation(${idx})" class="text-[11px] font-semibold text-brand-teal hover:underline">Daftarkan Location</button>
                ` : `<span class="text-[11px] text-brand-teal font-medium">Tersinkron</span>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function syncLocation(idx) {
  locations[idx].locId = `LOC-100294-${locations[idx].kode.replace('-', '')}`;
  locations[idx].status = 'Tersinkron';
  showToast(`${locations[idx].nama} terdaftar dengan ID ${locations[idx].locId}.`, 'success');
  renderSatusehat();
}

// ==========================================
// TAB 3: KREDENSIAL & AUTO-LOOKUP IHS
// ==========================================
function viewKredensial() {
  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      <div class="xl:col-span-7 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-[16px] font-semibold text-slate-800">Koneksi &amp; Kredensial API Kemenkes</h2>
            <p class="text-[12px] text-slate-400">Terenkripsi AES-256 di server • Token OAuth2 disimpan di Redis</p>
          </div>
          <button onclick="testOAuthConnection()" class="h-8 px-3.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
            Test Koneksi OAuth2
          </button>
        </div>

        <!-- Live Connection Status Strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2.5 px-3 border-l-2 ${connectionState.connected ? 'border-brand-teal' : 'border-rose-500'} bg-slate-50/50 text-[11px]">
          <div>
            <p class="text-slate-400 text-[10px]">Status OAuth2</p>
            <p class="font-semibold ${connectionState.connected ? 'text-brand-teal' : 'text-rose-600'}">
              ${connectionState.connected ? `Terhubung (${connectionState.httpCode})` : 'Terputus (401)'}
            </p>
          </div>
          <div>
            <p class="text-slate-400 text-[10px]">Organisasi Terverifikasi</p>
            <p class="font-medium text-slate-700 truncate">${connectionState.orgName}</p>
          </div>
          <div>
            <p class="text-slate-400 text-[10px]">Masa Token Bearer</p>
            <p class="font-mono font-medium text-slate-700">s/d ${connectionState.tokenExpiry}</p>
          </div>
          <div>
            <p class="text-slate-400 text-[10px]">Latensi &amp; Worker</p>
            <p class="font-medium text-slate-700">${connectionState.latencyMs} ms • ${connectionState.worker}</p>
          </div>
        </div>

        <!-- Masked / Locked Credential Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Organization ID</label>
            <input type="text" value="100029418" ${credentialsUnlocked ? '' : 'readonly'} class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs ${credentialsUnlocked ? 'bg-white' : 'bg-slate-50/80 text-slate-500'}" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Environment</label>
            <select ${credentialsUnlocked ? '' : 'disabled'} class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 text-xs ${credentialsUnlocked ? 'bg-white' : 'bg-slate-50/80 text-slate-500'}">
              <option>Production (api-satusehat.kemkes.go.id)</option>
              <option>Staging / Sandbox</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Client Key (Server-Side Masked)</label>
            <input type="text" value="${credentialsUnlocked ? '' : '••••••••••••••••8237'}" placeholder="Masukkan Client Key baru..." ${credentialsUnlocked ? '' : 'readonly'} class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs ${credentialsUnlocked ? 'bg-white' : 'bg-slate-50/80 text-slate-500'}" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Secret Key (Server-Side Masked)</label>
            <input type="text" value="${credentialsUnlocked ? '' : '••••••••••••••••3980'}" placeholder="Masukkan Secret Key baru..." ${credentialsUnlocked ? '' : 'readonly'} class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs ${credentialsUnlocked ? 'bg-white' : 'bg-slate-50/80 text-slate-500'}" />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          ${!credentialsUnlocked ? `
            <div class="flex items-center gap-2 text-xs">
              <input id="admin-pin" type="password" maxlength="6" placeholder="PIN Super Admin (6 digit)" class="w-44 h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs focus:outline-none focus:border-brand-teal" />
              <button onclick="unlockCredentials()" class="h-9 px-3.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Buka Kunci Edit
              </button>
            </div>
          ` : `
            <button onclick="credentialsUnlocked=false; renderSatusehat();" class="text-xs font-medium text-slate-500 hover:text-slate-700">Kunci Kembali</button>
            <button onclick="saveCredentials()" class="h-9 px-5 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark transition">Simpan &amp; Enkripsi Kredensial</button>
          `}
        </div>
      </div>

      <div class="xl:col-span-5 bg-white rounded-[26px] border border-slate-200/80 shadow-card p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100">
          <h3 class="text-[15px] font-semibold text-slate-800">Auto-Lookup IHS Number</h3>
          <p class="text-[11px] text-slate-400">Konversi 16 digit NIK KTP menjadi Patient / Practitioner IHS ID</p>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">Jenis Pencarian</label>
            <select id="ihs-type" class="w-full h-9 px-2.5 rounded-lg border border-slate-300/80 bg-white text-xs">
              <option value="Patient">Patient IHS Number (Pasien)</option>
              <option value="Practitioner">Practitioner IHS Number (Nakes)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-600 mb-1">NIK KTP (16 Digit)</label>
            <div class="flex gap-2">
              <input id="ihs-nik" type="text" maxlength="16" value="3273011205880004" class="w-full h-9 px-3 rounded-lg border border-slate-300/80 font-mono text-xs" />
              <button onclick="lookupIhs()" class="h-9 px-4 rounded-lg bg-brand-teal text-white text-xs font-medium hover:bg-brand-tealDark shrink-0">Cari IHS</button>
            </div>
          </div>

          ${ihsLookupResult ? `
            <div class="pt-2 border-t border-slate-100 text-[11px] space-y-0.5">
              <p class="text-slate-400">${ihsLookupResult.type} Ditemukan:</p>
              <p class="font-semibold text-slate-800 font-mono">${ihsLookupResult.ihsId}</p>
            </div>
          ` : ''}
        </div>
      </div>

    </div>
  `;
}

function testOAuthConnection() {
  connectionState.connected = true;
  connectionState.httpCode = '200 OK';
  connectionState.latencyMs = 4;
  connectionState.tokenExpiry = '08:05 WIB';
  showToast('OAuth2 Token valid (200 OK) • Organization 100029418 terverifikasi.', 'success');
  renderSatusehat();
}

function unlockCredentials() {
  const pin = document.getElementById('admin-pin')?.value.trim() || '';
  if (pin.length < 4) {
    showToast('Masukkan PIN Super Admin (minimal 4–6 digit) untuk membuka edit kredensial.', 'info');
    return;
  }
  credentialsUnlocked = true;
  showToast('Akses edit kredensial dibuka (tercatat di Audit Log).', 'info');
  renderSatusehat();
}

function saveCredentials() {
  credentialsUnlocked = false;
  showToast('Kredensial baru dienkripsi (AES-256) & token OAuth2 diperbarui.', 'success');
  renderSatusehat();
}

function lookupIhs() {
  const type = document.getElementById('ihs-type')?.value || 'Patient';
  const nik = document.getElementById('ihs-nik')?.value.trim() || '';
  if (nik.length !== 16) {
    showToast('NIK harus 16 digit.', 'info');
    return;
  }
  ihsLookupResult = {
    type,
    ihsId: type === 'Patient' ? 'P10004829102' : '10009842112'
  };
  showToast(`${type} IHS Number ditemukan: ${ihsLookupResult.ihsId}`, 'success');
  renderSatusehat();
}

initLayout('satusehat');
renderSatusehat();
