# HireSense AI Resume Upload System

## Folder Structure

```text
hiresense/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── uploads/
│   │   └── resumes/
│   │       └── .gitkeep
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── db.js
│       │   └── env.js
│       ├── controllers/
│       │   └── resumeController.js
│       ├── middleware/
│       │   ├── errorMiddleware.js
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   └── Resume.js
│       ├── routes/
│       │   └── resumeRoutes.js
│       ├── services/
│       │   └── resumeService.js
│       └── utils/
│           ├── apiResponse.js
│           ├── AppError.js
│           ├── asyncHandler.js
│           └── fileHelpers.js
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── LoadingSkeleton.jsx
│       │   ├── ResumeCard.jsx
│       │   ├── ResumeHistory.jsx
│       │   ├── ResumeUploader.jsx
│       │   └── UploadProgress.jsx
│       ├── services/
│       │   └── resumeApi.js
│       └── utils/
│           └── formatters.js
└── README.md
```

## Package Installation Commands

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hiresense-ai
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend Startup Instructions

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `backend` using the values from `.env.example` before starting the server.

Backend runs at `http://localhost:5000`.

## Frontend Startup Instructions

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend` using the values from `.env.example` before starting the app.

Frontend runs at `http://localhost:5173`.

## API Endpoints

### `POST /api/resumes/upload`

- Accepts multipart form-data with the field name `resume`
- Validates PDF extension and MIME type
- Rejects files larger than 5MB
- Stores metadata in MongoDB

### `GET /api/resumes/history`

- Returns uploaded resumes sorted by newest first

## Notes

- Multer is configured for local disk storage in `uploads/resumes`.
- Filenames are sanitized and suffixed with timestamp plus random bytes to prevent collisions.
- Frontend drag-and-drop and click-to-upload both use the same upload pipeline.
- Axios `onUploadProgress` powers the animated upload bar with real upload progress.
