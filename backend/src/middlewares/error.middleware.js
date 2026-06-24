const { sendError } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  return sendError(res, message, errors, statusCode);
};

module.exports = errorMiddleware;
