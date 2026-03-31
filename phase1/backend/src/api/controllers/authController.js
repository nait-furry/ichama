const { registerUser, loginUser } = require('../services/authService');

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({ success: true, token: data.token, user: data.user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
