const { sendError } = require('../utils/response');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Forbidden: role ${req.user.role} does not have access`, [], 403);
    }

    next();
  };
};

module.exports = roleMiddleware;
