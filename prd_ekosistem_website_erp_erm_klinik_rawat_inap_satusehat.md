# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Nama Produk:** Ekosistem Website Publik, ERP Operasional, & ERM Klinik Rawat Inap Terintegrasi SATUSEHAT Kemenkes RI  
**Versi Dokumen:** 1.0  
**Status:** Ready for Development  
**Target Infrastruktur:** Cloud VPS Biznet Gio (Data Center Indonesia - ISO/IEC 27001) + NEO Object Storage S3  
**Standar Kepatuhan:** Permenkes No. 24 Tahun 2022 (RME), PP No. 71 Tahun 2019 (PSTE), & HL7 FHIR R4 SATUSEHAT  

---

## 1. Visi & Tujuan Produk (Product Overview)
Membangun sistem informasi manajemen klinik rawat inap terpadu dengan prinsip ***Single Input, Multi-Output***. Setiap aktivitas klinis maupun operasional yang diinput oleh staf (Admisi, Perawat, Dokter, Apoteker, Analis Lab, Kasir, dan HRD) cukup dilakukan satu kali di dalam sistem, dan secara otomatis akan:
1. Memperbarui sisa ketersediaan tempat tidur (*bed*) dan kuota jadwal dokter di **Website Publik** secara *real-time*.
2. Mengakumulasi seluruh biaya layanan ke dalam tagihan berjalan pasien (*Consolidated Open Bill*) di **Kasir** tanpa input ulang.
3. Memotong stok obat dan alat kesehatan habis pakai (BMHP) di **Gudang Farmasi** menggunakan metode FEFO (*First Expired First Out*) serta mencatat HPP.
4. Menghitung komisi **Jasa Medis (*Fee* Dokter/Perawat)** dan komponen kehadiran shift ke dalam modul **Payroll SDM**.
5. Mengirimkan paket data rekam medis standar **HL7 FHIR R4** ke server **SATUSEHAT Kemenkes RI** di latar belakang (*asynchronous background queue*).

---

## 2. Spesifikasi Tech Stack & Infrastruktur Server

### 2.1. Core Application Tech Stack
| Lapisan (Layer) | Teknologi yang Digunakan | Fungsi & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Backend Framework** | **Laravel 11 (PHP 8.3+)** | Framework matang dengan keamanan tinggi (CSRF, XSS, SQLi protection), fitur *Queue/Scheduler* bawaan, serta ekosistem *library bridging* SATUSEHAT (`ivanlanin/satusehat-integration`). |
| **Frontend & UI** | **Livewire 3 / Inertia.js (React/Vue) + Alpine.js + Tailwind CSS** | Pengembangan antarmuka form klinis yang sangat cepat, reaktif tanpa *reload* halaman penuh (*SPA-feel*), dan responsif di desktop, tablet bangsal, maupun *smartphone*. |
| **Database Utama** | **PostgreSQL 16** | Mendukung transaksi keuangan/stok yang ketat (*ACID compliant*), pencarian cepat puluhan ribu baris kamus medis, serta tipe data **`JSONB`** untuk menyimpan *payload* FHIR SATUSEHAT, *Odontogram*, dan *Body Map*. |
| **Queue & Caching** | **Redis + Linux Supervisor** | Menjalankan proses antrean pengiriman API ke SATUSEHAT 24 jam penuh di latar belakang lengkap dengan mekanisme *auto-retry* jika server Kemenkes sedang lambat/gangguan. |
| **Real-Time Engine** | **Laravel Reverb / Pusher (WebSockets)** | Memperbarui layar TV panggilan antrean poliklinik/apotek serta status ketersediaan kasur (*Bed Management*) di Website Publik secara *real-time* detik itu juga. |
| **Access Control (RBAC)** | **`spatie/laravel-permission` + Custom Shift Middleware** | Mengatur matriks hak akses per *Role* dan mengunci akses input transaksi di luar jam kerja aktif pegawai (*Smart Shift Lock*). |
| **Cetakan & Media** | **DomPDF / Browsershot, `signature_pad`, ApexCharts, Fabric.js** | Mencetak gelang barcode/etiket obat thermal/resume medis PDF, tanda tangan digital layar sentuh, grafik kurva TTV harian, dan kanvas anatomi tubuh IGD. |

### 2.2. Infrastruktur Server Production & Deployment
| Komponen | Penyedia & Spesifikasi | Konfigurasi & Peran |
| :--- | :--- | :--- |
| **Cloud VPS Utama** | **Biznet Gio — NEO Lite (Paket SS 4.4)**<br>• 4 vCPU, 4 GB RAM, 60 GB SSD<br>• OS: Ubuntu 24.04 LTS<br>• Lokasi: Data Center Indonesia (Jawa Barat/Jakarta) | Menjalankan Web Server (Nginx), PHP-FPM 8.3, PostgreSQL 16, Redis, dan Supervisor. Terhubung langsung ke jaringan lokal IIX/OpenIXP untuk latensi $< 5\text{ ms}$ ke server Kemenkes. |
| **Object Storage (S3)** | **Biznet Gio — NEO Object Storage (100 GB)** | Menyimpan berkas medis berukuran besar (foto Rontgen, USG, EKG, PDF hasil lab, foto selfie absensi) dan file *automated daily database backup* (`.sql.gz`). |
| **Domain & Subdomain** | **Domain Resmi `.id` / `.co.id`** | • `klinikanda.id` (Website Profil Publik & Booking)<br>• `erp.klinikanda.id` (Aplikasi Internal ERP & ERM)<br>• `antrean.klinikanda.id` (Layar TV Antrean Ruang Tunggu) |
| **Server Panel & Security** | **CloudPanel / aaPanel + Cloudflare WAF + Let's Encrypt SSL** | Manajemen server visual gratis, proteksi Anti-DDoS, dan enkripsi lalu lintas data medis dengan HTTPS (TLS 1.3). |
| **WhatsApp Gateway** | **Fonnte / Wablas API** | Pengiriman otomatis tiket booking online, QR Code *check-in*, nomor antrean poli, dan pengingat jadwal kontrol pasien. |

---

## 3. Peran Pengguna & Matriks Hak Akses (Multi-Role RBAC)
Sistem menerapkan kontrol akses berbasis peran (*Role-Based Access Control*) disertai fitur **Smart Shift Lock**:

| Role Pengguna | Cakupan Akses Utama | Pembatasan Keamanan (Restriction) |
| :--- | :--- | :--- |
| **1. Pasien / Publik** | Akses Website Publik, cek ketersediaan kamar, cek jadwal dokter, & booking antrean online. | Tanpa akses ke jaringan internal ERP/ERM. |
| **2. Super Admin / Manajemen** | Akses penuh seluruh modul, dashboard analitik eksekutif, master data, & konfigurasi sistem. | Setiap perubahan data medis tetap terekam di *Audit Trail*. |
| **3. HRD / Kepegawaian** | Kelola akun staf, STR/SIP, tarik *Practitioner IHS ID*, jadwal shift 24 jam, absensi GPS, & *Payroll*. | Dilarang membuka detail rekam medis klinis (SOAP/CPPT) pasien. |
| **4. Admisi / Front Office** | Registrasi pasien (validasi NIK), antrean TV, admisi rawat inap (ADT), & tanda tangan *Consent*. | Dilarang melihat/mengubah form pemeriksaan dokter dan resep obat. |
| **5. Perawat (Rajal, IGD, Ranap)** | Triase IGD, asesmen awal TTV, peta *Bed Management*, CPPT keperawatan, grafik TTV/cairan, & MAR. | Dilarang mengubah harga layanan, stok gudang, atau kasir. |
| **6. Dokter (Poli, IGD, Visite)** | Pemeriksaan SOAP, *Odontogram*, *Body Map*, CPPT visite, ICD-10/9, *E-Prescribing*, & Resume Medis. | Dilarang mengedit transaksi kasir atau stok fisik gudang farmasi. |
| **7. Apoteker & Gudang Farmasi** | Antrean resep elektronik, cetak etiket, serah terima obat, stok FEFO, PO Supplier, & *mapping* KFA. | Dilarang mengubah catatan klinis/diagnosis dokter. |
| **8. Analis Lab & Radiologi** | Daftar *order* penunjang, input nilai hasil lab, & unggah lampiran foto Rontgen/USG/EKG/PDF. | Hanya mengakses modul penunjang medis. |
| **9. Kasir / Billing** | Pantau *Open Bill* pasien, input deposit rawat inap, pelunasan multi-metode, & cetak *invoice*. | Hanya melihat nama item & tarif biaya, tanpa akses baca detail anamnesis/SOAP rahasia pasien. |

---

## 4. Spesifikasi Modul & Fitur Fungsional (Functional Requirements)

### 4.1. Modul 1: Website Profil Publik & Reservasi Pasien (`FR-WEB`)
* **`FR-WEB-01` Pintasan Darurat (Floating Emergency Button):** Tombol akses cepat 1-klik untuk panggilan langsung ke IGD 24 Jam, pemesanan Ambulans, dan WhatsApp CS.
* **`FR-WEB-02` Informasi Ketersediaan Kamar Real-Time (Live Bed Availability):** Menampilkan kelas kamar rawat inap (VIP, Kelas 1, Kelas 2, Kelas 3, Isolasi), fasilitas kamar, tarif per malam, dan jumlah tempat tidur kosong secara *real-time* via WebSocket.
* **`FR-WEB-03` Jadwal & Booking Dokter Online:** Pencarian jadwal praktik dokter berdasarkan poliklinik/spesialisasi dan hari, informasi sisa kuota antrean per sesi, serta formulir reservasi online untuk pasien baru maupun lama.
* **`FR-WEB-04` Notifikasi Antrean Otomatis:** Pengiriman bukti booking, QR Code *check-in*, nomor antrean poliklinik, dan pengingat jadwal kontrol ke WhatsApp pasien.
* **`FR-WEB-05` Katalog Layanan & Artikel Kesehatan (CMS & SEO):** Informasi layanan Poliklinik, IGD, Persalinan/KIA, Laboratorium, Radiologi, Farmasi, paket Medical Check-Up (MCU), daftar asuransi rekanan/BPJS, serta blog edukasi kesehatan.

### 4.2. Modul 2: Admisi, Antrean Multi-Channel & Front Office (`FR-ADM`)
* **`FR-ADM-01` Registrasi & Validasi NIK Pasien:** Pendaftaran pasien baru dan lama dengan validasi 16 digit NIK KTP (otomatis menarik `Patient IHS Number` dari server SATUSEHAT) serta pencatatan nomor BPJS/Asuransi.
* **`FR-ADM-02` Manajemen Antrean Multi-Channel & Layar Panggil TV:** Pengambilan nomor antrean dari Website (Booking), Kiosk Mandiri (*Walk-in*), dan konversi otomatis ke antrean Poliklinik serta Apotek yang terhubung ke layar TV ruang tunggu disertai panggilan suara otomatis (*Text-to-Speech*).
* **`FR-ADM-03` Manajemen Admission, Discharge, Transfer (ADT):** Pendaftaran masuk rawat inap (berdasarkan Surat Pengantar Rawat Inap / SPRI dari dokter), pemilihan kelas/nomor bed, mutasi pindah kamar, hingga proses pemulangan pasien.
* **`FR-ADM-04` Digital General & Informed Consent:** Formulir persetujuan umum (termasuk persetujuan pelepasan data ke SATUSEHAT Kemenkes) dan persetujuan/penolakan tindakan medis menggunakan tanda tangan digital (*Touchscreen Signature Pad*).
* **`FR-ADM-05` Cetakan Identitas Medis:** Pencetakan kartu berobat pasien, label barcode rekam medis, dan gelang identitas barcode pasien rawat inap.

### 4.3. Modul 3: Rekam Medis Elektronik (ERM) Rawat Jalan & IGD (`FR-ERM-OP`)
* **`FR-ERM-01` Triase IGD & Body Map Visual:** Pencatatan tingkat kegawatdaruratan pasien IGD (Merah, Kuning, Hijau, Hitam) serta penandaan lokasi luka/trauma secara interaktif pada gambar anatomi tubuh (*Body Map*).
* **`FR-ERM-02` Asesmen Awal Keperawatan:** Pencatatan Tanda-Tanda Vital (TTV: Tekanan Darah Sistolik/Diastolik, Suhu, Nadi, Pernapasan, Saturasi $O_2$, Berat & Tinggi Badan), skrining nyeri, skrining risiko jatuh, dan riwayat alergi obat/makanan.
* **`FR-ERM-03` Pemeriksaan Dokter (SOAP) & Odontogram:** Pencatatan klinis terstruktur (*Subjective, Objective, Assessment, Plan*), riwayat kunjungan terdahulu, serta peta gigi interaktif (*Odontogram*) untuk Poli Gigi.
* **`FR-ERM-04` Kamus Medis Standar Terintegrasi (Autocomplete):** Pencarian otomatis puluhan ribu kode diagnosis penyakit (**ICD-10**), prosedur tindakan medis (**ICD-9-CM**), kode observasi klinis (**LOINC**), dan terminologi klinis (**SNOMED-CT**).
* **`FR-ERM-05` E-Prescribing & Order Penunjang:** Peresepan obat elektronik (obat jadi maupun racikan/puyer) yang langsung terkirim ke layar Apotek, serta form permintaan pemeriksaan Laboratorium/Radiologi digital.

### 4.4. Modul 4: ERM Khusus Rawat Inap / Bangsal (`FR-ERM-IP`)
* **`FR-ERM-06` Dasbor Visual Bangsal & Bed Management:** Peta interaktif ketersediaan tempat tidur per ruangan dengan indikator warna status (*Kosong, Terisi Pasien Pria/Wanita, Kotor/Sedang Disterilisasi, atau Rusak/Maintenance*).
* **`FR-ERM-07` CPPT (Catatan Perkembangan Pasien Terintegrasi):** Lembar *timeline* kolaboratif bagi Dokter (saat visite harian), Perawat (pergantian shift pagi/siang/malam), Ahli Gizi, dan Apoteker untuk mencatat perkembangan pasien rawat inap dalam satu layar terpadu.
* **`FR-ERM-08` Grafik Kurva TTV & Keseimbangan Cairan (Fluid Balance):** Visualisasi grafik tren harian untuk memantau suhu tubuh, tekanan darah, nadi, serta pencatatan cairan masuk (infus/minum) dan cairan keluar (urin/drain).
* **`FR-ERM-09` Medication Administration Record (MAR):** Jadwal pengingat dan log konfirmasi pemberian obat/injeksi harian oleh perawat bangsal kepada pasien rawat inap.
* **`FR-ERM-10` Resume Medis Pulang (Discharge Summary):** Pembuatan ringkasan rekam medis pasien keluar rawat inap, jadwal kontrol ulang, Surat Keterangan Sakit/Sehat, dan Surat Rujukan.

### 4.5. Modul 5: Penunjang Medis — Laboratorium & Radiologi (`FR-LAB`)
* **`FR-LAB-01` Daftar Order Penunjang Real-Time:** Penerimaan order pemeriksaan dari Poliklinik, IGD, maupun Bangsal Rawat Inap.
* **`FR-LAB-02` Input Hasil & Lampiran Berkas Medis:** Pengisian parameter hasil uji laboratorium (dilengkapi penanda otomatis jika nilai di luar batas rujukan normal), unggah file foto Rontgen/USG/EKG/PDF ke Object Storage S3, dan cetak hasil resmi.

### 4.6. Modul 6: ERP Operasional — Farmasi, Gudang, Kasir, SDM & Analitik (`FR-ERP`)
* **`FR-ERP-01` Manajemen Resep & Etiket Apotek:** Verifikasi resep elektronik dari dokter, penyiapan obat, dan pencetakan stiker etiket aturan pakai obat otomatis.
* **`FR-ERP-02` Inventory Gudang Obat (FEFO/FIFO):** Pengelolaan stok obat dan BMHP multi-gudang, pelacakan nomor *Batch*, peringatan dini obat mendekati tanggal kedaluwarsa (*Expired Date Alert*), kartu stok digital, *Purchase Order* (PO) ke PBF/Supplier, dan perhitungan HPP otomatis.
* **`FR-ERP-03` Consolidated Billing (Tagihan Kasir Terintegrasi):** Seluruh tindakan medis, pemakaian alkes/BMHP, resep obat apotek, pemeriksaan lab, dan argo sewa kamar harian rawat inap terakumulasi otomatis ke dalam satu tagihan berjalan (*Open Bill*) tanpa perlu input ulang di kasir.
* **`FR-ERP-04` Manajemen Deposit & Pembayaran Multi-Metode:** Pencatatan uang muka (*deposit*) masuk rawat inap, pembayaran Tunai, QRIS, Debit/Transfer, pengelolaan piutang Asuransi/BPJS, serta cetak kwitansi rincian biaya (*Itemized Invoice*).
* **`FR-ERP-05` Manajemen Akun Pegawai, STR/SIP & Sinkronisasi Nakes:** Pembuatan akun staf, peringatan masa berlaku STR/SIP tenaga medis, PIN tanda tangan elektronik 6 digit, dan tombol penarikan otomatis `Practitioner IHS Number` dari SATUSEHAT via NIK KTP.
* **`FR-ERP-06` Manajemen Jadwal Praktik Dokter & Roster Shift 24 Jam:** Pengaturan jadwal dan kuota praktik dokter poliklinik (tersinkronisasi otomatis ke halaman Booking Website Publik), pengaturan jadwal 3 shift (Pagi, Siang, Malam) untuk perawat rawat inap/IGD dan staf operasional, serta fitur pengajuan tukar shift/cuti.
* **`FR-ERP-07` Sistem Absensi Pegawai (GPS Geofencing & Selfie) & Payroll:** Absensi kehadiran masuk/pulang (*Clock-In/Clock-Out*) berbasis titik koordinat GPS radius klinik dan foto *live selfie*, penguncian akses input transaksi di luar jam shift aktif (*Smart Operational Lock*), serta rekapitulasi otomatis gaji pokok, tunjangan shift malam, dan komisi **Jasa Medis (*Fee* Dokter/Perawat)** ke dalam slip gaji bulanan.
* **`FR-ERP-08` Dashboard Analitik Eksekutif:** Visualisasi indikator klinik meliputi **BOR (*Bed Occupancy Rate*)**, ALOS (*Average Length of Stay*), TOI (*Turn Over Interval*), 10 Besar Penyakit (ekspor laporan RL Kemenkes), waktu tunggu pelayanan, pendapatan kotor vs bersih, piutang asuransi, dan rasio keberhasilan sinkronisasi SATUSEHAT.

### 4.7. Modul 7: Integrasi & Bridging SATUSEHAT Kemenkes (`FR-SS`)
* **`FR-SS-01` Auto-Lookup IHS Number & Sinkronisasi Master Ruangan:** Konversi otomatis NIK KTP pasien menjadi `Patient IHS ID`, NIK tenaga medis menjadi `Practitioner IHS ID`, serta pendaftaran struktur organisasi klinik (`Organization`) dan kode ruangan poli/IGD/kamar rawat inap (`Location`).
* **`FR-SS-02` Pengiriman Otomatis 6 Use Case Klinis (FHIR R4):** Pengiriman paket data FHIR R4 untuk Kunjungan (`Encounter`), TTV (`Observation` - LOINC), Keluhan & Diagnosis (`Condition` - ICD-10), Alergi (`AllergyIntolerance`), Tindakan (`Procedure` - ICD-9-CM), Resep & Serah Terima Obat (`MedicationRequest` & `MedicationDispense` - Kode KFA), serta Resume Medis (`Composition`).
* **`FR-SS-03` Asynchronous Queue Worker & Dashboard Retry Log:** Pengiriman data ke server Kemenkes berjalan di latar belakang (*background job*) agar tidak memperlambat layar kerja dokter, dilengkapi dasbor pemantauan status pengiriman (*Berhasil/Pending/Gagal*) dan tombol kirim ulang (*Retry*).

---

## 5. Daftar Fitur Umum Sistem & Struktur Menu Sidebar

### 5.1. Fitur Umum Sistem
* Autentikasi Pengguna & Multi-Role Access Control (RBAC)
* Manajemen Akun & Hak Akses Staf (Dokter, Perawat, Apoteker, Kasir, Admin)
* Pengaturan Profil Klinik, Cabang, & Jam Operasional
* Manajemen Master Data Poliklinik, Ruangan, Bangsal, & Kelas Kamar
* Manajemen Master Data Tarif Layanan, Tindakan Medis, & Paket MCU
* Manajemen Jadwal Praktik & Kuota Harian Dokter
* Pencarian Cepat & Filter Data Pasien (Nama, No. RM, NIK, No. BPJS)
* Riwayat Kunjungan & Timeline Rekam Medis Pasien Terpadu
* Cetak Dokumen Otomatis (Kartu Pasien, Gelang Barcode, Etiket Obat, Struk Kasir, Kwitansi, Surat Sakit/Rujukan, Resume Medis PDF)
* Ekspor Laporan ke Format Excel (`.xlsx`), CSV, & PDF
* Notifikasi Real-Time di Dalam Aplikasi (*In-App Notification*) & Integrasi WhatsApp
* Log Aktivitas Pengguna (*Audit Trail*) untuk Keamanan Data Medis
* Pencadangan Data Otomatis Harian (*Automated Daily Database Backup*)
* Desain Antarmuka Responsif (*Mobile, Tablet, & Desktop Friendly*)
* Keamanan Enkripsi Data & Koneksi SSL/HTTPS
* Manajemen Roster Shift Kerja 24 Jam (Pagi, Siang, Malam) & Pengajuan Cuti/Tukar Shift
* Sistem Absensi Kehadiran Berbasis GPS Geofencing & Live Selfie
* Penguncian Akses Operasional Berdasarkan Jam Shift Aktif (*Smart Shift Lock*)
* Pengaturan Matriks Izin Fitur Kustom (*View, Create, Edit, Delete, Export*)
* Peringatan Masa Berlaku STR & SIP Tenaga Medis
* Perhitungan Otomatis Slip Gaji (Gaji Pokok, Insentif Shift, & Komisi Jasa Medis)

### 5.2. Struktur Menu Sidebar Aplikasi Internal
* **1. Menu Utama / Dashboard**
  * Dashboard Utama (Ringkasan Kunjungan, Keuangan & BOR)
  * Monitor Antrean TV & Poli
  * Peta Ketersediaan Kamar & Bed (*Bed Management*)
* **2. Menu Admisi & Front Office**
  * Registrasi Pasien Baru & Lama
  * Pendaftaran Rawat Jalan & Poliklinik
  * Pendaftaran IGD (Gawat Darurat)
  * Admisi Rawat Inap (Masuk, Pindah, & Pulang / ADT)
  * Daftar Booking Online (Website & WhatsApp)
  * Dokumen Persetujuan (*General & Informed Consent*)
* **3. Menu Pelayanan Medis (ERM)**
  * Asesmen Awal Keperawatan & Triase IGD
  * Pemeriksaan Dokter Rawat Jalan (SOAP)
  * Pemeriksaan & Observasi IGD
  * Perawatan Bangsal Rawat Inap (CPPT & Visite)
  * Grafik Observasi TTV & Keseimbangan Cairan
  * Jadwal Pemberian Obat Inap (MAR)
  * Resume Medis Pulang & Surat Keterangan Medis
* **4. Menu Penunjang Medis**
  * Antrean & Input Hasil Laboratorium
  * Antrean & Input Hasil Radiologi / Penunjang
* **5. Menu Farmasi & Gudang Obat (Inventory)**
  * Antrean Resep Elektronik (Rawat Jalan, IGD, & Inap)
  * Penyerahan Obat & Cetak Etiket
  * Master Obat, Alkes, & Mapping KFA
  * Stok Gudang, Batch, & Expired Date
  * Pembelian (*Purchase Order*) & Penerimaan PBF
  * Stok Opname & Kartu Stok
* **6. Menu Kasir & Keuangan (Billing)**
  * Tagihan Berjalan (*Open Bill* Rawat Jalan & Inap)
  * Deposit / Uang Muka Rawat Inap
  * Pembayaran & Checkout Kasir
  * Klaim & Piutang Asuransi / BPJS
  * Rekapitulasi Jasa Medis (*Fee* Dokter & Perawat)
* **7. Menu Integrasi SATUSEHAT Kemenkes**
  * Konfigurasi Kredensial & Master IHS Number
  * Sinkronisasi Ruangan & Lokasi (*Location ID*)
  * Log Monitoring Pengiriman & Antrean *Retry*
* **8. Menu SDM, Jadwal, Absensi & Hak Akses (HR & RBAC)**
  * Data Pegawai, STR/SIP, & Sinkronisasi NIK Nakes (*IHS Number*)
  * Manajemen Akun Pengguna, Role, & Pembatasan Menu (RBAC)
  * Pengaturan Jadwal Praktik & Kuota Dokter Poli
  * Pengaturan Roster Shift Perawat & Staf (Pagi / Siang / Malam)
  * Absensi Kehadiran (*GPS Geofencing & Selfie*)
  * Pengajuan Izin, Cuti, & Tukar Shift
  * Rekapitulasi Kehadiran, Lembur, & Payroll Slip Gaji
* **9. Menu Manajemen, CMS Website & Pengaturan**
  * Laporan Kunjungan, RL Kemenkes, & 10 Besar Penyakit
  * Laporan Keuangan & Pendapatan Klinik
  * CMS Website Publik (Artikel, Layanan, & Banner)
  * Master Data Poliklinik, Kamar, Tarif, & Jadwal Dokter
  * Manajemen Pengguna, Hak Akses (RBAC), & Audit Log

---

## 6. Alur Kerja Sistem (End-to-End System Workflows)

### 6.1. Alur 1: Setup Kredensial, Master SDM, Jadwal & Absensi (`WF-01`)
1. **Konfigurasi Kredensial API:** Super Admin memasukkan `Organization ID`, `Client Key`, dan `Secret Key` resmi klinik dari portal DFO/SSP Kemenkes ke pengaturan sistem.
2. **Sinkronisasi Nakes, Ruangan & Obat KFA:**
   * HRD menginput data pegawai, nomor STR/SIP, dan 16 digit NIK KTP ➔ Sistem otomatis menarik `Practitioner IHS ID` dari SATUSEHAT dan mengunci tampilan menu sesuai Role RBAC.
   * Sistem mendaftarkan Poliklinik, IGD, dan Kamar/Bed Rawat Inap ke SATUSEHAT untuk menyimpan `Location ID`.
   * Tim farmasi memetakan daftar stok obat apotek ke kode standar **KFA Kemenkes**.
3. **Jadwal & Aktivasi Shift (*Smart Shift Lock*):** Admin menyusun jadwal praktik dokter (langsung tampil *real-time* di halaman Booking Website Publik) dan *roster* 3 shift. Saat pegawai tiba di klinik dan melakukan *Clock-In* (validasi radius GPS $\le 50\text{ meter}$ + foto *selfie*), sistem membuka kunci akses operasional staf tersebut dan mengubah status di layar TV ruang tunggu menjadi *"Dokter Sudah Hadir"*.

### 6.2. Alur 2: Alur Pelayanan Pasien Rawat Jalan / Poliklinik (`WF-02`)
1. **Pendaftaran & Ambil Nomor Antrean:**
   * Pasien daftar dari rumah via Website Publik (mendapat QR & nomor antrean poli via WhatsApp) atau datang langsung (*Walk-in*) mengambil tiket di Kiosk/Meja Admisi.
   * Resepsionis memvalidasi 16 digit NIK KTP dan meminta tanda tangan *General Consent* digital.
   * **Aksi Otomatis Sistem:** Menarik `Patient IHS Number`, mencetak nomor antrean poli (misal `PU-012`), membuka keranjang `open_bills` (Rp 0), dan mengirim `Encounter: Arrived` ke antrean Redis SATUSEHAT.
2. **Pemeriksaan Awal Perawat (Nurse Station):**
   * Perawat memanggil antrean pasien via audio TV, mengukur TTV (tensi, suhu, nadi, berat/tinggi badan), dan mencatat alergi.
   * **Aksi Otomatis Sistem:** Menyematkan kode **LOINC** & **SNOMED-CT** di balik layar dan meneruskan status pasien ke layar komputer dokter.
3. **Pemeriksaan Dokter (Ruang Poli):**
   * Dokter mengisi form SOAP, memilih kode diagnosis **ICD-10**, tindakan medis **ICD-9-CM**, dan membuat resep obat elektronik (*E-Prescribing*).
   * **Aksi Otomatis Sistem:** Tarif konsultasi dan tindakan langsung masuk ke *Open Bill* Kasir, komisi Jasa Medis tercatat di buku besar Payroll dokter/perawat, serta resep muncul beserta nomor antrean farmasi otomatis di layar Apotek.
4. **Penyerahan Obat (Apotek) & Pelunasan (Kasir):**
   * Apoteker menyiapkan obat, mencetak etiket, dan klik *"Serahkan Obat"* (stok gudang otomatis terpotong secara FEFO dan harga obat masuk ke Kasir).
   * Kasir menerima pembayaran (Tunai/QRIS/Asuransi) dan menyelesaikan kunjungan.
   * **Aksi Otomatis Sistem (SATUSEHAT Queue):** Mengirim paket data lengkap (`Encounter: Finished`, `Observation` TTV, `Condition` ICD-10, `Procedure` ICD-9, `MedicationRequest`, dan `MedicationDispense` KFA) ke server SATUSEHAT di latar belakang hingga berstatus centang hijau.

### 6.3. Alur 3: Alur Pelayanan IGD & Siklus Penuh Rawat Inap (`WF-03`)
1. **Penanganan IGD & Pengantar Rawat Inap (SPRI):** Pasien darurat masuk ke IGD; perawat dan dokter IGD mengisi form Triase, *Body Map* luka, TTV, dan tindakan darurat. Jika pasien harus menginap, dokter menerbitkan **Surat Pengantar Rawat Inap (SPRI)** digital.
2. **Penempatan Kamar & Bed (Admisi Rawat Inap):**
   * Resepsionis memilih kelas kamar dan nomor *Bed* yang kosong, mencatat uang muka (*deposit*), mencetak gelang barcode, dan meminta tanda tangan *Informed Consent* rawat inap.
   * **Aksi Otomatis Sistem:** Status Bed berubah menjadi **"Terisi"**, jumlah sisa kamar kosong di **Website Publik otomatis berkurang 1 detik itu juga**, argo tarif sewa kamar harian mulai berjalan, dan sistem mengirim `Encounter: In-Progress (Inpatient)` beserta `Location ID` kamar ke SATUSEHAT.
3. **Perawatan Harian di Bangsal (Visite Dokter, Shift Perawat & Argo Kamar):**
   * Setiap pergantian shift (Pagi/Siang/Malam), perawat menginput grafik suhu/tensi harian, keseimbangan cairan (*fluid balance*), pemakaian alkes/infus, serta mencentang jadwal pemberian obat (MAR).
   * Dokter melakukan visite harian dan mencatat perkembangan di lembar **CPPT (SOAP)** serta meresepkan obat harian.
   * **Aksi Otomatis Sistem:** Setiap pukul 12:00 WIB, *Cronjob Scheduler* otomatis menambahkan tarif sewa kamar harian ke *Consolidated Open Bill* pasien bersama seluruh biaya visite dokter, tindakan perawat, alkes, dan obat harian.
4. **Pemulangan Pasien (Discharge) & Checkout Kasir:**
   * Dokter mengisi **Resume Medis Pulang (*Discharge Summary*)** dan resep obat pulang. Kasir menampilkan total tagihan gabungan selama menginap dikurangi deposit awal, menerima pelunasan, dan mencetak *Itemized Invoice*.
   * **Aksi Otomatis Sistem:** Status tempat tidur berubah menjadi **"Kotor / Sedang Disterilisasi"** (dan setelah dikonfirmasi bersih oleh petugas, kembali menjadi **"Kosong"** sehingga kuota kamar di Website Publik bertambah 1 kembali). Sistem mengirimkan laporan akhir rawat inap dan `Composition` Resume Medis ke server SATUSEHAT Kemenkes.

---

## 7. Skema Entitas Database Utama (PostgreSQL 16 Schema Overview)
* **`users` & `employees`:** Menyimpan kredensial login, Role RBAC, `nik_ktp`, `practitioner_ihs_id`, nomor & masa berlaku `str_number` / `sip_number`, PIN 6 digit, dan persentase bagi hasil jasa medis.
* **`schedules` & `attendances`:** Menyimpan jadwal praktik/kuota dokter poli, *roster* shift 24 jam staf, log *Clock-In/Out*, koordinat GPS, dan URL foto *selfie*.
* **`rooms` & `beds`:** Menyimpan kelas kamar, tarif per malam, `satusehat_location_id`, dan status *real-time* (`AVAILABLE`, `OCCUPIED_MALE`, `OCCUPIED_FEMALE`, `DIRTY`, `MAINTENANCE`).
* **`patients`:** Menyimpan No. RM, `nik_ktp`, `patient_ihs_id`, No. BPJS/Asuransi, data demografi, dan file tanda tangan *General Consent*.
* **`queues` & `encounters`:** Menyimpan nomor antrean multi-channel, nomor registrasi kunjungan, jenis layanan (`AMB`, `EMER`, `IMP`), ID dokter, ID bed/ruangan, waktu masuk/keluar, dan `satusehat_encounter_id`.
* **`clinical_records` (SOAP, CPPT & TTV):** Menyimpan catatan S-O-A-P, profesi penginput, grafik TTV (terikat kode LOINC), *fluid balance*, *Body Map/Odontogram* (`JSONB`), diagnosis (`icd10_code`), dan tindakan (`icd9_code`).
* **`medicines` & `inventory_batches`:** Menyimpan master obat/alkes, `kfa_code` Kemenkes, HPP, harga jual, nomor *batch*, tanggal *expired* (FEFO), dan sisa stok per gudang.
* **`prescriptions` & `mar_logs`:** Menyimpan resep elektronik dokter, aturan pakai, status serah terima apotek, dan log pemberian obat harian perawat rawat inap.
* **`open_bills`, `bill_items` & `medical_fees`:** Menyimpan akumulasi tagihan berjalan pasien, deposit rawat inap, metode pembayaran kasir, serta buku besar komisi Jasa Medis dokter/perawat.
* **`satusehat_logs`:** Menyimpan *payload* request/response FHIR (`JSONB`), status pengiriman (`SUCCESS`, `PENDING`, `FAILED`), pesan error, dan penghitung *retry*.

---

## 8. Kebutuhan Non-Fungsional & Keamanan (Non-Functional Requirements)
1. **Performa & Responsivitas Klinis:** Waktu simpan form pemeriksaan lokal ke database PostgreSQL wajib **$< 200\text{ ms}$**. Seluruh komunikasi keluar ke API eksternal (SATUSEHAT & WhatsApp Gateway) wajib melalui **Redis Queue Worker** agar tidak memblokir antarmuka pengguna.
2. **Kepatuhan Data & Kedaulatan Server:** Seluruh data rekam medis dan pencadangan (*backup*) ditempatkan secara eksklusif di pusat data Indonesia (**Biznet Gio Cloud — ISO/IEC 27001**) sesuai mandat PP No. 71 Tahun 2019 dan Permenkes No. 24 Tahun 2022.
3. **High Availability & Disaster Recovery:** Pencadangan database otomatis (*Automated Daily Backup* `pg_dump`) dijalankan setiap pukul 02:00 WIB dini hari dengan enkripsi dan dikirim ke penyimpanan terpisah **NEO Object Storage S3**.