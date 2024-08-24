import { Test, TestingModule } from '@nestjs/testing';
import { RoleSettingsController } from './role-settings.controller';

describe('RoleSettingsController', () => {
  let controller: RoleSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleSettingsController],
    }).compile();

    controller = module.get<RoleSettingsController>(RoleSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
