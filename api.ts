
import { Task, TaskStatus } from './types';

// При хостинге фронтенда и бэкенда на одном сервере используем относительный путь
const API_URL = '/api';

export const api = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
      if (!response.ok) throw new Error('Ошибка загрузки');
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return await response.json();
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  }
};
