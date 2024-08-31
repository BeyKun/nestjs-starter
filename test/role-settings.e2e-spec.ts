import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RoleSettingsModule } from '../src/role-settings/role-settings.module';
import { loginStub } from '../src/auth/test/stubs/auth.stub';
import { AuthModule } from '../src/auth/auth.module';
import { AllExceptionsFilter } from '../src/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { DomainModule } from '../src/domain/domain.module';
import { RolesModule } from '../src/roles/roles.module';
import { ModulesModule } from '../src/modules/modules.module';

describe('RoleSettingsController (e2e)', () => {
  let app: INestApplication;
  let roleSettingId: string;
  let search: string;
  let token: string;
  let domainId: string;
  let moduleId: string;
  let roleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        RoleSettingsModule,
        AuthModule,
        DomainModule,
        RolesModule,
        ModulesModule,
      ],
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
    it('should return create role settings', async () => {
      const domains = await request(app.getHttpServer())
        .get('/domain')
        .set('Authorization', `Bearer ${token}`);

      const modules = await request(app.getHttpServer())
        .get('/modules')
        .set('Authorization', `Bearer ${token}`);

      const roles = await request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${token}`);

      domainId = domains.body.data[0].id;
      moduleId = modules.body.data[0].id;
      roleId = roles.body.data[0].id;
      search = domains.body.data[0].name;

      const { body } = await request(app.getHttpServer())
        .post('/role-settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          moduleId: moduleId,
          roleId: roleId,
          domainId: domainId,
          action: 'CREATE',
          isAllowed: true,
        })
        .expect(201);

      roleSettingId = body.data.id;
      expect(body).toBeDefined();
    });

    it('should return error module id not found', async () => {
      await request(app.getHttpServer())
        .post('/role-settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          moduleId: 'Test',
          roleId: roleId,
          domainId: domainId,
          action: 'CREATE',
          isAllowed: true,
        })
        .expect(404);
    });

    it('should return error role id not found', async () => {
      await request(app.getHttpServer())
        .post('/role-settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          moduleId: moduleId,
          roleId: 'Test',
          domainId: domainId,
          action: 'CREATE',
          isAllowed: true,
        })
        .expect(404);
    });

    it('should return error domain id not found', async () => {
      await request(app.getHttpServer())
        .post('/role-settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          moduleId: moduleId,
          roleId: roleId,
          domainId: 'test',
          action: 'CREATE',
          isAllowed: true,
        })
        .expect(404);
    });
  });

  describe('findAll', () => {
    it('should return all role settingss', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/role-settings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });

    it('should return at least 1 role settings', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/role-settings?search=' + search)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeInstanceOf(Array);
      expect(body.data).not.toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a role settings', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/role-settings/' + roleSettingId)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .get('/rolesettings/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('update', () => {
    it('should return updated role settings', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/role-settings/' + roleSettingId)
        .set('Authorization', `Bearer ${token}`)
        .send({
          moduleId: moduleId,
          roleId: roleId,
          domainId: domainId,
          action: 'CREATE',
          isAllowed: false,
        })
        .expect(200);

      expect(body.data).toBeDefined();
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .patch('/role-settings/test')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test2',
        })
        .expect(404);
    });
  });

  describe('delete', () => {
    it('should return deleted role settings', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/role-settings/' + roleSettingId)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body.data).toEqual(null);
    });

    it('should return not found', async () => {
      await request(app.getHttpServer())
        .delete('/role-settings/test')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
