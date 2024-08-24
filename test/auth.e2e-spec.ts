import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authStub, loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let user_id: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginStub, password: process.env.TEST_PASSWORD });

      access_token = body.data.access_token;
      expect(statusCode).toBe(201);
      expect(body.data).toEqual(authStub);
    });

    it('should return unauthenticated', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'wrong@mail.com',
          password: process.env.TEST_PASSWORD,
        })
        .expect(401);
    });
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${access_token}`)
        .send();

      expect(statusCode).toBe(200);
      expect(body.data).toBeDefined();
    });

    it('should return unauthenticated', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer wrong.token`)
        .expect(401);
    });
  });

  describe('register', () => {
    it('should return a registered user', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test 2',
          email: 'test2@mail.com',
          password: 'test123',
        });

      expect(statusCode).toBe(201);
      expect(body.data).toBeDefined();

      user_id = body.data.id;
    });

    it('should return invalid data email already exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test 2',
          email: 'test2@mail.com',
          password: 'test123',
        })
        .expect(422);
    });

    it('should delete user after test', async () => {
      await request(app.getHttpServer())
        .delete('/users/' + user_id)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
    });
  });
});
