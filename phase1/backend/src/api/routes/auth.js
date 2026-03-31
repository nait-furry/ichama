const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { validationMiddleware } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validationMiddleware,
  register,
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validationMiddleware,
  login,
);

module.exports = router;
