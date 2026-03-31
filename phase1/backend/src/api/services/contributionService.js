const { prisma } = require('../../db/models');
const { recordTransaction, createAuditLog, TRANSACTION_TYPES } = require('./ledgerService');

async function addContribution(groupId, userId, { amount, channel, externalReference }) {
  const contribution = await prisma.contribution.create({
    data: {
      groupId,
      userId,
      amount,
      channel,
      externalReference,
      status: 'CONFIRMED',
    },
  });

  await recordTransaction({
    type: TRANSACTION_TYPES.CONTRIBUTION,
    amount,
    groupId,
    userId,
    referenceId: contribution.id,
  });

  await createAuditLog({
    entity: 'contribution',
    entityId: contribution.id,
    action: 'CREATE',
    payload: contribution,
    userId,
  });

  return contribution;
}

async function listContributions(groupId) {
  return prisma.contribution.findMany({
    where: { groupId },
    orderBy: { recordedAt: 'desc' },
  });
}

module.exports = { addContribution, listContributions };
