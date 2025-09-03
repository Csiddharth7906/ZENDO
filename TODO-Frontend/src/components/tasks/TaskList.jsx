import { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskList() {
  const { tasks, loading, error, updateTask, deleteTask } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await updateTask(taskId, { status: newStatus });
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const result = await deleteTask(taskToDelete);
      if (result?.success) {
        toast.success('Task deleted successfully!');
      } else {
        toast.error(result?.error || 'Failed to delete task');
      }
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (tasks.length === 0) return <div className="text-center py-4 text-gray-500">No tasks found. Add one to get started!</div>;

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={() => handleStatusChange(task._id, task.status)}
              className="h-5 w-5 text-indigo-600 rounded"
            />
            <div>
              <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500">{task.description}</p>
              )}
              <div className="flex space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => handleDeleteClick(task._id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Delete Confirmation Modal */}
            {taskToDelete === task._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Are you sure?</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
