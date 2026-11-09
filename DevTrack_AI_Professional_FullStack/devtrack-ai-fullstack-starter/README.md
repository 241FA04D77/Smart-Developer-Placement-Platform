# DevTrack AI — Full-Stack Developer Project Tracking System

A full-stack project and task management workspace for individual developers and small teams. DevTrack AI brings project organization, task priorities, progress visibility and AI-assisted project insights into one responsive web application.

## Product capabilities

- **Account security:** registration and sign-in, bcrypt password hashing, signed JWT sessions and protected API routes.
- **Project management:** create, view, update and delete projects; project deletion also removes its associated tasks.
- **Task management:** create tasks with descriptions, priorities, due dates and workflow status; update status and delete tasks.
- **Progress dashboard:** task totals, completion metrics, project progress bars and status distribution.
- **AI project insights:** concise project status and next-step suggestions from a configured AI provider, with a deterministic local fallback when no provider key is configured.
- **Responsive interface:** desktop sidebar, mobile-friendly layout, empty states, loading feedback and error messages.
- **API safeguards:** Helmet security headers, JSON payload limits, authentication rate limiting, request validation and user-scoped database queries.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Lucide icons, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Security | Helmet, express-rate-limit, CORS allowlist |
| AI | Optional OpenAI-compatible chat completions endpoint; local fallback |

## Project structure

```text
devtrack-ai-fullstack-starter/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── style.css
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── middleware/auth.js
│       ├── models/ (User, Project, Task)
│       └── routes/ (auth, projects, tasks, ai)
├── REPORT.md
└── README.md
```

## Requirements

- Node.js 20 LTS or newer
- npm 10 or newer
- MongoDB Atlas account or a local MongoDB server
- Optional AI provider API key for provider-generated insights

## Local setup

### 1. Configure the backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update the values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Keep `.env` private. Never commit database credentials, JWT secrets or AI provider keys.

Start the API:

```bash
npm run dev
```

The API health endpoint is `http://localhost:5000/api/health`.

### 2. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Register an account, create a project, add tasks and generate an AI insight.

Vite proxies `/api` requests to the Express server. The proxy is configured in `client/vite.config.js`.

## API overview

All project, task and AI endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in and receive a JWT |
| GET | `/api/health` | API health check |
| GET / POST | `/api/projects` | List or create projects |
| PATCH / DELETE | `/api/projects/:id` | Update or delete a project |
| GET / POST | `/api/tasks` | List or create tasks |
| PATCH / DELETE | `/api/tasks/:id` | Update or delete a task |
| POST | `/api/ai/insights/:projectId` | Generate project insights |

### Data model

- **User:** name, normalized email, password hash and timestamps.
- **Project:** owner reference, name, description, status, optional due date and timestamps.
- **Task:** owner and project references, title, description, status (`todo`, `in-progress`, `done`), priority (`low`, `medium`, `high`), optional due date and timestamps.

Every project/task query is scoped to the authenticated owner. The API only accepts explicitly supported update fields.

## AI insights configuration

When `OPENAI_API_KEY` is present, the AI route sends a compact project/task summary to the configured chat-completions model. Without a key, DevTrack AI returns a local rule-based insight containing completion percentage, high-priority task count and suggested next actions. The fallback is intended for development and demonstrations; it is not a generative model.

## Production deployment checklist

1. Provision MongoDB Atlas and create a least-privilege database user.
2. Deploy the API to Render, Railway or another Node.js host.
3. Set `MONGO_URI`, a strong unique `JWT_SECRET`, `CLIENT_ORIGIN` and optional AI credentials in the hosting environment.
4. Deploy the Vite frontend to Vercel or Netlify and configure the API proxy/rewrite to the deployed backend.
5. Use HTTPS, restrict CORS to the exact production frontend origin and rotate secrets before release.
6. Add automated API/UI tests, monitoring, backups, email verification, password reset and audit logging before production use with real users.

## Current scope and limitations

This is an academic full-stack starter, not a fully audited enterprise service. JWTs are stored in browser local storage in this starter. For a higher-security production deployment, consider secure, HTTP-only cookies, refresh-token rotation, CSRF protections, stronger schema validation, automated tests, audit trails and role-based team collaboration. AI insights depend on the configured provider when enabled and should be reviewed by the user before acting on recommendations.

## Academic report

See [`REPORT.md`](./REPORT.md) for the project report content and chapter structure. Add your team details, guide information and verified application screenshots before final submission.
