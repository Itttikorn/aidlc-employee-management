// Employee Directory Client Application Logic

let state = {
  employees: [],
  teams: [],
  viewMode: 'grid',
  searchQuery: '',
  selectedTeamId: '',
  currentPage: 1,
  totalPages: 1,
  limit: 12
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const teamFilter = document.getElementById('teamFilter');
const viewGridBtn = document.getElementById('viewGridBtn');
const viewTableBtn = document.getElementById('viewTableBtn');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const cardsGrid = document.getElementById('cardsGrid');
const tableView = document.getElementById('tableView');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const statusBanner = document.getElementById('statusBanner');
const employeeModal = document.getElementById('employeeModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const formAvatarFile = document.getElementById('formAvatarFile');
const formAvatarUrl = document.getElementById('formAvatarUrl');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadEmployees();
});

function setupEventListeners() {
  // Search with debounce
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

  // Filter by team
  if (teamFilter) {
    teamFilter.addEventListener('change', (e) => {
      state.selectedTeamId = e.target.value;
      state.currentPage = 1;
      loadEmployees();
    });
  }

  // View toggle
  if (viewGridBtn && viewTableBtn) {
    viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    viewTableBtn.addEventListener('click', () => setViewMode('table'));
  }

  // Modal controls
  if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener('click', () => openModal());
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

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

  // Form submit
  if (employeeForm) {
    employeeForm.addEventListener('submit', handleFormSubmit);
  }
}

function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'grid') {
    cardsGrid.classList.remove('hidden');
    tableView.classList.add('hidden');
    viewGridBtn.classList.add('bg-indigo-50', 'text-indigo-600');
    viewGridBtn.classList.remove('bg-white', 'text-slate-600');
    viewTableBtn.classList.add('bg-white', 'text-slate-600');
    viewTableBtn.classList.remove('bg-indigo-50', 'text-indigo-600');
  } else {
    cardsGrid.classList.add('hidden');
    tableView.classList.remove('hidden');
    viewTableBtn.classList.add('bg-indigo-50', 'text-indigo-600');
    viewTableBtn.classList.remove('bg-white', 'text-slate-600');
    viewGridBtn.classList.add('bg-white', 'text-slate-600');
    viewGridBtn.classList.remove('bg-indigo-50', 'text-indigo-600');
  }
  renderDirectory();
}

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

  // Render cards
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

  // Render table
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

function openModal(employee = null) {
  document.getElementById('employeeId').value = employee ? employee.id : '';
  document.getElementById('formFullName').value = employee ? employee.name : '';
  document.getElementById('formEmail').value = employee ? employee.email : '';
  document.getElementById('formRole').value = employee ? (employee.role || employee.position) : '';
  document.getElementById('formBirthDate').value = employee && employee.birthDate ? employee.birthDate : '';
  formAvatarUrl.value = employee && employee.avatarUrl ? employee.avatarUrl : '';
  modalTitle.innerText = employee ? 'Edit Employee' : 'Add New Employee';
  employeeModal.classList.remove('hidden');
}

function closeModal() {
  employeeModal.classList.add('hidden');
  employeeForm.reset();
  formAvatarUrl.value = '';
}

async function handleFormSubmit(e) {
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
      closeModal();
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
  if (emp) openModal(emp);
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

function showBanner(message, type = 'success') {
  statusBanner.innerText = message;
  statusBanner.className = `mb-6 p-4 rounded-md text-sm font-medium ${type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`;
  statusBanner.classList.remove('hidden');
  setTimeout(() => {
    statusBanner.classList.add('hidden');
  }, 4000);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

