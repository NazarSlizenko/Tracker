
import { Task, TaskStatus } from './types';

// Fallback хранилище в оперативной памяти
const inMemoryDb: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage access denied, using memory');
      return inMemoryDb[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      inMemoryDb[key] = value;
    }
  }
};

const getLocalTasks = (): Task[] => {
  const saved = safeStorage.getItem('tma_tasks');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks: Task[]) => {
  safeStorage.setItem('tma_tasks', JSON.stringify(tasks));
};

export const api = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      // Имитируем запрос к API
      const response = await fetch(`/api/tasks?userId=${userId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      saveLocalTasks(data);
      return data;
    } catch (e) {
      return getLocalTasks();
    }
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: Date.now()
    };
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) return await response.json();
    } catch (e) {}

    const tasks = getLocalTasks();
    const updated = [newTask, ...tasks];
    saveLocalTasks(updated);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) return await response.json();
    } catch (e) {}

    const tasks = getLocalTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx > -1) {
      tasks[idx] = { ...tasks[idx], ...updates };
      saveLocalTasks(tasks);
      return tasks[idx];
    }
    throw new Error('Not found');
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (e) {}
    
    const tasks = getLocalTasks();
    saveLocalTasks(tasks.filter(t => t.id !== id));
  }
};
