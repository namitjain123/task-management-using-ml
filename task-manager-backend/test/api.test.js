const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');



jest.setTimeout(30000); // 30 seconds for all tests

jest.mock('../services/mlService', () => ({
  predictTaskPriority: jest.fn().mockResolvedValue('Medium'),
}));

let server;       // to hold server instance
let authToken;
let refreshToken;
let createdTaskId;

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
    server.on('error', (err) => {
      console.error('Server failed to start:', err);
      reject(err);
    });
  });

  try {
    await User.deleteMany({});
    await Task.deleteMany({});
  } catch (err) {
    console.error('DB cleanup failed:', err);
    throw err;
  }
});


afterAll(async () => {
  // Close MongoDB connection and server after tests
  await mongoose.connection.close();
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});

describe('Auth and Task API Integration Tests', () => {
  const user = {
    username: 'testuser',
    email: 'testuser2@example.com',
    password: 'Test1234!',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(user);
    expect(res.statusCode).toBe(201);
  }, 15000); // increase timeout if needed

  it('should login and return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    authToken = res.body.token;
    refreshToken = res.body.refreshToken;
  }, 15000);

  it('should refresh access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  }, 10000);

  it('should get empty tasks list', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      tags: ['test', 'api'],
      dueDate: new Date().toISOString(),
    };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTask);
    expect(res.statusCode).toBe(201);
    createdTaskId = res.body._id || res.body.id;
  }, 15000);

  it('should get tasks list with one task', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update the task', async () => {
    const updatedData = {
      title: 'Updated Test Task',
      description: 'Updated description',
      tags: ['updated'],
    };
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  it('should delete the task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 for deleted task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
});
