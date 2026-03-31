const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { repayLoanHandler } = require('../controllers/loanController');

const router = express.Router();

router.post(
  '/:id/repay',
  authMiddleware,
  requireRole(['ADMIN', 'TREASURER']),
  [body('amount').isFloat({ gt: 0 }).withMessage('Repayment amount must be greater than zero')],
  validationMiddleware,
  repayLoanHandler,
);

module.exports = router;
