export interface TeamLeadSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  assignedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  department: string;
  leadId: string | null;
  lead?: TeamLeadSummary | null;
  memberCount: number;
  members?: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamInput {
  name: string;
  description?: string | null;
  department?: string;
  leadId?: string | null;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string | null;
  department?: string;
  leadId?: string | null;
}

export interface AddTeamMemberInput {
  employeeId: string;
  role?: string;
}

export interface TeamFilterOptions {
  department?: string;
  search?: string;
}
