import { Test, TestingModule } from '@nestjs/testing';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';

describe('DomainController', () => {
  let controller: DomainController;
  const mockDomainService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomainController],
      providers: [DomainService],
    })
      .overrideProvider(DomainService)
      .useValue(mockDomainService)
      .compile();

    controller = module.get<DomainController>(DomainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
