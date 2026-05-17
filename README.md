# AI Candidate Profile Shortlisting System

A full-stack production-ready MERN application that intelligently shortlists and ranks candidates based on skills, experience, and AI-powered analysis using the OpenRouter API.

## Features
- **Recruiter Authentication**: JWT-based login and registration.
- **Candidate Management**: Full CRUD capabilities for candidate profiles.
- **Basic Matching**: Skill overlap, preferred skills, experience scoring, match levels, and ranked results.
- **AI Matching**: OpenRouter integration to evaluate candidates, explain recommendations, and generate interview questions.
- **Premium UI**: Modern glassmorphism design with Tailwind CSS and Framer Motion animations.
- **Command Palette Search**: Global search using `Ctrl+K`.
- **Analytics Dashboard**: Real-time charts using Recharts for candidate statistics.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.
- **AI**: OpenRouter API (`openai/gpt-5.2` by default).

## Required API Endpoints
- `POST /api/candidates` - Add a candidate.
- `GET /api/candidates` - Get all candidates for the logged-in recruiter.
- `POST /api/match` - Run basic skill and experience matching.
- `POST /api/ai/shortlist` - Run OpenRouter AI-based ranking and recommendations.

All candidate and matching endpoints are protected, so register/login first and send the JWT as `Authorization: Bearer <token>`.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxhw8ih.mongodb.net/candidate-shortlisting?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=openai/gpt-5.2
   CLIENT_URL=http://localhost:5173
   ```
4. Optional: Seed the database with dummy data: `node seed.js`
5. Start the development server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server: `npm run dev`

## Deployment to Render

### Backend Deployment
1. Create a new Web Service on Render.
2. Set the Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all Environment Variables from your `.env` file. (Set `CLIENT_URL` to your deployed frontend URL).
   - `MONGO_URI`: your MongoDB Atlas URI.
   - `JWT_SECRET`: any long random secret string.
   - `OPENROUTER_API_KEY`: your OpenRouter API key.
   - `OPENROUTER_MODEL`: `openai/gpt-5.2` or another model available in your OpenRouter account.
   - `CLIENT_URL`: your deployed frontend URL, for example `https://your-frontend.onrender.com`.

### Frontend Deployment
1. Create a new Static Site on Render.
2. Set the Root Directory to `client`.
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add the Environment Variable `VITE_API_URL` pointing to your deployed backend API URL, for example `https://your-backend.onrender.com/api`.
6. For Client-Side Routing: Add a Redirect/Rewrite rule in Render settings:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
