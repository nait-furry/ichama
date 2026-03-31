const { prisma } = require('../../db/models');
const { recordTransaction, createAuditLog, TRANSACTION_TYPES } = require('./ledgerService');

async function createLoan(groupId, userId, { amount, dueDate, collateral }) {
  const loan = await prisma.loan.create({
    data: {
      groupId,
      amount,
      collateral: collateral ? JSON.parse(JSON.stringify(collateral)) : null,
      status: 'DISBURSED',
      disbursedAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  await recordTransaction({
    type: TRANSACTION_TYPES.LOAN_DISBURSEMENT,
    amount,
    groupId,
    userId,
    referenceId: loan.id,
  });

  await createAuditLog({
    entity: 'loan',
    entityId: loan.id,
    action: 'DISBURSE',
    payload: loan,
    userId,
  });

  return loan;
}

async function repayLoan(loanId, userId, { amount }) {
  const loan = await prisma.loan.findUnique({ where: { id: loanId } });
  if (!loan) {
    const error = new Error('Loan not found');
    error.status = 404;
    throw error;
  }

  if (loan.status !== 'DISBURSED') {
    const error = new Error('Loan is not active for repayment');
    error.status = 400;
    throw error;
  }

  const payment = await prisma.loanRepayment.create({
    data: {
      loanId,
      amount,
      paidAt: new Date(),
      userId,
    },
  });

  await recordTransaction({
    type: TRANSACTION_TYPES.LOAN_REPAYMENT,
    amount,
    groupId: loan.groupId,
    userId,
    referenceId: payment.id,
  });

  const totalRepayments = await prisma.loanRepayment.aggregate({
    where: { loanId },
    _sum: { amount: true },
  });

  const repayments = Number(totalRepayments._sum.amount || 0);
  if (repayments >= Number(loan.amount)) {
    await prisma.loan.update({
      where: { id: loanId },
      data: { status: 'REPAID' },
    });
  }

  await createAuditLog({
    entity: 'loanRepayment',
    entityId: payment.id,
    action: 'REPAY',
    payload: payment,
    userId,
  });

  return payment;
}

module.exports = { createLoan, repayLoan };
