import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RolesModule } from '../src/roles/roles.module';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  let roles_id: string;
  let search: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RolesModule, AuthModule],
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
    it('should return create roles', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
          description: 'Test',
        })
        .expect(201);

      roles_id = body.data.id;
      search = body.data.name;
      expect(body).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 roles', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/roles?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a roles', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/roles/' + roles_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/roles/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should return updated roles', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/roles/' + roles_id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
          description: 'Test2',
        })
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .patch('/roles/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
        })
        .expect(404);
    });
  });

  describe('delete', () => {
    it('should return deleted roles', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/roles/' + roles_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/roles/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
