const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { createLoanHandler } = require('../controllers/loanController');

const router = express.Router();

router.post(
  '/:id/loans',
  authMiddleware,
  requireRole(['ADMIN', 'TREASURER']),
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Loan amount must be greater than zero'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
    body('collateral')
      .optional()
      .custom((value) => typeof value === 'object' && value !== null)
      .withMessage('Collateral must be a JSON object'),
  ],
  validationMiddleware,
  createLoanHandler,
);

module.exports = router;
