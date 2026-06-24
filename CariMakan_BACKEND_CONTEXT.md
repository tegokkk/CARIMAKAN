# PRD CariMakan — Backend Context

Dokumen ini berisi konteks khusus **Backend** untuk pengembangan website **CariMakan**. Backend dibuat sebagai pusat pengelolaan data, autentikasi, validasi, keamanan, integrasi database, dan penyedia REST API untuk frontend.

---

## 1. Ringkasan Produk

**CariMakan** adalah aplikasi website food discovery yang membantu pengguna mencari makanan, melihat detail restoran/menu, menyimpan menu favorit, mengelola keranjang, dan melakukan simulasi pemesanan.

Backend berperan sebagai service utama yang menghubungkan:

```txt
Frontend React Vite
        ↓ Axios
Backend Node.js Express
        ↓ mysql2
Database MySQL
```

Backend juga dapat mengambil data inspirasi dari **TheMealDB API**, tetapi data utama aplikasi tetap disimpan di database lokal.

---

## 2. Tujuan Backend

Backend CariMakan harus mampu:

1. Mengelola autentikasi user dan admin.
2. Mengatur role dan hak akses.
3. Mengelola data kategori makanan.
4. Mengelola data restoran.
5. Mengelola data menu/makanan.
6. Mengelola upload gambar menu dan restoran.
7. Mengelola keranjang user.
8. Mengelola checkout dan order.
9. Mengelola riwayat pesanan user.
10. Mengelola status pesanan oleh admin.
11. Mengelola fitur favorit.
12. Mengelola review dan rating.
13. Menyediakan statistik dashboard admin.
14. Mengintegrasikan TheMealDB API sebagai sumber data eksternal.
15. Menyediakan response API standar.
16. Menyediakan error handling global.
17. Menjaga struktur kode tetap rapi, modular, dan scalable.

---

## 3. Tech Stack Backend

```txt
Node.js
Express.js
MySQL
mysql2
dotenv
cors
bcrypt
jsonwebtoken
multer
helmet
morgan
express-validator / zod
```

### Fungsi Setiap Teknologi

| Teknologi | Fungsi |
|---|---|
| Node.js | Runtime JavaScript untuk backend |
| Express.js | Framework REST API |
| MySQL | Database relasional |
| mysql2 | Driver koneksi Node.js ke MySQL |
| dotenv | Menyimpan konfigurasi environment |
| cors | Mengizinkan akses frontend ke backend |
| bcrypt | Hash password user |
| jsonwebtoken | Membuat dan memverifikasi JWT |
| multer | Upload gambar menu/restoran |
| helmet | Keamanan dasar HTTP header |
| morgan | Logging request API |
| express-validator / zod | Validasi request body |

---

## 4. Struktur Folder Backend

```txt
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── restaurant.controller.js
│   │   ├── menu.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── favorite.controller.js
│   │   ├── admin.controller.js
│   │   └── external.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── menu.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── review.routes.js
│   │   ├── favorite.routes.js
│   │   ├── admin.routes.js
│   │   └── external.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── menu.service.js
│   │   ├── order.service.js
│   │   └── externalMeal.service.js
│   │
│   ├── utils/
│   │   ├── response.js
│   │   ├── generateToken.js
│   │   ├── slugify.js
│   │   └── pagination.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/
├── package.json
└── .env
```

---

## 5. Environment Backend

File `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=carimakan_db
DB_PORT=3306

JWT_SECRET=carimakan_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads
```

---

## 6. Database Design

### 6.1 Database

```sql
CREATE DATABASE carimakan_db;
USE carimakan_db;
```

---

### 6.2 Tabel `users`

Menyimpan data pengguna dan admin.

```txt
id
name
email
password
phone
role: user/admin
avatar
created_at
updated_at
```

Relasi:

- Satu user bisa memiliki banyak cart item.
- Satu user bisa memiliki banyak order.
- Satu user bisa memiliki banyak favorite.
- Satu user bisa memiliki banyak review.

---

### 6.3 Tabel `restaurants`

Menyimpan data restoran.

```txt
id
name
slug
description
address
city
phone
image
rating
is_active
created_at
updated_at
```

Relasi:

- Satu restoran memiliki banyak menu.

---

### 6.4 Tabel `categories`

Menyimpan kategori makanan.

```txt
id
name
slug
description
created_at
updated_at
```

Relasi:

- Satu kategori memiliki banyak menu.

---

### 6.5 Tabel `menus`

Menyimpan data makanan/menu.

```txt
id
restaurant_id
category_id
name
slug
description
price
image
rating
stock
is_recommended
is_active
created_at
updated_at
```

Relasi:

- Menu dimiliki oleh satu restoran.
- Menu masuk ke satu kategori.
- Menu bisa masuk cart.
- Menu bisa masuk order item.
- Menu bisa diberi review.
- Menu bisa difavoritkan user.

---

### 6.6 Tabel `carts`

Menyimpan keranjang user login.

```txt
id
user_id
menu_id
quantity
created_at
updated_at
```

---

### 6.7 Tabel `orders`

Menyimpan transaksi checkout.

```txt
id
user_id
order_code
total_price
status: pending/paid/process/done/cancelled
payment_method
customer_name
customer_phone
delivery_address
notes
created_at
updated_at
```

---

### 6.8 Tabel `order_items`

Menyimpan detail item pesanan.

```txt
id
order_id
menu_id
quantity
price
subtotal
created_at
updated_at
```

Catatan: `price` harus menyimpan harga saat checkout agar riwayat pesanan tidak berubah saat harga menu diubah admin.

---

### 6.9 Tabel `favorites`

Menyimpan menu favorit user.

```txt
id
user_id
menu_id
created_at
```

---

### 6.10 Tabel `reviews`

Menyimpan review dan rating menu.

```txt
id
user_id
menu_id
rating
comment
created_at
updated_at
```

---

## 7. Standard Response API

### 7.1 Response Sukses

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {},
  "pagination": null
}
```

### 7.2 Response Error

```json
{
  "success": false,
  "message": "Data tidak ditemukan",
  "errors": []
}
```

---

## 8. API Contract

### 8.1 Auth API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user/admin | Public |
| GET | `/api/auth/me` | Ambil data user login | User/Admin |
| POST | `/api/auth/logout` | Logout | User/Admin |

Payload register:

```json
{
  "name": "Tego Saputra",
  "email": "tego@mail.com",
  "password": "password123",
  "phone": "08123456789"
}
```

Payload login:

```json
{
  "email": "tego@mail.com",
  "password": "password123"
}
```

---

### 8.2 Category API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/categories` | List kategori | Public |
| POST | `/api/categories` | Tambah kategori | Admin |
| PUT | `/api/categories/:id` | Update kategori | Admin |
| DELETE | `/api/categories/:id` | Hapus kategori | Admin |

---

### 8.3 Restaurant API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/restaurants` | List restoran | Public |
| GET | `/api/restaurants/:id` | Detail restoran | Public |
| POST | `/api/restaurants` | Tambah restoran | Admin |
| PUT | `/api/restaurants/:id` | Update restoran | Admin |
| DELETE | `/api/restaurants/:id` | Hapus restoran | Admin |

---

### 8.4 Menu API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/menus` | List menu + search/filter | Public |
| GET | `/api/menus/:id` | Detail menu | Public |
| GET | `/api/menus/recommended` | Menu rekomendasi | Public |
| POST | `/api/menus` | Tambah menu | Admin |
| PUT | `/api/menus/:id` | Update menu | Admin |
| DELETE | `/api/menus/:id` | Hapus menu | Admin |

Query list menu:

```txt
/api/menus?search=nasi&category=1&minPrice=10000&maxPrice=50000&rating=4&sort=popular&page=1&limit=12
```

---

### 8.5 Cart API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/cart` | Ambil cart user | User |
| POST | `/api/cart` | Tambah item ke cart | User |
| PUT | `/api/cart/:id` | Update quantity | User |
| DELETE | `/api/cart/:id` | Hapus item | User |
| DELETE | `/api/cart` | Kosongkan cart | User |

Payload add cart:

```json
{
  "menu_id": 1,
  "quantity": 2
}
```

---

### 8.6 Order API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | `/api/orders` | Checkout | User |
| GET | `/api/orders/my` | Riwayat order user | User |
| GET | `/api/orders` | Semua order | Admin |
| GET | `/api/orders/:id` | Detail order | User/Admin |
| PUT | `/api/orders/:id/status` | Update status order | Admin |

Payload checkout:

```json
{
  "customer_name": "Tego Saputra",
  "customer_phone": "08123456789",
  "delivery_address": "Bandar Lampung",
  "payment_method": "COD",
  "notes": "Tidak pedas"
}
```

---

### 8.7 Favorite API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/favorites` | List favorit user | User |
| POST | `/api/favorites/:menuId` | Tambah favorit | User |
| DELETE | `/api/favorites/:menuId` | Hapus favorit | User |

---

### 8.8 Review API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/menus/:menuId/reviews` | Review menu | Public |
| POST | `/api/menus/:menuId/reviews` | Tambah review | User |
| DELETE | `/api/reviews/:id` | Hapus review | User/Admin |

---

### 8.9 External Meal API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/external/meals/search?query=chicken` | Cari data TheMealDB | Public |
| GET | `/api/external/meals/:id` | Detail meal TheMealDB | Public |
| POST | `/api/external/meals/import/:id` | Import meal ke database lokal | Admin |

---

### 8.10 Admin API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/admin/stats` | Statistik dashboard admin | Admin |

Data statistik:

```json
{
  "totalUsers": 100,
  "totalRestaurants": 15,
  "totalMenus": 80,
  "totalOrders": 200,
  "totalRevenue": 2500000,
  "latestOrders": [],
  "popularMenus": []
}
```

---

## 9. Development Task Backend per Modul

### Modul Backend 1 — Project Initialization

Task:

- Buat folder `backend`.
- Inisialisasi Node.js.
- Install dependencies.
- Buat struktur folder MVC.
- Buat `app.js` dan `server.js`.
- Buat koneksi database.
- Buat endpoint `/api/health`.
- Buat response helper.
- Buat error handler global.

Acceptance criteria:

- Backend berjalan di `localhost:5000`.
- Database terkoneksi.
- Endpoint `/api/health` mengembalikan status sukses.

---

### Modul Backend 2 — Auth & User Management

Task:

- Buat tabel `users`.
- Buat register controller.
- Buat login controller.
- Hash password dengan bcrypt.
- Generate JWT.
- Buat middleware auth.
- Buat middleware role admin.
- Buat endpoint `/api/auth/me`.

Acceptance criteria:

- User bisa register.
- User bisa login.
- Admin bisa login.
- Token valid.
- Endpoint admin tidak bisa diakses user biasa.

---

### Modul Backend 3 — Category Management

Task:

- Buat tabel `categories`.
- Buat CRUD kategori.
- Buat slug otomatis.
- Validasi nama kategori.
- Proteksi create/update/delete hanya untuk admin.

Acceptance criteria:

- Kategori bisa ditampilkan publik.
- Admin bisa tambah/edit/hapus kategori.
- User biasa tidak bisa mengubah kategori.

---

### Modul Backend 4 — Restaurant Management

Task:

- Buat tabel `restaurants`.
- Buat CRUD restoran.
- Buat upload gambar restoran.
- Buat slug otomatis.
- Tambahkan status aktif/nonaktif.
- Buat endpoint detail restoran.

Acceptance criteria:

- Restoran tampil di API.
- Detail restoran bisa dibuka.
- Admin bisa CRUD restoran.
- Upload gambar berjalan.

---

### Modul Backend 5 — Menu/Food Management

Task:

- Buat tabel `menus`.
- Relasikan menu dengan restoran dan kategori.
- Buat CRUD menu.
- Buat upload gambar menu.
- Tambahkan search.
- Tambahkan filter kategori.
- Tambahkan filter harga.
- Tambahkan filter rating.
- Tambahkan sorting.
- Tambahkan pagination.
- Tambahkan recommended menu.

Acceptance criteria:

- Menu tampil dari database.
- Detail menu bisa dibuka.
- Search dan filter berjalan.
- Pagination berjalan.
- Admin bisa CRUD menu.

---

### Modul Backend 6 — Search & Food Discovery

Task:

- Optimasi endpoint `/api/menus`.
- Gunakan query parameter untuk search dan filter.
- Validasi query parameter.
- Tambahkan response pagination standar.

Acceptance criteria:

- Search berdasarkan keyword berjalan.
- Filter kategori/harga/rating berjalan.
- Sort popular/latest/price berjalan.
- Response memiliki pagination.

---

### Modul Backend 7 — Cart Management

Task:

- Buat tabel `carts`.
- Buat endpoint ambil cart user.
- Buat add to cart.
- Jika item sudah ada, quantity bertambah.
- Update quantity.
- Remove item.
- Clear cart.

Acceptance criteria:

- Cart hanya bisa diakses user login.
- Item bisa ditambahkan.
- Quantity bisa diubah.
- Cart bisa dikosongkan.

---

### Modul Backend 8 — Checkout & Order

Task:

- Buat tabel `orders`.
- Buat tabel `order_items`.
- Generate order code.
- Simpan data checkout.
- Simpan snapshot harga menu.
- Kosongkan cart setelah checkout.
- Buat endpoint riwayat order user.
- Buat endpoint order admin.
- Buat update status order.

Acceptance criteria:

- User bisa checkout.
- Order tersimpan.
- Cart kosong setelah checkout.
- User bisa melihat riwayat order.
- Admin bisa mengubah status order.

---

### Modul Backend 9 — Favorite

Task:

- Buat tabel `favorites`.
- Tambah menu ke favorit.
- Hapus menu dari favorit.
- Tampilkan list favorit user.
- Cegah duplicate favorite.

Acceptance criteria:

- User bisa menyimpan menu favorit.
- User bisa menghapus menu favorit.
- Data favorit tidak duplicate.

---

### Modul Backend 10 — Review & Rating

Task:

- Buat tabel `reviews`.
- Buat endpoint list review menu.
- Buat endpoint tambah review.
- Batasi satu user satu review per menu.
- Hitung rata-rata rating menu.
- Admin bisa menghapus review bermasalah.

Acceptance criteria:

- Review tampil berdasarkan menu.
- User bisa memberi rating.
- Rating rata-rata menu berubah.

---

### Modul Backend 11 — External API TheMealDB

Task:

- Buat service TheMealDB.
- Buat endpoint search meal eksternal.
- Buat endpoint detail meal eksternal.
- Buat endpoint import meal ke database lokal.
- Tambahkan fallback jika API gagal.
- Pastikan backend tidak crash saat TheMealDB error.

Acceptance criteria:

- Backend bisa mengambil data dari TheMealDB.
- Jika TheMealDB gagal, API memberi error message yang jelas.
- Admin bisa import data eksternal ke menu lokal.

---

### Modul Backend 12 — Admin Dashboard

Task:

- Buat endpoint statistik.
- Hitung total user.
- Hitung total restoran.
- Hitung total menu.
- Hitung total order.
- Hitung total revenue dummy.
- Ambil latest orders.
- Ambil popular menus.

Acceptance criteria:

- Dashboard admin memiliki data statistik.
- Endpoint hanya bisa diakses admin.

---

## 10. Backend Testing Plan

Test backend menggunakan Postman, Thunder Client, atau Insomnia.

Checklist:

- Register user.
- Login user.
- Login admin.
- Auth middleware.
- Role middleware.
- CRUD kategori.
- CRUD restoran.
- CRUD menu.
- Search menu.
- Filter menu.
- Pagination menu.
- Upload gambar.
- Cart.
- Checkout.
- Order history.
- Update status order.
- Favorite.
- Review.
- External API.
- Admin stats.
- Error handling.

---

## 11. Backend Definition of Done

Fitur backend dianggap selesai jika:

1. Endpoint sudah dibuat.
2. Endpoint sudah dites menggunakan Postman/Thunder Client.
3. Validasi request berjalan.
4. Middleware auth dan role berjalan.
5. Response API mengikuti format standar.
6. Error handling tidak membuat server crash.
7. Data tersimpan ke MySQL.
8. Relasi database berjalan.
9. Upload file berjalan jika fitur membutuhkan gambar.
10. Endpoint admin terlindungi.
11. Endpoint user terlindungi.
12. Tidak ada error server saat flow utama dites.

---

## 12. Sprint Backend

### Sprint 1 — Foundation Backend

- Setup project backend.
- Setup Express.
- Setup MySQL.
- Setup response helper.
- Setup error handler.
- Setup endpoint health check.

### Sprint 2 — Auth & Master Data

- Auth API.
- Middleware JWT.
- Role admin.
- Category API.
- Restaurant API.
- Menu API.

### Sprint 3 — Discovery API

- Search menu.
- Filter menu.
- Sort menu.
- Pagination.
- Recommended menu.
- Detail menu/restoran.

### Sprint 4 — Cart & Order API

- Cart API.
- Checkout API.
- Order history.
- Admin manage order.
- Update status order.

### Sprint 5 — Advanced Backend Feature

- Favorite API.
- Review API.
- Rating calculation.
- External API TheMealDB.
- Admin stats.

### Sprint 6 — Finalisasi Backend

- Testing semua endpoint.
- Rapikan error handling.
- Rapikan validation.
- Siapkan environment production.
- Deploy backend.
- Dokumentasi API.

---

## 13. Backend Final Checklist

- [ ] Backend Express selesai.
- [ ] Database MySQL selesai.
- [ ] Auth API selesai.
- [ ] User role selesai.
- [ ] Category API selesai.
- [ ] Restaurant API selesai.
- [ ] Menu API selesai.
- [ ] Search/filter/pagination selesai.
- [ ] Upload gambar selesai.
- [ ] Cart API selesai.
- [ ] Order API selesai.
- [ ] Favorite API selesai.
- [ ] Review API selesai.
- [ ] Admin stats selesai.
- [ ] External API selesai.
- [ ] Error handling selesai.
- [ ] Response API standar selesai.
- [ ] Deployment backend selesai.
