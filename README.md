# CampusConnect – Student Club Management API

<p align="center">
  <strong>Midterm Project – REST API with ExpressJS</strong><br/>
  Nusa Putra University &nbsp;|&nbsp; 2025
</p>

---

## 👤 Developer Information

| Field       | Detail                    |
|-------------|---------------------------|
| **Name**    | Mubarak Atheeb            |
| **NIM**     | 20250040223               |
| **University** | Nusa Putra University  |
| **Course**  | Midterm Project – REST API with ExpressJS |

---

## 📋 Project Description

**CampusConnect** is a professional RESTful API for managing student clubs and events at a university. It is built with **Node.js** and **Express.js v5**, using in-memory JavaScript arrays as the data store (no database required). The API supports full CRUD operations, search, category filtering, authentication middleware, and a wildcard route.

---

## 🛠 Technologies

| Technology    | Version  |
|---------------|----------|
| Node.js       | ≥ 18.x   |
| Express.js    | ^5.1.0   |
| JavaScript    | CommonJS |
| Nodemon (dev) | ^3.1.0   |

---

## 📁 Project Structure

```
CampusConnect/
│
├── index.js          # Entry point – server setup & route mounting
├── middleware.js     # Logger, requireAuth, notFound, errorHandler
├── package.json      # Project manifest & scripts
├── README.md         # This file
│
├── routes/
│   ├── clubs.js      # Club Management Router
│   └── events.js     # Event Management Router (Bonus)
│
└── screenshots/      # Postman test screenshots (optional)
```

---

## ⚙️ Installation

```bash
# 1. Clone or navigate to the project folder
cd CampusConnect

# 2. Install dependencies
npm install
```

---

## 🚀 Running the Server

### Development (auto-reload with nodemon)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server starts at: **http://localhost:3000**

---

## 🔐 Authorization

DELETE routes are protected. Add the following header to your Postman request:

| Header          | Value                                    |
|-----------------|------------------------------------------|
| `Authorization` | `Bearer campusconnect-secret-token-2025` |

Omitting or using a wrong token returns **HTTP 401 Unauthorized**.

---

## 📡 API Endpoints

### Root

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/` | Welcome message with all endpoints listed |

---

### 🎓 Clubs  (`/clubs`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET    | `/clubs`                    | —    | Get all clubs |
| GET    | `/clubs/:id`                | —    | Get club by ID |
| POST   | `/clubs`                    | —    | Create a new club |
| PUT    | `/clubs/:id`                | —    | Update an existing club |
| DELETE | `/clubs/:id`                | ✅   | Delete a club |
| GET    | `/clubs/category`           | —    | List all categories |
| GET    | `/clubs/category/:name`     | —    | Filter clubs by category |
| GET    | `/clubs/search?name=<query>`| —    | Search clubs by name |

---

### 📅 Events  (`/events`)  — Bonus +5

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET    | `/events`      | —  | Get all events |
| GET    | `/events/:id`  | —  | Get event by ID |
| POST   | `/events`      | —  | Create a new event |
| PUT    | `/events/:id`  | —  | Update an event |
| DELETE | `/events/:id`  | ✅ | Delete an event |

---

### 🗂 Wildcard

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/files/*path` | Named wildcard – returns path segments as an array |

---

## 📝 Example Request Bodies

### POST /clubs
```json
{
  "name": "Cyber Security Club",
  "category": "Technology",
  "university": "Nusa Putra University",
  "description": "Ethical hacking and cybersecurity awareness.",
  "members": 20,
  "status": "active"
}
```

### PUT /clubs/:id
```json
{
  "name": "AWS Student Builder Club",
  "category": "Technology",
  "university": "Nusa Putra University",
  "description": "Updated description for the AWS club.",
  "members": 55,
  "status": "active"
}
```

### POST /events
```json
{
  "name": "Hackathon 2025",
  "clubId": 1,
  "location": "Main Auditorium",
  "date": "2025-08-20",
  "participants": 90,
  "status": "upcoming"
}
```

---

## ⚠️ Error Response Format

All errors follow a consistent format (+2 bonus):

```json
{
  "success": false,
  "status": 404,
  "error": "Not Found",
  "message": "Club with ID 99 does not exist."
}
```

| Status | Meaning                         |
|--------|---------------------------------|
| 200    | OK                              |
| 201    | Created                         |
| 400    | Bad Request (validation failed) |
| 401    | Unauthorized (missing/bad token)|
| 404    | Resource not found              |
| 500    | Internal server error           |

---

## 🧪 Postman Testing Guide

### Setup
1. Import a new collection in Postman called **CampusConnect**.
2. Set `Base URL` variable to `http://localhost:3000`.

### Test Cases

| # | Test | Method | URL | Expected |
|---|------|--------|-----|----------|
| 1  | Get all clubs | GET | `/clubs` | 200 + array of 5 clubs |
| 2  | Get club by ID | GET | `/clubs/1` | 200 + club object |
| 3  | Create club | POST | `/clubs` | 201 + new club |
| 4  | Update club | PUT | `/clubs/1` | 200 + updated club |
| 5  | Delete without token | DELETE | `/clubs/1` | 401 Unauthorized |
| 6  | Delete with token | DELETE | `/clubs/1` | 200 + deleted club |
| 7  | Missing fields | POST | `/clubs` (empty body) | 400 Bad Request |
| 8  | Unknown ID | GET | `/clubs/999` | 404 Not Found |
| 9  | Unknown URL | GET | `/unknown` | 404 Not Found |
| 10 | List categories | GET | `/clubs/category` | 200 + categories array |
| 11 | Filter by category | GET | `/clubs/category/Technology` | 200 + filtered clubs |
| 12 | Search clubs | GET | `/clubs/search?name=AWS` | 200 + matching clubs |
| 13 | Get all events | GET | `/events` | 200 + array of 5 events |
| 14 | Get event by ID | GET | `/events/1` | 200 + event object |
| 15 | Create event | POST | `/events` | 201 + new event |
| 16 | Update event | PUT | `/events/1` | 200 + updated event |
| 17 | Delete event (no token) | DELETE | `/events/1` | 401 Unauthorized |
| 18 | Delete event (with token) | DELETE | `/events/1` | 200 + deleted event |
| 19 | Wildcard route | GET | `/files/docs/api/v1` | 200 + path segments |

### Authorization Header (for DELETE tests)
```
Key   : Authorization
Value : Bearer campusconnect-secret-token-2025
```

---

## 📄 License

ISC – Mubarak Atheeb, 2025
