const app = require('./src/app');
const prisma = require('./src/config/prisma');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed (${response.status}): ${body.message || response.statusText}`);
  }
  return body;
}

async function run() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const suffix = Date.now();
  const userEmail = `smoke-user-${suffix}@carimakan.test`;
  const adminEmail = `smoke-admin-${suffix}@carimakan.test`;
  const categoryName = `Smoke Category ${suffix}`;
  const restaurantName = `Smoke Restaurant ${suffix}`;
  const menuName = `Smoke Menu ${suffix}`;
  let categoryId;
  let restaurantId;
  let menuId;
  let orderId;

  try {
    const health = await request(baseUrl, '/health');
    assert(health.success, 'health check failed');

    await request(baseUrl, '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Smoke User',
        email: userEmail,
        password: 'password123',
        phone: '080000000001',
      }),
    });

    await request(baseUrl, '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Smoke Admin',
        email: adminEmail,
        password: 'password123',
        phone: '080000000002',
      }),
    });

    await prisma.user.update({ where: { email: adminEmail }, data: { role: 'admin' } });

    const userLogin = await request(baseUrl, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: userEmail, password: 'password123' }),
    });
    const adminLogin = await request(baseUrl, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: adminEmail, password: 'password123' }),
    });

    const userToken = userLogin.data.token;
    const adminToken = adminLogin.data.token;
    assert(userToken && adminToken, 'login did not return tokens');

    const category = await request(baseUrl, '/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ name: categoryName, description: 'Smoke category' }),
    });
    categoryId = category.data.id;

    const restaurant = await request(baseUrl, '/restaurants', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: restaurantName,
        description: 'Smoke restaurant',
        address: 'Smoke Street',
        city: 'Bandar Lampung',
        phone: '081234567890',
        is_active: 1,
      }),
    });
    restaurantId = restaurant.data.id;

    const menu = await request(baseUrl, '/menus', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: menuName,
        description: 'Smoke menu',
        price: 15000,
        stock: 10,
        is_recommended: 1,
        is_active: 1,
      }),
    });
    menuId = menu.data.id;

    const menuList = await request(baseUrl, `/menus?search=${encodeURIComponent(menuName)}`);
    assert(menuList.data.some((item) => item.id === menuId), 'created menu was not returned by menu list');

    const cart = await request(baseUrl, '/cart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ menu_id: menuId, quantity: 2 }),
    });
    assert(cart.data.length === 1, 'cart should contain one item');

    const checkout = await request(baseUrl, '/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        customer_name: 'Smoke User',
        customer_phone: '080000000001',
        delivery_address: 'Smoke checkout address',
        payment_method: 'FAKEPAY',
        notes: 'Smoke test order',
      }),
    });
    orderId = checkout.data.id;
    assert(orderId && checkout.data.status === 'paid', 'checkout did not create paid order');

    const detail = await request(baseUrl, `/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(detail.data.id === orderId, 'order detail id mismatch');
    assert(detail.data.OrderItems.length === 1, 'order detail should include one item');

    console.log('Smoke tests passed.');
  } finally {
    await prisma.user.deleteMany({ where: { email: { in: [userEmail, adminEmail] } } });
    if (menuId) await prisma.menu.deleteMany({ where: { id: menuId } });
    if (restaurantId) await prisma.restaurant.deleteMany({ where: { id: restaurantId } });
    if (categoryId) await prisma.category.deleteMany({ where: { id: categoryId } });
    await prisma.$disconnect();
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
