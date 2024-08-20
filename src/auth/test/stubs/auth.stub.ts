import { Prisma } from '@prisma/client';

export const authStub = {
  user_id: expect.any(String),
  email: 'test@mail.com',
  access_token: expect.any(String),
};

export const loginStub = {
  username: 'test@mail.com',
  password: 'test123',
};

export const registerStub: Prisma.UserCreateInput = {
  name: 'Test',
  email: 'test@mail.com',
  password: 'test123',
};

export const registeredUserStub = {
  id: expect.any(String),
  name: 'Test',
  email: 'test@mail.com',
  role: 'ADMIN',
  created_at: expect.any(Date),
  updated_at: expect.any(Date),
};
