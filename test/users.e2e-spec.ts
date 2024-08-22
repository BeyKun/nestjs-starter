import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { loginStub, registerStub } from '../src/auth/test/stubs/auth.stub';
import { UsersModule } from '../src/users/users.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let user_id: string;
  let token: string;
  let search: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginStub, password: process.env.TEST_PASSWORD })
      .expect(201);

    token = body.data.access_token;
  });

  describe('create', () => {
    it('should return created user', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(registerStub)
        .expect(201);

      user_id = body.data.id;
      search = body.data.name;
      expect(body.data.id).toBeDefined();
      expect(body.data.name).toBe('Unit Test');
      expect(body.data.email).toBe('unittest@mail.com');
    });

    it('should return validation error', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'test', email: 'unittest@mail.com' })
        .expect(400);
    });

    it('should return validation error email already exist', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(registerStub)
        .expect(422);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 user', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/' + user_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data.id).toBeDefined();
      expect(body.data.name).toBe('Unit Test');
      expect(body.data.email).toBe('unittest@mail.com');
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/users/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should return updated user', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/users/' + user_id)
        .send(registerStub)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data.id).toBeDefined();
      expect(body.data.name).toBe('Unit Test');
      expect(body.data.email).toBe('unittest@mail.com');
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .patch('/users/test')
        .send(registerStub)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('delete', () => {
    it('should return deleted user', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/users/' + user_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeNull();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/users/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
