<p align="center">
  <img src="./docs/carimakan-banner.png" alt="CARIMAKAN homepage banner" width="100%" />
</p>

<h1 align="center">CARIMAKAN</h1>

<p align="center">
  Web pemesanan makanan lokal bergaya retro dengan katalog menu, cart, checkout, riwayat pesanan, favorit, review, dan admin panel.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-111111?logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql&logoColor=white" />
</p>

---

## Overview

CARIMAKAN adalah aplikasi full-stack food ordering. Frontend dibuat dengan React + Vite, backend memakai Express + Prisma, dan database menggunakan PostgreSQL/Supabase.

Fokus project ini adalah membuat pengalaman pencarian makanan terasa cepat dan jelas: user bisa melihat menu, memasukkan item ke keranjang, checkout, lalu memantau riwayat pesanan. Admin dapat mengelola menu, kategori, restoran, pesanan, dan user dari dashboard.

## Fitur

| Modul | Fitur |
| --- | --- |
| Menu | katalog, pencarian, kategori, rekomendasi, detail menu |
| User | register, login, profil, favorit, review, rating |
| Cart | tambah item, ubah jumlah, hapus item, clear cart |
| Checkout | buat pesanan, halaman detail pesanan, riwayat order |
| Admin | dashboard, menu, kategori, restoran, pesanan, user |
| Backend | Prisma ORM, JWT auth, Zod validation, upload gambar |
| Safety | error boundary frontend, rate limit auth/admin, smoke test |

## Alur Aplikasi

```mermaid
flowchart LR
  A["Cari menu"] --> B["Detail makanan"]
  B --> C["Tambah ke cart"]
  C --> D["Checkout"]
  D --> E["Detail pesanan"]
  E --> F["Riwayat order"]

  G["Admin"] --> H["Kelola data"]
  H --> I["Update status pesanan"]
```

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, React Icons, React Hot Toast |
| Styling | Tailwind CSS 4, GSAP, Lenis, custom retro components |
| Backend | Node.js, Express 5, Prisma Client |
| Database | PostgreSQL atau Supabase |
| Auth & Security | JWT, Bcrypt, Helmet, CORS, rate limit |
| Validation & Upload | Zod, Multer |

## Struktur Folder

```text
CARIMAKAN/
|-- backend/
|   |-- prisma/
|   |-- scripts/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- server.js
|   `-- test-smoke.js
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- components/
|       |-- context/
|       |-- pages/
|       |-- providers/
|       `-- services/
|-- docs/
|   `-- carimakan-banner.png
`-- README.md
```

## Quick Start

### 1. Clone

```bash
git clone https://github.com/tegokkk/CARIMAKAN.git
cd CARIMAKAN
```

### 2. Buat Database

```sql
CREATE DATABASE carimakan_db;
```

### 3. Jalankan Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run seed:users
npm run dev
```

Backend berjalan di:

```text
http://localhost:5000
```

### 4. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
```

Buat file `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Jalankan aplikasi:

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## Environment Backend

Contoh konfigurasi ada di `backend/.env.example`.

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:password@localhost:5432/carimakan_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/carimakan_db?schema=public"

JWT_SECRET=carimakan_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads
```

## Akun Development

Jalankan `npm run seed:users` untuk membuat akun default.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@carimakan.test` | `admin123` |
| User | `user@carimakan.test` | `user123` |

Untuk production, ganti password default dan gunakan `JWT_SECRET` yang kuat.

## Script

### Backend

| Command | Fungsi |
| --- | --- |
| `npm run dev` | menjalankan backend |
| `npm start` | menjalankan backend |
| `npm run prisma:generate` | generate Prisma Client |
| `npm run prisma:migrate` | menjalankan migration development |
| `npm run prisma:deploy` | menjalankan migration production |
| `npm run prisma:studio` | membuka Prisma Studio |
| `npm run seed` | seed data menu |
| `npm run seed:users` | seed user admin dan user biasa |
| `npm test` | menjalankan smoke test |

### Frontend

| Command | Fungsi |
| --- | --- |
| `npm run dev` | menjalankan Vite dev server |
| `npm run build` | build frontend |
| `npm run preview` | preview hasil build |
| `npm run lint` | menjalankan ESLint |

## API Ringkas

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

Endpoint admin membutuhkan token dengan role `admin`.

## Route Frontend

| Route | Halaman |
| --- | --- |
| `/` | beranda |
| `/search` | pencarian menu |
| `/menu/:id` | detail menu |
| `/cart` | keranjang |
| `/checkout` | checkout |
| `/orders` | riwayat pesanan |
| `/orders/:id` | detail pesanan |
| `/favorites` | favorit |
| `/profile` | profil |
| `/admin` | dashboard admin |
| `/admin/menus` | kelola menu |
| `/admin/categories` | kelola kategori |
| `/admin/restaurants` | kelola restoran |
| `/admin/orders` | kelola pesanan |
| `/admin/users` | kelola user |

## Testing

Backend smoke test:

```bash
cd backend
npm test
```

Frontend build:

```bash
cd frontend
npm run build
```

## Catatan

- File `.env`, `node_modules`, `dist`, dan upload runtime tidak masuk Git.
- Prisma schema berada di `backend/prisma/schema.prisma`.
- Migration berada di `backend/prisma/migrations`.
- Upload gambar disajikan dari endpoint `/uploads`.
- Jika menu belum muncul, pastikan migration dan seed sudah dijalankan.
- Jika checkout gagal, pastikan user sudah login dan backend aktif.

## Deployment Fullstack Netlify + Supabase

Repo ini sudah memiliki `netlify.toml` di root untuk deploy frontend React + Vite dan backend Express sebagai Netlify Function.

### 1. Buat Database Supabase

1. Buat project baru di Supabase.
2. Buka **Project Settings > Database**.
3. Ambil connection string PostgreSQL.
4. Gunakan direct connection untuk `DIRECT_URL` dan pooler connection untuk `DATABASE_URL` jika backend memakai pooler.

Contoh format:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?schema=public"
```

### 2. Deploy ke Netlify

1. Push project ini ke GitHub.
2. Buka Netlify, pilih **Add new site > Import an existing project**.
3. Import repository CARIMAKAN.
4. Netlify akan membaca `netlify.toml`:
   - Build command: `npm install --include=dev && npm install --prefix backend --include=dev && npm run prisma:generate --prefix backend && npm install --prefix frontend --include=dev && npm run build --prefix frontend`
   - Publish directory: `frontend/dist`
   - Functions directory: `netlify/functions`
5. Tambahkan environment variable di Netlify:

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?schema=public
JWT_SECRET=isi_dengan_secret_yang_kuat
JWT_EXPIRES_IN=7d
CLIENT_URL=https://domain-netlify-anda.netlify.app
UPLOAD_PATH=uploads
VITE_API_URL=/api
```

6. Klik **Deploy**.

### 3. Jalankan Migration dan Seed

Setelah deploy pertama berhasil, buka **Netlify > Site > Functions** untuk memastikan function `api` aktif. Lalu jalankan migration dan seed dari lokal dengan env Supabase production:

```bash
cd backend
npm run prisma:deploy
npm run seed
npm run seed:users
```

Frontend akan memanggil backend lewat path yang sama:

```text
https://domain-netlify-anda.netlify.app/api
```

Catatan: Netlify Functions tidak cocok untuk upload file permanen. Untuk production, simpan gambar upload ke Supabase Storage atau gunakan URL gambar eksternal.

---

<p align="center">
  CARIMAKAN - cari rasa lokal yang pas hari ini.
</p>
