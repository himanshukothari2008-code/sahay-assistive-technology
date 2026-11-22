const jwt = require('jsonwebtoken');
const { query } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_accessiaid_jwt_key_2026_change_in_production';

// Extract token from httpOnly cookie or Authorization header
const extractToken = (req) => {
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

// Soft authentication: Attaches req.user if token is valid, continues if not
const authenticateJWT = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch latest user data from DB to ensure user wasn't deleted
    const user = query.get('SELECT id, name, email, role, preferences_json FROM users WHERE id = ?', [decoded.id]);
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: JSON.parse(user.preferences_json || '{}')
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  next();
};

// Strict authentication: Rejects request if not logged in
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.'
    });
  }
  next();
};

// Role guard: Only users with role === 'admin'
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Administrator privileges required.'
    });
  }
  next();
};

// Helper to generate JWT and set secure httpOnly cookie
const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

const clearAuthCookie = (res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'lax'
  });
};

module.exports = {
  authenticateJWT,
  requireAuth,
  requireAdmin,
  setAuthCookie,
  clearAuthCookie,
  JWT_SECRET
};
