const express = require('express');
const { mpesaWebhook, financeInvoice } = require('../controllers/integrationController');

const router = express.Router();

router.post('/payments/webhook/mpesa', mpesaWebhook);
router.post('/invoices/:id/finance', financeInvoice);

module.exports = router;
