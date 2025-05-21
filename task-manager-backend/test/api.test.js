// test/api.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');



beforeAll(async () => {
  // Clear users and tasks to avoid duplicate errors
  await User.deleteMany({});
  await Task.deleteMany({});
});


let authToken;  // store JWT token for authenticated routes
let refreshToken;
let createdTaskId;

describe('Auth and Task API Integration Tests', () => {
  const user = {
    username: 'testuser',
    email: 'testuser2@example.com',
    password: 'Test1234!'
  };

  // Clean up users/tasks from your test DB before/after tests if possible
  // (Optional) You can implement this with mongoose or your DB client

jest.mock('../services/mlService', () => ({
  predictTaskPriority: jest.fn().mockResolvedValue('Medium')
}));


  // 1. Test Signup
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(user);

    expect(res.statusCode).toBe(201);
  });

  // 2. Test Login
  it('should login and return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();

    authToken = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  // 3. Test Refresh Token
  it('should refresh access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // 4. Test Get Tasks (empty initially)
  it('should get empty tasks list', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // 5. Test Create Task
  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      tags: ['test', 'api'],
      dueDate: new Date().toISOString()
    };

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTask);

    expect(res.statusCode).toBe(201);

 // Ensure the task ID is correctly returned
  createdTaskId = res.body._id;
  console.log('Created Task ID:', createdTaskId);  // Log for debugging
  console.log('This is the res body:', res.body);  // Log for debugging

    createdTaskId = res.body._id || res.body.id;  // adjust if needed
  },35000);

  // 6. Test Get Tasks (should have one task)
  it('should get tasks list with one task', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 7. Test Update Task
  it('should update the task', async () => {
    const updatedData = {
      title: 'Updated Test Task',
      description: 'Updated description',
      tags: ['updated']
    };

    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  // 8. Test Delete Task
  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
  });

  // 9. Test Get Deleted Task (should fail)
  it('should return 404 for deleted task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});