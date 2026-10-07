export type TaskStatus = 'Todo' | 'Pending' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TaskAssigneeSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface TaskTeamSummary {
  id: string;
  name: string;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  teamId: string;
  teamName?: string;
  team?: TaskTeamSummary;
  assigneeId: string | null;
  assigneeName?: string | null;
  assigneeAvatarUrl?: string | null;
  assignee?: TaskAssigneeSummary | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  teamId: string;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  teamId?: string;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface TaskFilterOptions {
  teamId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
}

