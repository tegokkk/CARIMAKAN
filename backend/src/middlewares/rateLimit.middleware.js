const { sendError } = require('../utils/response');

const buckets = new Map();

function rateLimit({ windowMs = 60_000, max = 30, message = 'Too many requests, please try again later' } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.originalUrl.split('?')[0]}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      return sendError(res, message, [], 429);
    }

    return next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref?.();

module.exports = rateLimit;
