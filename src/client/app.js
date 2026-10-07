// ==========================================================================
// Employee Management Hub - Comprehensive Reactive Client Application
// Inception Design System, Dual-Theme, Skeletons, FSM & Analytics
// ==========================================================================

const state = {
  currentTab: 'employees', // 'dashboard' | 'employees' | 'teams' | 'tasks'
  employees: [],
  teams: [],
  tasks: [],
  dashboardStats: null,
  viewMode: 'grid', // 'grid' | 'table'
  searchQuery: '',
  departmentFilter: '',
  teamFilter: '',
  taskTeamFilter: '',
  theme: localStorage.getItem('em_theme') || 'dark',
};

// ==========================================================================
// 1. DOM SELECTORS
// ==========================================================================

// Theme & Global Shell
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const globalSearchInput = document.getElementById('globalSearchInput');
const systemStatusText = document.getElementById('systemStatusText');
const statusBanner = document.getElementById('statusBanner');

// Navigation Buttons
const navDashboardBtn = document.getElementById('navDashboardBtn');
const navEmployeesBtn = document.getElementById('navEmployeesBtn');
const navTeamsBtn = document.getElementById('navTeamsBtn');
const navTasksBtn = document.getElementById('navTasksBtn');

// View Sections
const dashboardSection = document.getElementById('dashboardSection');
const employeesSection = document.getElementById('employeesSection');
const teamsSection = document.getElementById('teamsSection');
const tasksSection = document.getElementById('tasksSection');

// Primary Context Buttons
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addTeamBtn = document.getElementById('addTeamBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const addTeamSecondaryBtn = document.getElementById('addTeamSecondaryBtn');
const addTaskSecondaryBtn = document.getElementById('addTaskSecondaryBtn');
const refreshDashboardBtn = document.getElementById('refreshDashboardBtn');

// Employee View Controls
const employeeSearchInput = document.getElementById('employeeSearchInput');
const departmentFilter = document.getElementById('departmentFilter');
const teamFilter = document.getElementById('teamFilter');
const viewGridBtn = document.getElementById('viewGridBtn');
const viewTableBtn = document.getElementById('viewTableBtn');
const employeeCardGrid = document.getElementById('employeeCardGrid');
const employeeTableContainer = document.getElementById('employeeTableContainer');
const employeeTableBody = document.getElementById('employeeTableBody');

// Dashboard Elements
const kpiTotalEmployees = document.getElementById('kpiTotalEmployees');
const kpiTotalTeams = document.getElementById('kpiTotalTeams');
const kpiTotalTasks = document.getElementById('kpiTotalTasks');
const kpiCompletionRate = document.getElementById('kpiCompletionRate');
const kpiOverdueAlert = document.getElementById('kpiOverdueAlert');
const kpiCompletedSummary = document.getElementById('kpiCompletedSummary');
const barTodo = document.getElementById('barTodo');
const barPending = document.getElementById('barPending');
const barCompleted = document.getElementById('barCompleted');
const stageTodoText = document.getElementById('stageTodoText');
const stagePendingText = document.getElementById('stagePendingText');
const stageCompletedText = document.getElementById('stageCompletedText');
const priorityUrgentCount = document.getElementById('priorityUrgentCount');
const priorityHighCount = document.getElementById('priorityHighCount');
const priorityMediumCount = document.getElementById('priorityMediumCount');
const priorityLowCount = document.getElementById('priorityLowCount');
const dashboardTeamWorkloadTable = document.getElementById('dashboardTeamWorkloadTable');

// Teams Elements
const teamsGrid = document.getElementById('teamsGrid');

// Tasks Elements
const colTodo = document.getElementById('colTodo');
const colPending = document.getElementById('colPending');
const colCompleted = document.getElementById('colCompleted');
const todoCountBadge = document.getElementById('todoCountBadge');
const pendingCountBadge = document.getElementById('pendingCountBadge');
const completedCountBadge = document.getElementById('completedCountBadge');
const taskTeamFilter = document.getElementById('taskTeamFilter');

// Employee Modal Elements
const employeeModal = document.getElementById('employeeModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const employeeId = document.getElementById('employeeId');
const inputName = document.getElementById('inputName');
const inputPosition = document.getElementById('inputPosition');
const inputDepartment = document.getElementById('inputDepartment');
const inputEmail = document.getElementById('inputEmail');
const inputPhone = document.getElementById('inputPhone');
const inputBirthdate = document.getElementById('inputBirthdate');
const agePreviewBadge = document.getElementById('agePreviewBadge');
const calculatedAgeText = document.getElementById('calculatedAgeText');
const inputAvatarFile = document.getElementById('inputAvatarFile');
const avatarPlaceholder = document.getElementById('avatarPlaceholder');
const avatarImageTag = document.getElementById('avatarImageTag');
const modalTeamCheckboxes = document.getElementById('modalTeamCheckboxes');

// Team Modal Elements
const teamModal = document.getElementById('teamModal');
const teamForm = document.getElementById('teamForm');
const teamModalTitle = document.getElementById('teamModalTitle');
const closeTeamModalBtn = document.getElementById('closeTeamModalBtn');
const cancelTeamModalBtn = document.getElementById('cancelTeamModalBtn');
const teamId = document.getElementById('teamId');
const teamInputName = document.getElementById('teamInputName');
const teamInputDepartment = document.getElementById('teamInputDepartment');
const teamInputLead = document.getElementById('teamInputLead');
const teamInputDescription = document.getElementById('teamInputDescription');

// Task Modal Elements
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskModalTitle = document.getElementById('taskModalTitle');
const closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
const cancelTaskModalBtn = document.getElementById('cancelTaskModalBtn');
const taskId = document.getElementById('taskId');
const taskInputTitle = document.getElementById('taskInputTitle');
const taskInputTeam = document.getElementById('taskInputTeam');
const taskInputAssignee = document.getElementById('taskInputAssignee');
const taskInputStatus = document.getElementById('taskInputStatus');
const taskInputPriority = document.getElementById('taskInputPriority');
const taskInputDueDate = document.getElementById('taskInputDueDate');
const taskInputDescription = document.getElementById('taskInputDescription');

// ==========================================================================
// 2. THEME & APP SHELL CONTROLLERS
// ==========================================================================

function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('em_theme', theme);
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeLabel) themeLabel.textContent = 'Dark';
  } else {
    root.classList.remove('dark');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeLabel) themeLabel.textContent = 'Light';
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });
}

function toggleMobileSidebar(open) {
  if (!sidebar || !sidebarBackdrop) return;
  if (open) {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleMobileSidebar(true));
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => toggleMobileSidebar(false));

// ==========================================================================
// 3. TAB NAVIGATION CONTROLLER
// ==========================================================================

function switchTab(targetTab) {
  state.currentTab = targetTab;
  toggleMobileSidebar(false);

  // Reset button active styles
  const allNavBtns = [
    { btn: navDashboardBtn, sec: dashboardSection, addBtn: null },
    { btn: navEmployeesBtn, sec: employeesSection, addBtn: addEmployeeBtn },
    { btn: navTeamsBtn, sec: teamsSection, addBtn: addTeamBtn },
    { btn: navTasksBtn, sec: tasksSection, addBtn: addTaskBtn }
  ];

  allNavBtns.forEach(({ btn, sec, addBtn: cta }) => {
    if (!btn || !sec) return;
    const isActive = btn.id.toLowerCase().includes(targetTab);
    
    if (isActive) {
      btn.className = 'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 transition-colors text-left cursor-pointer';
      sec.classList.remove('hidden');
    } else {
      btn.className = 'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors text-left cursor-pointer';
      sec.classList.add('hidden');
    }

    if (cta) {
      if (isActive) cta.classList.remove('hidden');
      else cta.classList.add('hidden');
    }
  });

  // Fetch / Refresh relevant data
  if (targetTab === 'dashboard') loadDashboardData();
  else if (targetTab === 'employees') loadEmployeesData();
  else if (targetTab === 'teams') loadTeamsData();
  else if (targetTab === 'tasks') loadTasksData();
}

if (navDashboardBtn) navDashboardBtn.addEventListener('click', () => switchTab('dashboard'));
if (navEmployeesBtn) navEmployeesBtn.addEventListener('click', () => switchTab('employees'));
if (navTeamsBtn) navTeamsBtn.addEventListener('click', () => switchTab('teams'));
if (navTasksBtn) navTasksBtn.addEventListener('click', () => switchTab('tasks'));

// ==========================================================================
// 4. NOTIFICATION & STATUS BANNER
// ==========================================================================

function showBanner(message, type = 'success') {
  if (!statusBanner) return;
  statusBanner.classList.remove('hidden');
  
  if (type === 'success') {
    statusBanner.className = 'p-4 rounded-xl text-sm font-medium transition-all shadow-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  } else if (type === 'error') {
    statusBanner.className = 'p-4 rounded-xl text-sm font-medium transition-all shadow-sm bg-red-500/10 text-red-400 border border-red-500/30';
  } else {
    statusBanner.className = 'p-4 rounded-xl text-sm font-medium transition-all shadow-sm bg-blue-500/10 text-blue-400 border border-blue-500/30';
  }

  statusBanner.textContent = message;
  setTimeout(() => {
    statusBanner.classList.add('hidden');
  }, 4500);
}

// ==========================================================================
// 5. DATA FETCHING & API SERVICES
// ==========================================================================

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (systemStatusText) {
      if (data.status === 'healthy') {
        systemStatusText.textContent = 'Online';
        systemStatusText.className = 'text-[11px] font-bold text-emerald-400';
      } else {
        systemStatusText.textContent = 'Degraded';
        systemStatusText.className = 'text-[11px] font-bold text-amber-400';
      }
    }
  } catch {
    if (systemStatusText) {
      systemStatusText.textContent = 'Offline';
      systemStatusText.className = 'text-[11px] font-bold text-red-400';
    }
  }
}

async function loadDashboardData() {
  try {
    const res = await fetch('/api/dashboard/stats');
    const json = await res.json();
    if (json.success && json.data) {
      state.dashboardStats = json.data;
      renderDashboard(json.data);
    }
  } catch (err) {
    showBanner('Failed to load dashboard metrics', 'error');
  }
}

async function loadEmployeesData() {
  try {
    const res = await fetch('/api/employees');
    const json = await res.json();
    state.employees = json.data || [];
    renderEmployees();
  } catch (err) {
    showBanner('Failed to load employee directory', 'error');
  }
}

async function loadTeamsData() {
  try {
    const res = await fetch('/api/teams');
    const json = await res.json();
    state.teams = json.data || [];
    renderTeams();
    populateTeamFilters();
  } catch (err) {
    showBanner('Failed to load teams', 'error');
  }
}

async function loadTasksData() {
  try {
    let url = '/api/tasks';
    if (state.taskTeamFilter) url += `?teamId=${state.taskTeamFilter}`;
    const res = await fetch(url);
    const json = await res.json();
    state.tasks = json.data || [];
    renderTasks();
  } catch (err) {
    showBanner('Failed to load task board', 'error');
  }
}

// ==========================================================================
// 6. RENDERERS
// ==========================================================================

function renderDashboard(data) {
  const { overview, taskDistribution, priorityDistribution, teamWorkloads } = data;

  if (kpiTotalEmployees) kpiTotalEmployees.textContent = overview.totalEmployees;
  if (kpiTotalTeams) kpiTotalTeams.textContent = overview.totalTeams;
  if (kpiTotalTasks) kpiTotalTasks.textContent = overview.totalTasks;
  if (kpiCompletionRate) kpiCompletionRate.textContent = `${overview.completionRate}%`;
  if (kpiOverdueAlert) kpiOverdueAlert.textContent = `${overview.overdueTasksCount} overdue`;
  if (kpiCompletedSummary) kpiCompletedSummary.textContent = `${overview.completedTasks} completed`;

  if (barTodo) barTodo.style.width = `${taskDistribution.todo.percentage}%`;
  if (barPending) barPending.style.width = `${taskDistribution.pending.percentage}%`;
  if (barCompleted) barCompleted.style.width = `${taskDistribution.completed.percentage}%`;

  if (stageTodoText) stageTodoText.innerHTML = `${taskDistribution.todo.count} <span class="text-xs font-normal text-slate-400">(${taskDistribution.todo.percentage}%)</span>`;
  if (stagePendingText) stagePendingText.innerHTML = `${taskDistribution.pending.count} <span class="text-xs font-normal text-slate-400">(${taskDistribution.pending.percentage}%)</span>`;
  if (stageCompletedText) stageCompletedText.innerHTML = `${taskDistribution.completed.count} <span class="text-xs font-normal text-slate-400">(${taskDistribution.completed.percentage}%)</span>`;

  if (priorityUrgentCount) priorityUrgentCount.textContent = `${priorityDistribution.urgent} tasks`;
  if (priorityHighCount) priorityHighCount.textContent = `${priorityDistribution.high} tasks`;
  if (priorityMediumCount) priorityMediumCount.textContent = `${priorityDistribution.medium} tasks`;
  if (priorityLowCount) priorityLowCount.textContent = `${priorityDistribution.low} tasks`;

  if (dashboardTeamWorkloadTable) {
    if (!teamWorkloads || teamWorkloads.length === 0) {
      dashboardTeamWorkloadTable.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">No team activity recorded yet.</td></tr>`;
      return;
    }

    dashboardTeamWorkloadTable.innerHTML = teamWorkloads.map(tw => `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-3 px-3 font-semibold text-slate-200">${escapeHtml(tw.teamName)}</td>
        <td class="py-3 px-3"><span class="badge-solid">${escapeHtml(tw.department)}</span></td>
        <td class="py-3 px-3 text-center font-bold">${tw.memberCount}</td>
        <td class="py-3 px-3 text-center">${tw.totalTasks}</td>
        <td class="py-3 px-3 text-center text-emerald-400 font-semibold">${tw.completedTasks}</td>
        <td class="py-3 px-3 text-right">
          <div class="flex items-center justify-end space-x-2">
            <span class="font-bold">${tw.completionRate}%</span>
            <div class="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="bg-indigo-500 h-full" style="width: ${tw.completionRate}%"></div>
            </div>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function renderEmployees() {
  const q = (state.searchQuery || '').toLowerCase();
  const dept = state.departmentFilter;
  const team = state.teamFilter;

  const filtered = state.employees.filter(emp => {
    const matchesSearch = !q || 
      emp.name.toLowerCase().includes(q) || 
      emp.position.toLowerCase().includes(q) || 
      emp.email.toLowerCase().includes(q);
    const matchesDept = !dept || emp.department === dept;
    const matchesTeam = !team || (emp.teams && emp.teams.some(t => t.id === team || t.name === team));
    return matchesSearch && matchesDept && matchesTeam;
  });

  if (state.viewMode === 'grid') {
    if (employeeCardGrid) employeeCardGrid.classList.remove('hidden');
    if (employeeTableContainer) employeeTableContainer.classList.add('hidden');
    renderEmployeeCards(filtered);
  } else {
    if (employeeCardGrid) employeeCardGrid.classList.add('hidden');
    if (employeeTableContainer) employeeTableContainer.classList.remove('hidden');
    renderEmployeeTable(filtered);
  }
}

function renderEmployeeCards(employees) {
  if (!employeeCardGrid) return;
  if (employees.length === 0) {
    employeeCardGrid.innerHTML = `
      <div class="col-span-full card-solid p-12 text-center space-y-3">
        <span class="text-4xl">👥</span>
        <h3 class="text-base font-bold">No Employees Found</h3>
        <p class="text-xs text-slate-400">No profile matches your search and filter criteria.</p>
      </div>
    `;
    return;
  }

  employeeCardGrid.innerHTML = employees.map(emp => {
    const initials = emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const teamBadges = (emp.teams && emp.teams.length > 0)
      ? emp.teams.map(t => `<span class="badge-solid text-[10px]">${escapeHtml(t.name || t)}</span>`).join(' ')
      : `<span class="text-[11px] text-slate-500 italic">No assigned teams</span>`;

    const avatarHtml = emp.avatarUrl
      ? `<img src="${emp.avatarUrl}" class="w-12 h-12 rounded-full object-cover border border-slate-700" alt="${escapeHtml(emp.name)}">`
      : `<div class="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-600/20">${initials}</div>`;

    return `
      <div class="card-solid p-5 flex flex-col justify-between space-y-4" data-testid="employee-card">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-3">
            ${avatarHtml}
            <div>
              <h3 class="font-bold text-sm text-slate-100">${escapeHtml(emp.name)}</h3>
              <p class="text-xs text-slate-400">${escapeHtml(emp.position)}</p>
            </div>
          </div>
          <span class="age-badge">Age: ${emp.age}</span>
        </div>

        <div class="space-y-1.5 text-xs text-slate-400">
          <div class="flex items-center space-x-2">
            <span>🏢</span> <span class="font-semibold text-slate-200">${escapeHtml(emp.department)}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span>✉️</span> <a href="mailto:${escapeHtml(emp.email)}" class="hover:text-indigo-400 truncate">${escapeHtml(emp.email)}</a>
          </div>
          ${emp.phone ? `<div class="flex items-center space-x-2"><span>📞</span> <span>${escapeHtml(emp.phone)}</span></div>` : ''}
        </div>

        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teams</p>
          <div class="flex flex-wrap gap-1.5">${teamBadges}</div>
        </div>

        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-end space-x-2">
          <button onclick="editEmployee('${emp.id}')" data-testid="edit-employee-btn" class="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 cursor-pointer">
            Edit
          </button>
          <button onclick="deleteEmployee('${emp.id}')" data-testid="delete-employee-btn" class="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderEmployeeTable(employees) {
  if (!employeeTableBody) return;
  if (employees.length === 0) {
    employeeTableBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">No employees match criteria.</td></tr>`;
    return;
  }

  employeeTableBody.innerHTML = employees.map(emp => {
    const initials = emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const teamBadges = (emp.teams && emp.teams.length > 0)
      ? emp.teams.map(t => `<span class="badge-solid text-[10px]">${escapeHtml(t.name || t)}</span>`).join(' ')
      : `<span class="text-xs text-slate-500 italic">Unassigned</span>`;

    return `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-3 px-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              ${initials}
            </div>
            <div>
              <p class="font-semibold text-slate-200">${escapeHtml(emp.name)}</p>
              <p class="text-xs text-slate-400">${escapeHtml(emp.email)}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 font-medium text-slate-300">${escapeHtml(emp.position)}</td>
        <td class="py-3 px-4"><span class="badge-solid">${escapeHtml(emp.department)}</span></td>
        <td class="py-3 px-4 text-center font-bold text-slate-200">${emp.age}</td>
        <td class="py-3 px-4">${teamBadges}</td>
        <td class="py-3 px-4 text-right space-x-2">
          <button onclick="editEmployee('${emp.id}')" class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700">Edit</button>
          <button onclick="deleteEmployee('${emp.id}')" class="px-2.5 py-1 text-xs font-semibold rounded bg-red-500/10 text-red-400 hover:bg-red-500/20">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTeams() {
  if (!teamsGrid) return;
  if (state.teams.length === 0) {
    teamsGrid.innerHTML = `
      <div class="col-span-full card-solid p-12 text-center space-y-3">
        <span class="text-4xl">🏢</span>
        <h3 class="text-base font-bold">No Teams Created Yet</h3>
        <p class="text-xs text-slate-400">Click '+ Create Team' to organize cross-functional pods.</p>
      </div>
    `;
    return;
  }

  teamsGrid.innerHTML = state.teams.map(team => {
    const memberCount = team.members ? team.members.length : (team.memberCount || 0);
    const leadName = team.lead ? team.lead.name : (team.leadName || 'Unassigned');

    return `
      <div class="card-solid p-5 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-base text-slate-100">${escapeHtml(team.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5">${escapeHtml(team.description || 'No description provided.')}</p>
            </div>
            <span class="badge-solid">${escapeHtml(team.department)}</span>
          </div>

          <div class="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <div class="text-xs text-slate-300">
              <span class="text-slate-400">Lead:</span> <strong class="text-indigo-400">★ ${escapeHtml(leadName)}</strong>
            </div>
            <div class="text-xs font-bold text-slate-200">
              👥 ${memberCount} members
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-end space-x-2">
          <button onclick="editTeam('${team.id}')" class="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700">
            Edit Team
          </button>
          <button onclick="deleteTeam('${team.id}')" class="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderTasks() {
  const todoTasks = state.tasks.filter(t => t.status === 'Todo');
  const pendingTasks = state.tasks.filter(t => t.status === 'Pending');
  const completedTasks = state.tasks.filter(t => t.status === 'Completed');

  if (todoCountBadge) todoCountBadge.textContent = todoTasks.length;
  if (pendingCountBadge) pendingCountBadge.textContent = pendingTasks.length;
  if (completedCountBadge) completedCountBadge.textContent = completedTasks.length;

  if (colTodo) colTodo.innerHTML = renderTaskColumn(todoTasks, 'Todo');
  if (colPending) colPending.innerHTML = renderTaskColumn(pendingTasks, 'Pending');
  if (colCompleted) colCompleted.innerHTML = renderTaskColumn(completedTasks, 'Completed');
}

function renderTaskColumn(tasks, status) {
  if (tasks.length === 0) {
    return `<div class="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">No tasks in this stage</div>`;
  }

  return tasks.map(task => {
    const priorityClasses = {
      Urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
      High: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      Medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Low: 'bg-slate-700/40 text-slate-400 border-slate-600/40'
    }[task.priority] || 'bg-slate-800 text-slate-400';

    const assigneeName = task.assignee ? task.assignee.name : (task.assigneeName || 'Unassigned');
    const teamName = task.teamName || 'Assigned Team';

    let transitionBtns = '';
    if (status === 'Todo') {
      transitionBtns = `<button onclick="updateTaskStatus('${task.id}', 'Pending')" class="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white">Start > Pending</button>`;
    } else if (status === 'Pending') {
      transitionBtns = `
        <button onclick="updateTaskStatus('${task.id}', 'Todo')" class="px-2 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300">&lt; Todo</button>
        <button onclick="updateTaskStatus('${task.id}', 'Completed')" class="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white">Complete &gt;</button>
      `;
    } else if (status === 'Completed') {
      transitionBtns = `<button onclick="updateTaskStatus('${task.id}', 'Pending')" class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300">&lt; Reopen</button>`;
    }

    return `
      <div class="card-solid p-4 space-y-3" data-task-id="${task.id}">
        <div class="flex items-start justify-between">
          <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${priorityClasses}">${task.priority}</span>
          <span class="text-[11px] text-slate-400">${task.dueDate ? `📅 ${task.dueDate}` : ''}</span>
        </div>

        <div>
          <h4 class="font-bold text-sm text-slate-100">${escapeHtml(task.title)}</h4>
          <p class="text-xs text-slate-400 mt-1">${escapeHtml(task.description || '')}</p>
        </div>

        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-700/60">
          <span>🏢 ${escapeHtml(teamName)}</span>
          <span>👤 ${escapeHtml(assigneeName)}</span>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-1">
          ${transitionBtns}
          <button onclick="deleteTask('${task.id}')" class="text-xs text-red-400 hover:text-red-300 p-1">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function populateTeamFilters() {
  const options = `<option value="">All Teams</option>` + state.teams.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
  if (teamFilter) teamFilter.innerHTML = options;
  if (taskTeamFilter) taskTeamFilter.innerHTML = options;
}

// ==========================================================================
// 7. EVENT LISTENERS & MODAL CONTROLLERS
// ==========================================================================

// Global & Employee Search Input
if (globalSearchInput) {
  globalSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.currentTab === 'employees') renderEmployees();
  });
}

if (employeeSearchInput) {
  employeeSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderEmployees();
  });
}

if (departmentFilter) {
  departmentFilter.addEventListener('change', (e) => {
    state.departmentFilter = e.target.value;
    renderEmployees();
  });
}

if (teamFilter) {
  teamFilter.addEventListener('change', (e) => {
    state.teamFilter = e.target.value;
    renderEmployees();
  });
}

if (taskTeamFilter) {
  taskTeamFilter.addEventListener('change', (e) => {
    state.taskTeamFilter = e.target.value;
    loadTasksData();
  });
}

// View Toggle Switchers
if (viewGridBtn) {
  viewGridBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    viewGridBtn.className = 'px-2.5 py-1 rounded text-xs font-semibold bg-indigo-600 text-white cursor-pointer';
    if (viewTableBtn) viewTableBtn.className = 'px-2.5 py-1 rounded text-xs font-semibold text-slate-400 hover:text-slate-100 cursor-pointer';
    renderEmployees();
  });
}

if (viewTableBtn) {
  viewTableBtn.addEventListener('click', () => {
    state.viewMode = 'table';
    viewTableBtn.className = 'px-2.5 py-1 rounded text-xs font-semibold bg-indigo-600 text-white cursor-pointer';
    if (viewGridBtn) viewGridBtn.className = 'px-2.5 py-1 rounded text-xs font-semibold text-slate-400 hover:text-slate-100 cursor-pointer';
    renderEmployees();
  });
}

// Age Preview Calculation
if (inputBirthdate) {
  inputBirthdate.addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val) {
      if (agePreviewBadge) agePreviewBadge.classList.add('hidden');
      return;
    }
    const birth = new Date(val);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    
    if (agePreviewBadge && calculatedAgeText) {
      calculatedAgeText.textContent = `${age} yrs`;
      agePreviewBadge.classList.remove('hidden');
    }
  });
}

// Modals Open / Close
function openEmployeeModal(isEdit = false) {
  if (!employeeModal) return;
  employeeModal.classList.remove('hidden');
  if (modalTitle) modalTitle.textContent = isEdit ? 'Edit Employee Profile' : 'Add New Employee';
  
  // Render team checkboxes
  if (modalTeamCheckboxes) {
    modalTeamCheckboxes.innerHTML = state.teams.map(t => `
      <label class="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer">
        <input type="checkbox" name="teams" value="${t.id}" class="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500">
        <span>${escapeHtml(t.name)}</span>
      </label>
    `).join('') || '<p class="text-xs text-slate-500 italic">No teams created yet.</p>';
  }
}

function closeEmployeeModal() {
  if (employeeModal) employeeModal.classList.add('hidden');
  if (employeeForm) employeeForm.reset();
  if (agePreviewBadge) agePreviewBadge.classList.add('hidden');
}

if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', () => {
  if (employeeId) employeeId.value = '';
  openEmployeeModal(false);
});
if (closeModalBtn) closeModalBtn.addEventListener('click', closeEmployeeModal);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeEmployeeModal);

// Save Employee Submit
if (employeeForm) {
  employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = employeeId ? employeeId.value : '';
    const selectedTeamIds = Array.from(modalTeamCheckboxes.querySelectorAll('input[name="teams"]:checked')).map(cb => cb.value);

    const payload = {
      name: inputName.value.trim(),
      position: inputPosition.value.trim(),
      department: inputDepartment.value,
      email: inputEmail.value.trim(),
      phone: inputPhone.value.trim() || undefined,
      birthdate: inputBirthdate.value,
      teamIds: selectedTeamIds
    };

    try {
      const url = id ? `/api/employees/${id}` : '/api/employees';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Operation failed');

      closeEmployeeModal();
      showBanner(id ? 'Employee profile updated!' : 'Employee added successfully!');
      loadEmployeesData();
    } catch (err) {
      showBanner(err.message, 'error');
    }
  });
}

// Global actions exposed for buttons
window.editEmployee = async function(id) {
  const emp = state.employees.find(e => e.id === id);
  if (!emp) return;
  if (employeeId) employeeId.value = emp.id;
  if (inputName) inputName.value = emp.name;
  if (inputPosition) inputPosition.value = emp.position;
  if (inputDepartment) inputDepartment.value = emp.department;
  if (inputEmail) inputEmail.value = emp.email;
  if (inputPhone) inputPhone.value = emp.phone || '';
  if (inputBirthdate) {
    inputBirthdate.value = emp.birthdate ? emp.birthdate.substring(0, 10) : '';
    inputBirthdate.dispatchEvent(new Event('input'));
  }
  openEmployeeModal(true);
};

window.deleteEmployee = async function(id) {
  if (!confirm('Are you sure you want to delete this employee record?')) return;
  try {
    const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Deletion failed');
    showBanner('Employee record deleted');
    loadEmployeesData();
  } catch (err) {
    showBanner(err.message, 'error');
  }
};

// Team Modal
function openTeamModal(isEdit = false) {
  if (!teamModal) return;
  teamModal.classList.remove('hidden');
  if (teamModalTitle) teamModalTitle.textContent = isEdit ? 'Edit Team Profile' : 'Create New Team';

  if (teamInputLead) {
    teamInputLead.innerHTML = '<option value="">-- Select Team Lead --</option>' + 
      state.employees.map(e => `<option value="${e.id}">${escapeHtml(e.name)} (${escapeHtml(e.position)})</option>`).join('');
  }
}

function closeTeamModal() {
  if (teamModal) teamModal.classList.add('hidden');
  if (teamForm) teamForm.reset();
}

if (addTeamBtn) addTeamBtn.addEventListener('click', () => { if (teamId) teamId.value = ''; openTeamModal(false); });
if (addTeamSecondaryBtn) addTeamSecondaryBtn.addEventListener('click', () => { if (teamId) teamId.value = ''; openTeamModal(false); });
if (closeTeamModalBtn) closeTeamModalBtn.addEventListener('click', closeTeamModal);
if (cancelTeamModalBtn) cancelTeamModalBtn.addEventListener('click', closeTeamModal);

if (teamForm) {
  teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = teamId ? teamId.value : '';
    const payload = {
      name: teamInputName.value.trim(),
      department: teamInputDepartment.value,
      leadId: teamInputLead.value || undefined,
      description: teamInputDescription.value.trim() || undefined
    };

    try {
      const url = id ? `/api/teams/${id}` : '/api/teams';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Operation failed');
      closeTeamModal();
      showBanner(id ? 'Team profile updated!' : 'Team created successfully!');
      loadTeamsData();
    } catch (err) {
      showBanner(err.message, 'error');
    }
  });
}

window.deleteTeam = async function(id) {
  if (!confirm('Are you sure you want to delete this team?')) return;
  try {
    const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete team');
    showBanner('Team deleted successfully');
    loadTeamsData();
  } catch (err) {
    showBanner(err.message, 'error');
  }
};

// Task Modal
function openTaskModal(isEdit = false) {
  if (!taskModal) return;
  taskModal.classList.remove('hidden');
  if (taskModalTitle) taskModalTitle.textContent = isEdit ? 'Edit Task' : 'Author New Task';

  if (taskInputTeam) {
    taskInputTeam.innerHTML = '<option value="">-- Select Team --</option>' + 
      state.teams.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
  }
  if (taskInputAssignee) {
    taskInputAssignee.innerHTML = '<option value="">-- Unassigned --</option>' + 
      state.employees.map(e => `<option value="${e.id}">${escapeHtml(e.name)}</option>`).join('');
  }
}

function closeTaskModal() {
  if (taskModal) taskModal.classList.add('hidden');
  if (taskForm) taskForm.reset();
}

if (addTaskBtn) addTaskBtn.addEventListener('click', () => { if (taskId) taskId.value = ''; openTaskModal(false); });
if (addTaskSecondaryBtn) addTaskSecondaryBtn.addEventListener('click', () => { if (taskId) taskId.value = ''; openTaskModal(false); });
if (closeTaskModalBtn) closeTaskModalBtn.addEventListener('click', closeTaskModal);
if (cancelTaskModalBtn) cancelTaskModalBtn.addEventListener('click', closeTaskModal);

if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = taskId ? taskId.value : '';
    const payload = {
      title: taskInputTitle.value.trim(),
      teamId: taskInputTeam.value,
      assigneeId: taskInputAssignee.value || undefined,
      status: taskInputStatus.value,
      priority: taskInputPriority.value,
      dueDate: taskInputDueDate.value || undefined,
      description: taskInputDescription.value.trim() || undefined
    };

    try {
      const url = id ? `/api/tasks/${id}` : '/api/tasks';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Operation failed');
      closeTaskModal();
      showBanner(id ? 'Task updated!' : 'Task created successfully!');
      loadTasksData();
    } catch (err) {
      showBanner(err.message, 'error');
    }
  });
}

window.updateTaskStatus = async function(id, newStatus) {
  try {
    const res = await fetch(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Status transition rejected');
    showBanner(`Task moved to ${newStatus}`);
    loadTasksData();
  } catch (err) {
    showBanner(err.message, 'error');
  }
};

window.deleteTask = async function(id) {
  if (!confirm('Delete this task?')) return;
  try {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    showBanner('Task deleted');
    loadTasksData();
  } catch (err) {
    showBanner(err.message, 'error');
  }
};

if (refreshDashboardBtn) {
  refreshDashboardBtn.addEventListener('click', () => {
    loadDashboardData();
    showBanner('Dashboard analytics refreshed');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// 8. INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(state.theme);
  await checkHealth();
  await loadTeamsData();
  await loadEmployeesData();
  switchTab('employees');
  setInterval(checkHealth, 30000);
});
