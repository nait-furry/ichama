const { addContribution, listContributions } = require('../services/contributionService');

async function createContribution(req, res, next) {
  try {
    const groupId = req.params.id;
    const contribution = await addContribution(groupId, req.user.id, req.body);
    res.status(201).json({ success: true, contribution });
  } catch (error) {
    next(error);
  }
}

async function getContributions(req, res, next) {
  try {
    const groupId = req.params.id;
    const contributions = await listContributions(groupId);
    res.status(200).json({ success: true, contributions });
  } catch (error) {
    next(error);
  }
}

module.exports = { createContribution, getContributions };
