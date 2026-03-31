const { getGroupById } = require('../services/groupService');
const { computeGroupBalance, computeMemberBalance } = require('../services/ledgerService');

async function getGroupDashboard(req, res, next) {
  try {
    const groupId = req.params.id;
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: true, message: 'Group not found' });
    }

    const balance = await computeGroupBalance(groupId);
    const memberBalance = await computeMemberBalance(groupId, req.user.id);

    res.status(200).json({
      success: true,
      dashboard: {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
        },
        balances: {
          groupBalance: balance,
          memberBalance,
        },
        membershipCount: group.memberships.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getGroupDashboard };
