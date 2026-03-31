const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { prisma } = require('../../db/models');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid user token' });
    }
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware };
