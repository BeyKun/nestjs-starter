import { Test, TestingModule } from '@nestjs/testing';
import { RoleSettingsService } from './role-settings.service';

describe('RoleSettingsService', () => {
  let service: RoleSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleSettingsService],
    }).compile();

    service = module.get<RoleSettingsService>(RoleSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
