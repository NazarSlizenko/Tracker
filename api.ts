
import { Task, TaskStatus } from './types';

const API_URL = '/api';

// Имитация базы данных в браузере для работы без бэкенда
const getLocalTasks = (): Task[] => {
  const saved = localStorage.getItem('tma_tasks');
  return saved ? JSON.parse(saved) : [];
};

const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem('tma_tasks', JSON.stringify(tasks));
};

export const api = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
      if (!response.ok) throw new Error('Server unreachable');
      const data = await response.json();
      // Синхронизируем локальное хранилище для оффлайн режима
      saveLocalTasks(data);
      return data;
    } catch (e) {
      console.warn('API Offline: Используются локальные данные', e);
      return getLocalTasks();
    }
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.error('API Error (Create): Сохранение локально', e);
    }

    // Если сервер упал, сохраняем локально
    const tasks = getLocalTasks();
    const updatedTasks = [newTask, ...tasks];
    saveLocalTasks(updatedTasks);
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
    } catch (e) {
      console.error('API Error (Update): Обновление локально', e);
    }

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
    } catch (e) {
      console.error('API Error (Delete): Удаление локально', e);
    }

    const tasks = getLocalTasks();
    saveLocalTasks(tasks.filter(t => t.id !== id));
  }
};
