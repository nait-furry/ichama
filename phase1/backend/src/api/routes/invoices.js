const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { createInvoiceHandler, getInvoices } = require('../controllers/invoiceController');

const router = express.Router();

router.post(
  '/:id/invoices',
  authMiddleware,
  requireRole(['ADMIN', 'TREASURER']),
  [
    body('supplier').trim().notEmpty().withMessage('Supplier is required'),
    body('customer').trim().notEmpty().withMessage('Customer is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Invoice amount must be greater than zero'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
  ],
  validationMiddleware,
  createInvoiceHandler,
);

router.get('/:id/invoices', authMiddleware, requireRole(['ADMIN', 'TREASURER', 'MEMBER']), getInvoices);

module.exports = router;
