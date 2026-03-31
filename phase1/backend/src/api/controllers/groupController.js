const { createGroup, getGroupById } = require('../services/groupService');

async function createGroupHandler(req, res, next) {
  try {
    const group = await createGroup(req.body, req.user.id);
    res.status(201).json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

async function getGroupHandler(req, res, next) {
  try {
    const group = await getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: true, message: 'Group not found' });
    }
    res.status(200).json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGroupHandler, getGroupHandler };
