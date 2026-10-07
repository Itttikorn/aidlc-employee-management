export interface TeamSummary {
  id: string;
  name: string;
  description?: string | null;
}

export interface Employee {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  role: string;
  position?: string;
  birthDate?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
  teams?: TeamSummary[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateEmployeeInput {
  name?: string;
  fullName?: string;
  email: string;
  role?: string;
  position?: string;
  birthDate?: string | null;
  avatarUrl?: string | null;
  teamIds?: string[];
}

export interface UpdateEmployeeInput {
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  position?: string;
  birthDate?: string | null;
  avatarUrl?: string | null;
  teamIds?: string[];
}

export interface EmployeeFilterOptions {
  search?: string;
  teamId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedEmployeesResult {
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
