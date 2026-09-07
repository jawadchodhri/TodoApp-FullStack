# ⚡ TodoApp Pro — Full-Stack Task Management Web Application

A full-stack, responsive task management and productivity application built with **React 19**, **Vite**, **Express.js**, and **MongoDB Atlas**. Features JWT-based user authentication, task filtering & search, priority & category tagging, real-time productivity statistics, and seamless cloud deployment.

---

## 🔗 Live Deployments

- 🌐 **Frontend (Vercel):** [https://todo-app-full-stack-beige.vercel.app](https://todo-app-full-stack-beige.vercel.app)
- ⚙️ **Backend API (Render):** [https://todoapp-fullstack-r77w.onrender.com/api/health](https://todoapp-fullstack-r77w.onrender.com/api/health)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **State & Context:** React Context API (`AuthContext`)
- **Hosting:** Vercel

### Backend
- **Server:** Node.js + Express.js (ES Modules)
- **Database:** MongoDB Atlas + Mongoose 8 ODM
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs` password hashing
- **Security:** CORS origin validation, Cookie-Parser, Bearer Token headers
- **Hosting:** Render (Web Service)

---

## ✨ Key Features

### 🔐 Authentication & Security
* **User Isolation:** Each user has an isolated workspace with strict database-level security (`user: req.user.id`).
* **Secure Passwords:** Salted hashing with `bcryptjs` (passwords never stored in plain text).
* **Dual Auth Support:** JWT authentication supporting both `Authorization: Bearer <token>` headers and `HttpOnly` cookies for reliable cross-domain requests.
* **Persistent Sessions:** Seamless session verification upon page reload.

### 📋 Smart Task Management
* **Full CRUD Operations:** Create, Read, Update, and Delete tasks with instant client updates.
* **Priority Levels:** Organize tasks with color-coded badges: 🟢 Low, 🟡 Medium, 🔴 High.
* **Categories:** Tag tasks into categories (Work, Personal, Shopping, Health, Education, General).
* **Due Dates & Notes:** Add optional descriptions and due date deadlines.
* **Inline Task Editing:** Edit title, category, priority, and notes in an intuitive modal.

### 🔍 Search, Filters & Analytics
* **Live Keyword Search:** Instant search across task titles and descriptions.
* **Status Filter Tabs:** Quickly switch between `All`, `Active`, and `Completed` tasks.
* **Category Dropdown Filter:** Filter tasks by category tags.
* **Live Stats Bar:** Real-time summary cards displaying:
  - Total Tasks
  - Tasks In Progress
  - Completed Tasks
  - High Priority Alerts

### 🎨 Modern UI / UX
* Glassmorphic dark theme layout with glowing borders and smooth transitions.
* Fully responsive design optimized for mobile, tablet, and desktop viewports.
* Polished empty states, confirmation prompts, and loading spinners.

---

## 📡 API Endpoints Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user & issue JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |
| `POST` | `/api/auth/logout` | Private | Clear session & cookie |

### Todo Routes (`/api/todos`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/todos` | Private | Get user's tasks (supports `?status=`, `?category=`, `?search=`) |
| `POST` | `/api/todos` | Private | Create a new task |
| `PUT` | `/api/todos/:id` | Private | Update task details |
| `PATCH` | `/api/todos/:id/toggle` | Private | Toggle task completion status |
| `DELETE` | `/api/todos/:id` | Private | Delete a task |
| `GET` | `/api/todos/stats` | Private | Get live count statistics |
