const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('Sahay REST API End-to-End Test Suite', () => {
  // Test 1: Health
  test('GET /api/health returns 200 and status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.service, 'Sahay API Backend');
    assert.strictEqual(data.database, 'connected (SQLite)');
  });

  // Test 2: Categories
  test('GET /api/v1/categories returns 8 disability categories', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.count, 8);
    assert.ok(data.data.some(c => c.slug === 'visual-impairment'));
    assert.ok(data.data.some(c => c.slug === 'hearing-impairment'));
    assert.ok(data.data.some(c => c.slug === 'mobility-physical'));
  });

  // Test 3: Category Detail
  test('GET /api/v1/categories/visual-impairment returns all sections, media and quiz', async () => {
    const res = await fetch(`${baseUrl}/api/v1/categories/visual-impairment`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.slug, 'visual-impairment');
    assert.ok(data.data.blocks.length >= 7);
    assert.ok(data.data.media.length >= 1);
    assert.ok(data.data.quiz.length >= 4);
    assert.strictEqual(data.data.quiz[0].correct_index, undefined); // Safety: no answer leaking
  });

  // Test 4: Auth - Invalid Login
  test('POST /api/v1/auth/login fails on incorrect password', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@accessiaid.org', password: 'WrongPassword!' })
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // Test 5: Auth - Successful Admin Login & Cookie Extraction
  let adminCookie = '';
  test('POST /api/v1/auth/login succeeds for admin user and sets httpOnly cookie', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@accessiaid.org', password: 'AdminPass123!' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.role, 'admin');

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie && setCookie.includes('access_token='));
    adminCookie = setCookie.split(';')[0];
  });

  // Test 6: Auth - Registration
  test('POST /api/v1/auth/register creates new user account', async () => {
    const randomEmail = `test_${Date.now()}@example.com`;
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: randomEmail,
        password: 'ValidPassword123'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.name, 'Test Student');
  });

  // Test 7: Search
  test('GET /api/v1/search finds query matches across categories and content', async () => {
    const res = await fetch(`${baseUrl}/api/v1/search?q=screen`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.count > 0);
  });

  // Test 8: Quiz Submission
  test('POST /api/v1/quiz/:categoryId/submit accurately calculates score and explanations', async () => {
    const res = await fetch(`${baseUrl}/api/v1/quiz/cat-visual/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: [
          { question_id: 'qz-v-1', selected_index: 2 }, // Correct (85%)
          { question_id: 'qz-v-2', selected_index: 2 }  // Correct (4.5:1)
        ]
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.score, 2);
    assert.strictEqual(data.data.total, 2);
    assert.strictEqual(data.data.percentage, 100);
    assert.ok(data.data.results[0].explanation.includes('85%'));
  });

  // Test 8b: Submit 5-question set from expanded question pool
  test('POST /api/v1/quiz/:categoryId/submit successfully evaluates a 5-question curated set', async () => {
    const res = await fetch(`${baseUrl}/api/v1/quiz/cat-visual/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: [
          { question_id: 'qz-v-1', selected_index: 2 }, // correct
          { question_id: 'qz-v-2', selected_index: 2 }, // correct
          { question_id: 'qz-v-3', selected_index: 0 }, // correct
          { question_id: 'qz-v-4', selected_index: 1 }, // correct
          { question_id: 'qz-v-6', selected_index: 0 }  // correct
        ]
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.total, 5);
    assert.strictEqual(data.data.score, 5);
    assert.strictEqual(data.data.percentage, 100);
    assert.strictEqual(data.data.passed, true);
  });

  // Test 9: Feedback Submission
  test('POST /api/v1/feedback saves user feedback', async () => {
    const res = await fetch(`${baseUrl}/api/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'The optical simulations are very eye-opening for our class!',
        rating: 5
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // Test 10: Admin Protection & Stats
  test('GET /api/v1/admin/stats rejects unauthenticated requests', async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/stats`);
    assert.strictEqual(res.status, 401);
  });

  test('GET /api/v1/admin/stats accepts authenticated admin cookie', async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/stats`, {
      headers: { Cookie: adminCookie }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.totalCategories >= 8);
    assert.ok(data.data.totalUsers >= 2);
  });

  // Test 11: Swagger Documentation
  test('GET /api/docs/swagger.json returns valid OpenAPI 3.0 specification', async () => {
    const res = await fetch(`${baseUrl}/api/docs/swagger.json`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.openapi, '3.0.3');
    assert.strictEqual(data.info.title, 'Sahay REST API');
  });
});
