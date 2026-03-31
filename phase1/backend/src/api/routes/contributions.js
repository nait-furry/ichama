const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { createContribution, getContributions } = require('../controllers/contributionController');

const router = express.Router();

router.post(
  '/:id/contributions',
  authMiddleware,
  requireRole(['ADMIN', 'TREASURER', 'MEMBER']),
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Contribution amount must be greater than zero'),
    body('channel').trim().notEmpty().withMessage('Payment channel is required'),
    body('externalReference').optional().trim(),
  ],
  validationMiddleware,
  createContribution,
);

router.get('/:id/contributions', authMiddleware, requireRole(['ADMIN', 'TREASURER', 'MEMBER']), getContributions);

module.exports = router;
