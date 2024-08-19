import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authStub, loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginStub);

    expect(statusCode).toBe(201);
    expect(body.data).toEqual(authStub);
  });
});
