const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../db/models');
const { JWT_SECRET } = require('../../config');

const SALT_ROUNDS = 10;

async function registerUser({ email, phone, name, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, phone, name, passwordHash },
  });
  return user;
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

module.exports = { registerUser, loginUser };
