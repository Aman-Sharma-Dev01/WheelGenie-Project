const BASE = 'http://localhost:5000';
const results = [];

let customerToken, officialToken, adminToken;
let sellRequestId, inspectionId, meetingId, carId;
let marketplaceVehicleId, testDriveId, inquiryId, dealId, paperworkId;
let brandId, modelId, stateId, cityId;
let notificationId, uploadId, listingId;
let bookingId, mechanicId, evaluationId;
let userIdToBlock;

async function req(method, path, body = null, token = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${BASE}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch (e) {
    return { status: 0, data: null, error: e.message };
  }
}

function log(testNum, name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const line = `${icon} Test ${String(testNum).padStart(3, '0')}: ${name}${details ? ' — ' + details : ''}`;
  console.log(line);
  results.push({ testNum, name, passed, details });
}

async function runTests() {
  const ts = Date.now();
  console.log('\n' + '═'.repeat(65));
  console.log('  🚗 WheelGenie API — Comprehensive Test Suite (All 30 API Groups)');
  console.log('═'.repeat(65));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 1 — Server & Auth (Groups 1-5)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 1: Server & Auth ──\n');

  { const r = await req('GET', '/'); log(1, 'GET / (welcome)', r.status === 200 && r.data?.success, `Status: ${r.status}`); }
  { const r = await req('GET', '/health'); log(2, 'GET /health', r.status === 200 && r.data?.success, `Status: ${r.status}`); }
  { const r = await req('GET', '/api/v1/nonexistent'); log(3, '404 route', r.status === 404, `Status: ${r.status}`); }

  // Register customer
  const customerEmail = `cust_${ts}@test.com`;
  let r = await req('POST', '/api/v1/auth/register', { name: 'Test Customer', email: customerEmail, password: 'password123', phone: '9876543210', role: 'customer' });
  customerToken = r.data?.data?.accessToken || '';
  log(4, 'Register customer', r.status === 201 && !!customerToken, `Status: ${r.status}, Token: ${!!customerToken}`);

  // Duplicate
  r = await req('POST', '/api/v1/auth/register', { name: 'Test Customer', email: customerEmail, password: 'password123', phone: '9876543210', role: 'customer' });
  log(5, 'Duplicate email', r.status === 400, `Status: ${r.status}`);

  // Login
  r = await req('POST', '/api/v1/auth/login', { email: customerEmail, password: 'password123' });
  if (r.data?.data?.accessToken) customerToken = r.data.data.accessToken;
  log(6, 'Login', r.status === 200 && !!r.data?.data?.accessToken, `Status: ${r.status}`);

  // Wrong password
  r = await req('POST', '/api/v1/auth/login', { email: customerEmail, password: 'wrong' });
  log(7, 'Login wrong password', r.status === 401, `Status: ${r.status}`);

  // No email
  r = await req('POST', '/api/v1/auth/login', { password: 'password123' });
  log(8, 'Login missing email', r.status === 400, `Status: ${r.status}`);

  // Refresh token
  r = await req('POST', '/api/v1/auth/refresh-token', { refreshToken: 'invalid_refresh_token' });
  log(9, 'Refresh token (invalid)', r.status === 401, `Status: ${r.status}`);

  // Send OTP
  r = await req('POST', '/api/v1/auth/send-otp', { phone: '9876543210', type: 'verify' });
  log(10, 'Send OTP', r.status === 200, `Status: ${r.status}`);

  // Verify OTP (bad code)
  r = await req('POST', '/api/v1/auth/verify-otp', { phone: '9876543210', otp: '000000', type: 'verify' });
  log(11, 'Verify OTP (invalid)', r.status === 400 || r.status === 401, `Status: ${r.status}`);

  // Get Me
  r = await req('GET', '/api/v1/auth/me', null, customerToken);
  log(12, 'Get Me (authenticated)', r.status === 200 && r.data?.data?.user, `User: ${r.data?.data?.user?.name}`);

  // Get Me no token
  r = await req('GET', '/api/v1/auth/me');
  log(13, 'Get Me (no token)', r.status === 401, `Status: ${r.status}`);

  // Update profile
  r = await req('PUT', '/api/v1/auth/update-profile', { name: 'Updated Customer' }, customerToken);
  log(14, 'Update profile', r.status === 200 && r.data?.data?.user?.name === 'Updated Customer', `Name: ${r.data?.data?.user?.name}`);

  // Update location
  r = await req('PUT', '/api/v1/auth/update-location', { coordinates: { type: 'Point', coordinates: [72.8777, 19.076] } }, customerToken);
  log(15, 'Update location', r.status === 200, `Status: ${r.status}`);

  // Forgot password
  r = await req('POST', '/api/v1/auth/forgot-password', { email: customerEmail });
  log(16, 'Forgot password', r.status === 200, `Status: ${r.status}`);

  // Google login (invalid token)
  r = await req('POST', '/api/v1/auth/google-login', { token: 'bad_token' });
  log(17, 'Google login (invalid)', r.status === 400, `Status: ${r.status}`);

  // Logout
  r = await req('POST', '/api/v1/auth/logout');
  log(18, 'Logout', r.status === 200, `Status: ${r.status}`);

  // Register official + admin
  const officialEmail = `off_${ts}@test.com`;
  r = await req('POST', '/api/v1/auth/register', { name: 'Test Official', email: officialEmail, password: 'password123', phone: '9876543211', role: 'official' });
  officialToken = r.data?.data?.accessToken || '';
  log(19, 'Register official', r.status === 201 && !!officialToken, `Status: ${r.status}`);

  const adminEmail = `admin_${ts}@test.com`;
  r = await req('POST', '/api/v1/auth/register', { name: 'Test Admin', email: adminEmail, password: 'password123', phone: '9876543212', role: 'admin' });
  adminToken = r.data?.data?.accessToken || '';
  log(20, 'Register admin', r.status === 201 && !!adminToken, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 2 — Booking APIs (Group 3)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 2: Booking Mechanics ──\n');

  // Get all mechanics
  r = await req('GET', '/api/v1/mechanics');
  const mechanics = r.data?.data?.mechanics || r.data?.data?.users || [];
  mechanicId = mechanics[0]?._id || '';
  log(21, 'Get all mechanics', r.status === 200, `Status: ${r.status}, Count: ${mechanics.length}`);

  // Get mechanic by ID
  if (mechanicId) {
    r = await req('GET', `/api/v1/mechanics/${mechanicId}`);
    log(22, 'Get mechanic by ID', r.status === 200, `Status: ${r.status}`);
  } else log(22, 'Get mechanic by ID', false, 'SKIPPED: no mechanics available');

  // Create booking requires mechanic + vehicle — skip if no mechanic
  if (mechanicId) {
    r = await req('POST', '/api/v1/bookings', { mechanicId, vehicleId: '507f1f77bcf86cd799439011', service: 'Full engine service and oil change required', date: new Date(Date.now() + 86400000).toISOString() }, customerToken);
    bookingId = r.data?.data?.booking?._id || '';
    log(23, 'Create booking', r.status === 201 || r.status === 200, `Status: ${r.status}, ID: ${bookingId || 'N/A'}`);
  } else log(23, 'Create booking', false, 'SKIPPED: no mechanic');

  // Get my bookings
  r = await req('GET', '/api/v1/bookings/my', null, customerToken);
  log(24, 'Get my bookings', r.status === 200, `Status: ${r.status}`);

  // Get booking by ID
  if (bookingId) {
    r = await req('GET', `/api/v1/bookings/${bookingId}`, null, customerToken);
    log(25, 'Get booking by ID', r.status === 200, `Status: ${r.status}`);
  } else log(25, 'Get booking by ID', false, 'SKIPPED');

  // Update booking status
  if (bookingId) {
    r = await req('PATCH', `/api/v1/bookings/${bookingId}/status`, { status: 'Cancelled' }, customerToken);
    log(26, 'Update booking status', r.status === 200, `Status: ${r.status}`);
  } else log(26, 'Update booking status', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 3 — Marketplace & Sell Requests (Groups 2, 7)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 3: Marketplace & Sell Requests ──\n');

  // Create sell request (customer)
  r = await req('POST', '/api/v1/sell-requests', { brand: 'BMW', model: '3 Series', variant: '320d', fuel: 'Diesel', transmission: 'Automatic', kms: 25000, year: 2020, ownership: 1, city: 'Mumbai', expectedPrice: 2800000, description: 'Well maintained car' }, customerToken);
  sellRequestId = r.data?.data?.sellRequest?._id || '';
  log(27, 'Create sell request', r.status === 201 && !!sellRequestId, `Status: ${r.status}, ID: ${sellRequestId}`);

  // Get my sell requests
  r = await req('GET', '/api/v1/sell-requests/my', null, customerToken);
  log(28, 'Get my sell requests', r.status === 200, `Status: ${r.status}`);

  // Get sell request by ID
  if (sellRequestId) {
    r = await req('GET', `/api/v1/sell-requests/${sellRequestId}`, null, customerToken);
    log(29, 'Get sell request by ID', r.status === 200, `Status: ${r.status}`);
  } else log(29, 'Get sell request by ID', false, 'SKIPPED');

  // Update sell request
  if (sellRequestId) {
    r = await req('PUT', `/api/v1/sell-requests/${sellRequestId}`, { expectedPrice: 2700000 }, customerToken);
    log(30, 'Update sell request', r.status === 200, `Status: ${r.status}`);
  } else log(30, 'Update sell request', false, 'SKIPPED');

  // Add images to sell request
  if (sellRequestId) {
    r = await req('POST', `/api/v1/sell-requests/${sellRequestId}/images`, { images: [{ url: 'https://example.com/car.jpg' }] }, customerToken);
    log(31, 'Add sell request images', r.status === 200, `Status: ${r.status}`);
  } else log(31, 'Add sell request images', false, 'SKIPPED');

  // Add documents to sell request
  if (sellRequestId) {
    r = await req('POST', `/api/v1/sell-requests/${sellRequestId}/documents`, { documents: [{ name: 'RC', type: 'RC', url: 'https://example.com/rc.pdf' }] }, customerToken);
    log(32, 'Add sell request documents', r.status === 200, `Status: ${r.status}`);
  } else log(32, 'Add sell request documents', false, 'SKIPPED');

  // Cancel sell request
  if (sellRequestId) {
    r = await req('POST', `/api/v1/sell-requests/${sellRequestId}/cancel`, null, customerToken);
    log(33, 'Cancel sell request', r.status === 200, `Status: ${r.status}`);
  } else log(33, 'Cancel sell request', false, 'SKIPPED');

  // Re-create a sell request for admin flow
  r = await req('POST', '/api/v1/sell-requests', { brand: 'Maruti', model: 'Swift', variant: 'ZXi', fuel: 'Petrol', transmission: 'Manual', kms: 15000, year: 2023, ownership: 1, city: 'Delhi', expectedPrice: 650000 }, customerToken);
  sellRequestId = r.data?.data?.sellRequest?._id || sellRequestId;
  log(34, 'Create sell request #2', r.status === 201, `Status: ${r.status}, ID: ${sellRequestId}`);

  // Create marketplace listing
  r = await req('POST', '/api/v1/vehicles', { brand: 'Honda', model: 'City', variant: 'V CVT', fuel: 'Petrol', transmission: 'Automatic', kms: 25000, year: 2022, ownership: 1, city: 'Mumbai', images: ['https://example.com/car1.jpg'], price: 800000, description: 'Well maintained Honda City.' }, customerToken);
  listingId = r.data?.data?.listing?._id || r.data?.data?.vehicle?._id || '';
  marketplaceVehicleId = r.data?.data?.listing?.vehicle?._id || r.data?.data?.vehicle?._id || '';
  log(35, 'Create marketplace listing', r.status === 201 && !!listingId, `Status: ${r.status}, ID: ${listingId}`);

  // Get all listings
  r = await req('GET', '/api/v1/vehicles');
  log(36, 'Get all listings', r.status === 200, `Status: ${r.status}, Count: ${r.data?.data?.listings?.length || 0}`);

  // Get listing by ID
  if (listingId) {
    r = await req('GET', `/api/v1/vehicles/${listingId}`);
    log(37, 'Get listing by ID', r.status === 200, `Status: ${r.status}`);
  } else log(37, 'Get listing by ID', false, 'SKIPPED');

  // Search
  r = await req('GET', '/api/v1/vehicles?search=Honda');
  log(38, 'Search listings (?search=Honda)', r.status === 200, `Status: ${r.status}`);

  // Filter by city
  r = await req('GET', '/api/v1/vehicles?city=Mumbai');
  log(39, 'Filter by city', r.status === 200, `Status: ${r.status}`);

  // Pagination
  r = await req('GET', '/api/v1/vehicles?page=1&limit=2');
  log(40, 'Pagination', r.status === 200 && r.data?.pagination, `Status: ${r.status}, page=${r.data?.pagination?.page}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 4 — Admin Sell Requests & Inspections (Groups 8, 9)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 4: Admin Sell Requests & Inspections ──\n');

  // Admin get all sell requests
  r = await req('GET', '/api/v1/admin/sell-requests', null, adminToken);
  log(41, 'Admin get all sell requests', r.status === 200, `Status: ${r.status}`);

  // Admin get sell request by ID
  if (sellRequestId) {
    r = await req('GET', `/api/v1/admin/sell-requests/${sellRequestId}`, null, adminToken);
    log(42, 'Admin get sell request by ID', r.status === 200, `Status: ${r.status}`);
  } else log(42, 'Admin get sell request by ID', false, 'SKIPPED');

  // Admin schedule inspection
  if (sellRequestId) {
    r = await req('POST', `/api/v1/admin/sell-requests/${sellRequestId}/assign-official`, { officialId: '507f1f77bcf86cd799439011' }, adminToken);
    log(43, 'Assign official to sell request', r.status === 200, `Status: ${r.status}`);
  } else log(43, 'Assign official', false, 'SKIPPED');

  // Create inspection
  if (sellRequestId) {
    r = await req('POST', '/api/v1/inspections', { sellRequestId, scheduledDate: new Date(Date.now() + 86400000).toISOString() }, adminToken);
    inspectionId = r.data?.data?.inspection?._id || '';
    log(44, 'Create inspection', r.status === 201 && !!inspectionId, `Status: ${r.status}, ID: ${inspectionId}`);
  } else log(44, 'Create inspection', false, 'SKIPPED');

  // Get inspection by ID
  if (inspectionId) {
    r = await req('GET', `/api/v1/inspections/${inspectionId}`, null, adminToken);
    log(45, 'Get inspection by ID', r.status === 200, `Status: ${r.status}`);
  } else log(45, 'Get inspection by ID', false, 'SKIPPED');

  // Update inspection
  if (inspectionId) {
    r = await req('PUT', `/api/v1/inspections/${inspectionId}`, { status: 'completed', overallRating: 'good', estimatedValue: 2700000, recommendation: 'accept_as_is' }, adminToken);
    log(46, 'Update inspection', r.status === 200, `Status: ${r.status}`);
  } else log(46, 'Update inspection', false, 'SKIPPED');

  // Upload inspection images
  if (inspectionId) {
    r = await req('POST', `/api/v1/inspections/${inspectionId}/upload-images`, { images: [{ category: 'exterior', url: 'https://example.com/inspection.jpg' }] }, adminToken);
    log(47, 'Upload inspection images', r.status === 200, `Status: ${r.status}`);
  } else log(47, 'Upload inspection images', false, 'SKIPPED');

  // Upload inspection report
  if (inspectionId) {
    r = await req('POST', `/api/v1/inspections/${inspectionId}/upload-report`, { reportUrl: 'https://example.com/report.pdf' }, adminToken);
    log(48, 'Upload inspection report', r.status === 200, `Status: ${r.status}`);
  } else log(48, 'Upload inspection report', false, 'SKIPPED');

  // Mark inspection completed before approving
  if (sellRequestId) {
    r = await req('PUT', `/api/v1/admin/sell-requests/${sellRequestId}/status`, { status: 'inspection_completed' }, adminToken);
    log(48.5, 'Mark sell request inspection completed', r.status === 200, `Status: ${r.status}`);
  } else log(48.5, 'Mark sell request inspection completed', false, 'SKIPPED');

  // Admin approve sell request
  if (sellRequestId) {
    r = await req('POST', `/api/v1/admin/sell-requests/${sellRequestId}/approve`, { listingPrice: 3000000 }, adminToken);
    log(49, 'Approve sell request', r.status === 200, `Status: ${r.status}`);
  } else log(49, 'Approve sell request', false, 'SKIPPED');

  // Admin reject (create dummy for rejection test)
  let rejectId = '';
  r = await req('POST', '/api/v1/sell-requests', { brand: 'Test', model: 'Bad', variant: 'X', fuel: 'Petrol', transmission: 'Manual', kms: 100, year: 2020, ownership: 1, city: 'Test' }, customerToken);
  rejectId = r.data?.data?.sellRequest?._id || '';
  if (rejectId) {
    r = await req('POST', `/api/v1/admin/sell-requests/${rejectId}/reject`, { reason: 'Does not meet standards' }, adminToken);
    log(50, 'Reject sell request', r.status === 200, `Status: ${r.status}`);
  } else log(50, 'Reject sell request', false, 'SKIPPED');

  // Admin request more details
  if (sellRequestId) {
    r = await req('POST', `/api/v1/admin/sell-requests/${sellRequestId}/request-more-details`, { message: 'Please upload insurance document' }, adminToken);
    log(51, 'Request more details', r.status === 200, `Status: ${r.status}`);
  } else log(51, 'Request more details', false, 'SKIPPED');

  // Update sell request status
  if (sellRequestId) {
    r = await req('PUT', `/api/v1/admin/sell-requests/${sellRequestId}/status`, { status: 'listed' }, adminToken);
    log(52, 'Update sell request status', r.status === 200, `Status: ${r.status}`);
  } else log(52, 'Update sell request status', false, 'SKIPPED');

  // Customer cannot access admin routes
  r = await req('GET', '/api/v1/admin/sell-requests', null, customerToken);
  log(53, 'Customer blocked from admin sell-requests', r.status === 403, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 5 — Meeting APIs (Groups 10, 11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 5: Meetings ──\n');

  // Admin creates meeting
  r = await req('POST', '/api/v1/admin/meetings', { sellRequestId: sellRequestId || '507f1f77bcf86cd799439011', type: 'inspection', scheduledDate: new Date(Date.now() + 86400000).toISOString(), durationMinutes: 60 }, adminToken);
  meetingId = r.data?.data?.meeting?._id || '';
  log(54, 'Admin create meeting', r.status === 201 && !!meetingId, `Status: ${r.status}, ID: ${meetingId}`);

  // Admin get all meetings
  r = await req('GET', '/api/v1/admin/meetings', null, adminToken);
  log(55, 'Admin get all meetings', r.status === 200, `Status: ${r.status}`);

  // Admin get meeting by ID
  if (meetingId) {
    r = await req('GET', `/api/v1/admin/meetings/${meetingId}`, null, adminToken);
    log(56, 'Admin get meeting by ID', r.status === 200, `Status: ${r.status}`);
  } else log(56, 'Admin get meeting by ID', false, 'SKIPPED');

  // Admin update meeting status
  if (meetingId) {
    r = await req('PUT', `/api/v1/admin/meetings/${meetingId}/status`, { status: 'confirmed' }, adminToken);
    log(57, 'Admin update meeting status', r.status === 200, `Status: ${r.status}`);
  } else log(57, 'Admin update meeting status', false, 'SKIPPED');

  // Client gets my meetings
  r = await req('GET', '/api/v1/meetings/my', null, customerToken);
  log(58, 'Client get my meetings', r.status === 200, `Status: ${r.status}`);

  // Client confirm meeting (already confirmed by admin, expect 400)
  if (meetingId) {
    r = await req('POST', `/api/v1/meetings/${meetingId}/confirm`, null, customerToken);
    log(59, 'Client confirm meeting (already confirmed)', r.status === 400, `Status: ${r.status}`);
  } else log(59, 'Client confirm meeting (already confirmed)', false, 'SKIPPED');

  // Client reschedule meeting
  let newMeetingId = '';
  if (meetingId) {
    r = await req('POST', `/api/v1/meetings/${meetingId}/reschedule`, { preferredDate: new Date(Date.now() + 172800000).toISOString(), reason: 'Conflict' }, customerToken);
    newMeetingId = r.data?.data?.meeting?._id || '';
    log(60, 'Client reschedule meeting', r.status === 200, `Status: ${r.status}`);
  } else log(60, 'Client reschedule meeting', false, 'SKIPPED');

  // Client cancel the new meeting (status is 'scheduled')
  if (newMeetingId) {
    r = await req('POST', `/api/v1/meetings/${newMeetingId}/cancel`, { reason: 'Not needed' }, customerToken);
    log(61, 'Client cancel meeting', r.status === 200, `Status: ${r.status}`);
  } else log(61, 'Client cancel meeting', false, 'SKIPPED');

  // Client feedback: create a meeting, complete it, then submit feedback
  let feedbackMeetingId = '';
  if (sellRequestId) {
    r = await req('POST', '/api/v1/admin/meetings', { sellRequestId, type: 'inspection', scheduledDate: new Date(Date.now() + 86400000).toISOString(), durationMinutes: 60 }, adminToken);
    feedbackMeetingId = r.data?.data?.meeting?._id || '';
    if (feedbackMeetingId) {
      r = await req('PUT', `/api/v1/admin/meetings/${feedbackMeetingId}/status`, { status: 'confirmed' }, adminToken);
      r = await req('PUT', `/api/v1/admin/meetings/${feedbackMeetingId}/status`, { status: 'completed' }, adminToken);
      r = await req('POST', `/api/v1/meetings/${feedbackMeetingId}/feedback`, { feedback: 'Great service', rating: 5 }, customerToken);
      log(62, 'Client meeting feedback', r.status === 200, `Status: ${r.status}`);
    } else log(62, 'Client meeting feedback', false, 'SKIPPED');
  } else log(62, 'Client meeting feedback', false, 'SKIPPED');

  // Admin delete meeting (create one first)
  r = await req('POST', '/api/v1/admin/meetings', { sellRequestId: sellRequestId || '507f1f77bcf86cd799439011', type: 'inspection', scheduledDate: new Date(Date.now() + 86400000).toISOString() }, adminToken);
  const delMeetingId = r.data?.data?.meeting?._id || '';
  if (delMeetingId) {
    r = await req('DELETE', `/api/v1/admin/meetings/${delMeetingId}`, null, adminToken);
    log(63, 'Admin delete meeting', r.status === 200, `Status: ${r.status}`);
  } else log(63, 'Admin delete meeting', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 6 — Car APIs (Groups 12, 13)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 6: Car Listings ──\n');

  // Admin creates car
  r = await req('POST', '/api/v1/admin/cars', { brand: 'Mercedes', model: 'C-Class', variant: 'C220d', fuel: 'Diesel', transmission: 'Automatic', kms: 10000, year: 2023, ownership: 1, city: 'Mumbai', listingPrice: 4500000 }, adminToken);
  carId = r.data?.data?.car?._id || '';
  log(64, 'Admin create car', r.status === 201 && !!carId, `Status: ${r.status}, ID: ${carId}`);

  // Public get cars
  r = await req('GET', '/api/v1/cars');
  log(65, 'Public get cars', r.status === 200, `Status: ${r.status}, Count: ${r.data?.data?.cars?.length || 0}`);

  // Public get featured
  r = await req('GET', '/api/v1/cars/featured');
  log(66, 'Public get featured cars', r.status === 200, `Status: ${r.status}`);

  // Public get latest
  r = await req('GET', '/api/v1/cars/latest');
  log(67, 'Public get latest cars', r.status === 200, `Status: ${r.status}`);

  // Public search
  r = await req('GET', '/api/v1/cars/search?q=Mercedes');
  log(68, 'Public search cars (?q=Mercedes)', r.status === 200, `Status: ${r.status}`);

  // Public filter
  r = await req('GET', '/api/v1/cars/filter?brands=Mercedes');
  log(69, 'Public filter cars', r.status === 200, `Status: ${r.status}`);

  // Public get related
  if (carId) {
    r = await req('GET', `/api/v1/cars/related/${carId}`);
    log(70, 'Public get related cars', r.status === 200, `Status: ${r.status}`);
  } else log(70, 'Public get related cars', false, 'SKIPPED');

  // Public get car by ID
  if (carId) {
    r = await req('GET', `/api/v1/cars/${carId}`);
    log(71, 'Public get car by ID', r.status === 200, `Status: ${r.status}`);
  } else log(71, 'Public get car by ID', false, 'SKIPPED');

  // Admin get cars
  r = await req('GET', '/api/v1/admin/cars', null, adminToken);
  log(72, 'Admin get cars', r.status === 200, `Status: ${r.status}`);

  // Admin update car
  if (carId) {
    r = await req('PUT', `/api/v1/admin/cars/${carId}`, { listingPrice: 4400000 }, adminToken);
    log(73, 'Admin update car', r.status === 200, `Status: ${r.status}`);
  } else log(73, 'Admin update car', false, 'SKIPPED');

  // Admin publish car
  if (carId) {
    r = await req('PUT', `/api/v1/admin/cars/${carId}/publish`, null, adminToken);
    log(74, 'Admin publish car', r.status === 200, `Status: ${r.status}`);
  } else log(74, 'Admin publish car', false, 'SKIPPED');

  // Admin mark car reserved
  if (carId) {
    r = await req('PUT', `/api/v1/admin/cars/${carId}/reserved`, null, adminToken);
    log(75, 'Admin reserve car', r.status === 200, `Status: ${r.status}`);
  } else log(75, 'Admin reserve car', false, 'SKIPPED');

  // Admin mark car unsold
  if (carId) {
    r = await req('PUT', `/api/v1/admin/cars/${carId}/unsold`, null, adminToken);
    log(76, 'Admin unsold car', r.status === 200, `Status: ${r.status}`);
  } else log(76, 'Admin unsold car', false, 'SKIPPED');

  // Admin add car images
  if (carId) {
    r = await req('POST', `/api/v1/admin/cars/${carId}/images`, { images: [{ url: 'https://example.com/benz.jpg' }] }, adminToken);
    log(77, 'Admin add car images', r.status === 200, `Status: ${r.status}`);
  } else log(77, 'Admin add car images', false, 'SKIPPED');

  // Admin add car documents
  if (carId) {
    r = await req('POST', `/api/v1/admin/cars/${carId}/documents`, { documents: [{ name: 'Insurance', type: 'Insurance', url: 'https://example.com/insurance.pdf' }] }, adminToken);
    log(78, 'Admin add car documents', r.status === 200, `Status: ${r.status}`);
  } else log(78, 'Admin add car documents', false, 'SKIPPED');

  // Admin archive car
  if (carId) {
    r = await req('PUT', `/api/v1/admin/cars/${carId}/archive`, null, adminToken);
    log(79, 'Admin archive car', r.status === 200, `Status: ${r.status}`);
  } else log(79, 'Admin archive car', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 7 — Test Drives (Groups 14, 15)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 7: Test Drives ──\n');

  const tdCarId = marketplaceVehicleId || carId || '507f1f77bcf86cd799439011';

  // Client creates test drive
  r = await req('POST', '/api/v1/test-drives', { carId: tdCarId, scheduledDate: new Date(Date.now() + 86400000).toISOString(), notes: 'Want to test' }, customerToken);
  testDriveId = r.data?.data?.testDrive?._id || '';
  log(80, 'Client create test drive', r.status === 201 && !!testDriveId, `Status: ${r.status}, ID: ${testDriveId}`);

  // Client get my test drives
  r = await req('GET', '/api/v1/test-drives/my', null, customerToken);
  log(81, 'Client get my test drives', r.status === 200, `Status: ${r.status}`);

  // Client get test drive by ID
  if (testDriveId) {
    r = await req('GET', `/api/v1/test-drives/${testDriveId}`, null, customerToken);
    log(82, 'Client get test drive by ID', r.status === 200, `Status: ${r.status}`);
  } else log(82, 'Client get test drive by ID', false, 'SKIPPED');

  // Client reschedule
  if (testDriveId) {
    r = await req('PUT', `/api/v1/test-drives/${testDriveId}/reschedule`, { newDate: new Date(Date.now() + 172800000).toISOString(), reason: 'Need more time' }, customerToken);
    log(83, 'Client reschedule test drive', r.status === 200, `Status: ${r.status}`);
  } else log(83, 'Client reschedule test drive', false, 'SKIPPED');

  // Admin get all test drives
  r = await req('GET', '/api/v1/admin/test-drives', null, adminToken);
  log(84, 'Admin get all test drives', r.status === 200, `Status: ${r.status}`);

  // Admin approve test drive
  if (testDriveId) {
    r = await req('POST', `/api/v1/admin/test-drives/${testDriveId}/approve`, {}, adminToken);
    log(85, 'Admin approve test drive', r.status === 200, `Status: ${r.status}`);
  } else log(85, 'Admin approve test drive', false, 'SKIPPED');

  // Admin complete test drive
  if (testDriveId) {
    r = await req('POST', `/api/v1/admin/test-drives/${testDriveId}/complete`, { officialNotes: 'Completed successfully' }, adminToken);
    log(86, 'Admin complete test drive', r.status === 200, `Status: ${r.status}`);
  } else log(86, 'Admin complete test drive', false, 'SKIPPED');

  // Client cancel (create new one for cancel test)
  r = await req('POST', '/api/v1/test-drives', { carId: tdCarId, scheduledDate: new Date(Date.now() + 86400000).toISOString() }, customerToken);
  const cancelTdId = r.data?.data?.testDrive?._id || '';
  if (cancelTdId) {
    r = await req('POST', `/api/v1/test-drives/${cancelTdId}/cancel`, { reason: 'Changed mind' }, customerToken);
    log(87, 'Client cancel test drive', r.status === 200, `Status: ${r.status}`);
  } else log(87, 'Client cancel test drive', false, 'SKIPPED');

  // Admin reject test drive (create one)
  r = await req('POST', '/api/v1/test-drives', { carId: tdCarId, scheduledDate: new Date(Date.now() + 86400000).toISOString() }, customerToken);
  const rejectTdId = r.data?.data?.testDrive?._id || '';
  if (rejectTdId) {
    r = await req('POST', `/api/v1/admin/test-drives/${rejectTdId}/reject`, { reason: 'Car unavailable' }, adminToken);
    log(88, 'Admin reject test drive', r.status === 200, `Status: ${r.status}`);
  } else log(88, 'Admin reject test drive', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 8 — Inquiries (Groups 16, 17)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 8: Inquiries ──\n');

  // Client create inquiry
  r = await req('POST', '/api/v1/inquiries', { carId: carId || '507f1f77bcf86cd799439011', subject: 'Price question', message: 'Is the price negotiable?' }, customerToken);
  inquiryId = r.data?.data?.inquiry?._id || '';
  log(89, 'Client create inquiry', r.status === 201 && !!inquiryId, `Status: ${r.status}, ID: ${inquiryId}`);

  // Client get my inquiries
  r = await req('GET', '/api/v1/inquiries/my', null, customerToken);
  log(90, 'Client get my inquiries', r.status === 200, `Status: ${r.status}`);

  // Client get inquiry by ID
  if (inquiryId) {
    r = await req('GET', `/api/v1/inquiries/${inquiryId}`, null, customerToken);
    log(91, 'Client get inquiry by ID', r.status === 200, `Status: ${r.status}`);
  } else log(91, 'Client get inquiry by ID', false, 'SKIPPED');

  // Admin get all inquiries
  r = await req('GET', '/api/v1/admin/inquiries', null, adminToken);
  log(92, 'Admin get all inquiries', r.status === 200, `Status: ${r.status}`);

  // Admin reply to inquiry
  if (inquiryId) {
    r = await req('POST', `/api/v1/admin/inquiries/${inquiryId}/reply`, { message: 'Yes, price is negotiable.' }, adminToken);
    log(93, 'Admin reply to inquiry', r.status === 200, `Status: ${r.status}`);
  } else log(93, 'Admin reply to inquiry', false, 'SKIPPED');

  // Admin update inquiry status
  if (inquiryId) {
    r = await req('PUT', `/api/v1/admin/inquiries/${inquiryId}/status`, { status: 'closed' }, adminToken);
    log(94, 'Admin update inquiry status', r.status === 200, `Status: ${r.status}`);
  } else log(94, 'Admin update inquiry status', false, 'SKIPPED');

  // Client close inquiry
  r = await req('POST', '/api/v1/inquiries', { carId: carId || '507f1f77bcf86cd799439011', subject: 'Test', message: 'Testing close' }, customerToken);
  const closeInqId = r.data?.data?.inquiry?._id || '';
  if (closeInqId) {
    r = await req('POST', `/api/v1/inquiries/${closeInqId}/close`, null, customerToken);
    log(95, 'Client close inquiry', r.status === 200, `Status: ${r.status}`);
  } else log(95, 'Client close inquiry', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 9 — Deals & Paperwork (Groups 18, 19, 20, 21)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 9: Deals & Paperwork ──\n');

  // Admin creates deal
  r = await req('POST', '/api/v1/admin/deals', { carId: carId || '507f1f77bcf86cd799439011', clientId: '507f1f77bcf86cd799439011', agreedPrice: 4300000 }, adminToken);
  dealId = r.data?.data?.deal?._id || '';
  log(96, 'Admin create deal', r.status === 201 && !!dealId, `Status: ${r.status}, ID: ${dealId}`);

  // Admin get all deals
  r = await req('GET', '/api/v1/admin/deals', null, adminToken);
  log(97, 'Admin get all deals', r.status === 200, `Status: ${r.status}`);

  // Admin update deal
  if (dealId) {
    r = await req('PUT', `/api/v1/admin/deals/${dealId}`, { agreedPrice: 4250000 }, adminToken);
    log(98, 'Admin update deal', r.status === 200, `Status: ${r.status}`);
  } else log(98, 'Admin update deal', false, 'SKIPPED');

  // Admin update deal status
  if (dealId) {
    r = await req('PUT', `/api/v1/admin/deals/${dealId}/status`, { status: 'pending_payment' }, adminToken);
    log(99, 'Admin update deal status', r.status === 200, `Status: ${r.status}`);
  } else log(99, 'Admin update deal status', false, 'SKIPPED');

  // Client get my deals
  r = await req('GET', '/api/v1/deals/my', null, customerToken);
  log(100, 'Client get my deals', r.status === 200, `Status: ${r.status}`);

  // Admin cancel deal
  if (dealId) {
    r = await req('POST', `/api/v1/admin/deals/${dealId}/cancel`, { reason: 'Test cancellation' }, adminToken);
    log(101, 'Admin cancel deal', r.status === 200, `Status: ${r.status}`);
  } else log(101, 'Admin cancel deal', false, 'SKIPPED');

  // Admin create paperwork
  r = await req('POST', '/api/v1/admin/paperworks', { dealId: dealId || '507f1f77bcf86cd799439011' }, adminToken);
  paperworkId = r.data?.data?.paperwork?._id || '';
  log(102, 'Admin create paperwork', r.status === 201 && !!paperworkId, `Status: ${r.status}, ID: ${paperworkId}`);

  // Admin upload document
  if (paperworkId) {
    r = await req('POST', `/api/v1/admin/paperworks/${paperworkId}/upload`, { name: 'Sale Agreement', type: 'sale_agreement', url: 'https://example.com/agreement.pdf' }, adminToken);
    log(103, 'Admin upload paperwork document', r.status === 200, `Status: ${r.status}`);
  } else log(103, 'Admin upload paperwork document', false, 'SKIPPED');

  // Admin update paperwork status
  if (paperworkId) {
    r = await req('PUT', `/api/v1/admin/paperworks/${paperworkId}/status`, { status: 'completed' }, adminToken);
    log(104, 'Admin update paperwork status', r.status === 200, `Status: ${r.status}`);
  } else log(104, 'Admin update paperwork status', false, 'SKIPPED');

  // Client get my paperworks
  r = await req('GET', '/api/v1/paperworks/my', null, customerToken);
  log(105, 'Client get my paperworks', r.status === 200, `Status: ${r.status}`);

  // Client get paperwork documents (use admin since paperwork belongs to admin)
  if (paperworkId) {
    r = await req('GET', `/api/v1/paperworks/${paperworkId}/documents`, null, adminToken);
    log(106, 'Client get paperwork documents', r.status === 200, `Status: ${r.status}`);
  } else log(106, 'Client get paperwork documents', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 10 — Timeline, Dashboard (Groups 22, 23)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 10: Timeline & Dashboard ──\n');

  // Timeline sell request
  if (sellRequestId) {
    r = await req('GET', `/api/v1/timeline/sell-request/${sellRequestId}`, null, customerToken);
    log(107, 'Timeline sell request', r.status === 200, `Status: ${r.status}`);
  } else log(107, 'Timeline sell request', false, 'SKIPPED');

  // Timeline deal
  if (dealId) {
    r = await req('GET', `/api/v1/timeline/deal/${dealId}`, null, customerToken);
    log(108, 'Timeline deal', r.status === 200, `Status: ${r.status}`);
  } else log(108, 'Timeline deal', false, 'SKIPPED');

  // Timeline paperwork
  if (paperworkId) {
    r = await req('GET', `/api/v1/timeline/paperwork/${paperworkId}`, null, customerToken);
    log(109, 'Timeline paperwork', r.status === 200, `Status: ${r.status}`);
  } else log(109, 'Timeline paperwork', false, 'SKIPPED');

  // Client dashboard
  r = await req('GET', '/api/v1/dashboard/client', null, customerToken);
  log(110, 'Client dashboard', r.status === 200, `Status: ${r.status}`);

  // Admin dashboard
  r = await req('GET', '/api/v1/dashboard/admin', null, adminToken);
  log(111, 'Admin dashboard', r.status === 200, `Status: ${r.status}`);

  // Client cannot access admin dashboard
  r = await req('GET', '/api/v1/dashboard/admin', null, customerToken);
  log(112, 'Customer blocked from admin dashboard', r.status === 403, `Status: ${r.status}`);

  // Client dashboard (via client routes)
  r = await req('GET', '/api/v1/client/dashboard', null, customerToken);
  log(113, 'Client dashboard (client route)', r.status === 200, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 11 — Notifications & Analytics (Groups 24, 25)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 11: Notifications & Analytics ──\n');

  // Get notifications
  r = await req('GET', '/api/v1/notifications', null, customerToken);
  notificationId = r.data?.data?.notifications?.[0]?._id || r.data?.data?.[0]?._id || '';
  log(114, 'Get notifications', r.status === 200, `Status: ${r.status}`);

  // Get notification by ID
  if (notificationId) {
    r = await req('GET', `/api/v1/notifications/${notificationId}`, null, customerToken);
    log(115, 'Get notification by ID', r.status === 200, `Status: ${r.status}`);
  } else log(115, 'Get notification by ID', false, 'SKIPPED, no notifications');

  // Mark read
  if (notificationId) {
    r = await req('PUT', `/api/v1/notifications/read/${notificationId}`, null, customerToken);
    log(116, 'Mark notification read', r.status === 200, `Status: ${r.status}`);
  } else log(116, 'Mark notification read', false, 'SKIPPED');

  // Mark all read
  r = await req('PUT', '/api/v1/notifications/read-all', null, customerToken);
  log(117, 'Mark all notifications read', r.status === 200, `Status: ${r.status}`);

  // Delete notification
  if (notificationId) {
    r = await req('DELETE', `/api/v1/notifications/${notificationId}`, null, customerToken);
    log(118, 'Delete notification', r.status === 200, `Status: ${r.status}`);
  } else log(118, 'Delete notification', false, 'SKIPPED');

  // Client notifications (client route)
  r = await req('GET', '/api/v1/client/notifications', null, customerToken);
  log(119, 'Client notifications', r.status === 200, `Status: ${r.status}`);

  // Client mark notification read
  r = await req('PUT', '/api/v1/client/notification/read-all', null, customerToken);
  log(120, 'Client mark all read', r.status === 200, `Status: ${r.status}`);

  // Analytics
  r = await req('GET', '/api/v1/analytics/overview', null, adminToken);
  log(121, 'Analytics overview', r.status === 200, `Status: ${r.status}`);

  r = await req('GET', '/api/v1/analytics/sales', null, adminToken);
  log(122, 'Analytics sales', r.status === 200, `Status: ${r.status}`);

  r = await req('GET', '/api/v1/analytics/test-drives', null, adminToken);
  log(123, 'Analytics test-drives', r.status === 200, `Status: ${r.status}`);

  r = await req('GET', '/api/v1/analytics/inquiries', null, adminToken);
  log(124, 'Analytics inquiries', r.status === 200, `Status: ${r.status}`);

  r = await req('GET', '/api/v1/analytics/sell-requests', null, adminToken);
  log(125, 'Analytics sell-requests', r.status === 200, `Status: ${r.status}`);

  // Customer blocked from analytics
  r = await req('GET', '/api/v1/analytics/overview', null, customerToken);
  log(126, 'Customer blocked from analytics', r.status === 403, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 12 — Uploads (Group 26)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 12: Uploads ──\n');

  // Delete upload (invalid ID)
  r = await req('DELETE', '/api/v1/uploads/507f1f77bcf86cd799439011', null, adminToken);
  log(127, 'Delete upload (non-existent)', r.status === 404, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 13 — Master Data (Group 27)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 13: Master Data ──\n');

  // Get brands
  r = await req('GET', '/api/v1/master/brands', null, customerToken);
  log(128, 'Get brands', r.status === 200, `Status: ${r.status}`);

  // Admin creates brand
  r = await req('POST', '/api/v1/master/brands', { name: `TestBrand_${ts}` }, adminToken);
  brandId = r.data?.data?.brand?._id || '';
  log(129, 'Admin create brand', r.status === 201 && !!brandId, `Status: ${r.status}, ID: ${brandId}`);

  // Get brand by ID
  if (brandId) {
    r = await req('GET', `/api/v1/master/brands/${brandId}`, null, customerToken);
    log(130, 'Get brand by ID', r.status === 200, `Status: ${r.status}`);
  } else log(130, 'Get brand by ID', false, 'SKIPPED');

  // Admin update brand
  if (brandId) {
    r = await req('PUT', `/api/v1/master/brands/${brandId}`, { name: `UpdatedBrand_${ts}` }, adminToken);
    log(131, 'Admin update brand', r.status === 200, `Status: ${r.status}`);
  } else log(131, 'Admin update brand', false, 'SKIPPED');

  // Admin delete brand
  if (brandId) {
    r = await req('DELETE', `/api/v1/master/brands/${brandId}`, null, adminToken);
    log(132, 'Admin delete brand', r.status === 200, `Status: ${r.status}`);
  } else log(132, 'Admin delete brand', false, 'SKIPPED');

  // Customer blocked from create brand
  r = await req('POST', '/api/v1/master/brands', { name: 'ShouldFail' }, customerToken);
  log(133, 'Customer blocked from creating brand', r.status === 403, `Status: ${r.status}`);

  // Get models
  r = await req('GET', '/api/v1/master/models', null, customerToken);
  log(134, 'Get models', r.status === 200, `Status: ${r.status}`);

  // Admin creates model (requires brandId)
  r = await req('POST', '/api/v1/master/models', { name: `TestModel_${ts}`, brand: '507f1f77bcf86cd799439011' }, adminToken);
  modelId = r.data?.data?.model?._id || '';
  log(135, 'Admin create model', r.status === 201 || r.status === 200, `Status: ${r.status}, ID: ${modelId || 'N/A'}`);

  // Get states
  r = await req('GET', '/api/v1/master/states', null, customerToken);
  log(136, 'Get states', r.status === 200, `Status: ${r.status}`);

  // Admin creates state
  r = await req('POST', '/api/v1/master/states', { name: `TestState_${ts}`, code: (ts & 0xFF).toString(16).padStart(2, '0').toUpperCase() }, adminToken);
  stateId = r.data?.data?.state?._id || '';
  log(137, 'Admin create state', r.status === 201 && !!stateId, `Status: ${r.status}, ID: ${stateId}`);

  // Get state by ID
  if (stateId) {
    r = await req('GET', `/api/v1/master/states/${stateId}`, null, customerToken);
    log(138, 'Get state by ID', r.status === 200, `Status: ${r.status}`);
  } else log(138, 'Get state by ID', false, 'SKIPPED');

  // Get cities
  r = await req('GET', '/api/v1/master/cities', null, customerToken);
  log(139, 'Get cities', r.status === 200, `Status: ${r.status}`);

  // Admin creates city
  if (stateId) {
    r = await req('POST', '/api/v1/master/cities', { name: `TestCity_${ts}`, state: stateId }, adminToken);
    cityId = r.data?.data?.city?._id || '';
    log(140, 'Admin create city', r.status === 201 && !!cityId, `Status: ${r.status}, ID: ${cityId}`);
  } else log(140, 'Admin create city', false, 'SKIPPED');

  // Get cities by state
  if (stateId) {
    r = await req('GET', `/api/v1/master/states/${stateId}/cities`, null, customerToken);
    log(141, 'Get cities by state', r.status === 200, `Status: ${r.status}`);
  } else log(141, 'Get cities by state', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 14 — Wishlist & Compare (Groups 28, 29)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 14: Wishlist & Compare ──\n');

  // Get wishlist
  r = await req('GET', '/api/v1/wishlist', null, customerToken);
  log(142, 'Get wishlist', r.status === 200, `Status: ${r.status}`);

  // Add to wishlist
  if (carId) {
    r = await req('POST', `/api/v1/wishlist/${carId}`, null, customerToken);
    log(143, 'Add to wishlist', r.status === 200, `Status: ${r.status}`);
  } else log(143, 'Add to wishlist', false, 'SKIPPED');

  // Remove from wishlist
  if (carId) {
    r = await req('DELETE', `/api/v1/wishlist/${carId}`, null, customerToken);
    log(144, 'Remove from wishlist', r.status === 200, `Status: ${r.status}`);
  } else log(144, 'Remove from wishlist', false, 'SKIPPED');

  // Get compare
  r = await req('GET', '/api/v1/compare', null, customerToken);
  log(145, 'Get compare list', r.status === 200, `Status: ${r.status}`);

  // Add to compare
  if (carId) {
    r = await req('POST', '/api/v1/compare', { carId }, customerToken);
    log(146, 'Add to compare', r.status === 200, `Status: ${r.status}`);
  } else log(146, 'Add to compare', false, 'SKIPPED');

  // Remove from compare
  if (carId) {
    r = await req('DELETE', `/api/v1/compare/${carId}`, null, customerToken);
    log(147, 'Remove from compare', r.status === 200, `Status: ${r.status}`);
  } else log(147, 'Remove from compare', false, 'SKIPPED');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STAGE 15 — Admin Users (Group 30)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n── Stage 15: Admin Users ──\n');

  // Admin get all users
  r = await req('GET', '/api/v1/admin/users', null, adminToken);
  const users = r.data?.data?.users || r.data?.data || [];
  userIdToBlock = Array.isArray(users) && users.length > 0 ? users[0]._id : '';
  log(148, 'Admin get all users', r.status === 200, `Status: ${r.status}, Count: ${Array.isArray(users) ? users.length : 0}`);

  // Admin get user by ID
  if (userIdToBlock) {
    r = await req('GET', `/api/v1/admin/users/${userIdToBlock}`, null, adminToken);
    log(149, 'Admin get user by ID', r.status === 200, `Status: ${r.status}`);
  } else log(149, 'Admin get user by ID', false, 'SKIPPED');

  // Admin update user
  if (userIdToBlock) {
    r = await req('PUT', `/api/v1/admin/users/${userIdToBlock}`, { name: 'Updated By Admin' }, adminToken);
    log(150, 'Admin update user', r.status === 200, `Status: ${r.status}`);
  } else log(150, 'Admin update user', false, 'SKIPPED');

  // Admin block user
  if (userIdToBlock) {
    r = await req('PUT', `/api/v1/admin/users/${userIdToBlock}/block`, null, adminToken);
    log(151, 'Admin block user', r.status === 200, `Status: ${r.status}`);
  } else log(151, 'Admin block user', false, 'SKIPPED');

  // Admin unblock user
  if (userIdToBlock) {
    r = await req('PUT', `/api/v1/admin/users/${userIdToBlock}/unblock`, null, adminToken);
    log(152, 'Admin unblock user', r.status === 200, `Status: ${r.status}`);
  } else log(152, 'Admin unblock user', false, 'SKIPPED');

  // Admin delete user (create temp user first)
  r = await req('POST', '/api/v1/auth/register', { name: 'Delete Me', email: `delete_${ts}@test.com`, password: 'password123', phone: '9876543213', role: 'customer' });
  const deleteUserId = r.data?.data?.user?._id || '';
  if (deleteUserId) {
    r = await req('DELETE', `/api/v1/admin/users/${deleteUserId}`, null, adminToken);
    log(153, 'Admin delete user', r.status === 200, `Status: ${r.status}`);
  } else log(153, 'Admin delete user', false, 'SKIPPED');

  // Customer blocked from admin users
  r = await req('GET', '/api/v1/admin/users', null, customerToken);
  log(154, 'Customer blocked from admin users', r.status === 403, `Status: ${r.status}`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FINAL REPORT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n' + '═'.repeat(65));
  console.log('  📊 FINAL TEST REPORT');
  console.log('═'.repeat(65));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`\n  Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log(`  Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  const apiGroups = {
    '1. Server': [1, 2, 3],
    '2. Auth': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    '3. Bookings': [21, 22, 23, 24, 25, 26],
    '4. Marketplace': [35, 36, 37, 38, 39, 40],
    '5. Sell Requests': [27, 28, 29, 30, 31, 32, 33, 34],
    '6. Admin Sell Req': [41, 42, 43, 49, 50, 51, 52, 53],
    '7. Inspections': [44, 45, 46, 47, 48],
    '8. Meetings': [54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
    '9. Cars (Public)': [64, 65, 66, 67, 68, 69, 70, 71],
    '10. Cars (Admin)': [64, 72, 73, 74, 75, 76, 77, 78, 79],
    '11. Test Drives': [80, 81, 82, 83, 84, 85, 86, 87, 88],
    '12. Inquiries': [89, 90, 91, 92, 93, 94, 95],
    '13. Deals': [96, 97, 98, 99, 100, 101],
    '14. Paperwork': [102, 103, 104, 105, 106],
    '15. Timeline': [107, 108, 109],
    '16. Dashboard': [110, 111, 112, 113],
    '17. Notifications': [114, 115, 116, 117, 118, 119, 120],
    '18. Analytics': [121, 122, 123, 124, 125, 126],
    '19. Uploads': [127],
    '20. Master Data': [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141],
    '21. Wishlist': [142, 143, 144],
    '22. Compare': [145, 146, 147],
    '23. Admin Users': [148, 149, 150, 151, 152, 153, 154],
    '24. Access Control': [53, 112, 126, 133, 154],
  };

  console.log('  ┌──────────────────────────────┬──────────┐');
  console.log('  │ API Group                     │ Status   │');
  console.log('  ├──────────────────────────────┼──────────┤');
  for (const [group, tests] of Object.entries(apiGroups)) {
    const groupResults = results.filter(r => tests.includes(r.testNum));
    const allPassed = groupResults.length > 0 && groupResults.every(r => r.passed);
    const status = allPassed ? '✅ PASS' : '❌ FAIL';
    console.log(`  │ ${group.padEnd(28)} │ ${status.padEnd(8)} │`);
  }
  console.log('  └──────────────────────────────┴──────────┘');

  if (failed > 0) {
    console.log('\n  ❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`     Test ${String(r.testNum).padStart(3, '0')}: ${r.name} — ${r.details}`);
    });
  }

  console.log('\n' + '═'.repeat(65) + '\n');
}

runTests().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
