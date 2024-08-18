import { authStub, registeredUserStub } from "../test/stubs/auth.stub";

export const AuthService = jest.fn().mockReturnValue({
    login: jest.fn().mockReturnValue(authStub),
    register: jest.fn().mockResolvedValue(registeredUserStub()),
    profile: jest.fn().mockResolvedValue(registeredUserStub()),
});