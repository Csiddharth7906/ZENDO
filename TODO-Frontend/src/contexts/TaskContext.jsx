import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      // Ensure we have a valid array and normalize task data
      const tasksArray = Array.isArray(data.data) ? data.data : [];
      const normalizedTasks = tasksArray.map(task => ({
        ...task,
        status: task.status || 'todo' // Ensure status exists
      }));
      setTasks(normalizedTasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks');
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskData) => {
    console.log('addTask called with:', taskData);
    try {
      const response = await api.post('/tasks', taskData);
      console.log('Task created successfully:', response.data);
      
      // Normalize the new task data
      const newTask = {
        ...response.data.data,
        status: response.data.data.status || 'todo'
      };
      
      setTasks([...tasks, newTask]);
      return { success: true };
    } catch (err) {
      console.error('Error in addTask:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Error adding task'
      };
    }
  };

  // Update a task
  const updateTask = async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, ...updates } : task
      ));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error updating task'
      };
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      console.log('Deleting task with ID:', id);
      const response = await api.delete(`/tasks/${id}`);
      
      console.log('Delete response:', response.data);
      
      if (response.data?.success) {
        setTasks(tasks.filter(task => task._id !== id));
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Error deleting task'
      };
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};
