
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskStatus, ViewType, ThemeType } from './types.ts';
import { api, safeStorage } from './api.ts';
import HomeView from './views/HomeView.tsx';
import TaskFormView from './views/TaskFormView.tsx';
import ProfileView from './views/ProfileView.tsx';
import StatsView from './views/StatsView.tsx';
import TabBar from './components/TabBar.tsx';

const App: React.FC = () => {
  // Получаем объект WebApp максимально безопасно
  const tg = (window as any).Telegram?.WebApp || null;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = safeStorage.getItem('theme');
    return (saved as ThemeType) || 'system';
  });
  
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  // Данные пользователя
  const userId = tg?.initDataUnsafe?.user?.id?.toString() || 'dev_user';
  const userName = tg?.initDataUnsafe?.user?.first_name || 'Алексей';

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const data = await api.getTasks(userId);
    setTasks(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && (tg?.colorScheme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches));
    
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    
    safeStorage.setItem('theme', theme);
    
    if (tg) {
      tg.setHeaderColor(isDark ? '#2c2c2e' : '#ffffff');
    }
  }, [theme, tg]);

  const onSaveTask = async (data: any) => {
    if (currentView === 'edit' && editingTaskId) {
      await api.updateTask(editingTaskId, data);
    } else {
      await api.createTask({ ...data, userId, userName });
    }
    await loadTasks();
    setCurrentView('home');
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#efeff4] dark:bg-[#1c1c1d]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2481cc]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#efeff4] dark:bg-[#1c1c1d] pb-20 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-md px-4 py-3 border-b border-[#d1d1d6] dark:border-[#3a3a3c] flex justify-between items-center">
        <h1 className="text-lg font-bold dark:text-white">
          {currentView === 'home' && 'Задачи'}
          {currentView === 'stats' && 'Статистика'}
          {currentView === 'profile' && 'Профиль'}
          {currentView === 'create' && 'Новая'}
          {currentView === 'edit' && 'Правка'}
        </h1>
        <div className="text-[10px] uppercase font-black text-[#2481cc] tracking-tighter">TMA HUB</div>
      </header>

      <main className="flex-1 p-4">
        {currentView === 'home' && (
          <HomeView 
            tasks={filteredTasks} 
            filter={filter} 
            setFilter={setFilter} 
            onToggleStatus={async (id, status) => {
              const newStatus = status === TaskStatus.COMPLETED ? TaskStatus.IN_WORK : TaskStatus.COMPLETED;
              await api.updateTask(id, { status: newStatus });
              loadTasks();
            }}
            onEdit={(id) => { setEditingTaskId(id); setCurrentView('edit'); }}
            onAdd={() => setCurrentView('create')}
          />
        )}

        {currentView === 'stats' && <StatsView tasks={tasks} />}
        {currentView === 'profile' && <ProfileView theme={theme} setTheme={setTheme} />}

        {(currentView === 'create' || currentView === 'edit') && (
          <TaskFormView 
            task={tasks.find(t => t.id === editingTaskId) || null}
            onSave={onSaveTask}
            onCancel={() => setCurrentView('home')}
            onDelete={currentView === 'edit' ? async () => {
              if (editingTaskId) await api.deleteTask(editingTaskId);
              await loadTasks();
              setCurrentView('home');
            } : undefined}
          />
        )}
      </main>

      <TabBar activeTab={currentView} onTabChange={setCurrentView} />
    </div>
  );
};

export default App;
