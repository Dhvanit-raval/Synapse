# Synapse AI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20API-F55036)

Synapse AI is a full-stack AI chat workspace built with React, Vite, Express, MongoDB, and the Groq Chat Completions API. It includes user authentication, protected chat access, persistent conversation threads, Markdown rendering, syntax-highlighted code blocks, GitHub-flavored Markdown tables, theme settings, and a polished animated interface.

## Live Deployment

| App | URL |
| --- | --- |
| ![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white) | https://synapse-eight-weld.vercel.app |
| ![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white) | https://synapse-um0x.onrender.com |

## Preview

Synapse provides a modern conversational UI with:

- AI chat powered by Groq.
- Login and registration.
- Protected `/chat` route.
- Persistent user-specific thread history.
- New chat creation and thread deletion.
- Markdown, code blocks, and table rendering.
- Copy button for code snippets.
- Light and dark theme support.
- Settings panel for font size, bubble style, animations, and sound preference.
- Animated landing page and chat interactions.

## Tech Stack

### Frontend

| Package | Purpose |
| --- | --- |
| `react` | UI library for building the app interface. |
| `react-dom` | React DOM rendering. |
| `vite` | Fast frontend dev server and production build tool. |
| `@vitejs/plugin-react` | React integration for Vite. |
| `@rolldown/plugin-babel` | Babel integration used with the React compiler preset. |
| `babel-plugin-react-compiler` | React Compiler support. |
| `react-router-dom` | Client-side routing for home, login, and chat pages. |
| `animejs` | UI animations and transitions. |
| `react-markdown` | Markdown rendering for AI responses. |
| `remark-gfm` | GitHub-flavored Markdown support, including tables. |
| `rehype-highlight` | Code syntax highlighting inside Markdown. |
| `highlight.js` | Code highlighting theme support. |
| `react-spinners` | Loading indicator in the chat window. |
| `jwt-decode` | Decodes JWT-style tokens when present. |
| `uuid` | Generates unique chat thread IDs. |
| `oxlint` | Frontend linting. |

### Backend

| Package | Purpose |
| --- | --- |
| `express` | HTTP API server. |
| `mongoose` | MongoDB object modeling. |
| `dotenv` | Loads environment variables from `.env`. |
| `cors` | Allows frontend/backend communication during development. |
| `cookie-parser` | Cookie parsing middleware. |
| `bcrypt` | Password hashing for registered users. |
| `http-status` | Readable HTTP status constants. |
| `groq-sdk` | Groq SDK, used by the key-check helper. |
| `nodemon` | Backend development server with auto-restart. |
| `@google/genai` | Installed AI SDK dependency. |

## Project Structure

```text
Synapse/
|-- backend/
|   |-- controllers/
|   |   `-- user.controller.js
|   |-- models/
|   |   |-- Thread.js
|   |   `-- users.model.js
|   |-- routes/
|   |   |-- chat.js
|   |   `-- users.routes.js
|   |-- utils/
|   |   `-- groq.js
|   |-- checkKey.js
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |   |-- Login/
|   |   |   |-- ProtectedRoute/
|   |   |   |-- Settings/
|   |   |   |-- Home.jsx
|   |   |   |-- Navbar.jsx
|   |   |   `-- Sidebar.jsx
|   |   |-- context/
|   |   |   |-- AuthContext.jsx
|   |   |   `-- ChatContext.jsx
|   |   |-- hooks/
|   |   |   `-- useToken.jsx
|   |   |-- utils/
|   |   |   `-- api.jsx
|   |   |-- App.jsx
|   |   |-- Chat.jsx
|   |   |-- Chatwindow.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Features

### Authentication

- Register with name, email, username, and password.
- Passwords are hashed using `bcrypt`.
- Login returns a generated token.
- Token is stored in `localStorage`.
- The chat page is protected and redirects unauthenticated users to `/login`.

### AI Chat

- Sends user messages to the backend at `POST /api/chat`.
- Backend calls Groq Chat Completions with the `openai/gpt-oss-20b` model.
- Assistant replies are saved to MongoDB.
- Frontend displays replies with a typing animation.

### Thread History

- Each chat uses a generated UUID thread ID.
- Threads are saved in MongoDB with user messages and assistant replies.
- Sidebar shows previous chat threads.
- Users can open old threads or delete them.

### Markdown Output

AI responses support:

- Headings.
- Lists.
- Tables.
- Inline code.
- Fenced code blocks.
- Syntax highlighting.
- Copy-to-clipboard code blocks.

## Requirements

Install these before running the project:

- Node.js 18 or newer.
- npm.
- MongoDB Atlas account or local MongoDB server.
- Groq API key.

## Environment Variables

**Important:** Production deployments use separate frontend and backend domains:

- Frontend: `https://synapse-eight-weld.vercel.app`
- Backend: `https://synapse-um0x.onrender.com`

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173,http://localhost:8080,https://synapse-eight-weld.vercel.app
```

Do not commit real `.env` values to GitHub.

For the frontend, API calls default to same-origin `/api` and Vite proxies those calls to the local backend during development. If the deployed frontend and backend are on different domains, create `frontend/.env`:

```env
VITE_API_BASE_URL=https://synapse-um0x.onrender.com
```

![Render](https://img.shields.io/badge/Render-backend-46E3B7?logo=render&logoColor=white) Set `FRONTEND_URL` to include the Vercel frontend domain.

![Vercel](https://img.shields.io/badge/Vercel-frontend-000000?logo=vercel&logoColor=white) Set `VITE_API_BASE_URL` to the Render backend domain before building the frontend.

## Installation

Clone or open the project, then install dependencies for both apps.

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running Locally

Run the backend and frontend in two separate terminals.

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

Backend runs at:

```text
http://localhost:3000
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend usually runs at:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## Windows PowerShell Note

If PowerShell blocks `npm` with an execution policy error, use:

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the frontend for production. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs Oxlint. |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Express server with Nodemon. |
| `npm start` | Starts the Express server for production. |
| `node checkKey.js` | Tests whether the Groq API key works. |

## Docker

The project includes Dockerfiles for both apps and a Compose setup with MongoDB.

Create a root `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
```

Build and run:

```bash
docker compose build
docker compose up
```

Open:

```text
http://localhost:8080
```

The frontend container serves the Vite build with Nginx and proxies `/api` to the backend container. The backend is also exposed at `http://localhost:3000`, and MongoDB data is stored in the `mongo-data` Docker volume.

## API Routes

### User Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users/register` | Creates a new user account. |
| `POST` | `/api/users/login` | Logs in a user and returns a token. |

### Chat Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/chat` | Sends a message to the AI and saves the reply. |
| `GET` | `/api/thread` | Returns all threads for the authenticated user. |
| `GET` | `/api/thread/:threadId` | Returns messages for one thread. |
| `DELETE` | `/api/thread/:threadId` | Deletes a thread. |

## Request Examples

### Register

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Demo User\",\"username\":\"demo\",\"email\":\"demo@example.com\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"password123\"}"
```

### Send Chat Message

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"threadId\":\"demo-thread-id\",\"message\":\"Explain React hooks simply\"}"
```

## Build

To create a production frontend build:

```bash
cd frontend
npm run build
```

The production files are generated in:

```text
frontend/dist
```

## Important Notes

- **Backend port:** The backend listens on `PORT`, defaulting to `3000`.
- **Frontend domain:** The deployed frontend is `https://synapse-eight-weld.vercel.app`.
- **Backend domain:** The deployed backend is `https://synapse-um0x.onrender.com`.
- **API base:** The frontend uses same-origin `/api` by default. Set `VITE_API_BASE_URL` when the backend is on a separate domain.
- **CORS:** Origins are configured through `FRONTEND_URL`, comma-separated.
- **Database:** Chat history requires MongoDB to be connected.
- **AI key:** AI replies require a valid `GROQ_API_KEY`.
- **Assets:** Font Awesome and Google Fonts are loaded from CDNs in `frontend/index.html`.

## Troubleshooting

### Backend says MongoDB connection failed

Check that `MONGO_URL` is correct and your MongoDB server or Atlas cluster is reachable.

### AI replies fail

Check that `GROQ_API_KEY` exists in `backend/.env`. You can test it with:

```bash
cd backend
node checkKey.js
```

### Frontend cannot reach backend

Make sure the backend is running at `http://localhost:3000` and the frontend is running at `http://localhost:5173`.

For the deployed app, confirm:

- Vercel has `VITE_API_BASE_URL=https://synapse-um0x.onrender.com`.
- Render has `FRONTEND_URL` containing `https://synapse-eight-weld.vercel.app`.
- Both services were redeployed after changing environment variables.

### Markdown tables look broken

Make sure `remark-gfm` is installed in the frontend dependencies and that the latest frontend build is running.

## Future Improvements

- Add JWT-based authentication with expiration.
- Add refresh tokens or server-side sessions.
- Add streaming responses from the backend.
- Add automated frontend and backend tests.
- Add centralized error handling and request validation.

## License

Distributed under the MIT License. See `LICENSE` for more information.
