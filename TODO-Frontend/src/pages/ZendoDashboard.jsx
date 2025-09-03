import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { 
  PlusIcon, 
  CheckIcon, 
  TrashIcon, 
  InboxIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function ZendoDashboard() {
  const { user, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, loading } = useTasks();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState('inbox');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    dueDate: '',
    reminder: {
      enabled: false,
      datetime: ''
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required!');
      return;
    }

    try {
      const result = await addTask({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        status: 'pending',
        reminder: newTask.reminder.enabled ? {
          enabled: true,
          datetime: newTask.reminder.datetime,
          sent: false
        } : {
          enabled: false
        }
      });

      if (result.success) {
        toast.success('Task created successfully!');
        setNewTask({ 
          title: '', 
          description: '', 
          priority: 'medium', 
          dueDate: '',
          reminder: {
            enabled: false,
            datetime: ''
          }
        });
        setShowTaskForm(false);
      } else {
        toast.error(result.error || 'Failed to create task');
      }
    } catch (error) {
      toast.error('Error creating task');
    }
  };

  const handleTaskToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const result = await updateTask(task._id, { status: newStatus });
      
      if (result.success) {
        if (newStatus === 'completed') {
          toast.success('Task completed!');
        } else {
          toast.info('Task marked as pending');
        }
      }
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        toast.success('Task deleted');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  // Filter tasks based on active view
  const getFilteredTasks = () => {
    if (!Array.isArray(tasks)) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeView) {
      case 'today':
        return tasks.filter(task => {
          if (!task || !task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      case 'upcoming':
        return tasks.filter(task => {
          if (!task || !task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate > today;
        });
      case 'completed':
        return tasks.filter(task => task && task.status === 'completed');
      default:
        return tasks.filter(task => task && task.status !== 'completed');
    }
  };

  const filteredTasks = getFilteredTasks();

  const getViewTitle = () => {
    switch (activeView) {
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Inbox';
    }
  };

  const getTaskCount = (view) => {
    if (!Array.isArray(tasks)) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (view) {
      case 'inbox':
        return tasks.filter(task => task && task.status !== 'completed').length;
      case 'today':
        return tasks.filter(task => {
          if (!task || !task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        }).length;
      case 'upcoming':
        return tasks.filter(task => {
          if (!task || !task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate > today;
        }).length;
      case 'completed':
        return tasks.filter(task => task && task.status === 'completed').length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Zendo</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="p-4">
          <button
            onClick={() => setShowTaskForm(true)}
            className="w-full flex items-center space-x-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Add task</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                activeView === 'inbox'
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <InboxIcon className="w-4 h-4" />
                <span>Inbox</span>
              </div>
              {getTaskCount('inbox') > 0 && (
                <span className="text-xs text-gray-500">{getTaskCount('inbox')}</span>
              )}
            </button>

            <button
              onClick={() => setActiveView('today')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                activeView === 'today'
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-4 h-4" />
                <span>Today</span>
              </div>
              {getTaskCount('today') > 0 && (
                <span className="text-xs text-gray-500">{getTaskCount('today')}</span>
              )}
            </button>

            <button
              onClick={() => setActiveView('upcoming')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                activeView === 'upcoming'
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-4 h-4" />
                <span>Upcoming</span>
              </div>
              {getTaskCount('upcoming') > 0 && (
                <span className="text-xs text-gray-500">{getTaskCount('upcoming')}</span>
              )}
            </button>

            <button
              onClick={() => setActiveView('completed')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                activeView === 'completed'
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Completed</span>
              </div>
              {getTaskCount('completed') > 0 && (
                <span className="text-xs text-gray-500">{getTaskCount('completed')}</span>
              )}
            </button>
          </div>

          {/* Projects Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">My Projects</span>
              <ChevronDownIcon className="w-3 h-3 text-gray-400" />
            </div>
            <div className="mt-2">
              <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Getting Started</span>
                </div>
                <span className="text-xs text-gray-500">✨</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Cog6ToothIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center lg:hidden">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  <span className="lg:hidden">Zendo</span>
                  <span className="hidden lg:inline">{getViewTitle()}</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowTaskForm(true)}
                className="lg:hidden p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              <button className="hidden lg:block p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add task</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Task name"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  {/* Reminder Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id="reminder-enabled"
                        checked={newTask.reminder.enabled}
                        onChange={(e) => setNewTask({ 
                          ...newTask, 
                          reminder: { ...newTask.reminder, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="reminder-enabled" className="text-sm font-medium text-gray-700">
                        🔔 Set reminder
                      </label>
                    </div>
                    
                    {newTask.reminder.enabled && (
                      <input
                        type="datetime-local"
                        value={newTask.reminder.datetime}
                        onChange={(e) => setNewTask({ 
                          ...newTask, 
                          reminder: { ...newTask.reminder, datetime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    )}
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Add task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg mb-2">
                  {activeView === 'completed' ? 'No completed tasks yet' : 'Your task list is empty'}
                </p>
                <p className="text-gray-500 text-sm">
                  {activeView === 'completed' 
                    ? 'Complete some tasks to see them here' 
                    : 'Add a task above to get started'
                  }
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="group flex items-start sm:items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <button
                    onClick={() => handleTaskToggle(task)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          task.status === 'completed' 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </span>
                        {task.priority === 'high' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        )}
                        {task.priority === 'medium' && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className={`text-xs mt-1 ${
                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Add Task */}
          {!showTaskForm && (
            <div className="mt-6">
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add task</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
