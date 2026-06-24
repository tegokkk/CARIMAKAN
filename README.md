# CARIMAKAN

CARIMAKAN adalah web pemesanan makanan bergaya retro dengan katalog menu, keranjang, checkout, riwayat pesanan, favorit, review, dan panel admin. Project ini terdiri dari frontend React/Vite dan backend Express yang menggunakan Prisma Client untuk akses database MySQL/MariaDB.

## Fitur Utama

- Katalog menu makanan dengan pencarian, kategori, rekomendasi, dan detail menu.
- Autentikasi user dan admin berbasis JWT.
- Keranjang belanja, checkout, halaman sukses/detail pesanan, dan riwayat order.
- Favorit menu dan review/rating menu.
- Admin panel untuk dashboard, menu, kategori, restoran, pesanan, dan user.
- Upload gambar menu/restoran via backend.
- Integrasi TheMealDB untuk pencarian/import referensi makanan eksternal.
- Error boundary frontend supaya halaman tidak langsung blank ketika ada error React.
- Rate limit untuk endpoint auth dan admin.
- Smoke test backend untuk auth, menu, cart, checkout, dan order detail.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Hot Toast
- React Icons
- GSAP dan Lenis
- Tailwind CSS 4

### Backend

- Node.js
- Express 5
- Prisma ORM
- MySQL/MariaDB
- JWT
- Bcrypt
- Zod validation
- Multer upload
- Helmet, CORS, Morgan

## Struktur Project

```text
CARIMAKAN/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── test-smoke.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── providers/
│       └── services/
└── README.md
```

## Prasyarat

- Node.js 20 atau lebih baru
- MySQL/MariaDB aktif di lokal
- Git

## Setup Backend

Masuk ke folder backend:

```bash
cd backend
npm install
```

Copy file environment:

```bash
cp .env.example .env
```

Sesuaikan isi `.env`, terutama bagian database:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=carimakan_db
DB_PORT=3306
DATABASE_URL="mysql://root:@localhost:3306/carimakan_db"

JWT_SECRET=carimakan_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads
```

Buat database di MySQL/MariaDB:

```sql
CREATE DATABASE carimakan_db;
```

Generate Prisma Client dan jalankan migrasi:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Seed data menu dan user default:

```bash
npm run seed
npm run seed:users
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Setup Frontend

Masuk ke folder frontend:

```bash
cd frontend
npm install
```

Buat file `.env` jika belum ada:

```env
VITE_API_URL=http://localhost:5000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## Akun Default

Setelah menjalankan `npm run seed:users`, tersedia akun development:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@carimakan.test` | `admin123` |
| User | `user@carimakan.test` | `user123` |

Ganti password dan `JWT_SECRET` sebelum dipakai untuk production.

## Script Penting

### Backend

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server backend |
| `npm start` | Menjalankan server backend |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Membuat/menjalankan migration development |
| `npm run prisma:deploy` | Menjalankan migration untuk deployment |
| `npm run prisma:studio` | Membuka Prisma Studio |
| `npm run seed` | Seed data menu dari file markdown |
| `npm run seed:users` | Seed akun admin dan user default |
| `npm test` | Menjalankan smoke test backend |

### Frontend

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server |
| `npm run build` | Build frontend untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Menjalankan ESLint |

## Endpoint API Utama

Base URL:

```text
http://localhost:5000/api
```

| Modul | Endpoint |
| --- | --- |
| Auth | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout` |
| Category | `/categories` |
| Restaurant | `/restaurants` |
| Menu | `/menus`, `/menus/:id`, `/menus/recommended`, `/menus/stats` |
| Cart | `/cart` |
| Order | `/orders`, `/orders/my`, `/orders/:id` |
| Favorite | `/favorites`, `/favorites/:menuId` |
| Review | `/menus/:menuId/reviews`, `/reviews/:id` |
| External Meal | `/external/meals/search`, `/external/meals/:id` |
| Admin | `/admin/stats`, `/admin/users`, `/admin/orders` |

Endpoint admin membutuhkan token user dengan role `admin`.

## Halaman Frontend

| Route | Fungsi |
| --- | --- |
| `/` | Beranda dan rekomendasi menu |
| `/search` | Pencarian menu |
| `/menu/:id` | Detail menu |
| `/cart` | Keranjang |
| `/checkout` | Checkout |
| `/orders` | Riwayat pesanan |
| `/orders/:id` | Detail pesanan |
| `/favorites` | Menu favorit |
| `/profile` | Profil user |
| `/admin` | Dashboard admin |
| `/admin/menus` | Kelola menu |
| `/admin/categories` | Kelola kategori |
| `/admin/restaurants` | Kelola restoran |
| `/admin/orders` | Kelola pesanan |
| `/admin/users` | Kelola user |

## Testing

Jalankan smoke test backend:

```bash
cd backend
npm test
```

Test ini memeriksa flow utama:

- Health check API
- Register dan login
- Admin membuat category, restaurant, dan menu
- User menambahkan menu ke cart
- Checkout
- Ambil detail order

Build frontend:

```bash
cd frontend
npm run build
```

## Catatan Development

- File `.env`, `node_modules`, `dist`, dan upload runtime tidak ikut Git.
- Backend sudah memakai Prisma untuk modul utama aplikasi.
- File `.env.example` aman untuk contoh konfigurasi, tetapi jangan pakai secret default untuk production.
- Jika migrasi gagal, pastikan database sudah dibuat dan `DATABASE_URL` benar.
- Jika gambar tidak muncul, cek `UPLOAD_PATH` dan URL backend di frontend.

## Deployment Singkat

1. Set environment production di backend dan frontend.
2. Jalankan `npm install` di `backend` dan `frontend`.
3. Jalankan `npm run prisma:deploy` di backend.
4. Build frontend dengan `npm run build`.
5. Serve backend Node.js dan hasil build frontend sesuai platform hosting.

