import { Prisma } from '@prisma/client';

export const authStub = {
  user_id: expect.any(String),
  email: 'test@mail.com',
  access_token: expect.any(String),
};

// BEGIN-NOSCAN
export const loginStub = {
  username: 'test@mail.com',
  password: process.env.TEST_PASSWORD,
};

export const registerStub: Prisma.UserCreateInput = {
  name: 'Unit Test',
  email: 'unittest@mail.com',
  password: process.env.TEST_PASSWORD,
};
// END-NOSCAN

export const registeredUserStub = {
  id: expect.any(String),
  name: 'Test',
  email: 'test@mail.com',
  role: 'ADMIN',
  created_at: expect.any(Date),
  updated_at: expect.any(Date),
};
