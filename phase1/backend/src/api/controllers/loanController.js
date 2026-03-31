const { createLoan, repayLoan } = require('../services/loanService');

async function createLoanHandler(req, res, next) {
  try {
    const groupId = req.params.id;
    const loan = await createLoan(groupId, req.user.id, req.body);
    res.status(201).json({ success: true, loan });
  } catch (error) {
    next(error);
  }
}

async function repayLoanHandler(req, res, next) {
  try {
    const loanId = req.params.id;
    const payment = await repayLoan(loanId, req.user.id, req.body);
    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
}

module.exports = { createLoanHandler, repayLoanHandler };
