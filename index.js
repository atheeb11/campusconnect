// ============================================================
//  index.js – CampusConnect Entry Point
//  Developer : Mubarak Atheeb | NIM : 20250040223
//  University: Nusa Putra University
//  Project   : Midterm Project – REST API with ExpressJS
// ============================================================

const express = require('express');

// ─── Import middleware ────────────────────────────────────────
const { logger, notFound, errorHandler } = require('./middleware');

// ─── Import routers ───────────────────────────────────────────
const clubsRouter  = require('./routes/clubs');
const eventsRouter = require('./routes/events');

// ─── Create Express application ───────────────────────────────
const app  = express();
// Render injects PORT via environment variable; fall back to 3000 locally
const PORT = process.env.PORT || 3000;

// ============================================================
//  GLOBAL MIDDLEWARE
// ============================================================

// Parse incoming JSON request bodies
app.use(express.json());

// Log every request to the terminal
app.use(logger);

// ============================================================
//  ROUTES
// ============================================================

// Welcome / root route
app.get('/', (req, res) => {
  res.json({
    success  : true,
    status   : 200,
    developer: 'Mubarak Atheeb',
    nim      : '20250040223',
    university: 'Nusa Putra University',
    project  : 'CampusConnect – Student Club Management API',
    version  : '1.0.0',
    endpoints: {
      clubs : {
        'GET    /clubs'               : 'Get all clubs',
        'GET    /clubs/:id'           : 'Get club by ID',
        'POST   /clubs'               : 'Create a new club',
        'PUT    /clubs/:id'           : 'Update a club',
        'DELETE /clubs/:id'           : 'Delete a club (auth required)',
        'GET    /clubs/category{/:name}': 'List categories or filter by category',
        'GET    /clubs/search?name='  : 'Search clubs by name'
      },
      events: {
        'GET    /events'     : 'Get all events',
        'GET    /events/:id' : 'Get event by ID',
        'POST   /events'     : 'Create a new event',
        'PUT    /events/:id' : 'Update an event',
        'DELETE /events/:id' : 'Delete an event (auth required)'
      },
      wildcard: {
        'GET /files/*path': 'Named wildcard – returns the requested path as an array'
      }
    },
    auth: {
      header: 'Authorization',
      format: 'Bearer campusconnect-secret-token-2025',
      note  : 'Required for DELETE requests'
    }
  });
});

// ─── Mount club and event routers ────────────────────────────
app.use('/clubs',  clubsRouter);
app.use('/events', eventsRouter);

// ─── Named Wildcard Route (Express 5) ────────────────────────
// GET /files/*path  → returns the matched path as an array
app.get('/files/*path', (req, res) => {
  // In Express 5 a named wildcard is accessed via req.params
  const rawPath  = req.params.path;                      // e.g. "docs/api/v1"
  const segments = rawPath ? rawPath.split('/') : [];    // split into array

  res.json({
    success    : true,
    status     : 200,
    requestedPath: rawPath,
    pathSegments : segments
  });
});

// ============================================================
//  ERROR HANDLING  (must come after all routes)
// ============================================================

// 404 – unknown route handler
app.use(notFound);

// Global error handler (4-param signature – must be last)
app.use(errorHandler);

// ============================================================
//  START SERVER
// ============================================================
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║          CampusConnect API  –  Server Started        ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Developer  : Mubarak Atheeb                         ║`);
  console.log(`║  NIM        : 20250040223                            ║`);
  console.log(`║  University : Nusa Putra University                  ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Server     : http://localhost:${PORT}                   ║`);
  console.log(`║  Status     : Running ✓                              ║`);
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = { app, server };
