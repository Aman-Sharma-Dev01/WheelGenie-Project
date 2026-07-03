/**
 * WheelGenie API — Comprehensive Test Script
 * Tests all 43 cases across 4 stages
 */

const BASE = 'http://localhost:5000';
const results = [];
let accessToken = '';
let accessToken2 = '';
let resetToken = '';
let listingId = '';
let vehicleId = '';

// Helper to make HTTP requests (no external deps needed — Node 18+ fetch)
async function req(method, path, body = null, token = null) {
  const url = `${BASE}${path}`;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  } catch (e) {
    return { status: 0, data: null, error: e.message };
  }
}

function log(testNum, name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const line = `${icon} Test ${String(testNum).padStart(2, '0')}: ${name}${details ? ' — ' + details : ''}`;
  console.log(line);
  results.push({ testNum, name, passed, details });
}

async function runTests() {
  console.log('\n' + '═'.repeat(60));
  console.log('  🚗 WheelGenie API — Full Test Suite');
  console.log('═'.repeat(60));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 1 — Server Verification
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 1: Server Verification ──\n');

  // Test 1: GET /
  {
    const r = await req('GET', '/');
    log(1, 'GET /', r.status === 200 && r.data?.success === true, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 2: GET /health
  {
    const r = await req('GET', '/health');
    log(2, 'GET /health', r.status === 200 && r.data?.success === true, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 3: GET /api/v1/random-route (404)
  {
    const r = await req('GET', '/api/v1/random-route');
    log(3, 'GET /api/v1/random-route (404)', r.status === 404 && r.data?.success === false, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 2 — Authentication Testing
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 2: Authentication Testing ──\n');

  // Test 4: Register Customer
  {
    const r = await req('POST', '/api/v1/auth/register', {
      name: 'Aman Sharma',
      email: 'aman_test_' + Date.now() + '@gmail.com',
      password: 'password123',
      phone: '9876543210',
      role: 'customer'
    });
    // Save the email for later tests
    globalThis._testEmail = 'aman_test_' + (Date.now() - 1) + '@gmail.com'; // won't match, use actual
    const passed = r.status === 201 && r.data?.success === true && r.data?.data?.accessToken;
    if (r.data?.data?.accessToken) accessToken = r.data.data.accessToken;
    if (r.data?.data?.user?.email) globalThis._testEmail = r.data.data.user.email;
    log(4, 'Register Customer', passed, `Status: ${r.status}, JWT: ${accessToken ? 'YES' : 'NO'}, Email: ${globalThis._testEmail}`);
  }

  // Test 5: Duplicate Email Register (409 or 400)
  {
    const r = await req('POST', '/api/v1/auth/register', {
      name: 'Aman Sharma',
      email: globalThis._testEmail,
      password: 'password123',
      phone: '9876543210',
      role: 'customer'
    });
    const passed = (r.status === 409 || r.status === 400) && r.data?.success === false;
    log(5, 'Duplicate Email Register', passed, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 6: Validation Check (bad data)
  {
    const r = await req('POST', '/api/v1/auth/register', {
      name: 'A',
      email: 'abc',
      password: '12'
    });
    const passed = r.status === 400;
    log(6, 'Validation Check (bad data)', passed, `Status: ${r.status}, Errors: ${JSON.stringify(r.data?.errors?.slice?.(0, 2) || r.data?.message)}`);
  }

  // Test 7: Login
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: globalThis._testEmail,
      password: 'password123'
    });
    const passed = r.status === 200 && r.data?.data?.accessToken;
    if (r.data?.data?.accessToken) accessToken = r.data.data.accessToken;
    log(7, 'Login', passed, `Status: ${r.status}, Token: ${accessToken ? accessToken.substring(0, 20) + '...' : 'NO'}`);
  }

  // Test 8: Wrong Password
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: globalThis._testEmail,
      password: 'wrongpassword'
    });
    log(8, 'Wrong Password', r.status === 401, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 9: Wrong Email
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: 'nonexistent@xyz.com',
      password: 'password123'
    });
    log(9, 'Wrong Email', r.status === 401, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 10: No Password
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: globalThis._testEmail
    });
    log(10, 'No Password (validation)', r.status === 400, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 11: Get Me (with token)
  {
    const r = await req('GET', '/api/v1/auth/me', null, accessToken);
    const passed = r.status === 200 && r.data?.data?.user;
    log(11, 'Get Me (authenticated)', passed, `Status: ${r.status}, User: ${r.data?.data?.user?.name || 'N/A'}`);
  }

  // Test 12: Get Me (without token)
  {
    const r = await req('GET', '/api/v1/auth/me');
    log(12, 'Get Me (no token)', r.status === 401, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 13: Get Me (fake token)
  {
    const r = await req('GET', '/api/v1/auth/me', null, 'abcxyz');
    log(13, 'Get Me (fake token)', r.status === 401, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 14: Update Profile
  {
    const r = await req('PATCH', '/api/v1/auth/profile', {
      name: 'Aman Updated',
      phone: '1234567890'
    }, accessToken);
    const passed = r.status === 200 && r.data?.data?.user?.name === 'Aman Updated';
    log(14, 'Update Profile', passed, `Status: ${r.status}, Name: ${r.data?.data?.user?.name}`);
  }

  // Test 15: Forgot Password
  {
    const r = await req('POST', '/api/v1/auth/forgot-password', {
      email: globalThis._testEmail
    });
    const passed = r.status === 200 && r.data?.data?.resetURL;
    if (r.data?.data?.resetURL) {
      // Extract token from URL
      const parts = r.data.data.resetURL.split('/');
      resetToken = parts[parts.length - 1];
    }
    log(15, 'Forgot Password', passed, `Status: ${r.status}, ResetToken: ${resetToken ? resetToken.substring(0, 15) + '...' : 'NO'}`);
  }

  // Test 16: Reset Password
  {
    if (resetToken) {
      const r = await req('PATCH', `/api/v1/auth/reset-password/${resetToken}`, {
        password: 'newpassword456'
      });
      const passed = r.status === 200;
      log(16, 'Reset Password', passed, `Status: ${r.status}, Message: ${r.data?.message}`);
    } else {
      log(16, 'Reset Password', false, 'SKIPPED: No reset token from test 15');
    }
  }

  // Test 17: Old Password Login (should fail)
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: globalThis._testEmail,
      password: 'password123'
    });
    log(17, 'Old Password Login (should fail)', r.status === 401, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 18: New Password Login
  {
    const r = await req('POST', '/api/v1/auth/login', {
      email: globalThis._testEmail,
      password: 'newpassword456'
    });
    const passed = r.status === 200 && r.data?.data?.accessToken;
    if (r.data?.data?.accessToken) accessToken = r.data.data.accessToken;
    log(18, 'New Password Login', passed, `Status: ${r.status}`);
  }

  // Test 19: Logout
  {
    const r = await req('POST', '/api/v1/auth/logout');
    log(19, 'Logout', r.status === 200, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 3 — Marketplace
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 3: Marketplace Testing ──\n');

  // Test 20: Create Vehicle
  {
    const r = await req('POST', '/api/v1/vehicles', {
      brand: 'Honda',
      model: 'City',
      variant: 'V CVT',
      fuel: 'Petrol',
      transmission: 'Automatic',
      kms: 25000,
      year: 2022,
      ownership: 1,
      city: 'Mumbai',
      images: ['https://example.com/car1.jpg'],
      price: 800000,
      description: 'Well maintained Honda City, single owner, all service records available.'
    }, accessToken);
    const passed = r.status === 201 && r.data?.success === true;
    if (r.data?.data?.listing?._id) listingId = r.data.data.listing._id;
    if (r.data?.data?.listing?.vehicle?._id) vehicleId = r.data.data.listing.vehicle._id;
    log(20, 'Create Vehicle', passed, `Status: ${r.status}, ListingID: ${listingId || 'N/A'}`);
  }

  // Test 21: Create Vehicle Without Token
  {
    const r = await req('POST', '/api/v1/vehicles', {
      brand: 'Honda',
      model: 'City',
      variant: 'V CVT',
      fuel: 'Petrol',
      transmission: 'Automatic',
      kms: 25000,
      year: 2022,
      ownership: 1,
      city: 'Mumbai',
      images: ['https://example.com/car1.jpg'],
      price: 800000,
      description: 'Well maintained Honda City'
    });
    log(21, 'Create Vehicle (no token)', r.status === 401, `Status: ${r.status}`);
  }

  // Test 22: Invalid Body
  {
    const r = await req('POST', '/api/v1/vehicles', {
      brand: '',
      price: -100
    }, accessToken);
    log(22, 'Create Vehicle (invalid body)', r.status === 400, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 23: Missing Brand
  {
    const r = await req('POST', '/api/v1/vehicles', {
      model: 'City',
      variant: 'V CVT',
      fuel: 'Petrol',
      transmission: 'Automatic',
      kms: 25000,
      year: 2022,
      ownership: 1,
      city: 'Mumbai',
      images: ['https://example.com/car1.jpg'],
      price: 800000,
      description: 'Well maintained Honda City, single owner, all service records available.'
    }, accessToken);
    log(23, 'Create Vehicle (missing brand)', r.status === 400, `Status: ${r.status}`);
  }

  // Test 24: Invalid Fuel
  {
    const r = await req('POST', '/api/v1/vehicles', {
      brand: 'Honda',
      model: 'City',
      variant: 'V CVT',
      fuel: 'Water',
      transmission: 'Automatic',
      kms: 25000,
      year: 2022,
      ownership: 1,
      city: 'Mumbai',
      images: ['https://example.com/car1.jpg'],
      price: 800000,
      description: 'Well maintained Honda City, single owner, all service records available.'
    }, accessToken);
    log(24, 'Create Vehicle (invalid fuel: Water)', r.status === 400, `Status: ${r.status}`);
  }

  // Test 25: Invalid Year
  {
    const r = await req('POST', '/api/v1/vehicles', {
      brand: 'Honda',
      model: 'City',
      variant: 'V CVT',
      fuel: 'Petrol',
      transmission: 'Automatic',
      kms: 25000,
      year: 1900,
      ownership: 1,
      city: 'Mumbai',
      images: ['https://example.com/car1.jpg'],
      price: 800000,
      description: 'Well maintained Honda City, single owner, all service records available.'
    }, accessToken);
    // Note: Validator says min 1900 so 1900 might pass. Testing with 1899 as fallback.
    // The test expects 400 for year=1900, but schema says min(1900) which means >= 1900 is valid
    // Let's check and report truthfully
    log(25, 'Create Vehicle (year: 1900)', r.status === 400, `Status: ${r.status}, Message: ${r.data?.message || 'Passed validation (1900 is >= min)'}`);
  }

  // Create another vehicle for search/filter tests
  {
    await req('POST', '/api/v1/vehicles', {
      brand: 'Maruti',
      model: 'Swift',
      variant: 'ZXi',
      fuel: 'Petrol',
      transmission: 'Manual',
      kms: 15000,
      year: 2023,
      ownership: 1,
      city: 'Delhi',
      images: ['https://example.com/car2.jpg'],
      price: 650000,
      description: 'Brand new condition Maruti Swift, first owner, excellent mileage.'
    }, accessToken);
  }

  // Create third vehicle for variety
  {
    await req('POST', '/api/v1/vehicles', {
      brand: 'Honda',
      model: 'Amaze',
      variant: 'S MT',
      fuel: 'Diesel',
      transmission: 'Manual',
      kms: 40000,
      year: 2020,
      ownership: 2,
      city: 'Mumbai',
      images: ['https://example.com/car3.jpg'],
      price: 550000,
      description: 'Honda Amaze diesel, fuel efficient, well maintained second owner car.'
    }, accessToken);
  }

  // Test 26: Get All Vehicles
  {
    const r = await req('GET', '/api/v1/vehicles');
    const passed = r.status === 200 && Array.isArray(r.data?.data?.listings);
    log(26, 'Get All Vehicles', passed, `Status: ${r.status}, Count: ${r.data?.data?.listings?.length || 0}`);
  }

  // Test 27: Pagination
  {
    const r = await req('GET', '/api/v1/vehicles?page=1&limit=2');
    const passed = r.status === 200 &&
      r.data?.pagination?.page === 1 &&
      r.data?.pagination?.limit === 2 &&
      r.data?.pagination?.totalPages !== undefined &&
      r.data?.pagination?.total !== undefined;
    log(27, 'Pagination (?page=1&limit=2)', passed,
      `page=${r.data?.pagination?.page}, limit=${r.data?.pagination?.limit}, totalPages=${r.data?.pagination?.totalPages}, total=${r.data?.pagination?.total}`);
  }

  // Test 28: Search Honda
  {
    const r = await req('GET', '/api/v1/vehicles?search=Honda');
    const passed = r.status === 200 && r.data?.data?.listings?.length > 0;
    const allHonda = r.data?.data?.listings?.every(l => {
      const v = l.vehicle;
      return v && (v.brand?.toLowerCase().includes('honda') || v.model?.toLowerCase().includes('honda') || v.variant?.toLowerCase().includes('honda'));
    });
    log(28, 'Search (?search=Honda)', passed && allHonda, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}, AllHonda: ${allHonda}`);
  }

  // Test 29: Filter City
  {
    const r = await req('GET', '/api/v1/vehicles?city=Mumbai');
    const passed = r.status === 200;
    const allMumbai = r.data?.data?.listings?.every(l => l.vehicle?.city?.toLowerCase().includes('mumbai'));
    log(29, 'Filter (?city=Mumbai)', passed && allMumbai !== false, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}`);
  }

  // Test 30: Brand Filter
  {
    const r = await req('GET', '/api/v1/vehicles?brand=Honda');
    const passed = r.status === 200;
    const allHonda = r.data?.data?.listings?.every(l => l.vehicle?.brand?.toLowerCase().includes('honda'));
    log(30, 'Filter (?brand=Honda)', passed && allHonda !== false, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}`);
  }

  // Test 31: Fuel Filter
  {
    const r = await req('GET', '/api/v1/vehicles?fuel=Petrol');
    const passed = r.status === 200;
    log(31, 'Filter (?fuel=Petrol)', passed, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}`);
  }

  // Test 32: Price Range
  {
    const r = await req('GET', '/api/v1/vehicles?minPrice=500000&maxPrice=1000000');
    const passed = r.status === 200;
    const inRange = r.data?.data?.listings?.every(l => l.price >= 500000 && l.price <= 1000000);
    log(32, 'Price Range (?minPrice=500000&maxPrice=1000000)', passed && inRange !== false, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}`);
  }

  // Test 33: Sort Ascending
  {
    const r = await req('GET', '/api/v1/vehicles?sort=price');
    const passed = r.status === 200;
    const prices = r.data?.data?.listings?.map(l => l.price) || [];
    const ascending = prices.every((p, i) => i === 0 || p >= prices[i - 1]);
    log(33, 'Sort (?sort=price) ascending', passed && ascending, `Status: ${r.status}, Prices: [${prices.join(', ')}]`);
  }

  // Test 34: Sort Descending
  {
    const r = await req('GET', '/api/v1/vehicles?sort=-price');
    const passed = r.status === 200;
    const prices = r.data?.data?.listings?.map(l => l.price) || [];
    const descending = prices.every((p, i) => i === 0 || p <= prices[i - 1]);
    log(34, 'Sort (?sort=-price) descending', passed && descending, `Status: ${r.status}, Prices: [${prices.join(', ')}]`);
  }

  // Test 35: Sort Latest
  {
    const r = await req('GET', '/api/v1/vehicles?sort=latest');
    const passed = r.status === 200;
    const dates = r.data?.data?.listings?.map(l => new Date(l.createdAt).getTime()) || [];
    const newestFirst = dates.every((d, i) => i === 0 || d <= dates[i - 1]);
    log(35, 'Sort (?sort=latest) newest first', passed && newestFirst, `Status: ${r.status}, Results: ${r.data?.data?.listings?.length}`);
  }

  // Test 36: Vehicle By ID
  {
    if (listingId) {
      const r = await req('GET', `/api/v1/vehicles/${listingId}`);
      const passed = r.status === 200 && r.data?.data?.listing;
      log(36, 'Get Vehicle By ID', passed, `Status: ${r.status}, Brand: ${r.data?.data?.listing?.vehicle?.brand}`);
    } else {
      log(36, 'Get Vehicle By ID', false, 'SKIPPED: No listing ID');
    }
  }

  // Test 37: Wrong Vehicle ID (invalid format)
  {
    const r = await req('GET', '/api/v1/vehicles/123');
    log(37, 'Wrong Vehicle ID (123)', r.status === 400 || r.status === 500, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 38: Random Mongo ID (valid format but doesn't exist)
  {
    const r = await req('GET', '/api/v1/vehicles/507f1f77bcf86cd799439011');
    log(38, 'Random Mongo ID (404)', r.status === 404, `Status: ${r.status}, Message: ${r.data?.message}`);
  }

  // Test 39: Update Vehicle
  {
    if (listingId) {
      const r = await req('PATCH', `/api/v1/vehicles/${listingId}`, {
        price: 750000,
        description: 'Updated description - Price negotiable on Honda City'
      }, accessToken);
      const passed = r.status === 200;
      log(39, 'Update Vehicle', passed, `Status: ${r.status}, New Price: ${r.data?.data?.listing?.price}`);
    } else {
      log(39, 'Update Vehicle', false, 'SKIPPED: No listing ID');
    }
  }

  // Test 40: Update Without Token
  {
    if (listingId) {
      const r = await req('PATCH', `/api/v1/vehicles/${listingId}`, {
        price: 700000
      });
      log(40, 'Update Vehicle (no token)', r.status === 401, `Status: ${r.status}`);
    } else {
      log(40, 'Update Vehicle (no token)', false, 'SKIPPED: No listing ID');
    }
  }

  // Test 41: Different User Update (403)
  {
    // Register a second user
    const regR = await req('POST', '/api/v1/auth/register', {
      name: 'Test User 2',
      email: 'testuser2_' + Date.now() + '@gmail.com',
      password: 'password123',
      phone: '9876543211',
      role: 'customer'
    });
    if (regR.data?.data?.accessToken) {
      accessToken2 = regR.data.data.accessToken;
    }

    if (listingId && accessToken2) {
      const r = await req('PATCH', `/api/v1/vehicles/${listingId}`, {
        price: 500000
      }, accessToken2);
      log(41, 'Different User Update (403)', r.status === 403, `Status: ${r.status}, Message: ${r.data?.message}`);
    } else {
      log(41, 'Different User Update (403)', false, 'SKIPPED: No listing ID or second user token');
    }
  }

  // Test 42: Delete Vehicle
  {
    if (listingId) {
      const r = await req('DELETE', `/api/v1/vehicles/${listingId}`, null, accessToken);
      log(42, 'Delete Vehicle', r.status === 200, `Status: ${r.status}, Message: ${r.data?.message}`);
    } else {
      log(42, 'Delete Vehicle', false, 'SKIPPED: No listing ID');
    }
  }

  // Test 43: Delete Again (same ID — 404)
  {
    if (listingId) {
      const r = await req('DELETE', `/api/v1/vehicles/${listingId}`, null, accessToken);
      log(43, 'Delete Again (same ID — 404)', r.status === 404, `Status: ${r.status}, Message: ${r.data?.message}`);
    } else {
      log(43, 'Delete Again (same ID — 404)', false, 'SKIPPED: No listing ID');
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FINAL REPORT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n' + '═'.repeat(60));
  console.log('  📊 FINAL TEST REPORT');
  console.log('═'.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`\n  Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log(`  Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  // Module-wise summary
  const modules = {
    'Server Running': [1],
    'Health Check': [2],
    'Global Error Handler': [3],
    'Register': [4, 5, 6],
    'Login': [7, 8, 9, 10],
    'JWT Authentication': [11, 12, 13],
    'Profile': [14],
    'Forgot Password': [15],
    'Reset Password': [16, 17, 18],
    'Logout': [19],
    'Create Vehicle': [20, 21, 22, 23, 24, 25],
    'Read Vehicle': [26, 36, 37, 38],
    'Update Vehicle': [39, 40],
    'Delete Vehicle': [42, 43],
    'Search': [28],
    'Filters': [29, 30, 31, 32],
    'Sorting': [33, 34, 35],
    'Pagination': [27],
    'Authorization': [41],
    'Validation': [6, 22, 23, 24, 25],
  };

  console.log('  ┌─────────────────────────┬──────────┐');
  console.log('  │ Module                  │ Status   │');
  console.log('  ├─────────────────────────┼──────────┤');
  for (const [mod, testNums] of Object.entries(modules)) {
    const moduleTests = results.filter(r => testNums.includes(r.testNum));
    const allPassed = moduleTests.every(r => r.passed);
    const status = allPassed ? '✅ PASS' : '❌ FAIL';
    console.log(`  │ ${mod.padEnd(23)} │ ${status.padEnd(8)} │`);
  }
  console.log('  └─────────────────────────┴──────────┘');

  if (failed > 0) {
    console.log('\n  ❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`     Test ${r.testNum}: ${r.name} — ${r.details}`);
    });
  }

  console.log('\n' + '═'.repeat(60) + '\n');
}

runTests().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
