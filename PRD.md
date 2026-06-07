# Product Requirements Document (PRD)

# Personal Gym App

## 1. Ringkasan Produk

Personal Gym App adalah aplikasi yang digunakan secara pribadi untuk membantu pengguna mengatur latihan, mencatat aktivitas workout, memantau perkembangan tubuh, mengelola target fitness, dan menjaga konsistensi olahraga.

Aplikasi ini tidak ditujukan untuk gym komersial, admin gym, trainer, membership, atau sistem pembayaran. Fokus utama aplikasi adalah membantu satu pengguna mengelola perjalanan fitness pribadinya secara sederhana, terstruktur, dan mudah digunakan.

---

## 2. Tujuan Produk

Tujuan utama Personal Gym App adalah:

1. Membantu pengguna membuat dan mengikuti jadwal latihan.
2. Membantu pengguna mencatat workout harian.
3. Membantu pengguna memantau progress tubuh dan kekuatan.
4. Membantu pengguna membangun kebiasaan olahraga yang konsisten.
5. Memberikan insight sederhana dari data latihan dan progress pengguna.

---

## 3. Target Pengguna

### Pengguna Personal

Aplikasi ini ditujukan untuk individu yang ingin mengatur latihan gym secara mandiri.

Contoh pengguna:

* Pemula yang baru mulai gym.
* Orang yang ingin menurunkan berat badan.
* Orang yang ingin membentuk otot.
* Orang yang ingin menjaga kebugaran.
* Orang yang ingin mencatat progress latihan secara rapi.

---

## 4. Masalah yang Ingin Diselesaikan

Pengguna sering mengalami masalah seperti:

* Bingung harus latihan apa setiap hari.
* Tidak memiliki jadwal workout yang terstruktur.
* Catatan latihan masih manual di notes atau kertas.
* Sulit melihat perkembangan beban, repetisi, dan kekuatan.
* Sulit memantau perubahan berat badan dan ukuran tubuh.
* Tidak konsisten karena tidak ada reminder atau target yang jelas.
* Tidak tahu apakah progress latihan meningkat atau stagnan.

---

## 5. Ruang Lingkup Produk

### 5.1 Scope MVP

Fitur yang termasuk dalam MVP:

1. Onboarding pengguna
2. Profil fitness pribadi
3. Goal setting
4. Workout plan
5. Exercise library
6. Workout tracker
7. Progress tracking
8. Personal record tracking
9. Reminder latihan
10. Dashboard personal

---

### 5.2 Out of Scope MVP

Fitur yang belum termasuk MVP:

* Membership gym
* Payment
* QR check-in
* Admin dashboard
* Trainer dashboard
* Booking kelas
* Booking personal trainer
* Chat dengan trainer
* Multi-user management
* Marketplace
* AI form analysis dari video
* Integrasi wearable device

---

## 6. User Persona

### 6.1 Persona Utama

**Nama:** Raka
**Usia:** 24 tahun
**Level:** Pemula
**Tujuan:** Menurunkan berat badan dan mulai rutin olahraga

**Kebutuhan:**

* Jadwal latihan yang mudah diikuti.
* Panduan gerakan olahraga.
* Catatan workout sederhana.
* Progress berat badan.
* Reminder agar tidak lupa latihan.

---

### 6.2 Persona Tambahan

**Nama:** Dina
**Usia:** 29 tahun
**Level:** Intermediate
**Tujuan:** Meningkatkan massa otot dan strength

**Kebutuhan:**

* Catatan set, repetisi, dan beban.
* Riwayat latihan.
* Tracking personal record.
* Grafik peningkatan beban.
* Program latihan mingguan.

---

## 7. User Journey

### 7.1 Journey Pengguna Baru

1. Pengguna membuka aplikasi.
2. Pengguna melakukan onboarding.
3. Pengguna mengisi profil fitness.
4. Pengguna memilih tujuan fitness.
5. Sistem membuat atau menampilkan workout plan dasar.
6. Pengguna melihat jadwal latihan hari ini.
7. Pengguna melakukan latihan.
8. Pengguna mencatat set, repetisi, dan beban.
9. Pengguna menyelesaikan workout.
10. Pengguna melihat ringkasan workout dan progress.

---

### 7.2 Journey Pengguna Harian

1. Pengguna menerima reminder latihan.
2. Pengguna membuka dashboard.
3. Pengguna melihat workout hari ini.
4. Pengguna membuka detail exercise.
5. Pengguna mencatat latihan.
6. Pengguna menyelesaikan workout.
7. Sistem menyimpan riwayat workout.
8. Pengguna melihat progress dan personal record.

---

## 8. Fitur Produk

---

## 8.1 Onboarding

### Deskripsi

Fitur awal untuk mengenal kondisi, tujuan, dan preferensi latihan pengguna.

### Requirement

Pengguna dapat mengisi:

* Nama
* Umur
* Gender
* Tinggi badan
* Berat badan
* Level latihan
* Tujuan fitness
* Frekuensi latihan per minggu
* Lokasi latihan: gym atau rumah
* Alat yang tersedia

### Acceptance Criteria

* Pengguna dapat menyelesaikan onboarding.
* Data onboarding tersimpan.
* Sistem dapat menggunakan data onboarding untuk menyesuaikan workout plan.
* Pengguna dapat melewati onboarding dan mengisi nanti.

---

## 8.2 Profil Fitness

### Deskripsi

Fitur untuk menyimpan informasi dasar dan data fitness pengguna.

### Requirement

Pengguna dapat melihat dan mengubah:

* Nama
* Umur
* Gender
* Tinggi badan
* Berat badan
* Target berat badan
* Level latihan
* Tujuan fitness
* Preferensi latihan

### Acceptance Criteria

* Pengguna dapat melihat profil fitness.
* Pengguna dapat mengubah data profil.
* Perubahan data tersimpan.
* Data profil digunakan untuk progress tracking.

---

## 8.3 Goal Setting

### Deskripsi

Fitur untuk menentukan target fitness pribadi.

### Requirement

Pengguna dapat memilih target:

* Menurunkan berat badan
* Menambah massa otot
* Meningkatkan kekuatan
* Menjaga kebugaran
* Meningkatkan stamina

Pengguna dapat menentukan:

* Target berat badan
* Target frekuensi latihan per minggu
* Target durasi latihan
* Target tanggal pencapaian
* Target personal record

### Acceptance Criteria

* Pengguna dapat membuat goal baru.
* Pengguna dapat mengubah goal.
* Sistem menampilkan progress menuju goal.
* Goal muncul di dashboard personal.

---

## 8.4 Dashboard Personal

### Deskripsi

Halaman utama yang menampilkan ringkasan aktivitas dan progress pengguna.

### Requirement

Dashboard menampilkan:

* Workout hari ini
* Jadwal latihan minggu ini
* Streak latihan
* Progress berat badan
* Total workout minggu ini
* Personal record terbaru
* Reminder goal
* Ringkasan progress

### Acceptance Criteria

* Pengguna dapat melihat ringkasan fitness secara cepat.
* Data dashboard diperbarui berdasarkan aktivitas terbaru.
* Pengguna dapat membuka detail workout dari dashboard.
* Dashboard tetap informatif walaupun data masih sedikit.

---

## 8.5 Workout Plan

### Deskripsi

Fitur untuk menyediakan rencana latihan harian atau mingguan, termasuk saran otomatis berdasarkan profil fitness pengguna.

### Requirement

Pengguna dapat:

* Melihat workout plan harian.
* Melihat workout plan mingguan.
* Membuat workout plan sendiri.
* Mengedit workout plan.
* Menghapus workout plan.
* Menandai workout sebagai selesai.
* Mendapatkan saran workout plan otomatis berdasarkan profil fitness.
* Meninjau saran workout plan sebelum diterapkan.
* Mengedit exercise dalam saran sebelum menyimpan.

Workout plan berisi:

* Nama plan
* Hari latihan
* Daftar exercise
* Jumlah set
* Jumlah repetisi
* Target beban
* Estimasi durasi
* Rest time
* Catatan latihan

### Workout Plan Suggestion

Sistem dapat memberikan saran workout plan berdasarkan data profil fitness pengguna:

* **Goal**: saran disesuaikan dengan tujuan fitness (turun berat badan, naik otot, naik kekuatan, jaga kebugaran, naik stamina).
* **Frekuensi**: jumlah hari latihan per minggu digunakan untuk memilih template frekuensi terdekat (2-4x/minggu).
* **Template**: setiap goal memiliki template exercise yang sudah ditentukan, dengan variasi frekuensi latihan.

#### Alur Saran

1. Pengguna menekan tombol "💡 Saran" di halaman Workout Plan.
2. Frontend memanggil `POST /api/workout-plans/preview`.
3. Backend membaca profil fitness, memilih template berdasarkan goal & frekuensi, mengembalikan daftar plan yang disarankan.
4. Modal preview muncul menampilkan seluruh plan + exercise.
5. Pengguna dapat mengedit exercise (ganti exercise, ubah sets/reps/weight, tambah/hapus exercise).
6. Pengguna menekan "Terapkan" → memanggil `POST /api/workout-plans/suggest`.
7. Backend menghapus semua plan lama, menyimpan plan baru beserta exercise-nya.
8. Halaman reload menampilkan plan yang baru disimpan.

### Acceptance Criteria

* Pengguna dapat melihat workout plan.
* Pengguna dapat membuat workout plan manual.
* Pengguna dapat mengubah isi workout plan.
* Pengguna dapat menyelesaikan workout dari plan.
* Workout yang selesai masuk ke riwayat latihan.
* Pengguna dapat meminta saran workout plan otomatis.
* Pengguna dapat meninjau saran dalam modal preview.
* Pengguna dapat mengedit exercise dalam saran sebelum menyimpan.
* Pengguna dapat menerapkan atau membatalkan saran.
* Saran mempertimbangkan goal, frekuensi, level, lokasi, dan alat pengguna.

---

## 8.6 Exercise Library

### Deskripsi

Fitur berisi daftar gerakan olahraga dan instruksi latihan.

### Requirement

Exercise library berisi:

* Nama exercise
* Kategori otot
* Alat yang digunakan
* Tingkat kesulitan
* Instruksi gerakan
* Tips keselamatan
* Gambar atau video tutorial
* Otot utama yang dilatih
* Otot pendukung

Kategori exercise:

* Chest
* Back
* Shoulder
* Arms
* Legs
* Core
* Cardio
* Full body
* Mobility

### Acceptance Criteria

* Pengguna dapat melihat daftar exercise.
* Pengguna dapat mencari exercise.
* Pengguna dapat filter berdasarkan otot.
* Pengguna dapat filter berdasarkan alat.
* Pengguna dapat membuka detail exercise.
* Exercise dapat ditambahkan ke workout plan.

---

## 8.7 Workout Tracker

### Deskripsi

Fitur untuk mencatat latihan yang dilakukan pengguna.

### Requirement

Pengguna dapat mencatat:

* Nama workout
* Tanggal workout
* Exercise
* Jumlah set
* Jumlah repetisi
* Berat beban
* Durasi latihan
* Rest time
* RPE atau tingkat kesulitan
* Catatan tambahan

Pengguna dapat:

* Menambahkan log workout.
* Mengedit log workout.
* Menghapus log workout.
* Melihat riwayat workout.
* Mengulang workout sebelumnya.

### Acceptance Criteria

* Pengguna dapat mencatat workout dengan mudah.
* Data workout tersimpan berdasarkan tanggal.
* Pengguna dapat melihat riwayat workout.
* Pengguna dapat mengedit catatan workout.
* Sistem dapat menghitung total volume latihan.

---

## 8.8 Personal Record Tracking

### Deskripsi

Fitur untuk mencatat dan menampilkan pencapaian terbaik pengguna dalam latihan.

### Requirement

Sistem dapat mendeteksi:

* Beban tertinggi untuk exercise tertentu.
* Repetisi terbanyak untuk exercise tertentu.
* Volume tertinggi untuk exercise tertentu.
* Durasi cardio terbaik.
* Jarak cardio terjauh.

Contoh personal record:

* Bench Press: 60 kg x 5 reps
* Squat: 80 kg x 3 reps
* Treadmill: 5 km
* Plank: 2 menit

### Acceptance Criteria

* Sistem dapat menampilkan personal record.
* Sistem memperbarui personal record saat pengguna mencatat pencapaian baru.
* Pengguna dapat melihat daftar personal record berdasarkan exercise.
* Pengguna mendapat notifikasi sederhana saat memecahkan record.

---

## 8.9 Progress Tracking

### Deskripsi

Fitur untuk memantau perkembangan tubuh dan performa pengguna.

### Requirement

Pengguna dapat mencatat:

* Berat badan
* Lingkar dada
* Lingkar pinggang
* Lingkar lengan
* Lingkar paha
* Body fat percentage
* Foto progress
* Catatan kondisi tubuh

Sistem menampilkan:

* Grafik berat badan
* Grafik body measurement
* Grafik volume latihan
* Grafik personal record
* Riwayat progress berdasarkan tanggal

### Acceptance Criteria

* Pengguna dapat menambahkan data progress.
* Pengguna dapat melihat grafik progress.
* Pengguna dapat upload foto progress.
* Data progress tersimpan berdasarkan tanggal.
* Pengguna dapat membandingkan progress antar periode.

---

## 8.10 Reminder Latihan

### Deskripsi

Fitur pengingat agar pengguna tetap konsisten latihan.

### Requirement

Pengguna dapat mengatur:

* Hari reminder
* Jam reminder
* Jenis reminder
* Reminder workout
* Reminder update berat badan
* Reminder progress photo

### Acceptance Criteria

* Pengguna dapat mengaktifkan dan menonaktifkan reminder.
* Pengguna menerima reminder sesuai jadwal.
* Pengguna dapat mengubah jadwal reminder.
* Reminder tidak muncul jika dinonaktifkan.

---

## 8.11 Workout History

### Deskripsi

Fitur untuk melihat riwayat latihan yang sudah dilakukan.

### Requirement

Workout history menampilkan:

* Tanggal latihan
* Nama workout
* Daftar exercise
* Total set
* Total reps
* Total volume
* Durasi workout
* Catatan workout

Pengguna dapat:

* Filter berdasarkan tanggal.
* Filter berdasarkan exercise.
* Membuka detail workout.
* Mengulang workout sebelumnya.

### Acceptance Criteria

* Pengguna dapat melihat riwayat latihan.
* Pengguna dapat membuka detail workout.
* Pengguna dapat filter riwayat latihan.
* Pengguna dapat menggunakan workout lama sebagai template baru.

---

## 9. Fitur Lanjutan

Fitur yang dapat dikembangkan setelah MVP:

### 9.1 Nutrition Tracking

* Catat makanan harian
* Hitung kalori
* Hitung protein, karbohidrat, dan lemak
* Target kalori harian
* Water intake tracker
* Riwayat konsumsi makanan

### 9.2 Habit Tracking

* Streak olahraga
* Target langkah harian
* Target tidur
* Target minum air
* Checklist habit harian

### 9.3 Gamification Personal

* Badge pencapaian
* Workout streak
* Weekly challenge pribadi
* Reward pribadi
* Milestone progress

### 9.4 AI Recommendation

* Rekomendasi workout berdasarkan goal
* Penyesuaian workout berdasarkan progress
* Insight jika progress stagnan
* Saran deload week
* Rekomendasi latihan alternatif

### 9.5 Wearable Integration

* Integrasi smartwatch
* Data heart rate
* Data kalori terbakar
* Data langkah harian
* Data tidur

---

## 10. Role dan Permission

Karena aplikasi ini hanya digunakan secara personal, hanya ada satu role utama.

| Role | Permission                                                                                   |
| ---- | -------------------------------------------------------------------------------------------- |
| User | Mengelola profil, goal, workout plan, workout log, progress, reminder, dan dashboard pribadi |

---

## 11. Data yang Dibutuhkan

### 11.1 User

* User ID
* Nama
* Email
* Password
* Created date
* Last login

### 11.2 Fitness Profile

* Profile ID
* User ID
* Umur
* Gender
* Tinggi badan
* Berat badan
* Target berat badan
* Level latihan
* Tujuan fitness
* Frekuensi latihan

### 11.3 Goal

* Goal ID
* User ID
* Goal type
* Target value
* Current value
* Start date
* Target date
* Status

### 11.4 Exercise

* Exercise ID
* Nama exercise
* Kategori otot
* Alat
* Tingkat kesulitan
* Instruksi
* Tips
* Media URL

### 11.5 Workout Plan

* Plan ID
* User ID
* Plan name
* Day schedule
* Exercise list
* Estimated duration
* Status

### 11.6 Workout Log

* Log ID
* User ID
* Workout date
* Exercise ID
* Set number
* Repetition
* Weight
* Duration
* Rest time
* RPE
* Notes

### 11.7 Progress

* Progress ID
* User ID
* Date
* Weight
* Chest measurement
* Waist measurement
* Arm measurement
* Thigh measurement
* Body fat percentage
* Progress photo URL
* Notes

### 11.8 Reminder

* Reminder ID
* User ID
* Reminder type
* Day
* Time
* Status

---

## 12. Non-Functional Requirements

### 12.1 Performance

* Aplikasi harus dapat membuka dashboard dalam waktu maksimal 3 detik.
* Proses menyimpan workout log maksimal 2 detik.
* Grafik progress harus dapat dimuat dengan cepat.

### 12.2 Security

* Password harus disimpan menggunakan hashing.
* Data pribadi pengguna harus terlindungi.
* Akses data hanya untuk pemilik akun.
* API harus menggunakan authentication token.
* Foto progress harus disimpan secara aman.

### 12.3 Usability

* Interface harus sederhana dan mudah digunakan.
* Flow mencatat workout harus cepat.
* Pengguna dapat mencatat latihan saat sedang berada di gym tanpa banyak langkah.
* Tampilan grafik harus mudah dipahami.

### 12.4 Reliability

* Data workout dan progress tidak boleh hilang.
* Sistem harus memiliki backup database.
* Aplikasi tetap dapat menyimpan data dengan stabil.
* Error message harus jelas dan mudah dipahami.

### 12.5 Scalability

* Struktur sistem harus memungkinkan penambahan fitur nutrition, AI recommendation, dan wearable integration di masa depan.

---

## 13. Success Metrics

### 13.1 Product Metrics

* Jumlah workout log per minggu
* Jumlah exercise yang dicatat
* Jumlah progress update per bulan
* Frekuensi penggunaan dashboard
* Jumlah workout plan yang diselesaikan

### 13.2 Engagement Metrics

* Weekly active usage
* Workout streak
* Reminder open rate
* Jumlah personal record baru
* Jumlah pengguna yang menyelesaikan target mingguan

### 13.3 Fitness Metrics

* Perubahan berat badan
* Peningkatan total volume latihan
* Peningkatan personal record
* Konsistensi frekuensi latihan
* Progress terhadap goal utama

---

## 14. Prioritas MVP

### Phase 1: Core Personal Setup

* Onboarding
* Profil fitness
* Goal setting
* Dashboard personal

### Phase 2: Workout Management

* Exercise library
* Workout plan (manual CRUD + saran otomatis berdasarkan profil)
* Workout tracker
* Workout history

### Phase 3: Progress & Consistency

* Progress tracking
* Personal record tracking
* Reminder latihan
* Grafik progress

---

## 15. User Stories

### Story 1

Sebagai pengguna, saya ingin mengisi profil fitness agar aplikasi dapat menyesuaikan pengalaman latihan saya.

### Story 2

Sebagai pengguna, saya ingin menentukan tujuan fitness agar saya memiliki target yang jelas.

### Story 3

Sebagai pengguna, saya ingin melihat workout plan agar saya tahu latihan apa yang harus dilakukan hari ini.

### Story 4

Sebagai pengguna, saya ingin membuat workout plan sendiri agar saya dapat menyesuaikan latihan dengan kebutuhan saya.

### Story 4b

Sebagai pengguna, saya ingin mendapatkan saran workout plan otomatis berdasarkan profil dan tujuan fitness saya, agar saya tidak perlu menyusun plan dari awal.

### Story 5

Sebagai pengguna, saya ingin melihat daftar exercise agar saya dapat memahami cara melakukan gerakan dengan benar.

### Story 6

Sebagai pengguna, saya ingin mencatat set, repetisi, dan beban agar saya dapat memantau performa latihan.

### Story 7

Sebagai pengguna, saya ingin melihat riwayat workout agar saya dapat mengevaluasi latihan sebelumnya.

### Story 8

Sebagai pengguna, saya ingin melihat personal record agar saya tahu pencapaian terbaik saya.

### Story 9

Sebagai pengguna, saya ingin mencatat berat badan dan ukuran tubuh agar saya dapat melihat perubahan fisik.

### Story 10

Sebagai pengguna, saya ingin menerima reminder latihan agar saya lebih konsisten berolahraga.

---

## 16. Acceptance Criteria MVP

MVP dianggap berhasil jika:

1. Pengguna dapat melakukan onboarding.
2. Pengguna dapat mengisi dan mengubah profil fitness.
3. Pengguna dapat membuat goal fitness.
4. Pengguna dapat melihat dashboard personal.
5. Pengguna dapat melihat exercise library.
6. Pengguna dapat membuat workout plan.
7. Pengguna dapat mencatat workout.
8. Pengguna dapat melihat riwayat workout.
9. Pengguna dapat melihat personal record.
10. Pengguna dapat mencatat progress tubuh.
11. Pengguna dapat melihat grafik progress.
12. Pengguna dapat mengatur reminder latihan.

---

## 17. Risiko dan Mitigasi

| Risiko                          | Dampak                            | Mitigasi                                         |
| ------------------------------- | --------------------------------- | ------------------------------------------------ |
| Pengguna malas mencatat workout | Data progress tidak lengkap       | Buat flow input workout sesederhana mungkin      |
| Aplikasi terlalu kompleks       | Pengguna cepat berhenti memakai   | Fokus pada fitur inti dan UI sederhana           |
| Exercise library kurang lengkap | Workout plan kurang berguna       | Mulai dari exercise populer lalu tambah bertahap |
| Progress tidak terlihat cepat   | Pengguna kehilangan motivasi      | Tampilkan metrik kecil seperti streak dan PR     |
| Reminder terlalu mengganggu     | Pengguna menonaktifkan notifikasi | Berikan kontrol penuh untuk jadwal reminder      |

---

## 18. Dependencies

* Backend API
* Database
* Authentication system
* Exercise database
* Cloud storage untuk foto progress
* Push notification service
* Chart/analytics library
* Mobile app framework

---

## 19. Open Questions

1. Apakah aplikasi akan dibuat untuk mobile saja atau juga web?
2. ✅ Workout plan: manual + saran otomatis dari sistem (berdasarkan profil).
3. Apakah exercise library membutuhkan video tutorial dari awal?
4. Apakah progress photo wajib masuk MVP?
5. Apakah aplikasi perlu mode offline untuk mencatat workout di gym?
6. Apakah nutrition tracking akan masuk fase awal atau fase lanjutan?
7. Apakah pengguna ingin fitur AI recommendation sejak MVP?
8. Apakah aplikasi akan mendukung bahasa Indonesia saja atau multi-language?

---

## 20. Kesimpulan

Personal Gym App berfokus pada kebutuhan individu untuk mengatur latihan, mencatat workout, memantau progress, dan menjaga konsistensi olahraga.

Pada tahap MVP, fokus utama aplikasi adalah onboarding, profil fitness, goal setting, workout plan, exercise library, workout tracker, progress tracking, personal record, reminder, dan dashboard personal.

Fitur seperti nutrition tracking, habit tracking, gamification, AI recommendation, dan wearable integration dapat dikembangkan setelah MVP berjalan.
