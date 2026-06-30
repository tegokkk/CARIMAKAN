# Plan Rombak Besar CARIMAKAN

## 1. Tujuan Perubahan

CARIMAKAN akan dirombak dari aplikasi pemesanan makanan biasa menjadi platform dengan 3 jenis pengguna:

1. Admin
2. Toko atau Merchant
3. User atau Pelanggan

Konsep barunya adalah:

```text
Admin = pengelola sistem web CARIMAKAN
Merchant = pemilik toko/restoran yang menjual makanan
Customer = pelanggan yang mencari dan memesan makanan
```

Dengan alur ini, aplikasi menjadi lebih realistis seperti marketplace makanan. Admin tidak lagi menjadi satu-satunya pengelola semua restoran dan menu. Toko atau merchant memiliki area sendiri untuk mengelola restoran, menu, dan pesanan.

## 2. Role Baru

### Admin

Admin adalah pengelola utama sistem CARIMAKAN.

Tugas admin:

- Mengelola user.
- Mengelola merchant.
- Mengelola kategori global.
- Melihat semua restoran.
- Menyetujui atau menolak restoran/merchant.
- Menonaktifkan restoran atau user bermasalah.
- Memantau semua pesanan di sistem.
- Melihat statistik global aplikasi.

### Merchant / Toko

Merchant adalah pemilik restoran atau toko makanan.

Tugas merchant:

- Mendaftar sebagai toko.
- Membuat profil restoran.
- Mengedit data restoran miliknya.
- Menambahkan menu makanan.
- Mengedit atau menghapus menu miliknya.
- Melihat pesanan yang masuk ke restorannya.
- Mengubah status pesanan.
- Melihat riwayat pesanan.
- Melihat review dari pelanggan.

### Customer / Pelanggan

Customer adalah pengguna yang membeli makanan.

Tugas customer:

- Register dan login.
- Melihat restoran.
- Mencari makanan.
- Melihat detail menu.
- Menambahkan makanan ke cart.
- Checkout.
- Melihat status pesanan.
- Melihat riwayat pesanan.
- Memberikan review dan rating.
- Menyimpan menu favorit.

## 3. Alur Sistem Baru

### Alur Admin

```text
Login admin
-> Masuk dashboard admin
-> Kelola user dan merchant
-> Verifikasi restoran/toko
-> Kelola kategori global
-> Pantau semua pesanan
-> Nonaktifkan data bermasalah jika diperlukan
```

### Alur Merchant

```text
Register/login sebagai merchant
-> Buat profil restoran
-> Menunggu approval admin jika sistem memakai verifikasi
-> Tambahkan menu makanan
-> Menerima pesanan dari customer
-> Update status pesanan
-> Pantau riwayat pesanan dan review
```

### Alur Customer

```text
Register/login sebagai customer
-> Cari restoran atau menu
-> Buka detail makanan
-> Tambahkan ke cart
-> Checkout
-> Pesanan masuk ke merchant
-> Merchant update status pesanan
-> Customer melihat status pesanan
-> Customer memberi review
```

## 4. Perubahan Database

### User

Role user perlu diubah dari:

```text
user
admin
```

menjadi:

```text
admin
merchant
customer
```

Contoh field:

```text
User
- id
- name
- email
- password
- phone
- role
- avatar
- createdAt
- updatedAt
```

### Restaurant

Restaurant perlu memiliki pemilik atau merchant.

Tambahan field yang disarankan:

```text
Restaurant
- id
- ownerId / merchantId
- name
- slug
- description
- address
- city
- phone
- image
- rating
- status
- isActive
- createdAt
- updatedAt
```

Status restoran:

```text
pending
approved
rejected
suspended
```

Relasi:

```text
User merchant -> memiliki banyak Restaurant
Restaurant -> memiliki banyak Menu
Menu -> memiliki banyak OrderItem
Customer -> memiliki banyak Order
```

### Menu (Tambahan Detail)

```text
Menu
- id
- restaurantId
- categoryId (optional/global)
- name
- description
- price
- image
- isAvailable
- createdAt
- updatedAt
```

### Order & OrderItem (Tambahan Detail)

```text
Order
- id
- customerId
- restaurantId
- totalAmount
- paymentMethod (CASH, TRANSFER, E-WALLET, QRIS)
- paymentStatus (PENDING, PAID, FAILED)
- status (pending, accepted, processing, ready, done, cancelled)
- deliveryAddress (jika ada pengantaran)
- createdAt
- updatedAt

OrderItem
- id
- orderId
- menuId
- quantity
- price
- notes
```

### Order

Untuk tahap awal, rekomendasi alur order dibuat sederhana:

```text
Satu checkout hanya boleh berisi menu dari satu restoran.
```

Alasan:

- Lebih mudah dipahami.
- Lebih mudah diimplementasikan.
- Merchant bisa langsung melihat pesanan yang memang milik restorannya.
- Cocok untuk presentasi dan demo.

Jika ingin lebih kompleks di masa depan:

```text
Satu checkout bisa multi-restoran, lalu sistem memecah order berdasarkan restoran.
```

## 5. Backend Plan

Backend perlu dipisahkan berdasarkan role dan tanggung jawab.

### Endpoint Admin

```text
GET    /api/admin/stats
GET    /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id

GET    /api/admin/merchants
GET    /api/admin/restaurants
PUT    /api/admin/restaurants/:id/approve
PUT    /api/admin/restaurants/:id/reject
PUT    /api/admin/restaurants/:id/suspend

GET    /api/admin/orders
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

### Endpoint Merchant

```text
GET    /api/merchant/dashboard

GET    /api/merchant/restaurants
POST   /api/merchant/restaurants
GET    /api/merchant/restaurants/:id
PUT    /api/merchant/restaurants/:id
DELETE /api/merchant/restaurants/:id

GET    /api/merchant/menus
POST   /api/merchant/menus
PUT    /api/merchant/menus/:id
DELETE /api/merchant/menus/:id

GET    /api/merchant/orders
GET    /api/merchant/orders/:id
PUT    /api/merchant/orders/:id/status

GET    /api/merchant/reviews
```

### Endpoint Customer

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/restaurants
GET    /api/restaurants/:id
GET    /api/menus
GET    /api/menus/:id

GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
DELETE /api/cart

POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id

GET    /api/favorites
POST   /api/favorites/:menuId
DELETE /api/favorites/:menuId

POST   /api/menus/:menuId/reviews
GET    /api/menus/:menuId/reviews
```

### Middleware

Middleware yang perlu dipakai atau ditambahkan:

```text
authMiddleware
roleMiddleware("admin")
roleMiddleware("merchant")
roleMiddleware("customer")
ownershipMiddleware
validateMiddleware
errorMiddleware
```

Ownership middleware penting agar merchant hanya bisa mengelola data miliknya sendiri.

Contoh aturan:

```text
Merchant A tidak boleh edit restoran milik Merchant B.
Merchant A tidak boleh edit menu milik Merchant B.
Merchant A hanya melihat pesanan dari restorannya sendiri.
```

## 6. Frontend Plan

Frontend akan dibagi menjadi 3 area utama.

### Public / Customer Area

Route:

```text
/
/search
/restaurants
/restaurant/:id
/menu/:id
/cart
/checkout
/orders
/orders/:id
/favorites
/profile
```

Fitur:

- Home.
- Search menu.
- Detail restoran.
- Detail menu.
- Cart.
- Checkout.
- Riwayat pesanan.
- Favorite.
- Review.

### Admin Area

Route:

```text
/admin
/admin/users
/admin/merchants
/admin/restaurants
/admin/categories
/admin/orders
```

Fitur:

- Dashboard admin.
- Kelola user.
- Kelola merchant.
- Verifikasi restoran.
- Kelola kategori.
- Pantau order global.

### Merchant Area

Route:

```text
/merchant
/merchant/restaurants
/merchant/menus
/merchant/orders
/merchant/reviews
/merchant/profile
```

Fitur:

- Dashboard merchant.
- Kelola restoran milik sendiri.
- Kelola menu milik sendiri.
- Melihat pesanan masuk.
- Update status pesanan.
- Cetak struk pesanan (Format PDF atau Thermal).
- Melihat review.
- Edit profil toko.

## 7. Register dan Login Baru

Register perlu mendukung pilihan role.

Pilihan register:

```text
Daftar sebagai Pelanggan
Daftar sebagai Toko
```

Rekomendasi:

```text
Customer register -> langsung aktif
Merchant register -> bisa login, tetapi restoran menunggu approval admin
```

Setelah login, redirect berdasarkan role:

```text
admin -> /admin
merchant -> /merchant
customer -> /
```

## 8. Alur Pesanan Baru

### Customer Checkout

```text
Customer memilih menu
-> Masuk cart
-> Checkout
-> Backend validasi semua item berasal dari satu restoran
-> Order dibuat
-> Order masuk ke dashboard merchant
```

### Merchant Mengelola Pesanan

Status pesanan yang disarankan:

```text
pending
accepted
processing
ready
done
cancelled
```

Alur:

```text
Pesanan masuk
-> Merchant menerima pesanan
-> Merchant memproses pesanan
-> Pesanan siap
-> Pesanan selesai
```

### Customer Melihat Status

Customer bisa melihat status dari halaman:

```text
/orders
/orders/:id
```

### Sistem Pembayaran (Rekomendasi Tahap Awal)

Untuk tahap awal, sistem pembayaran sebaiknya dibuat sederhana agar tidak memperumit alur:

```text
1. Cash / Bayar di Tempat (COD): Pelanggan membayar langsung saat mengambil pesanan atau saat diantar.
2. Transfer Manual: Pelanggan transfer ke rekening Merchant atau rekening Admin (tergantung kebijakan platform).
3. QRIS Palsu (Dummy): Menampilkan gambar QR Code dummy saat pelanggan checkout. Pelanggan melakukan simulasi pembayaran (misal: klik tombol "Simulasikan Bayar") agar status pesanan otomatis berubah jadi PAID.
```

*Catatan: Jika menggunakan rekening Admin (Escrow), perlu dipikirkan fitur penarikan saldo (Withdrawal) untuk Merchant di masa depan. Untuk MVP, disarankan pembayaran langsung ke Merchant atau COD.*


## 9. Urutan Implementasi

### Tahap 1 - Persiapan

- Buat branch baru.
- Backup database jika perlu.
- Catat fitur lama yang masih dipakai.
- Pastikan build frontend dan backend masih aman sebelum mulai rombak.

### Tahap 2 - Database

- Ubah enum role menjadi `admin`, `merchant`, `customer`.
- Tambahkan `ownerId` atau `merchantId` di tabel `Restaurant`.
- Tambahkan status approval restoran.
- Update relasi Prisma.
- Buat migration.
- Update seed user:
  - admin
  - merchant
  - customer

### Tahap 3 - Backend Role dan Auth

- Update auth service agar register mendukung role customer/merchant.
- Update JWT payload jika diperlukan.
- Update role middleware.
- Tambahkan ownership validation.
- Pastikan admin, merchant, dan customer punya akses berbeda.

### Tahap 4 - Backend Merchant

- Buat route merchant.
- Buat controller merchant.
- Merchant bisa CRUD restoran miliknya.
- Merchant bisa CRUD menu miliknya.
- Merchant bisa melihat order miliknya.
- Merchant bisa update status pesanan.

### Tahap 5 - Backend Admin

- Admin melihat semua merchant.
- Admin approve/reject/suspend restoran.
- Admin melihat semua pesanan.
- Admin tetap mengelola kategori global.
- Admin bisa mengelola user.

### Tahap 6 - Frontend Auth

- Update halaman register dengan pilihan customer/merchant.
- Update redirect setelah login.
- Update ProtectedRoute untuk role baru.
- Update navbar agar menyesuaikan role.

### Tahap 7 - Frontend Merchant

- Buat `MerchantLayout`.
- Buat dashboard merchant.
- Buat halaman kelola restoran.
- Buat halaman kelola menu.
- Buat halaman pesanan masuk.
- Buat halaman review.

### Tahap 8 - Frontend Admin

- Update admin dashboard agar fokus ke sistem.
- Tambahkan halaman merchant.
- Tambahkan halaman approval restoran.
- Sesuaikan halaman restoran agar admin tidak bertindak sebagai pemilik toko.

### Tahap 9 - Customer Flow

- Pastikan customer bisa melihat restoran approved saja.
- Pastikan customer hanya bisa checkout menu dari restoran aktif.
- Tambahkan validasi cart satu restoran.
- Pastikan order masuk ke merchant yang benar.

### Tahap 10 - Testing

Test minimal:

```text
Admin login
Merchant register
Merchant buat restoran
Admin approve restoran
Merchant tambah menu
Customer register
Customer pesan menu
Merchant melihat pesanan masuk
Merchant update status pesanan
Customer melihat status pesanan berubah
Customer memberi review
Admin melihat semua aktivitas
```

## 10. Risiko dan Solusi

### Risiko 1 - Data lama belum punya owner

Solusi:

```text
Buat default merchant untuk restoran lama.
Assign semua restoran lama ke merchant tersebut.
```

### Risiko 2 - Cart multi-restoran terlalu kompleks

Solusi:

```text
Untuk tahap awal, batasi cart hanya satu restoran.
Jika user menambah menu dari restoran lain, minta user mengosongkan cart dulu.
```

### Risiko 3 - Upload gambar di Netlify tidak permanen

Solusi:

```text
Gunakan URL gambar eksternal atau Supabase Storage.
Untuk tahap cepat, pakai URL gambar.
```

### Risiko 4 - Hak akses merchant bocor

Solusi:

```text
Tambahkan ownership middleware.
Selalu cek ownerId pada restoran/menu/order sebelum update/delete.
```

## 11. Target Hasil Akhir

Setelah rombak selesai, CARIMAKAN memiliki 3 dashboard/alur:

```text
Admin Dashboard
- Kelola sistem
- Kelola user
- Kelola merchant
- Verifikasi restoran
- Pantau transaksi

Merchant Dashboard
- Kelola restoran sendiri
- Kelola menu sendiri
- Terima dan proses pesanan
- Lihat review

Customer App
- Cari restoran/menu
- Pesan makanan
- Checkout
- Pantau status pesanan
- Review makanan
```

## 12. Kesimpulan

Rombakan ini membuat CARIMAKAN berubah menjadi platform food marketplace yang lebih lengkap. Dengan pembagian role admin, merchant, dan customer, alur aplikasi menjadi lebih realistis:

```text
Admin mengelola platform.
Merchant mengelola bisnis makanan.
Customer melakukan pemesanan.
```

Rencana implementasi sebaiknya dilakukan bertahap, dimulai dari database dan role, lalu backend merchant, lalu frontend dashboard merchant, kemudian penyesuaian admin dan customer flow.
