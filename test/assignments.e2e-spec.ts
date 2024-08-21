import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { AssignmentsModule } from '../src/assignments/assignments.module';

describe('AssignmentController (e2e)', () => {
  let app: INestApplication;
  let assignment_id: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AssignmentsModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginStub, password: process.env.TEST_PASSWORD })
      .expect(201);

    token = body.data.access_token;
  });

  it('/assignments (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/assignments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: '589074a3-8741-4f97-a628-68fc528f5f25',
        domain_id: '474d7a74-61d4-4d4f-a965-7bad26968b01',
        role: 'ADMIN',
      })
      .expect(201);

    assignment_id = body.data.id;
    expect(body).toBeDefined();
  });

  it('/assignments (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/assignments')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data).not.toHaveLength(0);
  });

  it('/assignments/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/assignments/' + assignment_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toBeDefined();
  });

  it('/assignments/:id (PATCH)', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/assignments/' + assignment_id)
      .set('Authorization', `Bearer ${token}`)
      .send({
        role: 'ADMIN',
      })
      .expect(200);

    expect(body.data).toBeDefined();
  });

  it('/assignments/:id (DELETE)', async () => {
    const { body } = await request(app.getHttpServer())
      .delete('/assignments/' + assignment_id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.data).toEqual(null);
  });
});
