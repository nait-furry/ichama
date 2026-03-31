const { createGroup, getGroupById } = require('../src/api/services/groupService');
const { prisma } = require('../src/db/models');

jest.mock('../src/db/models', () => ({
  prisma: {
    group: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('createGroup persists a group and membership', async () => {
  prisma.group.create.mockResolvedValue({ id: 'group-1', name: 'Chama One', memberships: [] });
  const group = await createGroup({ name: 'Chama One', description: 'Demo group', legalStatus: 'Informal' }, 'user-1');

  expect(group).toMatchObject({ id: 'group-1', name: 'Chama One' });
  expect(prisma.group.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ name: 'Chama One' }) }));
});

test('getGroupById returns a group', async () => {
  prisma.group.findUnique.mockResolvedValue({ id: 'group-1', name: 'Chama One' });
  const group = await getGroupById('group-1');
  expect(group).toEqual({ id: 'group-1', name: 'Chama One' });
});
