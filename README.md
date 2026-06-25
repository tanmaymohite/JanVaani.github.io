# JanVaani

A citizen grievance portal built with React and Express, designed to help citizens submit complaints, upload evidence, and track issue resolution through a simple dashboard.

## Project Overview

`JanVaani` is a full-stack application with:
- A React + Vite frontend for complaint submission, listing, and officer management.
- An Express backend API with MongoDB support for storing grievances and handling file uploads.
- A responsive UI that supports easy navigation for citizens and officers.

## Features

- Submit new complaints with details and attachment support.
- View complaint cards and track statuses.
- Officer dashboard for reviewing and managing complaints.
- Multi-language support via application context.

## Technology Stack

- Frontend:
  - React
  - Vite
  - Lucide icons
- Backend:
  - Node.js
  - Express
  - Mongoose
  - Multer
  - CORS
  - dotenv
- Deployment helpers:
  - `gh-pages` (frontend deploy script configured)

## Repository Structure

- `frontend/` - React app and Vite configuration
- `backend/` - Express server, routes, models, and database configuration
- `.gitignore` - Ignores `node_modules`, logs, and environment files

## Getting Started

### Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your MongoDB connection string, for example:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/janvaani
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal to view the app.

## Deployment

The frontend package is configured with a `homepage` placeholder and deployment scripts for GitHub Pages.
Update `frontend/package.json` with your repository URL before running:

```bash
npm run deploy
```

## Notes

- Make sure MongoDB is running and accessible from the backend.
- The backend uses file uploads via `multer`, so uploaded evidence files are handled in the Express API.

## Contribution

If you want to improve this project, feel free to:
- Add more complaint status workflows
- Improve validation and error handling
- Add authentication for citizens and officers

## License

This project is open for improvement and can be shared freely.
