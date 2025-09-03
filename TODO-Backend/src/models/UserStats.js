const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastCompleted: {
    type: Date
  },
  achievements: [{
    type: String,
    enum: ['first_task', 'streak_3', 'streak_7', 'streak_30', 'level_5', 'level_10', 'all_tasks_completed']
  }]
}, { timestamps: true });

// Calculate level based on XP
userStatsSchema.methods.calculateLevel = function() {
  return Math.floor(Math.sqrt(this.xp / 100));
};

// Add XP and check for level up
userStatsSchema.methods.addXP = function(amount) {
  this.xp += amount;
  const newLevel = this.calculateLevel();
  const leveledUp = newLevel > this.level;
  this.level = newLevel;
  return { leveledUp, newLevel };
};

// Update streak
userStatsSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastCompleted = this.lastCompleted ? new Date(this.lastCompleted) : null;
  
  // Reset time parts for accurate day comparison
  now.setHours(0, 0, 0, 0);
  if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const dayInMs = 1000 * 60 * 60 * 24;
  const diffDays = lastCompleted ? Math.round((now - lastCompleted) / dayInMs) : 0;
  
  if (diffDays === 0) {
    // Already completed a task today
    return { currentStreak: this.streak, streakUpdated: false };
  } else if (diffDays === 1) {
    // Consecutive day
    this.streak += 1;
  } else if (diffDays > 1) {
    // Broken streak
    this.streak = 1;
  } else {
    // First task
    this.streak = 1;
  }
  
  this.lastCompleted = now;
  return { currentStreak: this.streak, streakUpdated: true };
};

module.exports = mongoose.model('UserStats', userStatsSchema);
