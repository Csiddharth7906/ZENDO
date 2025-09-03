import { FireIcon, TrophyIcon, StarIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../contexts/UserContext';

const GamificationStats = () => {
  const { stats } = useUser();
  
  // Calculate level progress
  const levelProgress = Math.min(Math.round((stats.xp / stats.xpToNextLevel) * 100), 100);
  
  // Mock achievements - replace with actual achievements from backend
  const achievements = [
    { id: 1, name: 'First Task', description: 'Complete your first task', completed: true },
    { id: 2, name: 'Early Bird', description: 'Complete 3 tasks before 9 AM', completed: stats.streak >= 1 },
    { id: 3, name: 'Week Streak', description: 'Maintain a 7-day streak', completed: stats.streak >= 7 },
    { id: 4, name: 'Task Master', description: 'Complete 50 tasks', completed: stats.totalTasks >= 50 },
    { id: 5, name: 'Overachiever', description: 'Reach level 10', completed: stats.level >= 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
          Level Progress
        </h2>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            Level {stats.level}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stats.xp} / {stats.xpToNextLevel} XP
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${levelProgress}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {stats.xpToNextLevel - stats.xp} XP to next level
        </p>
      </div>
      
      {/* Streak */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
          Streak
        </h2>
        
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">{stats.streak || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.streak === 0 ? 'Start a streak today!' : 
               stats.streak === 1 ? 'Day in a row!' : 
               'Days in a row!'}
            </p>
          </div>
        </div>
        
        {stats.streak > 0 && (
          <div className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Come back tomorrow to continue your streak!
          </div>
        )}
      </div>
      
      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          Achievements
        </h2>
        
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-start p-3 rounded-lg ${
                achievement.completed 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                achievement.completed 
                  ? 'bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400' 
                  : 'bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-500'
              }`}>
                {achievement.completed ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <BoltIcon className="h-4 w-4" />
                )}
              </div>
              <div>
                <h3 className={`text-sm font-medium ${
                  achievement.completed 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationStats;
