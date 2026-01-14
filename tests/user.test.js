import request from 'supertest';
import app from '../src/app.js'; 
import { connectDB, disconnectDB, clearDB } from './setup.js';
import { User } from '../src/models/user.model.js';

import bcrypt from 'bcryptjs';

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('User API', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/v1/users/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('should not register a user with existing email', async () => {
        const hashedPassword = await bcrypt.hash('123', 10);
        await User.create({ username: 'x', email: 'x@example.com', password: hashedPassword });
        const res = await request(app).post('/api/v1/users/register').send({
            username: 'x',
            email: 'x@example.com',
            password: '123'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Email already in use');
    });

    it('should login a user with correct credentials', async () => {
        const hashedPassword = await bcrypt.hash('pass123', 10);
        await User.create({ username: 'user', email: 'user@test.com', password: hashedPassword });
        const res = await request(app).post('/api/v1/users/login').send({
            email: 'user@test.com',
            password: 'pass123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
    });

    it('should not login with wrong password', async () => {
        const hashedPassword = await bcrypt.hash('pass123', 10);
        await User.create({ username: 'user', email: 'user@test.com', password: hashedPassword });
        const res = await request(app).post('/api/v1/users/login').send({
            email: 'user@test.com',
            password: 'wrongpass'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Invalid credentials!');
    });

});
