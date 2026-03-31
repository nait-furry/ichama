const { prisma } = require('../../db/models');

async function createGroup({ name, description, legalStatus }, ownerId) {
  const group = await prisma.group.create({
    data: {
      name,
      description,
      legalStatus,
      memberships: {
        create: {
          userId: ownerId,
          role: 'ADMIN',
          active: true,
        },
      },
    },
    include: { memberships: true },
  });
  return group;
}

async function getGroupById(groupId) {
  return prisma.group.findUnique({
    where: { id: groupId },
    include: {
      memberships: {
        include: { user: { select: { id: true, email: true, name: true } } },
      },
    },
  });
}

module.exports = { createGroup, getGroupById };
