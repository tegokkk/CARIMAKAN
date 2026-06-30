<p align="center">
  <img src="./docs/carimakan-banner.png" alt="CARIMAKAN homepage banner" width="100%" />
</p>

<h1 align="center">CARIMAKAN</h1>

<p align="center">
  Web pemesanan makanan lokal bergaya retro dengan katalog menu, pencarian, cart, checkout, riwayat pesanan, favorit, review, dashboard admin, dan dashboard merchant.
</p>

<p align="center">
  <a href="https://github.com/tegokkk/CARIMAKAN">
    <img alt="Repository" src="https://img.shields.io/badge/Repository-CARIMAKAN-181717?style=for-the-badge&logo=github" />
  </a>
  <img alt="React" src="https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61dafb" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-111111?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7-2d3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## Project Snapshot

| Attribute | Detail |
| --- | --- |
| Project Name | `CARIMAKAN` |
| Category | Full-stack food ordering web app |
| Frontend | React 19, Vite 8, Tailwind CSS 4, GSAP, Lenis |
| Backend | Node.js, Express 5, Prisma ORM 7 |
| Database | PostgreSQL atau Supabase PostgreSQL |
| Authentication | JWT, Bcrypt, role-based access |
| Roles | `user`, `admin`, `merchant` |
| Deployment Target | Netlify Static Site + Netlify Function + Supabase |

## About

CARIMAKAN adalah aplikasi pemesanan makanan lokal dengan tampilan retro. Pengguna dapat menjelajahi katalog menu, mencari makanan, melihat detail menu, menambahkan item ke keranjang, checkout, menyimpan favorit, memberi review, dan melihat riwayat pesanan.

Admin dapat mengelola user, role, restoran, merchant, kategori, pesanan, dan status restoran. Merchant dapat mengelola restoran, menu, dan pesanan miliknya melalui dashboard khusus.

Repository ini memakai struktur monorepo ringan: frontend React berada di `frontend/`, backend Express + Prisma berada di `backend/`, dan adaptor serverless Netlify berada di `netlify/functions/`.

## Feature Matrix

| Module | Features |
| --- | --- |
| Public | Beranda, pencarian menu, detail menu, halaman privacy, halaman terms |
| Auth | Register, login, logout, session check, JWT auth |
| Menu | Katalog, pencarian, kategori, rekomendasi, statistik, detail menu |
| Cart | Tambah item, ubah jumlah, hapus item, clear cart |
| Checkout | Buat pesanan, detail pesanan, riwayat order |
| User | Profil, favorit, review, rating |
| Admin | Statistik, kelola user, role, order, merchant, restoran, status restoran |
| Merchant | Dashboard, kelola restoran, menu, dan pesanan merchant |
| Backend | Prisma ORM, PostgreSQL, Zod validation, upload middleware, static uploads |
| Safety | Helmet, CORS, auth/admin rate limit, global error handler, frontend error boundary |

## Application Flow

```mermaid
flowchart LR
  A["User cari menu"] --> B["Detail makanan"]
  B --> C["Tambah ke cart"]
  C --> D["Checkout"]
  D --> E["Detail pesanan"]
  E --> F["Riwayat order"]

  G["Admin login"] --> H["Admin dashboard"]
  H --> I["Kelola user, restoran, kategori, order"]

  J["Merchant login"] --> K["Merchant dashboard"]
  K --> L["Kelola restoran, menu, order"]
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7, Axios |
| Styling & Motion | Tailwind CSS 4, GSAP, Lenis, Lottie, React Icons |
| Backend | Node.js, Express 5, Prisma Client 7 |
| Database | PostgreSQL, Supabase-compatible connection |
| Auth & Security | JWT, Bcrypt, Helmet, CORS, rate limit |
| Validation & Upload | Zod, Multer |
| Deployment | Netlify, Netlify Functions, Supabase |

## Folder Structure

```text
CARIMAKAN/
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |-- scripts/
|   |   `-- seed-users.js
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- app.js
|   |   |-- seed.js
|   |   `-- server.js
|   |-- .env.example
|   |-- package.json
|   |-- seed-from-md.js
|   |-- test-api.js
|   |-- test-e2e.js
|   `-- test-smoke.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- animations/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |   |-- admin/
|   |   |   `-- merchant/
|   |   |-- providers/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.js
|-- netlify/
|   `-- functions/
|       `-- api.js
|-- docs/
|   |-- MATERI_PRESENTASI_CARIMAKAN.md
|   |-- PLAN_ROMBAK_ROLE_CARIMAKAN.md
|   `-- carimakan-banner.png
|-- uploads/
|-- Data_Makanan_CariMakan_Link_Gambar.md
|-- CariMakan_BACKEND_CONTEXT.md
|-- netlify.toml
|-- package.json
`-- README.md
```

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/tegokkk/CARIMAKAN.git
cd CARIMAKAN
```

### 2. Setup PostgreSQL Database

```sql
CREATE DATABASE carimakan_db;
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Isi `.env` lokal:

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

Jalankan Prisma, seed, dan server:

```bash
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

Health check:

```text
http://localhost:5000/api/health
```

### 4. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
cp .env.example .env
```

Untuk lokal, isi `frontend/.env`:

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

## Demo Account

Jalankan `npm run seed:users` dari folder `backend` untuk membuat akun default.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@carimakan.test` | `admin123` |
| User | `user@carimakan.test` | `user123` |

Role `merchant` sudah didukung oleh schema, API, dan route frontend. Akun merchant dapat dibuat dengan register user baru lalu ubah role lewat admin dashboard/API.

Untuk production, ganti password default dan gunakan `JWT_SECRET` yang kuat.

## Scripts

### Root

Root `package.json` dipakai untuk dependency bersama/deploy Netlify. Workflow harian tetap dijalankan dari folder `backend/` dan `frontend/`.

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Menjalankan backend Express |
| `npm start` | Menjalankan backend Express |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Menjalankan migration development |
| `npm run prisma:deploy` | Menjalankan migration production |
| `npm run prisma:studio` | Membuka Prisma Studio |
| `npm run seed` | Seed data menu dari markdown |
| `npm run seed:users` | Seed akun admin dan user default |
| `npm test` | Menjalankan smoke test backend |

File test tambahan tersedia di `backend/test-api.js` dan `backend/test-e2e.js`.

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Menjalankan Vite dev server |
| `npm run build` | Build frontend |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Menjalankan ESLint |

## API Overview

Base URL:

```text
Local: http://localhost:5000/api
Production: https://domain-netlify-anda.netlify.app/api
```

| Module | Endpoint |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Category | `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` |
| Restaurant | `GET /restaurants`, `GET /restaurants/:id` |
| Menu | `GET /menus`, `GET /menus/stats`, `GET /menus/recommended`, `GET /menus/:id` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/:id`, `DELETE /cart/:id`, `DELETE /cart` |
| Order | `POST /orders`, `GET /orders/my`, `GET /orders`, `GET /orders/:id`, `PUT /orders/:id/status` |
| Favorite | `GET /favorites`, `POST /favorites/:menuId`, `DELETE /favorites/:menuId` |
| Review | `GET /menus/:menuId/reviews`, `POST /menus/:menuId/reviews`, `DELETE /reviews/:id` |
| External Meal | `GET /external/meals/search`, `GET /external/meals/:id`, `POST /external/meals/import/:id` |
| Admin | `GET /admin/stats`, `GET /admin/users`, `PUT /admin/users/:id/role`, `DELETE /admin/users/:id`, `GET /admin/orders`, `PUT /admin/orders/:id/status`, `GET /admin/merchants`, `GET /admin/restaurants`, `PUT /admin/restaurants/:id/status` |
| Merchant | `GET /merchant/dashboard`, `GET /merchant/restaurants`, `POST /merchant/restaurants`, `PUT /merchant/restaurants/:id`, `GET /merchant/menus`, `POST /merchant/menus`, `PUT /merchant/menus/:id`, `DELETE /merchant/menus/:id`, `GET /merchant/orders`, `PUT /merchant/orders/:id/status` |

Catatan akses:

- Endpoint cart, order user, favorite, post review, dan delete review membutuhkan login.
- Endpoint admin membutuhkan token dengan role `admin`.
- Endpoint merchant membutuhkan token dengan role `merchant` atau `admin`.
- Endpoint kategori create/update/delete membutuhkan role `admin`.

## Frontend Routes

| Route | Page |
| --- | --- |
| `/` | Beranda |
| `/search` | Pencarian menu |
| `/menu/:id` | Detail menu |
| `/login` | Login |
| `/register` | Register |
| `/cart` | Keranjang |
| `/checkout` | Checkout |
| `/orders` | Riwayat pesanan |
| `/orders/:id` | Detail pesanan |
| `/favorites` | Favorit |
| `/profile` | Profil |
| `/privacy` | Privacy |
| `/terms` | Terms |
| `/admin` | Dashboard admin |
| `/admin/menus` | Kelola menu |
| `/admin/categories` | Kelola kategori |
| `/admin/restaurants` | Kelola restoran |
| `/admin/orders` | Kelola pesanan |
| `/admin/users` | Kelola user |
| `/admin/merchants` | Kelola merchant |
| `/merchant` | Dashboard merchant |
| `/merchant/restaurants` | Kelola restoran merchant |
| `/merchant/menus` | Kelola menu merchant |
| `/merchant/orders` | Kelola pesanan merchant |

## Database Models

Schema Prisma berada di `backend/prisma/schema.prisma`.

| Model | Purpose |
| --- | --- |
| `User` | Data user, admin, dan merchant |
| `Category` | Kategori menu |
| `Restaurant` | Restoran, status approval, owner merchant |
| `Menu` | Item makanan/minuman |
| `Cart` | Keranjang user |
| `Order` | Pesanan utama |
| `OrderItem` | Item di dalam pesanan |
| `Favorite` | Menu favorit user |
| `Review` | Review dan rating menu |

Enum utama:

- `UserRole`: `user`, `admin`, `merchant`
- `OrderStatus`: `pending`, `accepted`, `processing`, `ready`, `done`, `cancelled`
- `RestaurantStatus`: `pending`, `approved`, `rejected`, `suspended`
- `PaymentStatus`: `pending`, `paid`, `failed`

## Testing

Backend smoke test:

```bash
cd backend
npm test
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend build:

```bash
cd frontend
npm run build
```

Netlify function health check:

```text
https://domain-netlify-anda.netlify.app/api/health
```

## Deployment: Netlify + Supabase

Repo ini memiliki `netlify.toml` di root untuk deploy frontend React + Vite dan backend Express sebagai Netlify Function.

### 1. Create Supabase Database

1. Buat project baru di Supabase.
2. Buka **Project Settings > Database**.
3. Ambil connection string PostgreSQL.
4. Gunakan direct connection untuk `DIRECT_URL` dan pooler connection untuk `DATABASE_URL` jika memakai Supabase pooler.

Contoh format:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?schema=public"
```

### 2. Configure Netlify

Set environment variable ini di **Netlify > Site configuration > Environment variables**:

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

Netlify membaca konfigurasi berikut dari `netlify.toml`:

```text
Build command:
npm install --include=dev && npm install --prefix backend --include=dev && npm run prisma:generate --prefix backend && npm install --prefix frontend --include=dev && npm run build --prefix frontend

Publish directory:
frontend/dist

Functions directory:
netlify/functions
```

### 3. Deploy Migration and Seed

Setelah deploy pertama berhasil, jalankan migration dan seed dari lokal dengan env Supabase production:

```powershell
cd backend
$env:DATABASE_URL="ISI_DATABASE_URL_SUPABASE"
$env:DIRECT_URL="ISI_DIRECT_URL_SUPABASE"
npm run prisma:deploy
npm run seed
npm run seed:users
```

Frontend production akan memanggil backend lewat path yang sama:

```text
https://domain-netlify-anda.netlify.app/api
```

## Important Notes

- File `.env`, `node_modules`, `dist`, dan upload runtime tidak masuk Git.
- Prisma schema berada di `backend/prisma/schema.prisma`.
- Migration berada di `backend/prisma/migrations`.
- Prisma Client digenerate ke `backend/src/generated/prisma`.
- Di Netlify, backend Express berjalan sebagai function di `netlify/functions/api.js`.
- Upload gambar disajikan dari endpoint `/uploads`, tetapi storage Netlify Function tidak permanen.
- Untuk production, simpan gambar upload ke Supabase Storage atau gunakan URL gambar eksternal.
- Jika menu belum muncul, pastikan migration dan seed sudah dijalankan.
- Jika checkout gagal, pastikan user sudah login dan backend aktif.
- Jika CORS bermasalah, pastikan `CLIENT_URL` sesuai domain frontend.

## Repository Status

```text
Frontend: React/Vite app
Backend : Express/Prisma API
Database: PostgreSQL/Supabase
Deploy  : Netlify-ready
```

---

<p align="center">
  <b>CARIMAKAN</b><br />
  Cari rasa lokal yang pas hari ini.
</p>
