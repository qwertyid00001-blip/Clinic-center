// Tailwind Config
if (window.tailwind) {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: { sans: ['Poppins', 'sans-serif'] },
        colors: {
          brand: {
            teal: '#009BA4',
            tealDark: '#007E86',
            blue: '#38729D',
            blueLight: '#EBF3F9',
            gold: '#F59E0B',
          }
        },
        boxShadow: {
          'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
          'pill': '0 4px 14px -2px rgba(15, 23, 42, 0.08)',
          'teal': '0 10px 22px -6px rgba(0, 155, 164, 0.38)',
        }
      }
    }
  };
}

const APP_BASE = window.APP_BASE || './';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    href: `${APP_BASE}index.html`,
    label: 'Dashboard',
    title: 'Manager Klinik',
    subtitle: 'Dashboard panel',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>`
  },
  {
    id: 'admisi',
    href: `${APP_BASE}admisi/index.html`,
    label: 'Admisi & Front Office',
    title: 'Admisi & Front Office',
    subtitle: 'Registrasi NIK, Antrean Multi-Channel, & ADT Rawat Inap',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>`
  },
  {
    id: 'erm',
    href: `${APP_BASE}erm/index.html`,
    label: 'Pelayanan Medis (ERM)',
    title: 'Pelayanan Medis (ERM)',
    subtitle: 'SOAP Rajal, Triase & Body Map IGD, CPPT & MAR Rawat Inap',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`
  },
  {
    id: 'penunjang',
    href: `${APP_BASE}penunjang/index.html`,
    label: 'Penunjang Medis',
    title: 'Penunjang Medis',
    subtitle: 'Order Laboratorium & Radiologi (S3 Storage)',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>`
  },
  {
    id: 'farmasi',
    href: `${APP_BASE}farmasi/index.html`,
    label: 'Farmasi & Gudang Obat',
    title: 'Farmasi & Gudang Obat',
    subtitle: 'Antrean E-Resep, Etiket, Stok FEFO & Mapping KFA',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>`
  },
  {
    id: 'kasir',
    href: `${APP_BASE}kasir/index.html`,
    label: 'Kasir & Keuangan',
    title: 'Kasir & Keuangan',
    subtitle: 'Consolidated Open Bill, Deposit Ranap & Jasa Medis',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>`
  },
  {
    id: 'satusehat',
    href: `${APP_BASE}satusehat/index.html`,
    label: 'Integrasi SATUSEHAT',
    title: 'Integrasi SATUSEHAT',
    subtitle: 'Monitoring HL7 FHIR R4, IHS ID & Redis Queue Retry',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>`
  },
  {
    id: 'sdm',
    href: `${APP_BASE}sdm/index.html`,
    label: 'SDM',
    title: 'SDM & Kepegawaian',
    subtitle: 'Data Nakes, STR/SIP, Absensi GPS Selfie & Payroll',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>`
  },
  {
    id: 'jadwal',
    href: `${APP_BASE}jadwal/index.html`,
    label: 'Jadwal & Shift',
    title: 'Jadwal & Shift 24 Jam',
    subtitle: 'Jadwal Praktik Dokter (Website) & Roster 3 Shift',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>`
  },
  {
    id: 'hak-akses',
    href: `${APP_BASE}hak-akses/index.html`,
    label: 'Hak Akses',
    title: 'Hak Akses (RBAC)',
    subtitle: 'Matriks Izin 9 Role & Smart Shift Lock',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`
  },
  {
    id: 'pengaturan',
    href: `${APP_BASE}pengaturan/index.html`,
    label: 'Pengaturan',
    title: 'Pengaturan Sistem',
    subtitle: 'Profil Klinik, Domain, WhatsApp Gateway & Backup S3',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`
  }
];

function initLayout(activePageId) {
  const currentItem = NAV_ITEMS.find(n => n.id === activePageId) || NAV_ITEMS[0];

  // Sidebar Nav
  const navEl = document.getElementById('sidebar-nav');
  if (navEl) {
    navEl.innerHTML = NAV_ITEMS.map(item => {
      const isActive = item.id === activePageId;
      return `
        <button onclick="navigateTo('${item.id}')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13px] transition-all text-left ${isActive ? 'nav-item-active font-medium' : 'text-slate-600 hover:bg-slate-100/80 font-normal'}">
          <span class="shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}">${item.icon}</span>
          <span class="truncate">${item.label}</span>
        </button>
      `;
    }).join('');
  }

  // Page Header
  const titleEl = document.getElementById('page-title');
  const subEl = document.getElementById('page-subtitle');
  if (titleEl) titleEl.textContent = currentItem.title;
  if (subEl) subEl.textContent = currentItem.subtitle;
}

function navigateTo(id) {
  const item = NAV_ITEMS.find(n => n.id === id);
  if (!item) return;
  if (item.href) {
    window.location.href = item.href;
  } else {
    showToast(`Modul "${item.label}" belum dibuat file terpisahnya. Siap dibuat kapan saja.`, 'info');
  }
}

function toggleSidebar(open) {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebar-backdrop');
  if (!sb || !bd) return;
  if (open) {
    sb.classList.remove('-translate-x-[120%]');
    bd.classList.remove('hidden');
  } else {
    sb.classList.add('-translate-x-[120%]');
    bd.classList.add('hidden');
  }
}

// Command Palette (CTRL + K)
const CMD_ACTIONS = [
  ...NAV_ITEMS.map(n => ({ label: `Buka Menu: ${n.label}`, sub: n.subtitle, action: () => navigateTo(n.id) })),
  { label: 'Registrasi Pasien Baru / Validasi NIK', sub: 'Admisi & Front Office', action: () => navigateTo('admisi') },
  { label: 'Admisi Rawat Inap (SPRI)', sub: 'Admisi & Front Office', action: () => navigateTo('admisi') },
];

function openCommandModal() {
  const modal = document.getElementById('cmd-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  const input = document.getElementById('cmd-input');
  input.value = '';
  filterCommandList('');
  setTimeout(() => input.focus(), 50);
}

function closeCommandModal() {
  const modal = document.getElementById('cmd-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function filterCommandList(query) {
  const q = query.toLowerCase();
  const filtered = CMD_ACTIONS.filter(c => c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q));
  const box = document.getElementById('cmd-results');
  if (!box) return;
  box.innerHTML = filtered.map(c => `
    <button onclick="runCmd(${CMD_ACTIONS.indexOf(c)})" class="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between transition">
      <div>
        <p class="font-medium text-slate-700">${c.label}</p>
        <p class="text-[11px] text-slate-400">${c.sub}</p>
      </div>
      <span class="text-[10px] text-slate-400">Enter</span>
    </button>
  `).join('') || `<p class="p-4 text-center text-slate-400">Tidak ada hasil cocok.</p>`;
}

function runCmd(idx) {
  closeCommandModal();
  CMD_ACTIONS[idx].action();
}

function toggleNotifPanel() {
  const np = document.getElementById('notif-panel');
  if (np) np.classList.toggle('hidden');
}

// Toast Notification (Clean Light Card)
let toastTimer;
function hideToast() {
  const t = document.getElementById('toast');
  if (!t) return;
  t.classList.add('hidden');
  t.classList.remove('flex');
}

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-msg');
  if (!t || !icon || !msgEl) return;
  msgEl.textContent = msg;
  if (type === 'success') {
    t.classList.remove('border-l-brand-blue');
    t.classList.add('border-l-brand-teal');
    icon.className = 'shrink-0 text-brand-teal';
    icon.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
  } else {
    t.classList.remove('border-l-brand-teal');
    t.classList.add('border-l-brand-blue');
    icon.className = 'shrink-0 text-brand-blue';
    icon.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
  }
  t.classList.remove('hidden');
  t.classList.add('flex');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3500);
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openCommandModal();
  } else if (e.key === 'Escape') {
    closeCommandModal();
    const np = document.getElementById('notif-panel');
    if (np) np.classList.add('hidden');
  }
});
