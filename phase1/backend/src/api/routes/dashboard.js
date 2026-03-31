const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { getGroupDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/:id/dashboard', authMiddleware, requireRole(['ADMIN', 'TREASURER', 'MEMBER']), getGroupDashboard);

module.exports = router;
