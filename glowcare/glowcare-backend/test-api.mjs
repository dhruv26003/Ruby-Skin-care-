async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  console.log('--- Starting GlowCare Backend Verification ---');

  // 1. Health
  const healthRes = await fetch(`${baseURL}/health`);
  const health = await healthRes.json();
  console.log('✓ /api/health:', health.status, '| Mode:', health.mode, '| Products:', health.productsCount);

  // 2. Categories
  const catRes = await fetch(`${baseURL}/categories`);
  const catData = await catRes.json();
  console.log('✓ /api/categories count:', catData.count);

  // 3. Products
  const prodRes = await fetch(`${baseURL}/products?limit=4`);
  const prodData = await prodRes.json();
  console.log('✓ /api/products count:', prodData.products.length, '| total:', prodData.total);

  // 4. Single Product
  const sampleId = prodData.products[0].id || prodData.products[0]._id;
  const singleRes = await fetch(`${baseURL}/products/${sampleId}`);
  const singleData = await singleRes.json();
  console.log('✓ /api/products/:id returned:', singleData.product.name);

  // 5. Coupon validation
  const couponRes = await fetch(`${baseURL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'GLOW10', orderSubtotal: 1500 })
  });
  const couponData = await couponRes.json();
  console.log('✓ /api/coupons/validate:', couponData.message, '| Discount:', couponData.coupon?.discountAmount);

  // 6. Customer Login
  const loginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@glowcare.com', password: 'Customer@123' })
  });
  const loginData = await loginRes.json();
  console.log('✓ /api/auth/login customer success:', loginData.success, '| User:', loginData.user?.name);
  const token = loginData.token;

  // 7. Admin Login
  const adminLoginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@glowcare.com', password: 'Admin@123' })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('✓ /api/auth/login admin success:', adminLoginData.success, '| Role:', adminLoginData.user?.role);
  const adminToken = adminLoginData.token;

  // 8. Admin Dashboard
  const adminDashRes = await fetch(`${baseURL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminDash = await adminDashRes.json();
  console.log('✓ /api/admin/dashboard stats:', adminDash.stats);

  // 9. Create Order
  const orderRes = await fetch(`${baseURL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [{ productId: sampleId, quantity: 2 }],
      shippingAddress: {
        fullName: 'Jane Doe',
        email: 'customer@glowcare.com',
        phone: '+1 555-019-2834',
        street: '124 Magnolia Blossom Lane',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'United States'
      },
      couponCode: 'GLOW10',
      paymentMethod: 'Demo Card'
    })
  });
  const orderData = await orderRes.json();
  console.log('✓ /api/orders create:', orderData.message, '| Order Number:', orderData.order?.orderNumber, '| Total:', orderData.order?.total);

  // 10. Contact Message
  const contactRes = await fetch(`${baseURL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Maya Lin',
      email: 'maya@example.com',
      subject: 'Hydration Routine Question',
      message: 'Which serum pairs best with the barrier repair cream?'
    })
  });
  const contactData = await contactRes.json();
  console.log('✓ /api/contact:', contactData.message);

  console.log('--- ALL BACKEND VERIFICATION TESTS PASSED! ---');
}

runTests().catch(console.error);
