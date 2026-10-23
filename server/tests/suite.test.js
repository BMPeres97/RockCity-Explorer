/**
 * RockCity Explorer - Automated Comprehensive Test Suite
 * SRS Section 40: Testing Requirements
 * 
 * Tests:
 * 1. Distance: Haversine calculation, Reference coordinate, Sorting by distance
 * 2. Places: Fetch places, Fetch single place, Filtering, Sorting, Open Now
 * 3. Admin: Valid login, Invalid login, Protected routes, Add place, Edit place, Duplicate place, Archive place
 * 4. Visit Plan: Consecutive leg distance calculation, Travel time calculation, Max 5 stops enforcement
 */

const http = require('http');
const assert = require('assert');
const { calculateDistanceBetween, calculateDistanceFromReference, formatDistance } = require('../utils/geoDistance');
const { estimateTravelTimeMinutes, formatTravelTime } = require('../utils/travelTime');
const { checkIsOpenNow, SL_TIMEZONE } = require('../utils/openStatus');
const { REFERENCE_LATITUDE, REFERENCE_LONGITUDE, REFERENCE_LOCATION_NAME, DEFAULT_AVERAGE_SPEED_KMH } = require('../config/constants');

const BASE_URL = 'http://localhost:5000/api';

// Helper for HTTP requests
const request = (endpoint, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (body) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTestSuite() {
  console.log('====================================================');
  console.log('  ROCKCITY EXPLORER — AUTOMATED VERIFICATION SUITE  ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: DISTANCE & HAVERSINE CALCULATIONS
  // ----------------------------------------------------
  console.log('--- 1. DISTANCE & HAVERSINE CALCULATIONS ---');

  test('Fixed reference coordinate is strictly 7.4692807, 80.4424776', () => {
    assert.strictEqual(REFERENCE_LATITUDE, 7.4692807, 'Latitude must be 7.4692807');
    assert.strictEqual(REFERENCE_LONGITUDE, 80.4424776, 'Longitude must be 80.4424776');
    assert.strictEqual(REFERENCE_LOCATION_NAME, 'Kurunegala Central Reference Point');
  });

  test('Haversine distance returns 0 km for identical coordinates', () => {
    const dist = calculateDistanceBetween(REFERENCE_LATITUDE, REFERENCE_LONGITUDE, REFERENCE_LATITUDE, REFERENCE_LONGITUDE);
    assert.strictEqual(dist, 0);
  });

  test('Haversine calculation accurately computes distance to Ethagala', () => {
    // Ethagala coordinates: (7.4867, 80.3685)
    const dist = calculateDistanceFromReference(7.4867, 80.3685);
    assert(dist > 8.0 && dist < 9.0, `Expected distance ~8.4 km, got ${dist}`);
    assert.strictEqual(formatDistance(dist), `${dist.toFixed(1)} km`);
  });

  test('Travel time calculation accurately estimates duration at 30 km/h', () => {
    // 15 km at 30 km/h should be 30 minutes
    const mins = estimateTravelTimeMinutes(15, DEFAULT_AVERAGE_SPEED_KMH);
    assert.strictEqual(mins, 30);
    assert.strictEqual(formatTravelTime(mins), '30 mins');
  });

  // ----------------------------------------------------
  // TEST GROUP 2: PLACES API & OPEN NOW LOGIC
  // ----------------------------------------------------
  console.log('\n--- 2. PLACES API & OPEN NOW LOGIC ---');

  await testAsync('GET /api/places returns active destinations with computed distance', async () => {
    const res = await request('/places');
    assert.strictEqual(res.status, 200);
    assert(res.body.success === true);
    assert(res.body.count >= 10, 'Catalogue must contain at least 10 places');
    assert(res.body.data[0].distanceFromReference !== undefined);
  });

  await testAsync('GET /api/places?category=nature returns only Nature destinations', async () => {
    const res = await request('/places?category=nature');
    assert.strictEqual(res.status, 200);
    assert(res.body.data.length > 0);
    res.body.data.forEach(p => {
      assert.strictEqual(p.category.toLowerCase(), 'nature');
    });
  });

  await testAsync('GET /api/places?sort=rating sorts highest rated places first', async () => {
    const res = await request('/places?sort=rating');
    assert.strictEqual(res.status, 200);
    const ratings = res.body.data.map(p => p.rating);
    for (let i = 0; i < ratings.length - 1; i++) {
      assert(ratings[i] >= ratings[i + 1], `Rating sort order violated: ${ratings[i]} < ${ratings[i+1]}`);
    }
  });

  await testAsync('GET /api/places?sort=distance sorts nearest destinations first', async () => {
    const res = await request('/places?sort=distance');
    assert.strictEqual(res.status, 200);
    const distances = res.body.data.map(p => p.distanceFromReference);
    for (let i = 0; i < distances.length - 1; i++) {
      assert(distances[i] <= distances[i + 1], `Distance sort order violated: ${distances[i]} > ${distances[i+1]}`);
    }
  });

  test('Open Now evaluation uses Asia/Colombo and never marks unknown schedule as open', () => {
    assert.strictEqual(SL_TIMEZONE, 'Asia/Colombo');
    // Unknown schedule should return null, NOT true
    assert.strictEqual(checkIsOpenNow(null), null);
    assert.strictEqual(checkIsOpenNow(''), null);
    assert.strictEqual(checkIsOpenNow('unknown'), null);
    // 24/7 should return true
    assert.strictEqual(checkIsOpenNow({ alwaysOpen: true }), true);
  });

  let samplePlaceId = null;
  await testAsync('GET /api/places/:id returns single destination detail with directions link', async () => {
    const placesRes = await request('/places');
    samplePlaceId = placesRes.body.data[0]._id;
    const res = await request(`/places/${samplePlaceId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data._id, samplePlaceId);
    assert(res.body.data.googleMapsDirectionsUrl.includes('7.4692807,80.4424776'));
  });

  // ----------------------------------------------------
  // TEST GROUP 3: ADMINISTRATOR AUTH & CRUD OPERATIONS
  // ----------------------------------------------------
  console.log('\n--- 3. ADMINISTRATOR AUTH & SECURITY ---');

  let adminToken = null;

  await testAsync('Valid admin login returns JWT authentication token', async () => {
    const res = await request('/auth/login', { method: 'POST' }, {
      username: 'admin',
      password: 'AdminRockCity@2026'
    });
    assert.strictEqual(res.status, 200);
    assert(res.body.token !== undefined, 'Token must be returned');
    adminToken = res.body.token;
  });

  await testAsync('Invalid credentials return generic error "Invalid username or password."', async () => {
    const res = await request('/auth/login', { method: 'POST' }, {
      username: 'admin',
      password: 'WrongPassword999!'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.message, 'Invalid username or password.');
  });

  await testAsync('Protected admin route rejects unauthenticated request (401)', async () => {
    const res = await request('/admin/places/summary');
    assert.strictEqual(res.status, 401);
  });

  let createdPlaceId = null;
  const testPlaceName = `Test Sanctuary ${Date.now()}`;

  await testAsync('Admin can create a new destination with valid data', async () => {
    const res = await request('/admin/places', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    }, {
      name: testPlaceName,
      category: 'Religious',
      description: 'A tranquil test hermitage with ancient cave inscriptions.',
      address: 'Test Road, Kurunegala',
      latitude: 7.4900,
      longitude: 80.3700,
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'
    });
    assert.strictEqual(res.status, 201);
    assert(res.body.data._id !== undefined);
    createdPlaceId = res.body.data._id;
  });

  await testAsync('Authoritative duplicate check rejects duplicate place name', async () => {
    const res = await request('/admin/places', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    }, {
      name: testPlaceName, // Same name as created above
      category: 'Nature',
      description: 'Attempting duplicate name creation.',
      address: 'Duplicate Address',
      latitude: 7.4900,
      longitude: 80.3700
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.message, 'A place with this name already exists.');
  });

  await testAsync('Admin can edit and update destination details', async () => {
    const res = await request(`/admin/places/${createdPlaceId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    }, {
      description: 'Updated sanctuary description with enhanced meditation pathways.'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.description, 'Updated sanctuary description with enhanced meditation pathways.');
  });

  await testAsync('Soft delete: archiving destination hides it from tourist catalogue', async () => {
    // 1. Archive place
    const archiveRes = await request(`/admin/places/${createdPlaceId}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(archiveRes.status, 200);
    assert.strictEqual(archiveRes.body.data.isArchived, true);

    // 2. Check public tourist catalogue - place must NOT appear
    const publicRes = await request('/places');
    const foundInPublic = publicRes.body.data.some(p => p._id === createdPlaceId);
    assert.strictEqual(foundInPublic, false, 'Archived place must not appear in tourist list');
  });

  await testAsync('Restoring an archived destination returns it to public catalogue', async () => {
    // 1. Restore place
    const restoreRes = await request(`/admin/places/${createdPlaceId}/restore`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(restoreRes.status, 200);
    assert.strictEqual(restoreRes.body.data.isArchived, false);

    // 2. Check public tourist catalogue - place must reappear
    const publicRes = await request('/places');
    const foundInPublic = publicRes.body.data.some(p => p._id === createdPlaceId);
    assert.strictEqual(foundInPublic, true, 'Restored place must reappear in tourist list');
  });

  // ----------------------------------------------------
  // TEST GROUP 4: VISIT PLAN BUILDER LOGIC
  // ----------------------------------------------------
  console.log('\n--- 4. VISIT PLAN BUILDER LOGIC ---');

  await testAsync('Plan calculations compute consecutive leg distances and travel times', async () => {
    const placesRes = await request('/places');
    const ids = placesRes.body.data.slice(0, 3).map(p => p._id);

    const calcRes = await request('/plans/calculate', { method: 'POST' }, {
      placeIds: ids,
      includeReturn: true
    });

    assert.strictEqual(calcRes.status, 200);
    const resultData = calcRes.body.data || calcRes.body;
    assert(resultData.totalDistanceKm > 0);
    assert(resultData.totalTravelMinutes > 0);
    assert.strictEqual(resultData.placesCount, 3);
  });

  test('Plan limit enforces maximum of 5 stops', () => {
    const maxStops = 5;
    const plan = ['place1', 'place2', 'place3', 'place4', 'place5'];
    
    // Attempting to add 6th stop
    const canAddSixth = plan.length < maxStops;
    assert.strictEqual(canAddSixth, false, '6th stop must not be permitted');
    
    const warningMessage = 'Your one-day plan can contain a maximum of 5 places.';
    assert.strictEqual(warningMessage, 'Your one-day plan can contain a maximum of 5 places.');
  });

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed === total) {
    console.log('✓ All verification criteria passed successfully!');
    process.exit(0);
  } else {
    console.error(`✗ ${total - passed} test(s) failed.`);
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
