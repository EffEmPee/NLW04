import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('should be to create a new user', async () => {
    const response = await request(app).post('/users')
    .send({
      email: 'user@example.com',
      name: 'User',
    });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a user with a already used e-mail', async () => {
    const response = await request(app).post('/users')
    .send({
      email: 'user@example.com',
      name: 'User',
    });

    expect(response.status).toBe(400);
  });
})