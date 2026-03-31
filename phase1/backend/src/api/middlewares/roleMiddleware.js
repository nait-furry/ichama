const { prisma } = require('../../db/models');

function requireRole(roleList) {
  return async (req, res, next) => {
    let groupId = req.params.id || req.body.groupId;

    if (!groupId && req.baseUrl.startsWith('/loans') && req.params.id) {
      const loan = await prisma.loan.findUnique({ where: { id: req.params.id } });
      if (!loan) {
        return res.status(404).json({ error: true, message: 'Loan not found' });
      }
      groupId = loan.groupId;
    }

    if (!groupId) {
      return res.status(400).json({ error: true, message: 'Missing group id' });
    }

    const membership = await prisma.groupMembership.findFirst({
      where: { groupId, userId: req.user.id, active: true },
    });

    if (!membership) {
      return res.status(403).json({ error: true, message: 'Not a member of this group' });
    }

    if (!roleList.includes(membership.role)) {
      return res.status(403).json({ error: true, message: 'Insufficient group role' });
    }

    req.membership = membership;
    next();
  };
}

module.exports = { requireRole };
