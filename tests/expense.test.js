const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../src/app');

const TEST_DATA_FILE = path.join(__dirname, '../data/expenses.json');

describe('Smart Expense Tracker API', () => {
  beforeEach(async () => {
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  });

  afterAll(async () => {
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  });

  describe('POST /api/expenses', () => {
    it('should create a new expense with valid payload', async () => {
      const payload = {
        title: 'Lunch',
        amount: 15.5,
        category: 'Food',
        date: '2026-08-01'
      };

      const res = await request(app)
        .post('/api/expenses')
        .send(payload);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Lunch');
      expect(res.body.amount).toBe(15.5);
      expect(res.body.category).toBe('Food');
    });

    it('should fail with 400 when missing required fields', async () => {
      const payload = {
        title: 'Coffee'
      };

      const res = await request(app)
        .post('/api/expenses')
        .send(payload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it('should fail with 400 when amount is invalid', async () => {
      const payload = {
        title: 'Books',
        amount: -10,
        category: 'Education',
        date: '2026-08-01'
      };

      const res = await request(app)
        .post('/api/expenses')
        .send(payload);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/expenses', () => {
    it('should return empty list when no expenses exist', async () => {
      const res = await request(app).get('/api/expenses');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all recorded expenses', async () => {
      await request(app).post('/api/expenses').send({
        title: 'Taxi',
        amount: 25.0,
        category: 'Transport',
        date: '2026-08-01'
      });

      const res = await request(app).get('/api/expenses');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Taxi');
    });
  });

  describe('GET /api/expenses/filter', () => {
    it('should filter expenses by category', async () => {
      await request(app).post('/api/expenses').send({
        title: 'Dinner',
        amount: 40.0,
        category: 'Food',
        date: '2026-08-01'
      });
      await request(app).post('/api/expenses').send({
        title: 'Bus Pass',
        amount: 50.0,
        category: 'Transport',
        date: '2026-08-01'
      });

      const res = await request(app)
        .get('/api/expenses/filter')
        .query({ category: 'Food' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Dinner');
    });

    it('should return 400 if category query is missing', async () => {
      const res = await request(app).get('/api/expenses/filter');
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/expenses/total', () => {
    it('should calculate total expense amount across all items', async () => {
      await request(app).post('/api/expenses').send({
        title: 'Item 1',
        amount: 10.0,
        category: 'Work',
        date: '2026-08-01'
      });
      await request(app).post('/api/expenses').send({
        title: 'Item 2',
        amount: 15.5,
        category: 'Personal',
        date: '2026-08-01'
      });

      const res = await request(app).get('/api/expenses/total');
      expect(res.statusCode).toEqual(200);
      expect(res.body.total).toBe(25.5);
      expect(res.body.count).toBe(2);
    });

    it('should calculate total expense amount for specific category', async () => {
      await request(app).post('/api/expenses').send({
        title: 'Item 1',
        amount: 10.0,
        category: 'Work',
        date: '2026-08-01'
      });
      await request(app).post('/api/expenses').send({
        title: 'Item 2',
        amount: 15.5,
        category: 'Personal',
        date: '2026-08-01'
      });

      const res = await request(app)
        .get('/api/expenses/total')
        .query({ category: 'Work' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.total).toBe(10.0);
      expect(res.body.count).toBe(1);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    it('should delete expense when given existing ID', async () => {
      const created = await request(app).post('/api/expenses').send({
        title: 'Cinema',
        amount: 12.0,
        category: 'Entertainment',
        date: '2026-08-01'
      });

      const expenseId = created.body.id;

      const deleteRes = await request(app).delete(`/api/expenses/${expenseId}`);
      expect(deleteRes.statusCode).toEqual(200);
      expect(deleteRes.body.message).toBe('Expense deleted successfully');

      const getAllRes = await request(app).get('/api/expenses');
      expect(getAllRes.body.length).toBe(0);
    });

    it('should return 404 when deleting non-existent ID', async () => {
      const res = await request(app).delete('/api/expenses/non-existent-uuid');
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBe('Expense not found');
    });
  });

  describe('GET /api/docs', () => {
    it('should serve swagger HTML documentation', async () => {
      const res = await request(app).get('/api/docs/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('swagger');
    });
  });
});
