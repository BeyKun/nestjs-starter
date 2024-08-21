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

  beforeEach(async () => {
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

  it('/users (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(registerStub)
      .expect(201);

    user_id = body.data.id;
    expect(body.data.id).toBeDefined();
    expect(body.data.name).toBe('Unit Test');
    expect(body.data.email).toBe('unittest@mail.com');
  });

  it('/users (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data).not.toHaveLength(0);
  });

  it('/users/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/' + user_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data.id).toBeDefined();
    expect(body.data.name).toBe('Unit Test');
    expect(body.data.email).toBe('unittest@mail.com');
  });

  it('/users/:id (PATCH)', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/users/' + user_id)
      .send(registerStub)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data.id).toBeDefined();
    expect(body.data.name).toBe('Unit Test');
    expect(body.data.email).toBe('unittest@mail.com');
  });

  it('/users/:id (DELETE)', async () => {
    const { body } = await request(app.getHttpServer())
      .delete('/users/' + user_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeNull();
  });
});
