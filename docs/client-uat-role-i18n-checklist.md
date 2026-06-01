# Dokumen Siap Pakai: Role, UAT, dan Audit Bilingual

Dokumen ini dipakai sebagai acuan final agar minim revisi dari client.

## 1) Matriks Role-Permission

Gunakan matrix ini sebagai kontrak perilaku sistem.

| Area | Admin Utama (`admin_main`) | Admin Cikarang (`admin_cikarang`) | Admin Bintaro (`admin_bintaro`) |
|---|---|---|---|
| Login ke panel admin | Ya | Ya | Ya |
| Akses dashboard admin | Ya (global) | Ya (fokus cabang) | Ya (fokus cabang) |
| Lihat statistik reservasi | Semua outlet | Hanya Cikarang | Hanya Bintaro |
| Lihat daftar reservasi | Semua outlet | Hanya Cikarang | Hanya Bintaro |
| Ubah status reservasi | Semua outlet | Hanya Cikarang | Hanya Bintaro |
| Buat admin baru | Ya | Tidak | Tidak |
| Hapus admin | Ya | Tidak | Tidak |
| Kelola campaign/popup | Ya | Tidak | Tidak |
| Kelola konten What’s On/artikel | Ya | Tidak | Tidak |
| Akses halaman users admin | Ya | Tidak (403) | Tidak (403) |
| Akses halaman campaigns admin | Ya | Tidak (403) | Tidak (403) |

### Catatan bisnis
- Admin cabang tidak boleh bisa mengubah data cabang lain (read/write).
- Admin utama tetap bisa melakukan override lintas cabang.
- Untuk keamanan operasional, aktivitas penting (status reservasi, buat/hapus user) idealnya di-log.

## 2) Checklist UAT Siap Pakai (Versi Client)

Checklist ini dipakai saat demo dan sign-off.

### A. Akses & Login
- [ ] Login `admin_main` berhasil.
- [ ] Login `admin_cikarang` berhasil.
- [ ] Login `admin_bintaro` berhasil.
- [ ] User non-admin ditolak.
- [ ] Logout berfungsi.

### B. Otorisasi Halaman
- [ ] `admin_main` bisa buka `/admin`, `/admin/reservations`, `/admin/users`, `/admin/campaigns`.
- [ ] `admin_cikarang` bisa buka `/admin` dan `/admin/reservations`.
- [ ] `admin_cikarang` ditolak saat buka `/admin/users` dan `/admin/campaigns`.
- [ ] `admin_bintaro` bisa buka `/admin` dan `/admin/reservations`.
- [ ] `admin_bintaro` ditolak saat buka `/admin/users` dan `/admin/campaigns`.

### C. Otorisasi Data Reservasi
- [ ] `admin_cikarang` hanya melihat reservasi outlet Cikarang.
- [ ] `admin_bintaro` hanya melihat reservasi outlet Bintaro.
- [ ] `admin_main` melihat semua reservasi.
- [ ] `admin_cikarang` tidak bisa update status reservasi Bintaro.
- [ ] `admin_bintaro` tidak bisa update status reservasi Cikarang.

### D. Fitur Admin Utama
- [ ] Admin utama bisa membuat user admin baru.
- [ ] Admin utama bisa memilih role saat create user.
- [ ] Admin utama bisa menghapus user sesuai rule bisnis.
- [ ] Admin utama bisa upload campaign.
- [ ] Admin utama bisa aktif/nonaktif/hapus campaign.

### E. Dua Cabang (Konten Publik)
- [ ] Halaman outlet menampilkan 2 cabang: Cikarang dan Bintaro.
- [ ] Halaman about menampilkan informasi 2 cabang.
- [ ] Form reservasi memungkinkan memilih outlet Cikarang/Bintaro.
- [ ] Copy/teks tidak lagi menyiratkan “hanya 1 cabang”.

### F. Bilingual EN/ID
- [ ] Toggle `ID` menampilkan Bahasa Indonesia di semua area user-facing.
- [ ] Toggle `EN` menampilkan Bahasa Inggris di semua area user-facing.
- [ ] Pergantian bahasa persisten setelah refresh.
- [ ] Tidak ada teks campuran ID/EN dalam satu konteks UI.

### G. Smoke Test Teknis
- [ ] Semua halaman utama bisa dibuka tanpa error.
- [ ] Tidak ada error console kritikal.
- [ ] Build/check TypeScript lulus.
- [ ] Respons API utama status 2xx/4xx sesuai ekspektasi.

## 3) Daftar Final Teks yang Harus Bilingual (Audit 1 Kali)

Pakai daftar ini sebagai one-pass audit agar tidak ada yang terlewat.

### A. Navigasi & Layout
- [ ] Navbar (semua label menu, tombol reserve/reservasi, contact/kontak).
- [ ] Footer (label link, legal links, copyright text).
- [ ] Judul section global (home/about/menu/catering/contact).

### B. Halaman Publik
- [ ] Home: hero, subheading, CTA, card title/desc, carousel hints.
- [ ] About: heading, paragraph, info cabang, CTA.
- [ ] Menu: heading, deskripsi, CTA PDF, metadata update.
- [ ] What’s On: heading, intro, tombol baca/read.
- [ ] FAQ: title, subtitle, item question/answer (ideal bilingual content source).
- [ ] Reservation: seluruh teks form + success state + error state.
- [ ] Terms & Privacy: heading, subheading, isi section.
- [ ] Not Found: title + message.

### C. Halaman Layanan
- [ ] Uni/services hub: nama layanan, deskripsi, CTA, promo card.
- [ ] Outlet page: judul, deskripsi, card info, tombol, slideshow text.
- [ ] Delivery page: heading, feature badges, steps, CTA.
- [ ] Catering page: package labels, include list labels, steps, CTA.
- [ ] Partnership page: benefit labels, package labels, CTA.

### D. Komponen Form (Semua)
- [ ] Label field.
- [ ] Placeholder.
- [ ] Helper text/hint.
- [ ] Empty-state message.
- [ ] Button text (submit/save/cancel/close).
- [ ] Toast sukses/gagal.
- [ ] Validasi form (error messages).
- [ ] Confirm dialog text.

### E. Area Admin
- [ ] Login admin (title, desc, placeholder, submit/loading/error).
- [ ] Admin dashboard (title, card labels, stats labels, CTA).
- [ ] Admin reservations (tab/filter, empty state, update status feedback).
- [ ] Admin users (dialog create user, role selector labels, delete confirmation).
- [ ] Admin campaigns (upload form, drag-drop text, validation text, status buttons).

### F. Atribut Aksesibilitas dan Minor Text
- [ ] `aria-label` yang terlihat user contextually (menu/close/navigation).
- [ ] Teks status loading.
- [ ] Teks fallback pada komponen yang gagal memuat data.

## Rekomendasi Workflow Audit Cepat (Sekali Jalan)

1. Set bahasa `ID`, jalankan checklist A-F.
2. Set bahasa `EN`, ulangi checklist A-F.
3. Uji 3 role admin secara terpisah:
   - `admin_main`
   - `admin_cikarang`
   - `admin_bintaro`
4. Catat temuan dengan format:
   - `Halaman`
   - `Elemen`
   - `Bahasa`
   - `Expected`
   - `Actual`
   - `Severity`

Dengan format ini, revisi jadi terstruktur dan bisa ditutup dalam satu putaran.
