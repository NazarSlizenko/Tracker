
export enum TaskStatus {
  IN_WORK = 'v_rabote',
  COMPLETED = 'vipolneno'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  userName: string;
  createdAt: number;
}

export type ThemeType = 'light' | 'dark' | 'system';

export type ViewType = 'home' | 'stats' | 'profile' | 'edit' | 'create';

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  activityData: { [key: string]: number };
}
