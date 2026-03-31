const { registerUser, loginUser } = require('../src/api/services/authService');
const { prisma } = require('../src/db/models');

jest.mock('../src/db/models', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

test('registerUser creates a new user', async () => {
  prisma.user.findUnique.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue({ id: 'user-1', email: 'test@example.com', name: 'Test User' });

  const result = await registerUser({ email: 'test@example.com', phone: '0700000000', name: 'Test User', password: 'Password123' });

  expect(result).toMatchObject({ id: 'user-1', email: 'test@example.com', name: 'Test User' });
  expect(prisma.user.create).toHaveBeenCalledTimes(1);
});

test('loginUser throws on invalid credentials', async () => {
  prisma.user.findUnique.mockResolvedValue(null);
  await expect(loginUser({ email: 'fail@example.com', password: 'Password123' })).rejects.toThrow('Invalid credentials');
});
