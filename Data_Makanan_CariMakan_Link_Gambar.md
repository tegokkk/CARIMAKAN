# Data Makanan CariMakan + Link Gambar

File ini berisi data awal makanan untuk aplikasi **CariMakan**.

Data ini bisa dipakai untuk:
- Data dummy React.
- Seed database MySQL.
- Referensi input manual admin.
- Data awal untuk halaman Home, FoodGrid, Search, dan Detail Menu.

> Catatan: Link gambar memakai URL eksternal. Untuk project final, lebih aman gambar diunduh lalu disimpan di `src/assets/images/foods/`, Cloudinary, Supabase Storage, atau folder upload backend.

---

## 1. Tabel Data Makanan

| No | Nama Makanan | Kategori | Harga Dummy | Rating | Link Gambar |
|---|---|---|---|---|---|
| 1 | Pempek Kapal Selam | Makanan Khas Lampung | Rp 18.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Kapal%20Selam.jpg) |
| 2 | Pempek Lenjer | Makanan Khas Lampung | Rp 12.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Lenjer%20Kecil%20khas%20Palembang.jpg) |
| 3 | Mie Lampung | Bakso & Mie | Rp 17.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam-01.jpg) |
| 4 | Nasi Bakar Ayam | Aneka Nasi | Rp 22.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Ayam.JPG) |
| 5 | Nasi Bakar Cumi Asin | Aneka Nasi | Rp 25.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Udang.JPG) |
| 6 | Ayam Geprek Sambal Bawang | Ayam & Bebek | Rp 18.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png) |
| 7 | Ayam Penyet | Ayam & Bebek | Rp 20.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20penyet.JPG) |
| 8 | Bakso Urat | Bakso & Mie | Rp 18.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Bakso%20urat%20asli%20solo.jpg) |
| 9 | Mie Ayam Bakso | Bakso & Mie | Rp 18.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam%20Bakso.jpg) |
| 10 | Seblak Seafood | Jajanan | Rp 20.000 | 4.5 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Seblak%203.jpg) |
| 11 | Batagor Bandung | Jajanan | Rp 15.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Batagor%20Savoy%20Homann%20Bandung.jpg) |
| 12 | Siomay Ikan | Jajanan | Rp 15.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Siomay%20Bandung.jpg) |
| 13 | Pizza Meat Lovers | Fast Food | Rp 65.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Meat%20lover%27s%20pizza%20%2816803723523%29.jpg) |
| 14 | Spaghetti Bolognese | Fast Food | Rp 35.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Spaghetti%20Bolognese.jpg) |
| 15 | Es Kopi Susu Gula Aren | Minuman | Rp 18.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Es%20Kopi%20Susu%20Gula%20Aren.jpg) |
| 16 | Thai Tea | Minuman | Rp 15.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Thai%20iced%20tea.jpg) |
| 17 | Risoles Mayo | Jajanan | Rp 12.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Risol%20Mayo.jpg) |
| 18 | Pisang Keju | Dessert | Rp 14.000 | 4.7 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Pisang%20keju%201.jpg) |
| 19 | Gurame Bakar | Seafood | Rp 45.000 | 4.8 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Gurame%20bakar%20kecap%202.JPG) |
| 20 | Lele Goreng Sambal | Sambal & Lalapan | Rp 18.000 | 4.6 | [Buka Gambar](https://commons.wikimedia.org/wiki/Special:FilePath/Pecel%20Lele%201.JPG) |

---

## 2. Data untuk React Frontend

Simpan sebagai:

```txt
src/data/foods.js
```

Isi file:

```js
export const foods = [
  {
    id: 1,
    name: "Pempek Kapal Selam",
    slug: "pempek-kapal-selam",
    category: "Makanan Khas Lampung",
    price: 18000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Kapal%20Selam.jpg",
    description: "Pempek isi telur dengan kuah cuko khas yang gurih, asam, manis, dan pedas.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 2,
    name: "Pempek Lenjer",
    slug: "pempek-lenjer",
    category: "Makanan Khas Lampung",
    price: 12000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Lenjer%20Kecil%20khas%20Palembang.jpg",
    description: "Pempek berbentuk panjang dengan tekstur kenyal dan rasa ikan yang khas.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 3,
    name: "Mie Lampung",
    slug: "mie-lampung",
    category: "Bakso & Mie",
    price: 17000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam-01.jpg",
    description: "Mie khas Lampung dengan topping ayam, sayur, dan kuah gurih.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 4,
    name: "Nasi Bakar Ayam",
    slug: "nasi-bakar-ayam",
    category: "Aneka Nasi",
    price: 22000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Ayam.JPG",
    description: "Nasi berbumbu dengan ayam suwir yang dibungkus daun pisang lalu dibakar.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 5,
    name: "Nasi Bakar Cumi Asin",
    slug: "nasi-bakar-cumi-asin",
    category: "Aneka Nasi",
    price: 25000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Udang.JPG",
    description: "Nasi bakar gurih dengan lauk seafood pedas asin yang cocok untuk makan siang.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 6,
    name: "Ayam Geprek Sambal Bawang",
    slug: "ayam-geprek-sambal-bawang",
    category: "Ayam & Bebek",
    price: 18000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png",
    description: "Ayam crispy digeprek dengan sambal bawang pedas dan nasi hangat.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 7,
    name: "Ayam Penyet",
    slug: "ayam-penyet",
    category: "Ayam & Bebek",
    price: 20000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20penyet.JPG",
    description: "Ayam goreng penyet dengan sambal terasi, lalapan, dan nasi.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 8,
    name: "Bakso Urat",
    slug: "bakso-urat",
    category: "Bakso & Mie",
    price: 18000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bakso%20urat%20asli%20solo.jpg",
    description: "Bakso besar bertekstur urat dengan kuah kaldu sapi yang gurih.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 9,
    name: "Mie Ayam Bakso",
    slug: "mie-ayam-bakso",
    category: "Bakso & Mie",
    price: 18000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam%20Bakso.jpg",
    description: "Mie ayam dengan topping ayam kecap, sayur, dan tambahan bakso.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 10,
    name: "Seblak Seafood",
    slug: "seblak-seafood",
    category: "Jajanan",
    price: 20000,
    rating: 4.5,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Seblak%203.jpg",
    description: "Seblak pedas dengan kerupuk, sayur, telur, dan campuran seafood.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 11,
    name: "Batagor Bandung",
    slug: "batagor-bandung",
    category: "Jajanan",
    price: 15000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Batagor%20Savoy%20Homann%20Bandung.jpg",
    description: "Bakso tahu goreng dengan saus kacang khas Bandung.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 12,
    name: "Siomay Ikan",
    slug: "siomay-ikan",
    category: "Jajanan",
    price: 15000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Siomay%20Bandung.jpg",
    description: "Siomay ikan lengkap dengan kentang, kol, tahu, telur, dan saus kacang.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 13,
    name: "Pizza Meat Lovers",
    slug: "pizza-meat-lovers",
    category: "Fast Food",
    price: 65000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meat%20lover%27s%20pizza%20%2816803723523%29.jpg",
    description: "Pizza topping daging, sosis, keju, dan saus tomat khas.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 14,
    name: "Spaghetti Bolognese",
    slug: "spaghetti-bolognese",
    category: "Fast Food",
    price: 35000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spaghetti%20Bolognese.jpg",
    description: "Pasta spaghetti dengan saus bolognese daging cincang.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 15,
    name: "Es Kopi Susu Gula Aren",
    slug: "es-kopi-susu-gula-aren",
    category: "Minuman",
    price: 18000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Es%20Kopi%20Susu%20Gula%20Aren.jpg",
    description: "Minuman kopi susu dingin dengan rasa manis legit gula aren.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 16,
    name: "Thai Tea",
    slug: "thai-tea",
    category: "Minuman",
    price: 15000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Thai%20iced%20tea.jpg",
    description: "Teh khas Thailand dengan susu, rasa manis, creamy, dan segar.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 17,
    name: "Risoles Mayo",
    slug: "risoles-mayo",
    category: "Jajanan",
    price: 12000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Risol%20Mayo.jpg",
    description: "Risoles isi smoked beef, telur, dan saus mayo yang creamy.",
    isRecommended: false,
    isActive: true,
  },
  {
    id: 18,
    name: "Pisang Keju",
    slug: "pisang-keju",
    category: "Dessert",
    price: 14000,
    rating: 4.7,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pisang%20keju%201.jpg",
    description: "Pisang goreng dengan taburan keju, susu, dan topping manis.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 19,
    name: "Gurame Bakar",
    slug: "gurame-bakar",
    category: "Seafood",
    price: 45000,
    rating: 4.8,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gurame%20bakar%20kecap%202.JPG",
    description: "Ikan gurame bakar dengan bumbu kecap dan sambal.",
    isRecommended: true,
    isActive: true,
  },
  {
    id: 20,
    name: "Lele Goreng Sambal",
    slug: "lele-goreng-sambal",
    category: "Sambal & Lalapan",
    price: 18000,
    rating: 4.6,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pecel%20Lele%201.JPG",
    description: "Lele goreng garing dengan sambal, lalapan, dan nasi hangat.",
    isRecommended: false,
    isActive: true,
  },
];
```

Contoh penggunaan di React:

```jsx
import { foods } from "../data/foods";
import FoodCard from "../components/food/FoodCard";

function FoodGridExample() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}

export default FoodGridExample;
```

---

## 3. Data JSON

Simpan sebagai:

```txt
src/data/foods.json
```

Isi file:

```json
[
  {
    "id": 1,
    "name": "Pempek Kapal Selam",
    "slug": "pempek-kapal-selam",
    "category": "Makanan Khas Lampung",
    "price": 18000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Kapal%20Selam.jpg",
    "description": "Pempek isi telur dengan kuah cuko khas yang gurih, asam, manis, dan pedas.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Pempek Lenjer",
    "slug": "pempek-lenjer",
    "category": "Makanan Khas Lampung",
    "price": 12000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Lenjer%20Kecil%20khas%20Palembang.jpg",
    "description": "Pempek berbentuk panjang dengan tekstur kenyal dan rasa ikan yang khas.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 3,
    "name": "Mie Lampung",
    "slug": "mie-lampung",
    "category": "Bakso & Mie",
    "price": 17000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam-01.jpg",
    "description": "Mie khas Lampung dengan topping ayam, sayur, dan kuah gurih.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 4,
    "name": "Nasi Bakar Ayam",
    "slug": "nasi-bakar-ayam",
    "category": "Aneka Nasi",
    "price": 22000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Ayam.JPG",
    "description": "Nasi berbumbu dengan ayam suwir yang dibungkus daun pisang lalu dibakar.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 5,
    "name": "Nasi Bakar Cumi Asin",
    "slug": "nasi-bakar-cumi-asin",
    "category": "Aneka Nasi",
    "price": 25000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Udang.JPG",
    "description": "Nasi bakar gurih dengan lauk seafood pedas asin yang cocok untuk makan siang.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 6,
    "name": "Ayam Geprek Sambal Bawang",
    "slug": "ayam-geprek-sambal-bawang",
    "category": "Ayam & Bebek",
    "price": 18000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png",
    "description": "Ayam crispy digeprek dengan sambal bawang pedas dan nasi hangat.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 7,
    "name": "Ayam Penyet",
    "slug": "ayam-penyet",
    "category": "Ayam & Bebek",
    "price": 20000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20penyet.JPG",
    "description": "Ayam goreng penyet dengan sambal terasi, lalapan, dan nasi.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 8,
    "name": "Bakso Urat",
    "slug": "bakso-urat",
    "category": "Bakso & Mie",
    "price": 18000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Bakso%20urat%20asli%20solo.jpg",
    "description": "Bakso besar bertekstur urat dengan kuah kaldu sapi yang gurih.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 9,
    "name": "Mie Ayam Bakso",
    "slug": "mie-ayam-bakso",
    "category": "Bakso & Mie",
    "price": 18000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam%20Bakso.jpg",
    "description": "Mie ayam dengan topping ayam kecap, sayur, dan tambahan bakso.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 10,
    "name": "Seblak Seafood",
    "slug": "seblak-seafood",
    "category": "Jajanan",
    "price": 20000,
    "rating": 4.5,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Seblak%203.jpg",
    "description": "Seblak pedas dengan kerupuk, sayur, telur, dan campuran seafood.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 11,
    "name": "Batagor Bandung",
    "slug": "batagor-bandung",
    "category": "Jajanan",
    "price": 15000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Batagor%20Savoy%20Homann%20Bandung.jpg",
    "description": "Bakso tahu goreng dengan saus kacang khas Bandung.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 12,
    "name": "Siomay Ikan",
    "slug": "siomay-ikan",
    "category": "Jajanan",
    "price": 15000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Siomay%20Bandung.jpg",
    "description": "Siomay ikan lengkap dengan kentang, kol, tahu, telur, dan saus kacang.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 13,
    "name": "Pizza Meat Lovers",
    "slug": "pizza-meat-lovers",
    "category": "Fast Food",
    "price": 65000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Meat%20lover%27s%20pizza%20%2816803723523%29.jpg",
    "description": "Pizza topping daging, sosis, keju, dan saus tomat khas.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 14,
    "name": "Spaghetti Bolognese",
    "slug": "spaghetti-bolognese",
    "category": "Fast Food",
    "price": 35000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Spaghetti%20Bolognese.jpg",
    "description": "Pasta spaghetti dengan saus bolognese daging cincang.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 15,
    "name": "Es Kopi Susu Gula Aren",
    "slug": "es-kopi-susu-gula-aren",
    "category": "Minuman",
    "price": 18000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Es%20Kopi%20Susu%20Gula%20Aren.jpg",
    "description": "Minuman kopi susu dingin dengan rasa manis legit gula aren.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 16,
    "name": "Thai Tea",
    "slug": "thai-tea",
    "category": "Minuman",
    "price": 15000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Thai%20iced%20tea.jpg",
    "description": "Teh khas Thailand dengan susu, rasa manis, creamy, dan segar.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 17,
    "name": "Risoles Mayo",
    "slug": "risoles-mayo",
    "category": "Jajanan",
    "price": 12000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Risol%20Mayo.jpg",
    "description": "Risoles isi smoked beef, telur, dan saus mayo yang creamy.",
    "is_recommended": false,
    "is_active": true
  },
  {
    "id": 18,
    "name": "Pisang Keju",
    "slug": "pisang-keju",
    "category": "Dessert",
    "price": 14000,
    "rating": 4.7,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pisang%20keju%201.jpg",
    "description": "Pisang goreng dengan taburan keju, susu, dan topping manis.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 19,
    "name": "Gurame Bakar",
    "slug": "gurame-bakar",
    "category": "Seafood",
    "price": 45000,
    "rating": 4.8,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Gurame%20bakar%20kecap%202.JPG",
    "description": "Ikan gurame bakar dengan bumbu kecap dan sambal.",
    "is_recommended": true,
    "is_active": true
  },
  {
    "id": 20,
    "name": "Lele Goreng Sambal",
    "slug": "lele-goreng-sambal",
    "category": "Sambal & Lalapan",
    "price": 18000,
    "rating": 4.6,
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pecel%20Lele%201.JPG",
    "description": "Lele goreng garing dengan sambal, lalapan, dan nasi hangat.",
    "is_recommended": false,
    "is_active": true
  }
]
```

---

## 4. Seed SQL untuk Database MySQL

Asumsi tabel yang digunakan:

```sql
categories(id, name, slug, description)
menus(id, restaurant_id, category_id, name, slug, description, price, image, rating, stock, is_recommended, is_active)
```

Asumsi `restaurant_id = 1` sudah tersedia di tabel `restaurants`.

### 4.1 Insert Categories

```sql
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Makanan Khas Lampung', 'makanan-khas-lampung', 'Kategori Makanan Khas Lampung'),
(2, 'Bakso & Mie', 'bakso-mie', 'Kategori Bakso & Mie'),
(3, 'Aneka Nasi', 'aneka-nasi', 'Kategori Aneka Nasi'),
(4, 'Ayam & Bebek', 'ayam-bebek', 'Kategori Ayam & Bebek'),
(5, 'Jajanan', 'jajanan', 'Kategori Jajanan'),
(6, 'Fast Food', 'fast-food', 'Kategori Fast Food'),
(7, 'Minuman', 'minuman', 'Kategori Minuman'),
(8, 'Dessert', 'dessert', 'Kategori Dessert'),
(9, 'Seafood', 'seafood', 'Kategori Seafood'),
(10, 'Sambal & Lalapan', 'sambal-lalapan', 'Kategori Sambal & Lalapan');
```

### 4.2 Insert Menus

```sql
INSERT INTO menus (
  id,
  restaurant_id,
  category_id,
  name,
  slug,
  description,
  price,
  image,
  rating,
  stock,
  is_recommended,
  is_active
) VALUES
(1, 1, 1, 'Pempek Kapal Selam', 'pempek-kapal-selam', 'Pempek isi telur dengan kuah cuko khas yang gurih, asam, manis, dan pedas.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Kapal%20Selam.jpg', 4.8, 100, 1, 1),
(2, 1, 1, 'Pempek Lenjer', 'pempek-lenjer', 'Pempek berbentuk panjang dengan tekstur kenyal dan rasa ikan yang khas.', 12000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Lenjer%20Kecil%20khas%20Palembang.jpg', 4.7, 100, 1, 1),
(3, 1, 2, 'Mie Lampung', 'mie-lampung', 'Mie khas Lampung dengan topping ayam, sayur, dan kuah gurih.', 17000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam-01.jpg', 4.6, 100, 0, 1),
(4, 1, 3, 'Nasi Bakar Ayam', 'nasi-bakar-ayam', 'Nasi berbumbu dengan ayam suwir yang dibungkus daun pisang lalu dibakar.', 22000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Ayam.JPG', 4.8, 100, 1, 1),
(5, 1, 3, 'Nasi Bakar Cumi Asin', 'nasi-bakar-cumi-asin', 'Nasi bakar gurih dengan lauk seafood pedas asin yang cocok untuk makan siang.', 25000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Nasi%20Bakar%20Udang.JPG', 4.7, 100, 1, 1),
(6, 1, 4, 'Ayam Geprek Sambal Bawang', 'ayam-geprek-sambal-bawang', 'Ayam crispy digeprek dengan sambal bawang pedas dan nasi hangat.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20geprek.png', 4.8, 100, 1, 1),
(7, 1, 4, 'Ayam Penyet', 'ayam-penyet', 'Ayam goreng penyet dengan sambal terasi, lalapan, dan nasi.', 20000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Ayam%20penyet.JPG', 4.7, 100, 1, 1),
(8, 1, 2, 'Bakso Urat', 'bakso-urat', 'Bakso besar bertekstur urat dengan kuah kaldu sapi yang gurih.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Bakso%20urat%20asli%20solo.jpg', 4.6, 100, 0, 1),
(9, 1, 2, 'Mie Ayam Bakso', 'mie-ayam-bakso', 'Mie ayam dengan topping ayam kecap, sayur, dan tambahan bakso.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Mie%20Ayam%20Bakso.jpg', 4.7, 100, 1, 1),
(10, 1, 5, 'Seblak Seafood', 'seblak-seafood', 'Seblak pedas dengan kerupuk, sayur, telur, dan campuran seafood.', 20000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Seblak%203.jpg', 4.5, 100, 0, 1),
(11, 1, 5, 'Batagor Bandung', 'batagor-bandung', 'Bakso tahu goreng dengan saus kacang khas Bandung.', 15000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Batagor%20Savoy%20Homann%20Bandung.jpg', 4.6, 100, 0, 1),
(12, 1, 5, 'Siomay Ikan', 'siomay-ikan', 'Siomay ikan lengkap dengan kentang, kol, tahu, telur, dan saus kacang.', 15000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Siomay%20Bandung.jpg', 4.6, 100, 0, 1),
(13, 1, 6, 'Pizza Meat Lovers', 'pizza-meat-lovers', 'Pizza topping daging, sosis, keju, dan saus tomat khas.', 65000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Meat%20lover%27s%20pizza%20%2816803723523%29.jpg', 4.8, 100, 1, 1),
(14, 1, 6, 'Spaghetti Bolognese', 'spaghetti-bolognese', 'Pasta spaghetti dengan saus bolognese daging cincang.', 35000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Spaghetti%20Bolognese.jpg', 4.7, 100, 1, 1),
(15, 1, 7, 'Es Kopi Susu Gula Aren', 'es-kopi-susu-gula-aren', 'Minuman kopi susu dingin dengan rasa manis legit gula aren.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Es%20Kopi%20Susu%20Gula%20Aren.jpg', 4.8, 100, 1, 1),
(16, 1, 7, 'Thai Tea', 'thai-tea', 'Teh khas Thailand dengan susu, rasa manis, creamy, dan segar.', 15000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Thai%20iced%20tea.jpg', 4.6, 100, 0, 1),
(17, 1, 5, 'Risoles Mayo', 'risoles-mayo', 'Risoles isi smoked beef, telur, dan saus mayo yang creamy.', 12000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Risol%20Mayo.jpg', 4.6, 100, 0, 1),
(18, 1, 8, 'Pisang Keju', 'pisang-keju', 'Pisang goreng dengan taburan keju, susu, dan topping manis.', 14000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Pisang%20keju%201.jpg', 4.7, 100, 1, 1),
(19, 1, 9, 'Gurame Bakar', 'gurame-bakar', 'Ikan gurame bakar dengan bumbu kecap dan sambal.', 45000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Gurame%20bakar%20kecap%202.JPG', 4.8, 100, 1, 1),
(20, 1, 10, 'Lele Goreng Sambal', 'lele-goreng-sambal', 'Lele goreng garing dengan sambal, lalapan, dan nasi hangat.', 18000, 'https://commons.wikimedia.org/wiki/Special:FilePath/Pecel%20Lele%201.JPG', 4.6, 100, 0, 1);
```

---

## 5. Cara Eksekusi di Frontend

### 5.1 Buat file data

```bash
mkdir -p src/data
touch src/data/foods.js
```

Lalu salin data JavaScript dari bagian **Data untuk React Frontend**.

### 5.2 Tampilkan di Home

```jsx
import { foods } from "../data/foods";
import FoodCard from "../components/food/FoodCard";

function Home() {
  return (
    <section className="px-4 py-10">
      <h2 className="text-2xl font-bold">Rekomendasi Makanan</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}

export default Home;
```

---

## 6. Cara Eksekusi di Backend

### 6.1 Buat file seed

```bash
mkdir -p database
touch database/seed_foods.sql
```

Lalu salin bagian **Seed SQL untuk Database MySQL** ke file `seed_foods.sql`.

### 6.2 Jalankan di MySQL

```bash
mysql -u root -p carimakan_db < database/seed_foods.sql
```

Atau jalankan manual lewat phpMyAdmin:

1. Buka phpMyAdmin.
2. Pilih database `carimakan_db`.
3. Masuk tab SQL.
4. Paste query insert.
5. Klik Go / Kirim.

---

## 7. Rekomendasi Penyimpanan Gambar

Untuk tahap awal, boleh pakai URL langsung:

```js
image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pempek%20Kapal%20Selam.jpg"
```

Untuk tahap production, lebih baik:

```txt
1. Download gambar.
2. Simpan ke backend/uploads/foods.
3. Simpan URL gambar lokal ke database.
```

Atau gunakan cloud storage:

```txt
Cloudinary
Supabase Storage
Firebase Storage
ImageKit
```

---

## 8. Final Checklist

- [ ] Data makanan sudah dibuat.
- [ ] Link gambar sudah tersedia.
- [ ] File `foods.js` sudah dibuat.
- [ ] FoodCard sudah membaca data.
- [ ] Gambar tampil di browser.
- [ ] Data bisa dipakai untuk seed database.
- [ ] Harga dan kategori sudah sesuai kebutuhan aplikasi.
- [ ] Data bisa dicari melalui fitur search.
- [ ] Data bisa difilter berdasarkan kategori.
