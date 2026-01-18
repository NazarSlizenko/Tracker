
import { Task, TaskStatus } from './types';

const API_URL = '/api';

// Надежная обертка над хранилищем: если localStorage заблокирован, используем память
const memoryStorage: Record<string, string> = {};
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  }
};

const getLocalTasks = (): Task[] => {
  const saved = safeStorage.getItem('tma_tasks');
  return saved ? JSON.parse(saved) : [];
};

const saveLocalTasks = (tasks: Task[]) => {
  safeStorage.setItem('tma_tasks', JSON.stringify(tasks));
};

export const api = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
      if (!response.ok) throw new Error('Server unreachable');
      const data = await response.json();
      saveLocalTasks(data);
      return data;
    } catch (e) {
      console.warn('API Offline: Using local data');
      return getLocalTasks();
    }
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) return await response.json();
    } catch (e) {}

    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const tasks = getLocalTasks();
    saveLocalTasks([newTask, ...tasks]);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) return await response.json();
    } catch (e) {}

    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
      tasks[index] = { ...tasks[index], ...updates };
      saveLocalTasks(tasks);
      return tasks[index];
    }
    throw new Error('Task not found');
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) return;
    } catch (e) {}

    const tasks = getLocalTasks();
    saveLocalTasks(tasks.filter(t => t.id !== id));
  }
};
