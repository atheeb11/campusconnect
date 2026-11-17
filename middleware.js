// ============================================================
//  middleware.js – CampusConnect
//  Developer : Mubarak Atheeb | NIM : 20250040223
//  University: Nusa Putra University
// ============================================================

// ─── Development token (simple, for demonstration purposes) ───
const DEV_TOKEN = 'campusconnect-secret-token-2025';

// ─── 1. Logger Middleware ─────────────────────────────────────
// Logs HTTP method, URL, timestamp, and IP for every request
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method    = req.method;
  const url       = req.originalUrl;
  const ip        = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url}  –  IP: ${ip}`);
  next();
};

// ─── 2. requireAuth Middleware ────────────────────────────────
// Protects DELETE routes; expects header:
//   Authorization: Bearer campusconnect-secret-token-2025
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      status : 401,
      error  : 'Unauthorized',
      message: 'Authorization header is missing. Please provide a valid token.'
    });
  }

  // Accept both "Bearer <token>" and bare "<token>" formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (token !== DEV_TOKEN) {
    return res.status(401).json({
      success: false,
      status : 401,
      error  : 'Unauthorized',
      message: 'Invalid token. Access denied.'
    });
  }

  next();
};

// ─── 3. notFound Middleware ───────────────────────────────────
// Catches any URL that did not match a registered route
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status : 404,
    error  : 'Not Found',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

// ─── 4. errorHandler Middleware ───────────────────────────────
// Must use exactly four parameters so Express recognises it
// as an error-handling middleware. Must be registered last.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message || err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status : statusCode,
    error  : err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
};

module.exports = { logger, requireAuth, notFound, errorHandler, DEV_TOKEN };
