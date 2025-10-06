# Yapyard – Real-time Chat Application

Yapyard is a modern, full-stack chat application built with React and Node.js. It features real-time messaging, user authentication, email verification, password reset, profile management, and a sleek, responsive UI. Yapyard is designed for fast, secure, and interactive communication.

---

## Features

- **Real-time Chat:** Instant messaging with live updates using WebSockets.
- **User Authentication:** Sign up, login, email verification, password reset.
- **Profile Management:** Set username, avatar, and manage account details.
- **Chat History:** View and search previous conversations.
- **Sound Effects:** Keyboard and notification sounds for enhanced UX.
- **Loading Skeletons:** Smooth loading states for messages and users.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **Secure:** JWT-based authentication, email verification, and password reset flows.

---

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Zustand (state management)
- Axios (API calls)

**Backend:**
- Node.js (Express)
- MongoDB (via Mongoose)
- Socket.io (real-time communication)
- Nodemailer, Brevo, Arcjet (email services)
- Cloudinary (avatar uploads)
- JWT (authentication)

---

## Project Structure

### Frontend (`frontend/`)
- `src/components/`: Reusable UI components (chat, profile, loaders, etc.)
- `src/pages/`: Main app pages (Chat, Login, Signup, Forgot/Reset Password, Verify Email, Set Username)
- `src/hooks/`: Custom React hooks (e.g., keyboard sound effects)
- `src/store/`: Zustand stores for auth and chat state
- `src/lib/axios.js`: Axios instance for API requests
- `public/sounds/`: Sound assets for UI feedback

### Backend (`backend/`)
- `src/controllers/`: Route controllers for auth and messaging
- `src/models/`: Mongoose models (User, Message)
- `src/routes/`: Express route definitions
- `src/lib/`: Utilities (DB connection, email, cloudinary, socket, env)
- `src/emails/`: Email handlers and templates
- `src/middleware/`: Express and socket middlewares (auth, arcjet)
- `src/server.js`: Main server entry point

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- Cloudinary account (for avatar uploads)
- Email service credentials (Brevo, Arcjet, or SMTP)

### Setup

#### 1. Clone the repository

```sh
git clone <your-repo-url>
cd yapyard-main
```

#### 2. Configure Environment Variables

Create a `.env` file in both `frontend/` and `backend/` folders.  
Include variables for API URLs, MongoDB URI, JWT secret, email service credentials, and Cloudinary.

#### 3. Install Dependencies

```sh
cd backend
npm install
cd ../frontend
npm install
```

#### 4. Start Backend Server

```sh
cd backend
npm start
```

#### 5. Start Frontend

```sh
cd frontend
npm run dev
```

Visit [https://yapyard.vercel.app/](https://yapyard.vercel.app/)

---

## Usage

- **Sign Up:** Create an account and verify your email.
- **Login:** Access your chats and profile.
- **Chat:** Start new conversations, send messages, and view chat history.
- **Profile:** Set your username and avatar.
- **Password Reset:** Request a reset link via email if you forget your password.

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Environment:** Set production variables and configure CORS for frontend-backend communication.

---

**Note:**  
- For production, ensure HTTPS, secure environment variables, and proper email service configuration.
- Sound effects can be disabled or customized in the frontend.
