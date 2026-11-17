// ============================================================
//  routes/events.js – Event Management Router  (Bonus +5)
//  Developer : Mubarak Atheeb | NIM : 20250040223
//  University: Nusa Putra University
// ============================================================

const express      = require('express');
const router       = express.Router();
const { requireAuth } = require('../middleware');

// ─── In-Memory Data Store ────────────────────────────────────
let events = [
  {
    id          : 1,
    name        : 'AWS Cloud Day Workshop',
    clubId      : 1,
    location    : 'Auditorium A, Nusa Putra University',
    date        : '2025-03-15',
    participants: 50,
    status      : 'completed'
  },
  {
    id          : 2,
    name        : 'Google I/O Extended Campus',
    clubId      : 2,
    location    : 'Lab Building, Room 301',
    date        : '2025-04-20',
    participants: 70,
    status      : 'upcoming'
  },
  {
    id          : 3,
    name        : 'Robotics Battle Competition',
    clubId      : 3,
    location    : 'Engineering Hall',
    date        : '2025-05-10',
    participants: 40,
    status      : 'upcoming'
  },
  {
    id          : 4,
    name        : 'Photography Exhibition',
    clubId      : 4,
    location    : 'Campus Gallery',
    date        : '2025-06-01',
    participants: 100,
    status      : 'planning'
  },
  {
    id          : 5,
    name        : 'Inter-Campus Sports Tournament',
    clubId      : 5,
    location    : 'Main Stadium',
    date        : '2025-07-15',
    participants: 200,
    status      : 'planning'
  }
];

let nextId = 6;

// ─── Helper: find event by ID ─────────────────────────────────
const findEvent = (id) => events.find((e) => e.id === parseInt(id, 10));

// ─── Required fields ──────────────────────────────────────────
const REQUIRED_FIELDS = ['name', 'clubId', 'location', 'date', 'participants', 'status'];

// ─── Validation helper ────────────────────────────────────────
const validate = (body) => {
  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  if (typeof body.participants !== 'number' || body.participants < 0) {
    return { valid: false, message: '"participants" must be a non-negative number.' };
  }
  return { valid: true };
};

// ============================================================
//  ROUTE CHAINING – GET /events  &  POST /events
// ============================================================
router
  .route('/')
  .get((req, res) => {
    res.json({
      success: true,
      status : 200,
      count  : events.length,
      data   : events
    });
  })
  .post((req, res) => {
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

    const newEvent = {
      id          : nextId++,
      name        : body.name,
      clubId      : body.clubId,
      location    : body.location,
      date        : body.date,
      participants: body.participants,
      status      : body.status
    };

    events.push(newEvent);

    res.status(201).json({
      success: true,
      status : 201,
      message: 'Event created successfully.',
      data   : newEvent
    });
  });

// ============================================================
//  ROUTE CHAINING – single event by ID
// ============================================================
router
  .route('/:id')
  .get((req, res) => {
    const event = findEvent(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Event with ID ${req.params.id} does not exist.`
      });
    }
    res.json({ success: true, status: 200, data: event });
  })
  .put((req, res) => {
    const event = findEvent(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Event with ID ${req.params.id} does not exist.`
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

    event.name         = body.name;
    event.clubId       = body.clubId;
    event.location     = body.location;
    event.date         = body.date;
    event.participants = body.participants;
    event.status       = body.status;

    res.json({
      success: true,
      status : 200,
      message: 'Event updated successfully.',
      data   : event
    });
  })
  .delete(requireAuth, (req, res) => {
    const index = events.findIndex((e) => e.id === parseInt(req.params.id, 10));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        status : 404,
        error  : 'Not Found',
        message: `Event with ID ${req.params.id} does not exist.`
      });
    }

    const deleted = events.splice(index, 1)[0];

    res.json({
      success: true,
      status : 200,
      message: 'Event deleted successfully.',
      data   : deleted
    });
  });

module.exports = router;
