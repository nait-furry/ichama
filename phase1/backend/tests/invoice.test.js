const { createInvoice, listInvoices } = require('../src/api/services/invoiceService');
const { prisma } = require('../src/db/models');

jest.mock('../src/db/models', () => ({
  prisma: {
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('createInvoice saves invoice and audit log', async () => {
  const invoicePayload = {
    groupId: 'group-1',
    supplier: 'Local Supplier',
    customer: 'Customer B',
    amount: 500,
    dueDate: '2026-05-01',
  };

  prisma.invoice.create.mockResolvedValue({ id: 'invoice-1', ...invoicePayload });
  const invoice = await createInvoice('group-1', 'user-1', invoicePayload);

  expect(invoice).toMatchObject({ id: 'invoice-1', supplier: 'Local Supplier' });
  expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
});

test('listInvoices returns invoice list', async () => {
  prisma.invoice.findMany.mockResolvedValue([{ id: 'invoice-1', amount: 500 }]);
  const invoices = await listInvoices('group-1');
  expect(invoices).toEqual([{ id: 'invoice-1', amount: 500 }]);
});
