
// Fallback хранилище в оперативной памяти
const inMemoryDb = {};

export const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return inMemoryDb[key] || null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      inMemoryDb[key] = value;
    }
  }
};

const getLocalTasks = () => {
  const saved = safeStorage.getItem('tma_tasks');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks) => {
  safeStorage.setItem('tma_tasks', JSON.stringify(tasks));
};

export const api = {
  getTasks: async (userId) => {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      saveLocalTasks(data);
      return data;
    } catch (e) {
      return getLocalTasks();
    }
  },
  
  createTask: async (task) => {
    const newTask = {
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
    saveLocalTasks([newTask, ...tasks]);
    return newTask;
  },

  updateTask: async (id, updates) => {
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

  // deleteTask implementation added to fix the error in App.tsx
  deleteTask: async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) return true;
    } catch (e) {}

    const tasks = getLocalTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveLocalTasks(filtered);
    return true;
  }
};
