const { prisma } = require('../../db/models');
const { createAuditLog } = require('./ledgerService');

async function createInvoice(groupId, userId, { supplier, customer, amount, dueDate }) {
  const invoice = await prisma.invoice.create({
    data: {
      groupId,
      supplier,
      customer,
      amount,
      dueDate: new Date(dueDate),
      status: 'REGISTERED',
    },
  });

  await createAuditLog({
    entity: 'invoice',
    entityId: invoice.id,
    action: 'CREATE',
    payload: invoice,
    userId,
  });

  return invoice;
}

async function listInvoices(groupId) {
  return prisma.invoice.findMany({
    where: { groupId },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { createInvoice, listInvoices };
