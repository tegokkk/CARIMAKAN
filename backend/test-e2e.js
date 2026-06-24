const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let createdMenuId = 1;

async function runTests() {
  console.log('🚀 Memulai End-to-End API Testing...\n');

  try {
    // 1. Test Register
    console.log('Testing [POST] /api/auth/register...');
    const testEmail = `testuser${Date.now()}@example.com`;
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User E2E',
      email: testEmail,
      password: 'password123',
      phone: '08123456789'
    });
    console.log('✅ Register Berhasil:', regRes.data.message);

    // 2. Test Login
    console.log('\nTesting [POST] /api/auth/login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    authToken = loginRes.data.data.token;
    console.log('✅ Login Berhasil, Token didapatkan!');

    // Konfigurasi axios menggunakan token
    const authConfig = { headers: { Authorization: `Bearer ${authToken}` } };

    // 3. Test Ambil Daftar Menu
    console.log('\nTesting [GET] /api/menus...');
    const menuRes = await axios.get(`${API_URL}/menus`);
    const menus = menuRes.data.data;
    console.log(`✅ Berhasil mengambil ${menus.length} menu.`);
    
    if (menus.length > 0) {
      createdMenuId = menus[0].id; // Ambil menu pertama untuk di-test
    } else {
      console.log('⚠️ Tidak ada menu untuk di test. Silakan jalankan seeder.');
      return;
    }

    // 4. Test Tambah Keranjang
    console.log('\nTesting [POST] /api/cart...');
    await axios.post(`${API_URL}/cart`, {
      menu_id: createdMenuId,
      quantity: 2
    }, authConfig);
    console.log('✅ Berhasil menambah ke keranjang.');

    // 5. Test Ambil Keranjang
    console.log('\nTesting [GET] /api/cart...');
    const cartRes = await axios.get(`${API_URL}/cart`, authConfig);
    console.log(`✅ Keranjang berisi ${cartRes.data.data.length} item.`);

    // 6. Test Checkout (Order)
    console.log('\nTesting [POST] /api/orders...');
    const orderRes = await axios.post(`${API_URL}/orders`, {
      delivery_address: 'Jalan Test E2E No. 99, Jakarta'
    }, authConfig);
    console.log('✅ Checkout Berhasil. ID Order:', orderRes.data.data.order_id);

    // 7. Test Tambah Favorit
    console.log('\nTesting [POST] /api/favorites/:menuId...');
    await axios.post(`${API_URL}/favorites/${createdMenuId}`, {}, authConfig);
    console.log('✅ Berhasil menyimpan ke Favorit.');

    // 8. Test Memberikan Ulasan
    console.log('\nTesting [POST] /api/reviews/:menuId...');
    await axios.post(`${API_URL}/reviews/${createdMenuId}`, {
      rating: 5,
      comment: 'Sangat enak! Ini ulasan dari E2E testing.'
    }, authConfig);
    console.log('✅ Berhasil memberikan ulasan bintang 5.');

    console.log('\n🎉 SEMUA TEST BERHASIL DILEWATI TANPA ERROR!');

  } catch (error) {
    console.error('\n❌ ERROR SAAT TESTING:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();
