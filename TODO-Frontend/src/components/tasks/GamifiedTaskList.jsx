import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { CheckCircleIcon, FireIcon, StarIcon } from '@heroicons/react/24/outline';

const GamifiedTaskList = ({ tasks = [], onTaskUpdate, onTaskDelete }) => {
  const { stats, updateStats } = useUser();
  const [localTasks, setLocalTasks] = useState(tasks || []);

  useEffect(() => {
    setLocalTasks(tasks || []);
  }, [tasks]);

  const handleTaskToggle = async (task) => {
    try {
      const updatedTask = {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      };

      const response = await axios.put(`/api/tasks/${task._id}`, updatedTask);
      
      // Update local state
      setLocalTasks(prev => 
        prev.map(t => t._id === task._id ? response.data.data : t)
      );

      // If we have updated stats in the response, update the user context
      if (response.data.data.userStats) {
        updateStats(response.data.data.userStats);
        
        // Show XP gain notification
        if (updatedTask.status === 'completed' && response.data.data.userStats.xpGained) {
          toast.success(`+${response.data.data.userStats.xpGained} XP!`, {
            icon: '🎉',
            autoClose: 2000,
            hideProgressBar: true,
          });
        }
      }

      // Call parent handler if provided
      if (onTaskUpdate) {
        onTaskUpdate(response.data.data);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Calculate XP progress percentage
  const xpPercentage = Math.min(
    Math.round((stats.xp / stats.xpToNextLevel) * 100),
    100
  );

  return (
    <div className="space-y-4">
      {/* XP and Level Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="font-bold text-gray-700 dark:text-gray-200">
              Level {stats.level}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.xp} / {stats.xpToNextLevel} XP
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
        
        {/* Streak Counter */}
        {stats.streak > 0 && (
          <div className="mt-4 flex items-center text-sm text-orange-500">
            <FireIcon className="h-5 w-5 mr-1" />
            <span>{stats.streak} day streak!</span>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {localTasks && localTasks.length > 0 ? localTasks.map((task) => (
          <div 
            key={task._id}
            className={`flex items-center p-4 rounded-lg shadow ${
              task.status === 'completed' 
                ? 'bg-green-50 dark:bg-green-900/30' 
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } transition-colors duration-200`}
          >
            <button
              onClick={() => handleTaskToggle(task)}
              className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
              } transition-colors`}
              aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.status === 'completed' && <CheckCircleIcon className="h-4 w-4" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <p 
                className={`text-sm font-medium ${
                  task.status === 'completed' 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {task.title}
              </p>
              {task.xpValue > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                  +{task.xpValue} XP
                </span>
              )}
            </div>
            
            {task.priority && (
              <span 
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamifiedTaskList;
