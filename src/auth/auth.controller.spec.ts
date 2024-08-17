import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn((req) => {
      return {
        data: {
          user_id: '123456',
          email: req.username,
          access_token: 'token',
        },
        code: 200,
        message: 'Success',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return a token', async () => {
    const result = await controller.login({
      username: 'test@mail.com',
      password: 'test',
    });
    expect(result).toEqual({
      data: {
        user_id: expect.any(String),
        email: 'test@mail.com',
        access_token: expect.any(String),
      },
      code: 200,
      message: 'Success',
    });
  });
});
