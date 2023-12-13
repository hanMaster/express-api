import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let app: App;

beforeAll(async () => {
    app = (await boot).app;
});

let jwt: string;

describe('UserController', () => {
    it('Register - error', async () => {
        const res = await request(app.app).post('/users/register').send({
            email: '1@2.com',
            name: 'e2etest',
            password: '12435',
        });
        expect(res.statusCode).toBe(422);
    });

    it('Login - success', async () => {
        const res = await request(app.app).post('/users/login').send({
            email: '1@2.com',
            password: '1234',
        });
        expect(res.statusCode).toBe(200);
        jwt = res.body.jwt;
        expect(jwt).toBeTruthy();
    });

    it('Login - error', async () => {
        const res = await request(app.app).post('/users/login').send({
            email: '1@2.com',
            password: '12345',
        });
        expect(res.statusCode).toBe(401);
    });

    it('getInfo - error', async () => {
        const res = await request(app.app).get('/users/info').set('Authorization', `Bearer ${jwt}=`);
        expect(res.statusCode).toBe(401);
    });

    it('getInfo - success', async () => {
        const res = await request(app.app).get('/users/info').set('Authorization', `Bearer ${jwt}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.email).toBe('1@2.com');
    });
});

afterAll(() => {
    app.close();
});
