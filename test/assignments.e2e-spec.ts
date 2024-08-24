import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { AssignmentsModule } from '../src/assignments/assignments.module';
import { DomainModule } from '../src/domain/domain.module';
import { UsersModule } from '../src/users/users.module';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';

describe('AssignmentController (e2e)', () => {
  let app: INestApplication;
  let assignment_id: string;
  let token: string;
  let user_id: string;
  let domain_id: string;
  let search: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AssignmentsModule, AuthModule, DomainModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginStub, password: process.env.TEST_PASSWORD })
      .expect(201);

    token = body.data.access_token;
  });

  describe('create', () => {
    it('it should create an assignment', async () => {
      const users = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      const domains = await request(app.getHttpServer())
        .get('/domain')
        .set('Authorization', `Bearer ${token}`);

      user_id = users.body.data[0].id;
      search = users.body.data[0].name;
      domain_id = domains.body.data[0].id;

      const { body } = await request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: user_id,
          domain_id: domain_id,
          role: 'ADMIN',
        })
        .expect(201);

      assignment_id = body.data.id;
      expect(body).toBeDefined();
    });

    it('it should return and error validation user not found', async () => {
      await request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: 'test',
          domain_id: 'test',
          role: 'ADMIN',
        })
        .expect(404);
    });

    it('it should return and error validation domain not found', async () => {
      await request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: user_id,
          domain_id: 'test',
          role: 'ADMIN',
        })
        .expect(404);
    });

    it('it should return and error validation role', async () => {
      await request(app.getHttpServer())
        .post('/assignments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: user_id,
          domain_id: domain_id,
          role: 'TEST',
        })
        .expect(400);
    });
  });

  describe('findAll', () => {
    it('should return all assignments', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/assignments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 assignment', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/assignments?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return an assignment', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/assignments/' + assignment_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).not.toBeNull();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/assignments/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should update an assignment', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/assignments/' + assignment_id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'ENGINEER',
        })
        .expect(200);

      expect(body.data.role).toBe('ENGINEER');
    });

    it('should return error validation role', async () => {
      await request(app.getHttpServer())
        .patch('/assignments/' + assignment_id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'TEST',
        })
        .expect(400);
    });
  });

  describe('delete', () => {
    it('should delete an assignment', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/assignments/' + assignment_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/assignments/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
