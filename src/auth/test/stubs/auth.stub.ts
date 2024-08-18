export const authStub = {
    user_id: expect.any(String),
    email: 'test@mail.com',
    access_token: expect.any(String),
}

export const loginStub = {
    username: 'test@mail.com',
    password: 'test123',
}

export const registeredUserStub = () => {
    return {
        id: '123456',
        name: 'Test',
        email: 'test@mail.com',
        role: 'ADMIN',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    }
}