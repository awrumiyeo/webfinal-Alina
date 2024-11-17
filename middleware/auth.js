const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated (JWT-based)
const checkAuth = (req, res, next) => {
  const token = req.cookies.token; // Read token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save user info to the request object
    next(); // Proceed to the next middleware or route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check user role (e.g., admin, editor)
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next(); // Proceed to the next middleware or route
  };
};

// Middleware to check session-based authentication (e.g., using Passport.js)
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Middleware for optional role-based access
const optionalRoleCheck = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Role not allowed' });
    }
    next();
  };
};

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login'); // Redirect to login if no token is found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    res.redirect('/login');
  }
}

module.exports = {
  checkAuth,         // JWT-based authentication
  checkRole,         // Role-based authorization
  isAuthenticated,   // Passport.js session-based authentication
  optionalRoleCheck,
  authenticateToken // Optional role check middleware
};
