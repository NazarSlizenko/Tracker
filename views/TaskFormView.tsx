
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';

interface TaskFormViewProps {
  task: Task | null;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'userId' | 'userName'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const TaskFormView: React.FC<TaskFormViewProps> = ({ task, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.IN_WORK);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-[13px] font-medium text-[#8e8e93] px-1 uppercase">Название</label>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Напр: Сделать редизайн"
          className="w-full bg-white dark:bg-[#2c2c2e] dark:text-white border border-[#d1d1d6] dark:border-white/10 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-[#2481cc] outline-none"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[13px] font-medium text-[#8e8e93] px-1 uppercase">Описание</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали..."
          rows={4}
          className="w-full bg-white dark:bg-[#2c2c2e] dark:text-white border border-[#d1d1d6] dark:border-white/10 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-[#2481cc] outline-none resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[13px] font-medium text-[#8e8e93] px-1 uppercase">Статус</label>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-[#d1d1d6] dark:border-white/10 overflow-hidden">
          <button 
            type="button"
            onClick={() => setStatus(TaskStatus.IN_WORK)}
            className={`w-full flex justify-between items-center px-4 py-4 border-b border-black/5 dark:border-white/5 ${status === TaskStatus.IN_WORK ? 'bg-[#2481cc]/5' : ''}`}
          >
            <span className="dark:text-white">В работе</span>
            {status === TaskStatus.IN_WORK && <div className="w-2 h-2 rounded-full bg-[#2481cc]"></div>}
          </button>
          <button 
            type="button"
            onClick={() => setStatus(TaskStatus.COMPLETED)}
            className={`w-full flex justify-between items-center px-4 py-4 ${status === TaskStatus.COMPLETED ? 'bg-[#2481cc]/5' : ''}`}
          >
            <span className="dark:text-white">Выполнено</span>
            {status === TaskStatus.COMPLETED && <div className="w-2 h-2 rounded-full bg-[#2481cc]"></div>}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button 
          type="submit"
          className="w-full bg-[#2481cc] text-white font-semibold py-4 rounded-xl shadow-md active:scale-[0.98] transition-all"
        >
          {task ? 'Сохранить изменения' : 'Создать задачу'}
        </button>
        {onDelete && (
          <button 
            type="button"
            onClick={onDelete}
            className="w-full text-red-500 font-medium py-2 active:opacity-60 transition-all"
          >
            Удалить задачу
          </button>
        )}
        <button 
          type="button"
          onClick={onCancel}
          className="w-full text-[#8e8e93] text-sm py-2"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default TaskFormView;
