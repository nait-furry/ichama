const { addContribution, listContributions } = require('../src/api/services/contributionService');
const { prisma } = require('../src/db/models');

jest.mock('../src/db/models', () => ({
  prisma: {
    contribution: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('addContribution creates contribution, transaction, and audit log', async () => {
  prisma.contribution.create.mockResolvedValue({ id: 'contribution-1', amount: 100, channel: 'M-Pesa' });

  const contribution = await addContribution('group-1', 'user-1', {
    amount: 100,
    channel: 'M-Pesa',
    externalReference: 'ref-123',
  });

  expect(contribution).toMatchObject({ id: 'contribution-1', amount: 100 });
  expect(prisma.transaction.create).toHaveBeenCalledTimes(1);
  expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
});

test('listContributions returns contributions for group', async () => {
  prisma.contribution.findMany.mockResolvedValue([{ id: 'contribution-1', amount: 100 }]);
  const items = await listContributions('group-1');
  expect(items).toEqual([{ id: 'contribution-1', amount: 100 }]);
});
