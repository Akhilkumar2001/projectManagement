# ProjectFlow — Project Tracking & Management

A centralized project management platform with **Admin**, **Employee**, and **Client** roles.

---

## Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18, Redux Toolkit, Vite, Tailwind CSS |
| Backend    | Node.js, Express (ES Modules) |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + Role-based access       |
| File Upload | Multer (local server storage) |

---

## Project Structure

```
projectManagement/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, Upload
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   └── utils/          # Helpers, token generation
│   ├── uploads/            # Uploaded files (gitignored)
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/         # Logo, images
    │   ├── components/     # Shared UI components
    │   ├── pages/          # Route-level pages
    │   ├── services/       # API service layer (one file per entity)
    │   ├── store/          # Redux slices
    │   ├── styles/
    │   │   ├── theme.js    # ← CENTRALIZED THEME (colors, fonts, status colors)
    │   │   └── index.css   # Tailwind + CSS variables
    │   └── utils/
    │       └── constants.js # BASE_URL, endpoints, role/status constants
    ├── .env.example
    └── package.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env      # Fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # Set VITE_API_URL if needed
npm install
npm run dev               # Runs on http://localhost:5173
```

---

## Theming

All colors, fonts, and status/priority badge colors live in **one file**:

```
frontend/src/styles/theme.js
```

Change `theme.colors.primary` → entire app rebrands (Tailwind classes + CSS variables both update).

---

## API Base URL

Defined in **one place**:

```
frontend/src/utils/constants.js → BASE_URL
frontend/.env → VITE_API_URL
```

All services in `src/services/` import from `constants.js` — never hardcode URLs.

---

## Roles & Access

| Feature              | Admin | Employee | Client |
|----------------------|:-----:|:--------:|:------:|
| Create projects      | ✅    | ❌       | ❌     |
| Assign tasks         | ✅    | ❌       | ❌     |
| Update task status   | ✅    | ✅       | ❌     |
| Upload images        | ✅    | ✅       | ❌     |
| Approve / Reject     | ✅    | ❌       | ❌     |
| View own projects    | ✅    | ✅       | ✅     |
| Manage users         | ✅    | ❌       | ❌     |
| View activity logs   | ✅    | ❌       | ❌     |

---

## Uploaded Files

Files are stored at `backend/uploads/` and served at:

```
http://localhost:5000/uploads/<filename>
```

The full URL is saved in the DB (with `baseUrl + /uploads/filename`) so the frontend can display directly.

---

## MVP Checklist

- [x] JWT authentication
- [x] Role-based access (Admin / Employee / Client)
- [x] Project CRUD
- [x] Task CRUD with status tracking
- [x] Approval / Rejection workflow
- [x] Auto-create rework subtask on rejection
- [x] Image upload (local server)
- [x] Activity logging
- [x] Centralized theme
- [x] Separated API services
