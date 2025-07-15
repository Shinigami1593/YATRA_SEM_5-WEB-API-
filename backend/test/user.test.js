const request = require('supertest');
const app = require('../index'); // your Express app
const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/admin/Admin');

let userToken;
let adminToken;
let testUserId;

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User and Admin API Tests', () => {

  beforeAll(async () => {
    // Clean users with test emails before starting
    await User.deleteMany({ email: /testuser/ });
    await Admin.deleteMany({ email: /testadmin/ });
  });

  // User Registration - Fail missing fields
  test('User registration fails when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/users/register')
      .send({ email: 'testuser1@example.com' }); // missing other required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

//   // User Registration - Success
  test('User registration succeeds with all fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/users/register')
      .send({
        name: 'Test User',
        email: 'testuser1@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");
  });

//   // User Login - Fail wrong password
  test('User login fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/users/login')
      .send({
        email: 'testuser1@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("Invalid credentials");
  });

//   // User Login - Success
  test('User login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/users/login')
      .send({
        email: 'testuser1@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    // expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));

    userToken = res.body.token;
  });

//   // Get User Profile - Unauthorized (no token)
  test('Get user profile fails without auth token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/users/profile');

    expect(res.statusCode).toBe(403);
  });

  // Get User Profile - Success
  test('Get user profile succeeds with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/users/profile')
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('testuser1@example.com');
    testUserId = res.body._id;
  });

//   // Update User Profile - Success
  test('Update user profile works', async () => {
    const res = await request(app)
      .put('/api/v1/auth/users/profile')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        name: 'updateduser',
        firstName: 'Updated',
        lastName: 'User'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('updateduser');
  });

//   // Delete User Profile - Success
  test('Delete user profile works', async () => {
    const res = await request(app)
      .delete('/api/v1/auth/users/profile')
      .set('Authorization', 'Bearer ' + userToken);

    expect(res.statusCode).toBe(200);
    // expect(res.body.success).toBe(true);
  });

//   // --- ADMIN TESTS BELOW ---

//   // Admin Registration
//   test('Admin registration succeeds', async () => {
//     const res = await request(app)
//       .post('/api/v1/auth/admin/register')
//       .send({
//         email: 'admin@yatra.com',
//         password: 'yatraadmin123',
//         role: 'admin' // likely handled internally, but send anyway
//       });

//     expect(res.statusCode).toBe(201);
//     // expect(res.body.success).toBe(true);
//   });

//   // Admin Login
  test('Admin login succeeds', async () => {
    const res = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@yatra.com',
        password: 'yatraadmin123'
      });

    expect(res.statusCode).toBe(200);
    // expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));

    adminToken = res.body.token;
  });

//   // Admin get all users
  test('Admin can get all users', async () => {
    const res = await request(app)
      .get('/api/v1/auth/admin/users')
      .set('Authorization', 'Bearer ' + adminToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

});
