import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DomainModule } from '../src/domain/domain.module';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';

describe('DomainController (e2e)', () => {
  let app: INestApplication;
  let domain_id: string;
  let search: string;
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

  describe('create', () => {
    it('should return create domain', async () => {
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
      search = body.data.name;
      expect(body).toBeDefined();
    });

    it('should return error validation', async () => {
      await request(app.getHttpServer())
        .post('/domain')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test',
        })
        .expect(400);
    });
  });

  describe('findAll', () => {
    it('should return all domains', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/domain')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 domain', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/domain?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a domain', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/domain/' + domain_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/domain/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should return updated domain', async () => {
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

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .patch('/domain/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
        })
        .expect(404);
    });
  });

  describe('delete', () => {
    it('should return deleted domain', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/domain/' + domain_id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/domain/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
