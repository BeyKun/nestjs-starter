import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  authStub,
  loginStub,
  registerStub,
  registeredUserStub,
} from './stubs/auth.stub';

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

      test('then should call authService.login', async () => {
        expect(service.login).toHaveBeenCalledWith(loginStub);
      });

      test('then should return an access token', async () => {
        expect(result).toEqual(authStub);
      });
    });
  });

  describe('register', () => {
    describe('when register is called', () => {
      let result: any;

      beforeEach(async () => {
        result = await controller.register(registerStub);
      });

      test('then should call authService.register', async () => {
        expect(service.register).toHaveBeenCalledWith(registerStub);
      });

      test('then should return a registered user', async () => {
        expect(result).toEqual(registeredUserStub);
      });
    });
  });
});
