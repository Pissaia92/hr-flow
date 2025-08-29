import request from 'supertest';
import { app } from '../src/server';

describe('Auth API', () => {
  it('should return 404 for non-existent route', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toEqual(404);
  });

  it('should have health check endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});