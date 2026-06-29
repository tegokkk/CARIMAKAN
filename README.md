<p align="center">
  <img src="./docs/carimakan-banner.png" alt="CARIMAKAN homepage banner" width="100%" />
</p>

<h1 align="center">CARIMAKAN</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=24&duration=2500&pause=700&color=AA3000&center=true&vCenter=true&width=900&height=60&hideCursor=true&lines=Retro+Food+Ordering+Web+Application;React+%2B+Express+%2B+Prisma+%2B+PostgreSQL;Search+Menu+%7C+Cart+%7C+Checkout+%7C+Admin+Panel" alt="Retro Food Ordering Web Application" />
</p>

<p align="center">
  Web pemesanan makanan lokal bergaya retro dengan katalog menu, pencarian, cart, checkout, riwayat pesanan, favorit, review, dan admin panel.
</p>

<p align="center">
  <a href="https://github.com/tegokkk/CARIMAKAN">
    <img alt="Repository" src="https://img.shields.io/badge/Repository-CARIMAKAN-181717?style=for-the-badge&logo=github" />
  </a>
  <img alt="React" src="https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61dafb" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-111111?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## Project Snapshot

| Attribute | Detail |
| --- | --- |
| Project Name | `CARIMAKAN` |
| Category | Full-stack food ordering web app |
| Frontend | React 19, Vite, Tailwind CSS 4, GSAP, Lenis |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL atau Supabase |
| Authentication | JWT, Bcrypt, role-based access |
| Deployment Target | Netlify Functions + Supabase |
| Main Users | Customer dan Admin |

## About

CARIMAKAN adalah aplikasi pemesanan makanan lokal yang dirancang dengan nuansa retro. User dapat mencari makanan, melihat detail menu, menambahkan item ke keranjang, checkout, dan melihat riwayat pesanan. Admin dapat mengelola menu, kategori, restoran, order, dan user dari dashboard.

Fokus aplikasi ini adalah membuat alur pemesanan sederhana, cepat, dan mudah dipresentasikan sebagai project full-stack: frontend, backend, database, autentikasi, validasi, upload gambar, dan deployment sudah berada dalam satu repository.

## Feature Matrix

| Module | Features |
| --- | --- |
| Menu | Katalog, pencarian, kategori, rekomendasi, detail menu |
| User | Register, login, profil, favorit, review, rating |
| Cart | Tambah item, ubah jumlah, hapus item, clear cart |
| Checkout | Buat pesanan, detail pesanan, riwayat order |
| Admin | Dashboard, kelola menu, kategori, restoran, pesanan, user |
| Backend | Prisma ORM, JWT auth, Zod validation, upload gambar |
| Safety | Error boundary frontend, auth/admin rate limit, smoke test |

## Application Flow

```mermaid
flowchart LR
  A["Cari menu"] --> B["Detail makanan"]
  B --> C["Tambah ke cart"]
  C --> D["Checkout"]
  D --> E["Detail pesanan"]
  E --> F["Riwayat order"]

  G["Admin login"] --> H["Admin dashboard"]
  H --> I["Kelola data"]
  I --> J["Update status pesanan"]
```

## Tech Stack

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111111" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-Animation-88CE02?style=flat-square&logo=greensock&logoColor=111111" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Runtime-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-111111?style=flat-square&logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Netlify" src="https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=flat-square&logo=netlify&logoColor=white" />
</p>

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, React Icons, React Hot Toast |
| Styling | Tailwind CSS 4, GSAP, Lenis, custom retro components |
| Backend | Node.js, Express 5, Prisma Client |
| Database | PostgreSQL atau Supabase |
| Auth & Security | JWT, Bcrypt, Helmet, CORS, rate limit |
| Validation & Upload | Zod, Multer |

## Folder Structure

```text
CARIMAKAN/
|-- netlify/
|   `-- functions/
|       `-- api.js
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
|-- netlify.toml
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

### 3. Configure Backend Environment

Masuk ke folder backend, lalu buat file `.env` dari contoh yang tersedia.

```bash
cd backend
npm install
cp .env.example .env
```

Contoh konfigurasi lokal:

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

### 4. Run Migration, Seed, and Backend

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

### 5. Run Frontend

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

## Demo Account

Jalankan `npm run seed:users` untuk membuat akun default.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@carimakan.test` | `admin123` |
| User | `user@carimakan.test` | `user123` |

Untuk production, ganti password default dan gunakan `JWT_SECRET` yang kuat.

## Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Menjalankan backend |
| `npm start` | Menjalankan backend |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Menjalankan migration development |
| `npm run prisma:deploy` | Menjalankan migration production |
| `npm run prisma:studio` | Membuka Prisma Studio |
| `npm run seed` | Seed data menu |
| `npm run seed:users` | Seed user admin dan user biasa |
| `npm test` | Menjalankan smoke test |

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

## Frontend Routes

| Route | Page |
| --- | --- |
| `/` | Beranda |
| `/search` | Pencarian menu |
| `/menu/:id` | Detail menu |
| `/cart` | Keranjang |
| `/checkout` | Checkout |
| `/orders` | Riwayat pesanan |
| `/orders/:id` | Detail pesanan |
| `/favorites` | Favorit |
| `/profile` | Profil |
| `/admin` | Dashboard admin |
| `/admin/menus` | Kelola menu |
| `/admin/categories` | Kelola kategori |
| `/admin/restaurants` | Kelola restoran |
| `/admin/orders` | Kelola pesanan |
| `/admin/users` | Kelola user |

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

Repo ini sudah memiliki `netlify.toml` di root untuk deploy frontend React + Vite dan backend Express sebagai Netlify Function.

### 1. Create Supabase Database

1. Buat project baru di Supabase.
2. Buka **Project Settings > Database**.
3. Ambil connection string PostgreSQL.
4. Gunakan direct connection untuk `DIRECT_URL` dan pooler connection untuk `DATABASE_URL` jika backend memakai pooler.

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

Netlify akan membaca konfigurasi berikut dari `netlify.toml`:

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

Frontend akan memanggil backend lewat path yang sama:

```text
https://domain-netlify-anda.netlify.app/api
```

## Notes

- File `.env`, `node_modules`, `dist`, dan upload runtime tidak masuk Git.
- Prisma schema berada di `backend/prisma/schema.prisma`.
- Migration berada di `backend/prisma/migrations`.
- Di Netlify, backend Express berjalan sebagai function di `netlify/functions/api.js`.
- Upload gambar disajikan dari endpoint `/uploads`, tetapi storage Netlify Function tidak permanen.
- Untuk production, simpan gambar upload ke Supabase Storage atau gunakan URL gambar eksternal.
- Jika menu belum muncul, pastikan migration dan seed sudah dijalankan.
- Jika checkout gagal, pastikan user sudah login dan backend aktif.

## Repository Status

<p>
  <img alt="Frontend lint" src="https://img.shields.io/badge/frontend_lint-passing-2ea44f?style=flat-square" />
  <img alt="Frontend build" src="https://img.shields.io/badge/frontend_build-passing-2ea44f?style=flat-square" />
  <img alt="Backend smoke test" src="https://img.shields.io/badge/backend_smoke_test-passing-2ea44f?style=flat-square" />
</p>

---

<p align="center">
  <b>CARIMAKAN</b><br />
  Cari rasa lokal yang pas hari ini.
</p>
