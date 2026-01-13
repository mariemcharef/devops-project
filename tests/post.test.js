import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, clearDB } from './setup.js';
import { Post } from '../src/models/post.model.js';

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('Post API', () => {

    it('should create a new post', async () => {
        const res = await request(app).post('/api/v1/posts/create').send({
            name: 'Test Post',
            description: 'This is a test'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.post).toHaveProperty('id');
        expect(res.body.post.name).toBe('Test Post');
    });

    it('should not create post without required fields', async () => {
        const res = await request(app).post('/api/v1/posts/create').send({
            name: ''
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('All fields are required');
    });

    it('should fetch all posts', async () => {
        await Post.create({ name: 'Post1', description: 'Desc1' });
        await Post.create({ name: 'Post2', description: 'Desc2' });
        const res = await request(app).get('/api/v1/posts/getPosts');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name');
    });

});
