/**
 * RockCity Explorer - Security & Sanitization Middleware
 * NoSQL Injection Protection & Input Sanitization
 */

/**
 * Deeply sanitize an object or string against NoSQL operator injection
 * Removes keys starting with '$' or containing '.' from objects
 */
const sanitizeData = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Trim and prevent raw regex operator strings if inappropriately submitted
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeData);
  }

  if (typeof value === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      // Reject or strip MongoDB query operators like $gt, $ne, $where, etc.
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleanObj[key] = sanitizeData(value[key]);
    }
    return cleanObj;
  }

  return value;
};

/**
 * Express middleware to sanitize body, query params, and route params
 */
const noSqlInjectionProtection = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeData(req.body);
  }
  if (req.query) {
    req.query = sanitizeData(req.query);
  }
  if (req.params) {
    req.params = sanitizeData(req.params);
  }
  next();
};

module.exports = {
  noSqlInjectionProtection,
  sanitizeData
};
