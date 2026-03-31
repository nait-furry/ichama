const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createGroupHandler, getGroupHandler } = require('../controllers/groupController');
const { validationMiddleware } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Group name is required'),
    body('description').optional().trim(),
    body('legalStatus').optional().trim(),
  ],
  validationMiddleware,
  createGroupHandler,
);

router.get('/:id', authMiddleware, getGroupHandler);

module.exports = router;
