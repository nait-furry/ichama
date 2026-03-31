const { prisma } = require('../../db/models');

const TRANSACTION_TYPES = {
  CONTRIBUTION: 'CONTRIBUTION',
  LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT: 'LOAN_REPAYMENT',
};

async function recordTransaction({ type, amount, groupId, userId, referenceId }) {
  return prisma.transaction.create({
    data: {
      type,
      amount,
      groupId,
      userId,
      referenceId,
    },
  });
}

async function createAuditLog({ entity, entityId, action, payload, userId }) {
  return prisma.auditLog.create({
    data: {
      entity,
      entityId,
      action,
      payload,
      userId,
    },
  });
}

async function computeGroupBalance(groupId) {
  const result = await prisma.transaction.groupBy({
    by: ['type'],
    where: { groupId },
    _sum: { amount: true },
  });

  const totals = result.reduce(
    (acc, item) => ({ ...acc, [item.type]: item._sum.amount || 0 }),
    {},
  );

  const contributions = Number(totals.CONTRIBUTION || 0);
  const disbursed = Number(totals.LOAN_DISBURSEMENT || 0);
  const repayments = Number(totals.LOAN_REPAYMENT || 0);

  return contributions - disbursed + repayments;
}

async function computeMemberBalance(groupId, userId) {
  const result = await prisma.transaction.groupBy({
    by: ['type'],
    where: { groupId, userId },
    _sum: { amount: true },
  });

  const totals = result.reduce(
    (acc, item) => ({ ...acc, [item.type]: item._sum.amount || 0 }),
    {},
  );

  const contributions = Number(totals.CONTRIBUTION || 0);
  const repayments = Number(totals.LOAN_REPAYMENT || 0);

  return contributions + repayments;
}

module.exports = { recordTransaction, createAuditLog, computeGroupBalance, computeMemberBalance, TRANSACTION_TYPES };
