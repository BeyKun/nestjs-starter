import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DomainModule } from '../src/domain/domain.module';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';

describe('DomainController (e2e)', () => {
  let app: INestApplication;
  let domain_id: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DomainModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginStub, password: process.env.TEST_PASSWORD })
      .expect(201);

    token = body.data.access_token;
  });

  it('/domain (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/domain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
        description: 'Test',
        parent_id: null,
      })
      .expect(201);

    domain_id = body.data.id;
    expect(body).toBeDefined();
  });

  it('/domain (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/domain')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data).not.toHaveLength(0);
  });

  it('/domain/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/domain/' + domain_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeDefined();
  });

  it('/domain/:id (PATCH)', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/domain/' + domain_id)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test2',
        description: 'Test2',
      })
      .expect(200);

    expect(body.data).toBeDefined();
  });

  it('/domain/:id (DELETE)', async () => {
    const { body } = await request(app.getHttpServer())
      .delete('/domain/' + domain_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toEqual(null);
  });
});
