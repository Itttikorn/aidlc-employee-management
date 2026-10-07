// Employee, Team & 3-Stage Task Board Client Application Logic

let state = {
  currentTab: 'employees', // 'employees' | 'teams' | 'tasks'
  employees: [],
  teams: [],
  tasks: [],
  viewMode: 'grid',
  searchQuery: '',
  selectedTeamId: '',
  teamSearchQuery: '',
  teamDepartmentFilter: '',
  taskSearchQuery: '',
  taskTeamFilter: '',
  taskPriorityFilter: '',
  currentPage: 1,
  totalPages: 1,
  limit: 12
};

// DOM Elements - Navigation & Header
const navEmployeesBtn = document.getElementById('navEmployeesBtn');
const navTeamsBtn = document.getElementById('navTeamsBtn');
const navTasksBtn = document.getElementById('navTasksBtn');
const employeesSection = document.getElementById('employeesSection');
const teamsSection = document.getElementById('teamsSection');
const tasksSection = document.getElementById('tasksSection');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addTeamBtn = document.getElementById('addTeamBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const statusBanner = document.getElementById('statusBanner');

// Employee UI Elements
const searchInput = document.getElementById('searchInput');
const teamFilter = document.getElementById('teamFilter');
const viewGridBtn = document.getElementById('viewGridBtn');
const viewTableBtn = document.getElementById('viewTableBtn');
const cardsGrid = document.getElementById('cardsGrid');
const tableView = document.getElementById('tableView');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const employeeModal = document.getElementById('employeeModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const formAvatarFile = document.getElementById('formAvatarFile');
const formAvatarUrl = document.getElementById('formAvatarUrl');

// Team UI Elements
const teamSearchInput = document.getElementById('teamSearchInput');
const departmentFilter = document.getElementById('departmentFilter');
const teamsGrid = document.getElementById('teamsGrid');
const teamsEmptyState = document.getElementById('teamsEmptyState');
const teamModal = document.getElementById('teamModal');
const teamForm = document.getElementById('teamForm');
const teamModalTitle = document.getElementById('teamModalTitle');
const closeTeamModalBtn = document.getElementById('closeTeamModalBtn');
const cancelTeamModalBtn = document.getElementById('cancelTeamModalBtn');
const formTeamLead = document.getElementById('formTeamLead');

// Manage Members Modal Elements
const manageMembersModal = document.getElementById('manageMembersModal');
const manageMembersTitle = document.getElementById('manageMembersTitle');
const manageMembersSubtitle = document.getElementById('manageMembersSubtitle');
const closeMembersModalBtn = document.getElementById('closeMembersModalBtn');
const addMemberForm = document.getElementById('addMemberForm');
const currentManagingTeamId = document.getElementById('currentManagingTeamId');
const availableEmployeeSelect = document.getElementById('availableEmployeeSelect');
const memberRoleSelect = document.getElementById('memberRoleSelect');
const teamMembersList = document.getElementById('teamMembersList');

// Task UI Elements
const taskSearchInput = document.getElementById('taskSearchInput');
const taskTeamFilter = document.getElementById('taskTeamFilter');
const taskPriorityFilter = document.getElementById('taskPriorityFilter');
const todoTasksList = document.getElementById('todoTasksList');
const pendingTasksList = document.getElementById('pendingTasksList');
const completedTasksList = document.getElementById('completedTasksList');
const todoCountBadge = document.getElementById('todoCountBadge');
const pendingCountBadge = document.getElementById('pendingCountBadge');
const completedCountBadge = document.getElementById('completedCountBadge');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskModalTitle = document.getElementById('taskModalTitle');
const closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
const cancelTaskModalBtn = document.getElementById('cancelTaskModalBtn');
const formTaskTeam = document.getElementById('formTaskTeam');
const formTaskAssignee = document.getElementById('formTaskAssignee');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadTeams();
  loadEmployees();
  loadTasks();
});

function setupEventListeners() {
  // Navigation Tabs
  if (navEmployeesBtn) navEmployeesBtn.addEventListener('click', () => switchTab('employees'));
  if (navTeamsBtn) navTeamsBtn.addEventListener('click', () => switchTab('teams'));
  if (navTasksBtn) navTasksBtn.addEventListener('click', () => switchTab('tasks'));

  // Employee Search with debounce
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        state.searchQuery = e.target.value;
        state.currentPage = 1;
        loadEmployees();
      }, 250);
    });
  }

  // Team Search with debounce
  let teamDebounce;
  if (teamSearchInput) {
    teamSearchInput.addEventListener('input', (e) => {
      clearTimeout(teamDebounce);
      teamDebounce = setTimeout(() => {
        state.teamSearchQuery = e.target.value;
        loadTeams();
      }, 250);
    });
  }

  // Department filter
  if (departmentFilter) {
    departmentFilter.addEventListener('change', (e) => {
      state.teamDepartmentFilter = e.target.value;
      loadTeams();
    });
  }

  // Filter by team in directory
  if (teamFilter) {
    teamFilter.addEventListener('change', (e) => {
      state.selectedTeamId = e.target.value;
      state.currentPage = 1;
      loadEmployees();
    });
  }

  // Task Search with debounce
  let taskDebounce;
  if (taskSearchInput) {
    taskSearchInput.addEventListener('input', (e) => {
      clearTimeout(taskDebounce);
      taskDebounce = setTimeout(() => {
        state.taskSearchQuery = e.target.value;
        loadTasks();
      }, 250);
    });
  }

  if (taskTeamFilter) {
    taskTeamFilter.addEventListener('change', (e) => {
      state.taskTeamFilter = e.target.value;
      loadTasks();
    });
  }

  if (taskPriorityFilter) {
    taskPriorityFilter.addEventListener('change', (e) => {
      state.taskPriorityFilter = e.target.value;
      loadTasks();
    });
  }

  // View toggle
  if (viewGridBtn && viewTableBtn) {
    viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    viewTableBtn.addEventListener('click', () => setViewMode('table'));
  }

  // Modal buttons
  if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', () => openEmployeeModal());
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeEmployeeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeEmployeeModal);

  if (addTeamBtn) addTeamBtn.addEventListener('click', () => openTeamModal());
  if (closeTeamModalBtn) closeTeamModalBtn.addEventListener('click', closeTeamModal);
  if (cancelTeamModalBtn) cancelTeamModalBtn.addEventListener('click', closeTeamModal);

  if (addTaskBtn) addTaskBtn.addEventListener('click', () => openTaskModal());
  if (closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', closeTaskModal);
  if (cancelTaskModalBtn) cancelTaskModalBtn.addEventListener('click', closeTaskModal);

  if (closeMembersModalBtn) closeMembersModalBtn.addEventListener('click', closeManageMembersModal);
  if (addMemberForm) addMemberForm.addEventListener('submit', handleAddMemberSubmit);

  // Avatar upload
  if (formAvatarFile) {
    formAvatarFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showBanner('Avatar file size cannot exceed 5MB', 'error');
          formAvatarFile.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          formAvatarUrl.value = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Forms submit
  if (employeeForm) employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
  if (teamForm) teamForm.addEventListener('submit', handleTeamFormSubmit);
  if (taskForm) taskForm.addEventListener('submit', handleTaskFormSubmit);
}

function switchTab(tab) {
  state.currentTab = tab;
  
  // Section visibility
  employeesSection.classList.toggle('hidden', tab !== 'employees');
  teamsSection.classList.toggle('hidden', tab !== 'teams');
  tasksSection.classList.toggle('hidden', tab !== 'tasks');

  // Header action buttons
  addEmployeeBtn.classList.toggle('hidden', tab !== 'employees');
  addTeamBtn.classList.toggle('hidden', tab !== 'teams');
  addTaskBtn.classList.toggle('hidden', tab !== 'tasks');

  // Tab styles
  const activeClass = 'px-3.5 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 transition-colors cursor-pointer';
  const inactiveClass = 'px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer';

  navEmployeesBtn.className = tab === 'employees' ? activeClass : inactiveClass;
  navTeamsBtn.className = tab === 'teams' ? activeClass : inactiveClass;
  navTasksBtn.className = tab === 'tasks' ? activeClass : inactiveClass;

  if (tab === 'teams') loadTeams();
  if (tab === 'tasks') loadTasks();
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'grid') {
    cardsGrid.classList.remove('hidden');
    tableView.classList.add('hidden');
    viewGridBtn.classList.add('bg-indigo-50', 'text-indigo-700');
    viewGridBtn.classList.remove('bg-white', 'text-slate-600');
    viewTableBtn.classList.add('bg-white', 'text-slate-600');
    viewTableBtn.classList.remove('bg-indigo-50', 'text-indigo-700');
  } else {
    cardsGrid.classList.add('hidden');
    tableView.classList.remove('hidden');
    viewTableBtn.classList.add('bg-indigo-50', 'text-indigo-700');
    viewTableBtn.classList.remove('bg-white', 'text-slate-600');
    viewGridBtn.classList.add('bg-white', 'text-slate-600');
    viewGridBtn.classList.remove('bg-indigo-50', 'text-indigo-700');
  }
  renderDirectory();
}

// -------------------------------------------------------------
// EMPLOYEES DIRECTORY
// -------------------------------------------------------------

async function loadEmployees() {
  try {
    const params = new URLSearchParams({
      page: state.currentPage,
      limit: state.limit
    });
    if (state.searchQuery) params.append('search', state.searchQuery);
    if (state.selectedTeamId) params.append('teamId', state.selectedTeamId);

    const res = await fetch(`/api/employees?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      state.employees = data.data || [];
      state.totalPages = data.pagination?.totalPages || 1;
      renderDirectory();
    } else {
      showBanner(data.message || 'Failed to load employees', 'error');
    }
  } catch (error) {
    showBanner('Network error loading employee directory', 'error');
  }
}

function renderDirectory() {
  if (state.employees.length === 0) {
    emptyState.classList.remove('hidden');
    cardsGrid.innerHTML = '';
    tableBody.innerHTML = '';
    return;
  }

  emptyState.classList.add('hidden');

  cardsGrid.innerHTML = state.employees.map((emp) => `
    <div class="card-solid p-5 flex flex-col justify-between" data-testid="employee-card" data-employee-id="${emp.id}">
      <div>
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center font-bold text-sm text-indigo-700">
              ${emp.avatarUrl ? `<img src="${emp.avatarUrl}" alt="${emp.name}" class="w-full h-full object-cover">` : emp.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm leading-snug">${escapeHtml(emp.name)}</h4>
              <p class="text-xs font-medium text-indigo-600">${escapeHtml(emp.role || emp.position)}</p>
            </div>
          </div>
          ${emp.age ? `<span class="age-badge">${emp.age} yrs</span>` : ''}
        </div>
        <p class="text-xs text-slate-500 truncate mb-3 flex items-center">
          <svg class="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          ${escapeHtml(emp.email)}
        </p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${(emp.teams && emp.teams.length > 0) ? emp.teams.map(t => `<span class="badge-solid">${escapeHtml(t.name)}</span>`).join('') : '<span class="text-xs text-slate-400 italic">No teams assigned</span>'}
        </div>
      </div>
      <div class="border-t border-slate-100 pt-3 flex justify-end space-x-2">
        <button onclick="editEmployee('${emp.id}')" class="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">Edit</button>
        <button onclick="deleteEmployee('${emp.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer">Delete</button>
      </div>
    </div>
  `).join('');

  tableBody.innerHTML = state.employees.map((emp) => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
            ${emp.avatarUrl ? `<img src="${emp.avatarUrl}" alt="${emp.name}" class="w-full h-full object-cover">` : emp.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="font-semibold text-slate-900">${escapeHtml(emp.name)}</div>
            <div class="text-xs text-slate-500">${escapeHtml(emp.email)}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">${escapeHtml(emp.role || emp.position)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-600">${emp.age ? `<span class="age-badge">${emp.age} yrs</span>` : '—'}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex flex-wrap gap-1">
          ${(emp.teams && emp.teams.length > 0) ? emp.teams.map(t => `<span class="badge-solid">${escapeHtml(t.name)}</span>`).join('') : '<span class="text-xs text-slate-400 italic">—</span>'}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button onclick="editEmployee('${emp.id}')" class="text-indigo-600 hover:text-indigo-900 text-xs font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer">Edit</button>
        <button onclick="deleteEmployee('${emp.id}')" class="text-red-600 hover:text-red-900 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openEmployeeModal(employee = null) {
  document.getElementById('employeeId').value = employee ? employee.id : '';
  document.getElementById('formFullName').value = employee ? employee.name : '';
  document.getElementById('formEmail').value = employee ? employee.email : '';
  document.getElementById('formRole').value = employee ? (employee.role || employee.position) : '';
  document.getElementById('formBirthDate').value = employee && employee.birthDate ? employee.birthDate : '';
  formAvatarUrl.value = employee && employee.avatarUrl ? employee.avatarUrl : '';
  modalTitle.innerText = employee ? 'Edit Employee' : 'Add New Employee';
  employeeModal.classList.remove('hidden');
}

function closeEmployeeModal() {
  employeeModal.classList.add('hidden');
  employeeForm.reset();
  formAvatarUrl.value = '';
}

async function handleEmployeeFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('employeeId').value;
  const payload = {
    name: document.getElementById('formFullName').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    role: document.getElementById('formRole').value.trim(),
    birthDate: document.getElementById('formBirthDate').value || null,
    avatarUrl: formAvatarUrl.value || null
  };

  try {
    const url = id ? `/api/employees/${id}` : '/api/employees';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner(id ? 'Employee updated successfully' : 'Employee created successfully', 'success');
      closeEmployeeModal();
      loadEmployees();
    } else {
      showBanner(result.message || result.error || 'Failed to save employee', 'error');
    }
  } catch (error) {
    showBanner('Network error saving employee', 'error');
  }
}

window.editEmployee = function(id) {
  const emp = state.employees.find(e => e.id === id);
  if (emp) openEmployeeModal(emp);
};

window.deleteEmployee = async function(id) {
  if (!confirm('Are you sure you want to delete this employee profile?')) return;
  try {
    const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showBanner('Employee deleted successfully', 'success');
      loadEmployees();
    } else {
      showBanner(result.message || 'Failed to delete employee', 'error');
    }
  } catch (error) {
    showBanner('Network error deleting employee', 'error');
  }
};

// -------------------------------------------------------------
// TEAMS HUB
// -------------------------------------------------------------

async function loadTeams() {
  try {
    const params = new URLSearchParams();
    if (state.teamDepartmentFilter) params.append('department', state.teamDepartmentFilter);
    if (state.teamSearchQuery) params.append('search', state.teamSearchQuery);

    const res = await fetch(`/api/teams?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      state.teams = data.data || [];
      renderTeams();
      updateTeamFilterDropdowns();
    } else {
      showBanner(data.message || 'Failed to load teams', 'error');
    }
  } catch (error) {
    showBanner('Network error loading teams', 'error');
  }
}

function updateTeamFilterDropdowns() {
  // Directory filter
  if (teamFilter) {
    const currentVal = teamFilter.value;
    teamFilter.innerHTML = '<option value="">All Teams (Filter)</option>' +
      state.teams.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    teamFilter.value = currentVal;
  }

  // Task board filter
  if (taskTeamFilter) {
    const currentTaskTeamVal = taskTeamFilter.value;
    taskTeamFilter.innerHTML = '<option value="">All Teams (Task Board)</option>' +
      state.teams.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    taskTeamFilter.value = currentTaskTeamVal;
  }
}

function renderTeams() {
  if (!teamsGrid || !teamsEmptyState) return;

  if (state.teams.length === 0) {
    teamsEmptyState.classList.remove('hidden');
    teamsGrid.innerHTML = '';
    return;
  }

  teamsEmptyState.classList.add('hidden');

  teamsGrid.innerHTML = state.teams.map((team) => {
    const members = team.members || [];
    const displayMembers = members.slice(0, 4);
    const remainingCount = team.memberCount > 4 ? team.memberCount - 4 : 0;

    return `
      <div class="card-solid p-5 flex flex-col justify-between" data-testid="team-card" data-team-id="${team.id}">
        <div>
          <div class="flex items-start justify-between mb-2">
            <div>
              <h4 class="font-bold text-slate-900 text-base leading-snug">${escapeHtml(team.name)}</h4>
              <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                ${escapeHtml(team.department)}
              </span>
            </div>
          </div>

          <p class="text-xs text-slate-600 mt-2 mb-4 line-clamp-2">
            ${team.description ? escapeHtml(team.description) : '<span class="italic text-slate-400">No description provided</span>'}
          </p>

          <div class="bg-slate-50 rounded-lg p-2.5 mb-4 border border-slate-100 flex items-center space-x-2.5">
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0">
              ${team.lead && team.lead.avatarUrl ? `<img src="${team.lead.avatarUrl}" class="w-full h-full object-cover">` : (team.lead ? team.lead.name.charAt(0).toUpperCase() : '—')}
            </div>
            <div class="min-w-0">
              <p class="text-xs text-slate-500 font-medium">Team Lead</p>
              <p class="text-xs font-bold text-slate-900 truncate">${team.lead ? escapeHtml(team.lead.name) : 'No Lead Assigned'}</p>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex -space-x-2 overflow-hidden items-center">
              ${displayMembers.map(m => `
                <div title="${escapeHtml(m.name)} (${escapeHtml(m.role)})" class="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold overflow-hidden">
                  ${m.avatarUrl ? `<img src="${m.avatarUrl}" class="w-full h-full object-cover">` : m.name.charAt(0).toUpperCase()}
                </div>
              `).join('')}
              ${remainingCount > 0 ? `
                <div class="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                  +${remainingCount}
                </div>
              ` : ''}
              ${members.length === 0 ? '<span class="text-xs text-slate-400 italic">No members yet</span>' : ''}
            </div>
            <span class="text-xs font-semibold text-slate-500">${team.memberCount} member${team.memberCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 flex justify-between items-center">
          <button onclick="manageTeamMembers('${team.id}')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer">
            👥 Manage Roster
          </button>
          <div class="space-x-1">
            <button onclick="editTeam('${team.id}')" class="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer">Edit</button>
            <button onclick="deleteTeam('${team.id}')" class="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openTeamModal(team = null) {
  document.getElementById('teamId').value = team ? team.id : '';
  document.getElementById('formTeamName').value = team ? team.name : '';
  document.getElementById('formTeamDepartment').value = team ? team.department : 'Engineering';
  document.getElementById('formTeamDescription').value = team && team.description ? team.description : '';
  teamModalTitle.innerText = team ? 'Edit Team' : 'Add New Team';

  formTeamLead.innerHTML = '<option value="">No Lead Assigned</option>' +
    state.employees.map(e => `<option value="${e.id}" ${team && team.leadId === e.id ? 'selected' : ''}>${escapeHtml(e.name)} (${escapeHtml(e.role || e.position)})</option>`).join('');

  teamModal.classList.remove('hidden');
}

function closeTeamModal() {
  teamModal.classList.add('hidden');
  teamForm.reset();
}

async function handleTeamFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('teamId').value;
  const payload = {
    name: document.getElementById('formTeamName').value.trim(),
    department: document.getElementById('formTeamDepartment').value,
    description: document.getElementById('formTeamDescription').value.trim() || null,
    leadId: document.getElementById('formTeamLead').value || null
  };

  try {
    const url = id ? `/api/teams/${id}` : '/api/teams';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner(id ? 'Team updated successfully' : 'Team created successfully', 'success');
      closeTeamModal();
      loadTeams();
    } else {
      showBanner(result.message || result.error || 'Failed to save team', 'error');
    }
  } catch (error) {
    showBanner('Network error saving team', 'error');
  }
}

window.editTeam = function(id) {
  const team = state.teams.find(t => t.id === id);
  if (team) openTeamModal(team);
};

window.deleteTeam = async function(id) {
  if (!confirm('Are you sure you want to delete this team? Member associations will be unlinked.')) return;
  try {
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showBanner('Team deleted successfully', 'success');
      loadTeams();
    } else {
      showBanner(result.message || 'Failed to delete team', 'error');
    }
  } catch (error) {
    showBanner('Network error deleting team', 'error');
  }
};

// -------------------------------------------------------------
// MANAGE TEAM MEMBERS MODAL
// -------------------------------------------------------------

window.manageTeamMembers = async function(teamId) {
  const team = state.teams.find(t => t.id === teamId);
  if (!team) return;

  currentManagingTeamId.value = teamId;
  manageMembersTitle.innerText = `Manage Roster: ${team.name}`;
  manageMembersSubtitle.innerText = `${team.department} Department`;

  await refreshTeamMembersModal(teamId);
  manageMembersModal.classList.remove('hidden');
};

function closeManageMembersModal() {
  manageMembersModal.classList.add('hidden');
  addMemberForm.reset();
}

async function refreshTeamMembersModal(teamId) {
  try {
    const res = await fetch(`/api/teams/${teamId}/members`);
    const data = await res.json();
    const members = data.data || [];

    const memberIds = new Set(members.map(m => m.id));
    const available = state.employees.filter(e => !memberIds.has(e.id));

    availableEmployeeSelect.innerHTML = '<option value="">Select Employee to Add...</option>' +
      available.map(e => `<option value="${e.id}">${escapeHtml(e.name)} (${escapeHtml(e.role || e.position)})</option>`).join('');

    if (members.length === 0) {
      teamMembersList.innerHTML = '<div class="p-4 text-center text-xs text-slate-400 italic">No members assigned to this team yet.</div>';
    } else {
      teamMembersList.innerHTML = members.map(m => `
        <div class="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 overflow-hidden">
              ${m.avatarUrl ? `<img src="${m.avatarUrl}" class="w-full h-full object-cover">` : m.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="text-xs font-bold text-slate-900 leading-tight">${escapeHtml(m.name)}</p>
              <p class="text-[11px] text-slate-500">${escapeHtml(m.email)}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${m.role === 'Lead' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
              ${escapeHtml(m.role)}
            </span>
            <button onclick="removeMemberFromTeam('${teamId}', '${m.id}')" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs font-bold" title="Remove member">&times;</button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    showBanner('Failed to load team members', 'error');
  }
}

async function handleAddMemberSubmit(e) {
  e.preventDefault();
  const teamId = currentManagingTeamId.value;
  const employeeId = availableEmployeeSelect.value;
  const role = memberRoleSelect.value;

  if (!employeeId) return;

  try {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, role })
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner('Member added to team', 'success');
      await refreshTeamMembersModal(teamId);
      loadTeams();
    } else {
      showBanner(result.message || 'Failed to add member', 'error');
    }
  } catch (error) {
    showBanner('Network error adding team member', 'error');
  }
}

window.removeMemberFromTeam = async function(teamId, employeeId) {
  if (!confirm('Remove this employee from the team roster?')) return;

  try {
    const res = await fetch(`/api/teams/${teamId}/members/${employeeId}`, {
      method: 'DELETE'
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner('Member removed from team', 'success');
      await refreshTeamMembersModal(teamId);
      loadTeams();
    } else {
      showBanner(result.message || 'Failed to remove member', 'error');
    }
  } catch (error) {
    showBanner('Network error removing team member', 'error');
  }
};

// -------------------------------------------------------------
// 3-STAGE KANBAN TASK BOARD
// -------------------------------------------------------------

async function loadTasks() {
  try {
    const params = new URLSearchParams();
    if (state.taskTeamFilter) params.append('teamId', state.taskTeamFilter);
    if (state.taskPriorityFilter) params.append('priority', state.taskPriorityFilter);
    if (state.taskSearchQuery) params.append('search', state.taskSearchQuery);

    const res = await fetch(`/api/tasks?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      state.tasks = data.data || [];
      renderKanbanBoard();
    } else {
      showBanner(data.message || 'Failed to load tasks', 'error');
    }
  } catch (error) {
    showBanner('Network error loading tasks', 'error');
  }
}

function renderKanbanBoard() {
  if (!todoTasksList || !pendingTasksList || !completedTasksList) return;

  const todoTasks = state.tasks.filter(t => t.status === 'Todo');
  const pendingTasks = state.tasks.filter(t => t.status === 'Pending');
  const completedTasks = state.tasks.filter(t => t.status === 'Completed');

  if (todoCountBadge) todoCountBadge.innerText = todoTasks.length;
  if (pendingCountBadge) pendingCountBadge.innerText = pendingTasks.length;
  if (completedCountBadge) completedCountBadge.innerText = completedTasks.length;

  todoTasksList.innerHTML = renderTaskColumn(todoTasks, 'Todo');
  pendingTasksList.innerHTML = renderTaskColumn(pendingTasks, 'Pending');
  completedTasksList.innerHTML = renderTaskColumn(completedTasks, 'Completed');
}

function renderTaskColumn(tasks, status) {
  if (tasks.length === 0) {
    return `<div class="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">No tasks in ${status}</div>`;
  }

  return tasks.map(task => {
    const priorityColors = {
      Urgent: 'bg-red-50 text-red-700 border-red-200',
      High: 'bg-amber-50 text-amber-700 border-amber-200',
      Medium: 'bg-blue-50 text-blue-700 border-blue-200',
      Low: 'bg-slate-50 text-slate-600 border-slate-200'
    };

    const isOverdue = task.dueDate && task.status !== 'Completed' && new Date(task.dueDate) < new Date(new Date().toDateString());

    return `
      <div class="card-solid p-4 flex flex-col justify-between space-y-3" data-testid="task-card" data-task-id="${task.id}">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="font-bold text-slate-900 text-sm leading-snug">${escapeHtml(task.title)}</h4>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColors[task.priority] || priorityColors.Medium}">
              ${escapeHtml(task.priority)}
            </span>
          </div>

          <p class="text-xs text-slate-600 line-clamp-2 mb-3">
            ${task.description ? escapeHtml(task.description) : '<span class="italic text-slate-400">No description</span>'}
          </p>

          <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3">
            <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
              🏢 ${escapeHtml(task.teamName || 'Team')}
            </span>
            ${task.dueDate ? `
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${isOverdue ? 'bg-red-100 text-red-800 font-bold' : 'bg-slate-100 text-slate-700'}">
                📅 ${task.dueDate} ${isOverdue ? '(Overdue)' : ''}
              </span>
            ` : ''}
          </div>

          <!-- Assignee Info -->
          <div class="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold overflow-hidden flex-shrink-0">
              ${task.assignee && task.assignee.avatarUrl ? `<img src="${task.assignee.avatarUrl}" class="w-full h-full object-cover">` : (task.assignee ? task.assignee.name.charAt(0).toUpperCase() : '—')}
            </div>
            <span class="text-xs text-slate-600 truncate font-medium">
              ${task.assignee ? escapeHtml(task.assignee.name) : '<span class="italic text-slate-400">Unassigned</span>'}
            </span>
          </div>
        </div>

        <!-- Action & Progression Toolbar -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div class="space-x-1 flex">
            ${status === 'Todo' ? `
              <button onclick="moveTaskStatus('${task.id}', 'Pending')" class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold rounded transition-colors" title="Start task">
                ▶ In Progress
              </button>
              <button onclick="moveTaskStatus('${task.id}', 'Completed')" class="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold rounded transition-colors" title="Complete task">
                ✓ Done
              </button>
            ` : ''}
            ${status === 'Pending' ? `
              <button onclick="moveTaskStatus('${task.id}', 'Todo')" class="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold rounded transition-colors" title="Reset to Todo">
                ◀ Todo
              </button>
              <button onclick="moveTaskStatus('${task.id}', 'Completed')" class="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold rounded transition-colors" title="Complete task">
                ✓ Done
              </button>
            ` : ''}
            ${status === 'Completed' ? `
              <button onclick="moveTaskStatus('${task.id}', 'Pending')" class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold rounded transition-colors" title="Reopen task">
                ↺ Reopen
              </button>
            ` : ''}
          </div>

          <div class="space-x-1 flex">
            <button onclick="editTask('${task.id}')" class="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 text-xs font-semibold" title="Edit task">Edit</button>
            <button onclick="deleteTask('${task.id}')" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 text-xs font-semibold" title="Delete task">&times;</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.moveTaskStatus = async function(taskId, newStatus) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner(`Task moved to ${newStatus}`, 'success');
      loadTasks();
    } else {
      showBanner(result.message || 'Failed to update task status', 'error');
    }
  } catch (error) {
    showBanner('Network error updating task status', 'error');
  }
};

function openTaskModal(task = null) {
  document.getElementById('taskId').value = task ? task.id : '';
  document.getElementById('formTaskTitle').value = task ? task.title : '';
  document.getElementById('formTaskPriority').value = task ? task.priority : 'Medium';
  document.getElementById('formTaskDescription').value = task && task.description ? task.description : '';
  document.getElementById('formTaskDueDate').value = task && task.dueDate ? task.dueDate : '';
  taskModalTitle.innerText = task ? 'Edit Task' : 'Add New Task';

  // Populate Teams dropdown
  formTaskTeam.innerHTML = '<option value="">Select Team...</option>' +
    state.teams.map(t => `<option value="${t.id}" ${task && task.teamId === t.id ? 'selected' : ''}>${escapeHtml(t.name)} (${escapeHtml(t.department)})</option>`).join('');

  // Populate Assignees dropdown
  formTaskAssignee.innerHTML = '<option value="">Unassigned</option>' +
    state.employees.map(e => `<option value="${e.id}" ${task && task.assigneeId === e.id ? 'selected' : ''}>${escapeHtml(e.name)} (${escapeHtml(e.role || e.position)})</option>`).join('');

  taskModal.classList.remove('hidden');
}

function closeTaskModal() {
  taskModal.classList.add('hidden');
  taskForm.reset();
}

async function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('taskId').value;
  const payload = {
    title: document.getElementById('formTaskTitle').value.trim(),
    teamId: document.getElementById('formTaskTeam').value,
    priority: document.getElementById('formTaskPriority').value,
    assigneeId: document.getElementById('formTaskAssignee').value || null,
    dueDate: document.getElementById('formTaskDueDate').value || null,
    description: document.getElementById('formTaskDescription').value.trim() || null
  };

  try {
    const url = id ? `/api/tasks/${id}` : '/api/tasks';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showBanner(id ? 'Task updated successfully' : 'Task created successfully', 'success');
      closeTaskModal();
      loadTasks();
    } else {
      showBanner(result.message || result.error || 'Failed to save task', 'error');
    }
  } catch (error) {
    showBanner('Network error saving task', 'error');
  }
}

window.editTask = function(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) openTaskModal(task);
};

window.deleteTask = async function(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showBanner('Task deleted successfully', 'success');
      loadTasks();
    } else {
      showBanner(result.message || 'Failed to delete task', 'error');
    }
  } catch (error) {
    showBanner('Network error deleting task', 'error');
  }
};

// -------------------------------------------------------------
// UTILITIES
// -------------------------------------------------------------

function showBanner(message, type = 'success') {
  statusBanner.innerText = message;
  statusBanner.className = `mb-6 p-4 rounded-xl text-sm font-medium ${type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`;
  statusBanner.classList.remove('hidden');
  setTimeout(() => {
    statusBanner.classList.add('hidden');
  }, 4000);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
