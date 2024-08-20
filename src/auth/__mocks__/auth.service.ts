export const AuthService = jest.fn().mockImplementation(() => ({
  login: jest.fn().mockResolvedValue({}),
  register: jest.fn().mockResolvedValue({}),
  profile: jest.fn().mockResolvedValue({}),
}));
