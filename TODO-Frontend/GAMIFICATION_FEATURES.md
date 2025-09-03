# Gamification Features

This document outlines the gamification features implemented in the To-Do application.

## Features

### 1. User Progress System
- **Levels**: Users level up as they complete tasks
- **XP Points**: Earn XP for completing tasks
- **Streaks**: Daily login and task completion streaks
- **Achievements**: Unlockable achievements for various milestones

### 2. Visual Feedback
- XP gain notifications
- Level-up animations
- Achievement unlock popups
- Progress bars for level progression

### 3. Dashboard Stats
- Current level and progress to next level
- Daily/weekly task completion
- Current streak counter
- Achievement tracker

## Components

### UserContext
Manages user state including:
- Authentication status
- User profile
- Game stats (level, XP, streak, achievements)
- Authentication methods (login, register, logout)

### GamifiedTaskList
Enhanced task list with:
- XP indicators for tasks
- Visual feedback on completion
- Streak indicators
- Priority-based styling

### GamificationStats
Displays user progress including:
- Level progress bar
- XP counter
- Streak counter
- Achievement list

## Integration

The gamification system is integrated with the existing task management system:
- Tasks award XP on completion
- Daily streaks are tracked
- Achievements are unlocked based on user activity
- All stats are persisted to the backend

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_XP=100
REACT_APP_STREAK_BONUS=1.2
```

## Dependencies

- @heroicons/react: For UI icons
- react-toastify: For notifications
- axios: For API requests
- react-router-dom: For routing
