import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ModulesModule } from '../src/modules/modules.module';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('ModulesController (e2e)', () => {
  let app: INestApplication;
  let modules_id: string;
  let search: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ModulesModule, AuthModule],
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
    it('should return create modules', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/modules')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
          description: 'Test',
          constant: 'TEST',
        })
        .expect(201);

      modules_id = body.data.id;
      search = body.data.name;
      expect(body).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all modules', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/modules')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 modules', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/modules?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a modules', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/modules/' + modules_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/modules/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should return updated modules', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/modules/' + modules_id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
          description: 'Test2',
          constant: 'TEST2',
        })
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .patch('/modules/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
        })
        .expect(404);
    });
  });

  describe('delete', () => {
    it('should return deleted modules', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/modules/' + modules_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/modules/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
