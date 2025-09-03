# TaskMaster Backend API

A robust backend API for the TaskMaster application, featuring task management, user authentication, and gamification elements.

## Features

- **User Authentication**
  - Register, login, and manage user accounts
  - JWT-based authentication
  - Password reset functionality

- **Task Management**
  - Create, read, update, and delete tasks
  - Filter and sort tasks
  - Task categories and priorities

- **Gamification**
  - XP and leveling system
  - Daily streaks
  - Achievements
  - Leaderboard

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
JWT_COOKIE_EXPIRE=30

# Email (using Mailtrap for development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=no-reply@taskmaster.com

# Gamification
BASE_XP=10
XP_MULTIPLIER=1.5
STREAK_BONUS=5
MAX_STREAK_DAYS=7

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Tasks
- `GET /api/tasks` - Get all tasks for the logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### User Stats
- `GET /api/user/me` - Get current user's stats
- `POST /api/user/xp` - Add XP to user
- `GET /api/user/leaderboard` - Get leaderboard

## Development

- Run in development mode:
  ```
  npm run dev
  ```

- Run tests:
  ```
  npm test
  ```

## License

This project is licensed under the MIT License.
