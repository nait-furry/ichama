const { validationResult } = require('express-validator');

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, issues: errors.array() });
  }
  next();
}

module.exports = { validationMiddleware };
