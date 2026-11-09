# DEVTRACK AI – FULL-STACK DEVELOPER PROJECT TRACKING SYSTEM

## Declaration

We hereby declare that the field project titled **“DEVTRACK AI – FULL-STACK DEVELOPER PROJECT TRACKING SYSTEM”** is the result of our own study, design and implementation work. Student names, roll numbers and guide details are to be completed by the project team before submission.

## Table of Contents

1. Abstract
2. Introduction
   - 2.1 Drawbacks of Existing Systems
   - 2.2 Project Objectives
3. System Architecture
   - 3.1 User Interface Module
   - 3.2 Application Logic Module
   - 3.3 Data Storage Module
4. Implementation
   - 4.1 Technologies Used
   - 4.2 User Management Module
   - 4.3 Project and Task Management Module
   - 4.4 AI Insights Module
5. Results and Discussion
   - 5.1 System Performance Comparison
6. Conclusion and Future Work
7. References

## 1. Abstract

DevTrack AI is a full-stack web application designed to help individual developers and small software teams organize projects, manage tasks and understand development progress from a single workspace. The application provides secure account registration and login, project creation, task tracking, priority selection, due dates and status updates. A dashboard summarizes project and task progress. An AI insights module produces a concise project summary and practical next-step suggestions. When an AI provider key is not configured, a local rule-based fallback provides basic progress insights. The system uses React and Vite for the frontend, Node.js and Express for server-side operations, and MongoDB for persistent data storage. JWT-based authentication and password hashing are included. The application is designed as an extensible foundation for improving project visibility, task coordination and developer productivity.

## 2. Introduction

Software development projects involve activities such as requirement analysis, design, coding, testing, documentation and deployment. When these activities are tracked manually, team members may lose visibility into task ownership, deadlines and overall project progress. Project updates can become scattered across spreadsheets, chat messages and personal notes. DevTrack AI provides a unified web-based workspace where users can create projects, add tasks, set priorities and update task status. The dashboard summarizes task distribution and completion progress. The AI assistant uses project and task information to generate a short status summary and suggested next actions.

The application follows a client-server architecture. The React frontend communicates with an Express REST API. The API validates requests, checks authentication and reads or updates MongoDB documents through Mongoose models. This separation supports maintainability and future extension.

### 2.1 Drawbacks of Existing Systems

- Project information may be spread across spreadsheets, chat messages and personal notes.
- Progress reporting often depends on manual updates and may become outdated.
- Task priorities and pending work may not be visible in one place.
- Developers may spend time preparing status summaries instead of reviewing actual work.
- Basic tools may not provide contextual suggestions for the next development activities.
- Without centralized storage and access control, maintaining consistent project records becomes difficult.

### 2.2 Project Objectives

- Develop a responsive full-stack application for organizing software projects and tasks.
- Provide secure registration and login using password hashing and token-based authentication.
- Support project creation, editing and deletion.
- Support task creation, status updates, priority selection and deletion.
- Display project and task progress through a dashboard.
- Provide AI-assisted project summaries and next-step suggestions.
- Store user, project and task information persistently in MongoDB.
- Design the application in modular form so additional collaboration and reporting features can be added later.

## 3. System Architecture

The proposed system follows a three-layer architecture consisting of the presentation layer, application layer and data storage layer. The user interacts with the React interface through a desktop or mobile browser. The interface sends HTTP requests to the Express API. Authentication middleware verifies the JWT before protected operations are performed. Route handlers validate the request, execute business logic and use Mongoose models to communicate with MongoDB. For AI insights, the backend collects the selected project's details and task statistics, then either calls a configured AI provider or generates a local fallback summary. The result is returned to the frontend and displayed in the project insights panel.

**Logical flow:** User → React UI → Express REST API → Authentication and Business Logic → MongoDB. The AI Insights Service receives project context from the backend and returns an insight response to the React UI.

### 3.1 User Interface Module

The user interface is developed using React. It contains authentication screens, navigation, dashboard metrics, project lists, task lists, project creation forms and task creation forms. The dashboard displays the number of projects and tasks, completed tasks and high-priority work requiring attention. Users can filter tasks by project and update task status. Responsive CSS adapts the interface to different screen sizes. Loading, empty and error states provide feedback during user interaction.

### 3.2 Application Logic Module

The application logic is implemented using Node.js and Express. It exposes REST endpoints for authentication, projects, tasks and AI insights. Registration validates required fields and hashes the password before saving the user. Login compares the submitted password with the stored hash and returns a signed JWT. Protected routes use authentication middleware to identify the current user. Project and task operations are scoped to the authenticated user. The backend also applies security headers, request-size limits and rate limiting to authentication routes.

### 3.3 Data Storage Module

MongoDB is used as the persistent database and Mongoose defines the data models. The User collection stores the user's name, email and password hash. The Project collection stores the owner, project name, description, status and optional due date. The Task collection stores its project reference, owner, title, description, status, priority and optional due date. References connect tasks with their projects and support project-specific task retrieval and dashboard summaries.

## 4. Implementation

DevTrack AI is implemented as a full-stack JavaScript application. The frontend and backend are maintained in separate folders to keep presentation logic independent from server-side operations. The client communicates with the backend through JSON-based REST requests. The backend uses environment variables for database credentials, token secrets and optional AI provider configuration.

### 4.1 Technologies Used

- **React:** Builds reusable interface components and manages client-side state.
- **Vite:** Provides the frontend development server and production build process.
- **CSS:** Provides layout, colors, responsive behavior and visual styling.
- **Node.js:** Runs the JavaScript backend environment.
- **Express.js:** Defines REST API routes and middleware.
- **MongoDB:** Stores user, project and task documents.
- **Mongoose:** Defines schemas and supports database operations.
- **JWT:** Provides signed tokens for authenticated API access.
- **bcryptjs:** Hashes passwords before storage and verifies passwords during login.
- **Helmet and express-rate-limit:** Add security headers and limit repeated authentication requests.
- **Optional AI provider API:** Generates natural-language project insights when configured. A local fallback is included for development without an API key.

### 4.2 User Management Module

The user management module supports account registration and login. During registration, the user provides a name, email address and password. The backend validates the fields, checks that the email is not already registered and hashes the password using bcryptjs. The password itself is not stored in the database. During login, the backend retrieves the user by email and compares the entered password with the saved hash. If the credentials are valid, the server generates a JWT with an expiry period. The frontend includes this token in authenticated API requests.

### 4.3 Project and Task Management Module

The project module allows a user to create projects with a name, description and optional due date. Projects can be listed, updated or deleted. When a project is deleted, its associated tasks are also deleted by the API. The task module allows users to add tasks to their own projects, enter descriptions, select a priority, set an optional due date and change task status. Supported task states are To Do, In Progress and Done. Dashboard statistics are calculated from task records returned by the API.

### 4.4 AI Insights Module

The AI insights module provides a short status overview and practical next actions for a selected project. The backend calculates the number of total, completed, in-progress, open and unfinished high-priority tasks. If an AI provider key is configured, the server sends a compact project context to the configured model and returns its response. If no key is available, a deterministic local fallback calculates completion percentage and recommends reviewing high-priority tasks, completing active work after verification and assigning due dates to tasks that do not have them. The fallback allows the insight workflow to be demonstrated without an external AI service.

## 5. Results and Discussion

The application is structured to demonstrate the main workflow of a developer project tracker: account registration, login, project creation, task creation, task status changes, dashboard summaries and project insights. Expected interface states include an empty dashboard before projects are created, a populated project list after project creation and updated progress after tasks are marked complete. The AI insight panel displays either a provider-generated response or the local fallback. Actual screenshots and measured test results must be inserted after the application is installed, run and verified in the target environment.

**Suggested screenshots for final submission:** (1) Login and registration screen, (2) dashboard with task statistics, (3) project creation form, (4) task list showing different statuses and priorities, and (5) AI project insights panel.

### 5.1 System Performance Comparison

| Parameter | Manual / disconnected approach | DevTrack AI approach |
|---|---|---|
| Project information | Spread across tools | Centralized project workspace |
| Task status | Manually communicated | Updated in the task list |
| Priority visibility | May be inconsistent | Priority shown per task |
| Progress overview | Prepared manually | Dashboard task counts |
| Status summary | Written manually | AI insight or local fallback |
| Data persistence | Depends on individual tools | MongoDB-backed records |

The comparison describes intended functional differences. Quantitative claims such as response time, user satisfaction or productivity improvement should only be added after a documented evaluation with real test data.

## 6. Conclusion and Future Work

DevTrack AI provides a full-stack foundation for managing software projects and development tasks. It combines a React user interface, an Express backend and MongoDB storage to support account management, project organization and task tracking. The dashboard provides a consolidated view of task progress, while the AI insights module helps users review project status and identify possible next actions. The local fallback ensures that the basic insight workflow can be demonstrated even when an external AI key is unavailable.

Future enhancements may include team invitations, task assignment to multiple users, comments, file attachments, notifications, calendar integration, GitHub integration, sprint planning, activity history, advanced analytics and role-based team administration. Further work should also include automated tests, email verification, password reset, audit logging, stronger input validation and deployment configuration.

## 7. References

[1] React Documentation, “React – The Library for Web and Native User Interfaces,” https://react.dev/

[2] Vite Documentation, “Getting Started,” https://vite.dev/guide/

[3] OpenJS Foundation, “Node.js Documentation,” https://nodejs.org/docs/latest/api/

[4] Express.js, “Express – Node.js Web Application Framework,” https://expressjs.com/

[5] MongoDB, “MongoDB Manual,” https://www.mongodb.com/docs/manual/

[6] Mongoose, “Mongoose Documentation,” https://mongoosejs.com/docs/

[7] Auth0, “JSON Web Tokens,” https://jwt.io/introduction/

[8] OWASP Foundation, “Password Storage Cheat Sheet,” https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

[9] OpenAI, “API Reference,” https://platform.openai.com/docs/api-reference/ (for optional model integration)
