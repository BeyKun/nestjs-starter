import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authStub, loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginStub, password: process.env.TEST_PASSWORD });

    access_token = body.data.access_token;
    expect(statusCode).toBe(201);
    expect(body.data).toEqual(authStub);
  });

  it('/auth/profile (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(statusCode).toBe(200);
    expect(body.data).toBeDefined();
  });

  it('/auth/register (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test 2',
        email: 'test2@mail.com',
        password: 'test123',
      });

    expect(statusCode).toBe(201);
    expect(body.data).toBeDefined();

    //delete after test
    await request(app.getHttpServer())
      .delete('/users/' + body.data.id)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
});
