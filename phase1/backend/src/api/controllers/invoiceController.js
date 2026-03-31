const { createInvoice, listInvoices } = require('../services/invoiceService');

async function createInvoiceHandler(req, res, next) {
  try {
    const groupId = req.params.id;
    const invoice = await createInvoice(groupId, req.user.id, req.body);
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
}

async function getInvoices(req, res, next) {
  try {
    const groupId = req.params.id;
    const invoices = await listInvoices(groupId);
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
}

module.exports = { createInvoiceHandler, getInvoices };
