// ============================================================
//  routes/clubs.js – Club Management Router
//  Developer : Mubarak Atheeb | NIM : 20250040223
//  University: Nusa Putra University
// ============================================================

const express      = require('express');
const router       = express.Router();
const { requireAuth } = require('../middleware');

// ─── In-Memory Data Store ────────────────────────────────────
let clubs = [
  {
    id         : 1,
    name       : 'AWS Student Builder Club',
    category   : 'Technology',
    university : 'Nusa Putra University',
    description: 'A community for students passionate about cloud computing with Amazon Web Services.',
    members    : 45,
    status     : 'active'
  },
  {
    id         : 2,
    name       : 'Google Developer Student Club',
    category   : 'Technology',
    university : 'Nusa Putra University',
    description: 'Google-supported club helping students grow their tech skills and build solutions.',
    members    : 60,
    status     : 'active'
  },
  {
    id         : 3,
    name       : 'Robotics Club',
    category   : 'Engineering',
    university : 'Nusa Putra University',
    description: 'Students designing and building robots for competitions and campus showcases.',
    members    : 30,
    status     : 'active'
  },
  {
    id         : 4,
    name       : 'Photography Club',
    category   : 'Arts',
    university : 'Nusa Putra University',
    description: 'Capturing campus life through creative photography and visual storytelling.',
    members    : 25,
    status     : 'active'
  },
  {
    id         : 5,
    name       : 'Sports Club',
    category   : 'Sports',
    university : 'Nusa Putra University',
    description: 'Promoting physical wellness and sportsmanship across all campus sports activities.',
    members    : 80,
    status     : 'active'
  }
];

// Auto-incrementing ID counter
let nextId = 6;

// ─── Helper: find club by ID ──────────────────────────────────
const findClub = (id) => clubs.find((c) => c.id === parseInt(id, 10));

// ─── Required fields for POST / PUT ──────────────────────────
const REQUIRED_FIELDS = ['name', 'category', 'university', 'description', 'members', 'status'];

// ─── Validation helper ────────────────────────────────────────
const validate = (body) => {
  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  if (typeof body.members !== 'number' || body.members < 0) {
    return { valid: false, message: '"members" must be a non-negative number.' };
  }
  return { valid: true };
};

// ============================================================
//  SPECIFIC / STATIC ROUTES FIRST (before dynamic :id)
// ============================================================

// ─── GET /clubs/search?name=<query> ──────────────────────────
// +3 bonus: search by name (case-insensitive)
router.get('/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      success: false,
      status : 400,
      error  : 'Bad Request',
      message: 'Query parameter "name" is required. Example: /clubs/search?name=AWS'
    });
  }

  const results = clubs.filter((c) =>
    c.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({
    success: true,
    status : 200,
    query  : name,
    count  : results.length,
    data   : results
  });
});

// ─── GET /clubs/category{/:name} – Optional parameter (Express 5) ───
// Without :name  → list all unique categories
// With    :name  → filter clubs by that category
router.get('/category{/:name}', (req, res) => {
  const { name } = req.params;

  if (!name) {
    // Return distinct categories
    const categories = [...new Set(clubs.map((c) => c.category))];
    return res.json({
      success   : true,
      status    : 200,
      message   : 'All available club categories',
      categories
    });
  }

  const results = clubs.filter(
    (c) => c.category.toLowerCase() === name.toLowerCase()
  );

  if (results.length === 0) {
    return res.status(404).json({
      success : false,
      status  : 404,
      error   : 'Not Found',
      message : `No clubs found in category: "${name}"`
    });
  }

  res.json({
    success : true,
    status  : 200,
    category: name,
    count   : results.length,
    data    : results
  });
});

// ============================================================
//  ROUTE CHAINING WITH router.route()
//  GET /clubs  &  POST /clubs
// ============================================================
router
  .route('/')
  .get((req, res) => {
    // GET /clubs – return all clubs
    res.json({
      success: true,
      status : 200,
      count  : clubs.length,
      data   : clubs
    });
  })
  .post((req, res) => {
    // POST /clubs – create a new club
    const body = req.body;
    const check = validate(body);

    if (!check.valid) {
      return res.status(400).json({
        success: false,
        status : 400,
        error  : 'Bad Request',
        message: check.message || `Missing required fields: ${check.missing.join(', ')}`
      });
    }

    const newClub = {
      id         : nextId++,
      name       : body.name,
      category   : body.category,
      university : body.university,
      description: body.description,
      members    : body.members,
      status     : body.status
    };

    clubs.push(newClub);

    res.status(201).json({
      success: true,
      status : 201,
      message: 'Club created successfully.',
      data   : newClub
    });
  });

// ============================================================
//  ROUTE CHAINING WITH router.route() – single club by ID
//  GET /clubs/:id  |  PUT /clubs/:id  |  DELETE /clubs/:id
// ============================================================
router
  .route('/:id')
  .get((req, res) => {
    // GET /clubs/:id
    const club = findClub(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Club with ID ${req.params.id} does not exist.`
      });
    }
    res.json({ success: true, status: 200, data: club });
  })
  .put((req, res) => {
    // PUT /clubs/:id – full update
    const club = findClub(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Club with ID ${req.params.id} does not exist.`
      });
    }

    const body  = req.body;
    const check = validate(body);

    if (!check.valid) {
      return res.status(400).json({
        success: false,
        status : 400,
        error  : 'Bad Request',
        message: check.message || `Missing required fields: ${check.missing.join(', ')}`
      });
    }

    // Update in place
    club.name        = body.name;
    club.category    = body.category;
    club.university  = body.university;
    club.description = body.description;
    club.members     = body.members;
    club.status      = body.status;

    res.json({
      success: true,
      status : 200,
      message: 'Club updated successfully.',
      data   : club
    });
  })
  .delete(requireAuth, (req, res) => {
    // DELETE /clubs/:id – protected by requireAuth
    const index = clubs.findIndex((c) => c.id === parseInt(req.params.id, 10));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Club with ID ${req.params.id} does not exist.`
      });
    }

    const deleted = clubs.splice(index, 1)[0];

    res.json({
      success: true,
      status : 200,
      message: 'Club deleted successfully.',
      data   : deleted
    });
  });

module.exports = router;
