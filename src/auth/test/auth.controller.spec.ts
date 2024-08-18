import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authStub, loginStub } from './stubs/auth.stub';

jest.mock('../auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    describe('when login is called', () => {
      let result: any;

      beforeEach(async () => {
        result = await controller.login(loginStub);
      });

      test('should return an access token', async () => {
        expect(result).toEqual(authStub);
      });
    })
  });
});
