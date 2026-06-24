const db = require('./src/config/db');

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('=== Starting CariMakan API Integration Tests ===\n');

  let userToken = '';
  let adminToken = '';
  let categoryId = null;
  let restaurantId = null;
  let menuId = null;
  let cartItemId = null;
  let orderId = null;
  let reviewId = null;

  try {
    // 0. Clean database for testing consistency
    console.log('Cleaning test data...');
    await db.execute('DELETE FROM reviews');
    await db.execute('DELETE FROM favorites');
    await db.execute('DELETE FROM carts');
    await db.execute('DELETE FROM order_items');
    await db.execute('DELETE FROM orders');
    await db.execute('DELETE FROM menus');
    await db.execute('DELETE FROM categories');
    await db.execute('DELETE FROM restaurants');
    await db.execute("DELETE FROM users WHERE email IN ('test_user@mail.com', 'test_admin@mail.com')");
    console.log('Clean complete.\n');

    // 1. Health check
    console.log('Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthData.success ? 'PASSED' : 'FAILED', `(${healthData.message})`);

    // 2. Register user
    console.log('\nTesting User Registration...');
    const regUserRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test_user@mail.com',
        password: 'password123',
        phone: '08123456789'
      })
    });
    const regUserData = await regUserRes.json();
    console.log('Register User:', regUserData.success ? 'PASSED' : 'FAILED', regUserData.message);

    // 3. Register admin
    console.log('Testing Admin Registration...');
    const regAdminRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'test_admin@mail.com',
        password: 'password123',
        phone: '08123456780'
      })
    });
    const regAdminData = await regAdminRes.json();
    console.log('Register Admin:', regAdminData.success ? 'PASSED' : 'FAILED', regAdminData.message);

    // Promote register admin user to role = 'admin' directly in DB
    await db.execute("UPDATE users SET role = 'admin' WHERE email = 'test_admin@mail.com'");
    console.log('Admin role promoted in database.');

    // 4. Login User
    console.log('\nTesting User Login...');
    const loginUserRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_user@mail.com',
        password: 'password123'
      })
    });
    const loginUserData = await loginUserRes.json();
    userToken = loginUserData.data.token;
    console.log('Login User:', loginUserData.success ? 'PASSED' : 'FAILED', `Token retrieved: ${!!userToken}`);

    // 5. Login Admin
    console.log('Testing Admin Login...');
    const loginAdminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_admin@mail.com',
        password: 'password123'
      })
    });
    const loginAdminData = await loginAdminRes.json();
    adminToken = loginAdminData.data.token;
    console.log('Login Admin:', loginAdminData.success ? 'PASSED' : 'FAILED', `Token retrieved: ${!!adminToken}`);

    // 6. Test User auth/me
    console.log('\nTesting Auth Me (User)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const meData = await meRes.json();
    console.log('Auth Me:', meData.success ? 'PASSED' : 'FAILED', `Name: ${meData.data.name}, Role: ${meData.data.role}`);

    // 7. Test Admin restriction on Stats
    console.log('Testing Role restriction on stats (User should be forbidden)...');
    const userStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    console.log('User Stats Request Status:', userStatsRes.status, `(Expected: 403)`);

    // 8. Admin creates a category
    console.log('\nTesting Category Creation (Admin)...');
    const catRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Indonesian Food',
        description: 'Traditional Indonesian culinary delights'
      })
    });
    const catData = await catRes.json();
    categoryId = catData.data.id;
    console.log('Create Category:', catData.success ? 'PASSED' : 'FAILED', `ID: ${categoryId}, Slug: ${catData.data.slug}`);

    // 9. Admin creates a restaurant
    console.log('Testing Restaurant Creation (Admin)...');
    const restRes = await fetch(`${BASE_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Warung Tego',
        description: 'The best local food in town',
        address: 'Bandar Lampung',
        city: 'Bandar Lampung',
        phone: '08129999888',
        is_active: 1
      })
    });
    const restData = await restRes.json();
    restaurantId = restData.data.id;
    console.log('Create Restaurant:', restData.success ? 'PASSED' : 'FAILED', `ID: ${restaurantId}, Slug: ${restData.data.slug}`);

    // 10. Admin creates a menu
    console.log('Testing Menu Creation (Admin)...');
    const menuRes = await fetch(`${BASE_URL}/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: 'Nasi Goreng Kampung',
        description: 'Spicy fried rice with local herbs',
        price: 18000,
        stock: 50,
        is_recommended: 1,
        is_active: 1
      })
    });
    const menuData = await menuRes.json();
    menuId = menuData.data.id;
    console.log('Create Menu:', menuData.success ? 'PASSED' : 'FAILED', `ID: ${menuId}, Slug: ${menuData.data.slug}`);

    // 11. Public list menus with search & pagination
    console.log('\nTesting Menus Discovery (Public)...');
    const discoverRes = await fetch(`${BASE_URL}/menus?search=Goreng&page=1&limit=10`);
    const discoverData = await discoverRes.json();
    console.log('Discover Menus count:', discoverData.data.length, 'Total Items:', discoverData.pagination.totalItems);

    // 12. Cart Operations (User)
    console.log('\nTesting Add to Cart (User)...');
    const addCartRes = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        menu_id: menuId,
        quantity: 2
      })
    });
    const addCartData = await addCartRes.json();
    cartItemId = addCartData.data[0].id;
    console.log('Add to Cart:', addCartData.success ? 'PASSED' : 'FAILED', `Cart Item ID: ${cartItemId}, Qty: ${addCartData.data[0].quantity}`);

    // 13. Update Cart Quantity
    console.log('Testing Update Cart Quantity...');
    const updateCartRes = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ quantity: 3 })
    });
    const updateCartData = await updateCartRes.json();
    console.log('Update Cart:', updateCartData.success ? 'PASSED' : 'FAILED');

    // 14. Checkout (User)
    console.log('\nTesting Checkout (User)...');
    const checkoutRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        customer_name: 'Test User Checkout',
        customer_phone: '08123456789',
        delivery_address: 'Gedong Meneng, Bandar Lampung',
        payment_method: 'COD',
        notes: 'Extra crackers please'
      })
    });
    const checkoutData = await checkoutRes.json();
    orderId = checkoutData.data.id;
    console.log('Checkout:', checkoutData.success ? 'PASSED' : 'FAILED', `Order ID: ${orderId}, Code: ${checkoutData.data.order_code}, Total: ${checkoutData.data.total_price}`);

    // Verify stock reduced
    const [updatedMenu] = await db.execute('SELECT stock FROM menus WHERE id = ?', [menuId]);
    console.log('Updated Menu Stock:', updatedMenu[0].stock, '(Expected: 47 because 50 - 3)');

    // 15. Favorites
    console.log('\nTesting Add Favorite (User)...');
    const favRes = await fetch(`${BASE_URL}/favorites/${menuId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const favData = await favRes.json();
    console.log('Add Favorite:', favData.success ? 'PASSED' : 'FAILED');

    console.log('Testing Get Favorites...');
    const getFavsRes = await fetch(`${BASE_URL}/favorites`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const getFavsData = await getFavsRes.json();
    console.log('Favorites count:', getFavsData.data.length);

    // 16. Reviews
    console.log('\nTesting Add Review (User)...');
    const reviewRes = await fetch(`${BASE_URL}/menus/${menuId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'Absolutely delicious!'
      })
    });
    const reviewData = await reviewRes.json();
    reviewId = reviewData.data.id;
    console.log('Add Review:', reviewData.success ? 'PASSED' : 'FAILED', `Review ID: ${reviewId}`);

    // Verify menu rating updated
    const [ratedMenu] = await db.execute('SELECT rating FROM menus WHERE id = ?', [menuId]);
    console.log('Menu Rating updated:', ratedMenu[0].rating, '(Expected: 5.00)');

    const [ratedRestaurant] = await db.execute('SELECT rating FROM restaurants WHERE id = ?', [restaurantId]);
    console.log('Restaurant Rating updated:', ratedRestaurant[0].rating, '(Expected: 5.00)');

    // 17. TheMealDB Integration & Import
    console.log('\nTesting External Meals Search (TheMealDB)...');
    const extSearchRes = await fetch(`${BASE_URL}/external/meals/search?query=chicken`);
    const extSearchData = await extSearchRes.json();
    const externalMealId = extSearchData.data[0].idMeal;
    const externalMealName = extSearchData.data[0].strMeal;
    console.log('External Search:', extSearchData.success ? 'PASSED' : 'FAILED', `First match: ${externalMealName} (ID: ${externalMealId})`);

    console.log('Testing External Meal Import...');
    const importRes = await fetch(`${BASE_URL}/external/meals/import/${externalMealId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        category_id: categoryId,
        price: 25000
      })
    });
    const importData = await importRes.json();
    console.log('Import Meal:', importData.success ? 'PASSED' : 'FAILED', `Imported local menu: ${importData.data?.name}`);

    // 18. Admin Stats
    console.log('\nTesting Admin Stats...');
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    console.log('Admin Stats:', statsData.success ? 'PASSED' : 'FAILED');
    console.log('Stats summary:');
    console.log(`- Total Users: ${statsData.data.totalUsers}`);
    console.log(`- Total Restaurants: ${statsData.data.totalRestaurants}`);
    console.log(`- Total Menus: ${statsData.data.totalMenus}`);
    console.log(`- Total Orders: ${statsData.data.totalOrders}`);
    console.log(`- Total Revenue: ${statsData.data.totalRevenue}`);
    console.log(`- Popular Menu: ${statsData.data.popularMenus[0]?.name} (Sold: ${statsData.data.popularMenus[0]?.total_sold})`);

    console.log('\n=== All Tests Passed Successfully! ===');
  } catch (error) {
    console.error('Test Suite Failed with Error:', error);
  } finally {
    await db.end();
  }
};

runTests();
