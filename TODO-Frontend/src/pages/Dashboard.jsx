import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { TaskProvider } from '../contexts/TaskContext';
import GamifiedTaskList from '../components/tasks/GamifiedTaskList';
import GamificationStats from '../components/gamification/GamificationStats';
import TaskForm from '../components/tasks/TaskForm';
import { 
  PlusIcon, 
  BellIcon, 
  MagnifyingGlassIcon, 
  FireIcon,
  StarIcon,
  TrophyIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon, 
  ListBulletIcon,
  Bars3Icon
} from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { stats, updateStats } = useUser();
  const navigate = useNavigate();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Stats for the dashboard cards
  const dashboardStats = [
    { 
      name: 'Current Level', 
      value: stats?.level || 1, 
      icon: StarIcon, 
      change: `${stats?.xp || 0}/${stats?.xpToNextLevel || 100} XP`,
      changeType: 'neutral'
    },
    { 
      name: 'Daily Streak', 
      value: stats?.streak || 0, 
      icon: FireIcon, 
      change: stats?.streak > 0 ? 'Keep it up!' : 'Start a streak!',
      changeType: stats?.streak > 0 ? 'increase' : 'decrease'
    },
    { 
      name: 'Tasks Completed', 
      value: stats?.tasksCompleted || 0, 
      icon: CheckCircleIcon, 
      change: '+5 today',
      changeType: 'increase'
    },
    { 
      name: 'Achievements', 
      value: `${stats?.achievements?.filter(a => a.completed)?.length || 0}/${stats?.achievements?.length || 0}`, 
      icon: TrophyIcon, 
      change: '2 new',
      changeType: 'increase'
    },
  ];

  // Handle task completion
  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.userStats) {
      updateStats(updatedTask.userStats);
    }
  };

  return (
    <TaskProvider>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="ml-4 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] fixed top-16 left-0 overflow-y-auto">
              <nav className="mt-6">
                <div className="px-6">
                  <div className="flex items-center px-2 py-3 text-gray-900 bg-indigo-50 rounded-md">
                    <Squares2X2Icon className="w-5 h-5 text-indigo-600" />
                    <span className="mx-3 font-medium">Dashboard</span>
                  </div>
                  <div className="mt-2">
                    <button 
                      onClick={() => navigate('/upcoming')}
                      className="w-full flex items-center px-2 py-3 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <ClockIcon className="w-5 h-5" />
                      <span className="mx-3">Upcoming</span>
                    </button>
                    <button 
                      onClick={() => navigate('/completed')}
                      className="w-full flex items-center px-2 py-3 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="mx-3">Completed</span>
                    </button>
                    <button 
                      onClick={() => navigate('/in-progress')}
                      className="w-full flex items-center px-2 py-3 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                      <span className="mx-3">In Progress</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardStats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                        <div className={`mt-2 flex items-center text-sm ${
                          stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 
                          stat.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                          ) : stat.changeType === 'decrease' ? (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        stat.name.includes('Level') ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        stat.name.includes('Streak') ? 'bg-orange-100 dark:bg-orange-900/30' :
                        stat.name.includes('Completed') ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        <stat.icon className={`h-6 w-6 ${
                          stat.name.includes('Level') ? 'text-yellow-600 dark:text-yellow-400' :
                          stat.name.includes('Streak') ? 'text-orange-600 dark:text-orange-400' :
                          stat.name.includes('Completed') ? 'text-green-600 dark:text-green-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tasks'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    My Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'stats'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    My Stats & Achievements
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'tasks' ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Today's Tasks</h2>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                          className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          title={viewMode === 'list' ? 'Grid view' : 'List view'}
                        >
                          {viewMode === 'list' ? (
                            <Squares2X2Icon className="h-5 w-5" />
                          ) : (
                            <ListBulletIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowTaskForm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          New Task
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <GamifiedTaskList onTaskUpdate={handleTaskUpdate} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Progress</h2>
                        {/* Add progress charts here */}
                        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400">Progress charts coming soon</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <GamificationStats />
                    </div>
                  </div>
                )}

                {/* Task List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  {/* TaskList component will be integrated here */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}
