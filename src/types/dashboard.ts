export interface DashboardOverview {
  totalEmployees: number;
  totalTeams: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  overdueTasksCount: number;
}

export interface TaskStatusMetric {
  count: number;
  percentage: number;
}

export interface TaskDistribution {
  todo: TaskStatusMetric;
  pending: TaskStatusMetric;
  completed: TaskStatusMetric;
}

export interface PriorityDistribution {
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

export interface TeamWorkloadSummary {
  teamId: string;
  teamName: string;
  department: string;
  memberCount: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface DashboardStatsResponse {
  overview: DashboardOverview;
  taskDistribution: TaskDistribution;
  priorityDistribution: PriorityDistribution;
  teamWorkloads: TeamWorkloadSummary[];
}

