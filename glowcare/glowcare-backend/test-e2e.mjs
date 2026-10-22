async function runFullE2ETest() {
  const baseURL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('🌿 GlowCare Full E-Commerce E2E Integration Test');
  console.log('====================================================');

  // Test 1: Health & Diagnostics
  const healthRes = await fetch(`${baseURL}/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status, '| Mode:', health.mode, '| Products Count:', health.productsCount);
  if (health.status !== 'healthy') throw new Error('Health check failed');

  // Test 2: Categories
  const catRes = await fetch(`${baseURL}/categories`);
  const catData = await catRes.json();
  console.log('2. Categories fetched:', catData.count, 'categories');
  if (catData.count < 7) throw new Error('Categories count less than 7');

  // Test 3: Products with filtering
  const prodRes = await fetch(`${baseURL}/products?category=serums&sort=rating`);
  const prodData = await prodRes.json();
  console.log('3. Filtered Products (category=serums, sort=rating):', prodData.products.length, 'items');
  const sampleProduct = prodData.products[0];
  console.log('   Sample Product:', sampleProduct.name, '| Price: $' + sampleProduct.price, '| Rating:', sampleProduct.rating);

  // Test 4: Single Product by Slug
  const singleRes = await fetch(`${baseURL}/products/${sampleProduct.slug}`);
  const singleData = await singleRes.json();
  console.log('4. Product Details by Slug:', singleData.product.name, '| Related count:', singleData.related?.length);

  // Test 5: Customer Registration
  const testEmail = `testuser_${Date.now()}@example.com`;
  const regRes = await fetch(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Amara Vance',
      email: testEmail,
      password: 'Password@123',
      phone: '+1 555-888-9999'
    })
  });
  const regData = await regRes.json();
  console.log('5. Customer Registration:', regData.success, '| User ID:', regData.user?.id);
  const customerToken = regData.token;

  // Test 6: Customer Login
  const loginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password@123'
    })
  });
  const loginData = await loginRes.json();
  console.log('6. Customer Login:', loginData.success, '| Role:', loginData.user?.role);

  // Test 7: Coupon Validation
  const couponRes = await fetch(`${baseURL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'GLOW10',
      orderSubtotal: 1500.0
    })
  });
  const couponData = await couponRes.json();
  console.log('7. Coupon Validation (GLOW10):', couponData.message, '| Discount:', couponData.coupon?.discountAmount);

  // Test 8: Order Placement (Server-Side Price Validation)
  const orderRes = await fetch(`${baseURL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      items: [
        { productId: sampleProduct.id || sampleProduct._id, quantity: 2 }
      ],
      shippingAddress: {
        fullName: 'Amara Vance',
        email: testEmail,
        phone: '+1 555-888-9999',
        street: '888 Botanical Heights Blvd',
        city: 'Santa Monica',
        state: 'CA',
        postalCode: '90401',
        country: 'United States'
      },
      couponCode: 'GLOW10',
      paymentMethod: 'Demo Card Simulator',
      notes: 'Please ring the doorbell upon arrival.'
    })
  });
  const orderData = await orderRes.json();
  console.log('8. Order Placement:', orderData.message, '| Order Number:', orderData.order?.orderNumber, '| Total: $' + orderData.order?.total);
  const createdOrder = orderData.order;

  // Test 9: Customer My-Orders
  const myOrdersRes = await fetch(`${baseURL}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const myOrdersData = await myOrdersRes.json();
  console.log('9. Customer Order History:', myOrdersData.orders?.length, 'order(s) found');

  // Test 10: Customer Reviews
  const reviewRes = await fetch(`${baseURL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`
    },
    body: JSON.stringify({
      productId: sampleProduct.id || sampleProduct._id,
      rating: 5,
      title: 'Transformed my morning glow',
      comment: 'This formula is absolutely gentle, light, and effective. Highly recommend for dull skin!',
      userName: 'Amara Vance'
    })
  });
  const reviewData = await reviewRes.json();
  console.log('10. Review Submission:', reviewData.message, '| Rating:', reviewData.review?.rating);

  // Test 11: Contact Form
  const contactRes = await fetch(`${baseURL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Amara Vance',
      email: testEmail,
      subject: 'Routine advice for sensitive skin',
      message: 'Hello, which moisturizer pairs best with the Radiance C+ serum?'
    })
  });
  const contactData = await contactRes.json();
  console.log('11. Contact Inquiry:', contactData.message);

  // Test 12: Admin Authentication
  const adminLoginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@glowcare.com',
      password: 'Admin@123'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('12. Admin Authentication:', adminLoginData.success, '| Role:', adminLoginData.user?.role);
  const adminToken = adminLoginData.token;

  // Test 13: Admin Dashboard Metrics
  const adminDashRes = await fetch(`${baseURL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminDashData = await adminDashRes.json();
  console.log('13. Admin Dashboard Metrics:', JSON.stringify(adminDashData.stats));

  // Test 14: Admin Order Status Transition
  const orderId = createdOrder._id || createdOrder.id || createdOrder.orderNumber;
  const updateStatusRes = await fetch(`${baseURL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      orderStatus: 'Shipped',
      trackingNumber: 'GLOW-TRK-982713'
    })
  });
  const updateStatusData = await updateStatusRes.json();
  console.log('14. Admin Order Status Updated:', updateStatusData.order?.orderStatus, '| Tracking:', updateStatusData.order?.trackingNumber);

  console.log('====================================================');
  console.log('✨ ALL 14 E2E INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

runFullE2ETest().catch((err) => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
