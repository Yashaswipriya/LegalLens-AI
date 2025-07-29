const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for decoded ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = authMiddleware;
