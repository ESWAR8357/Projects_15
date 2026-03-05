/**
 * Client-Side Database Manager - Professional Data Management System
 * Educational implementation of CRUD operations with LocalStorage as database
 */

class DatabaseManager {
    constructor() {
        // Database configuration
        this.dbKey = 'client_database';
        this.records = [];
        this.filteredRecords = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadDatabase();
        this.render();
    }

    // Initialize DOM element references
    initializeElements() {
        // Form elements
        this.dataForm = document.getElementById('dataForm');
        this.nameInput = document.getElementById('nameInput');
        this.emailInput = document.getElementById('emailInput');
        this.phoneInput = document.getElementById('phoneInput');
        this.companyInput = document.getElementById('companyInput');
        this.addBtn = document.getElementById('addBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Error elements
        this.nameError = document.getElementById('nameError');
        this.emailError = document.getElementById('emailError');
        this.phoneError = document.getElementById('phoneError');
        this.companyError = document.getElementById('companyError');
        
        // Table elements
        this.searchInput = document.getElementById('searchInput');
        this.dataTable = document.getElementById('dataTable');
        this.tableBody = document.getElementById('tableBody');
        this.emptyState = document.getElementById('emptyState');
        this.noResults = document.getElementById('noResults');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        
        // Status elements
        this.recordCount = document.getElementById('recordCount');
        this.formStatus = document.getElementById('formStatus');
        
        // Modal elements
        this.deleteModal = document.getElementById('deleteModal');
        this.deletePreview = document.getElementById('deletePreview');
        this.confirmDelete = document.getElementById('confirmDelete');
        this.cancelDelete = document.getElementById('cancelDelete');
        
        // Toast elements
        this.successToast = document.getElementById('successToast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    // Set up event listeners
    initializeEventListeners() {
        // Form events
        this.dataForm.addEventListener('submit', (e) => this.handleAddRecord(e));
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Real-time validation
        this.nameInput.addEventListener('input', () => this.validateField('name'));
        this.emailInput.addEventListener('input', () => this.validateField('email'));
        this.phoneInput.addEventListener('input', () => this.validateField('phone'));
        this.companyInput.addEventListener('input', () => this.validateField('company'));
        
        // Search functionality
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        
        // Table sorting
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sortable')) {
                const column = e.target.closest('.sortable').dataset.column;
                this.handleSort(column);
            }
        });
        
        // Export functionality
        this.exportBtn.addEventListener('click', () => this.exportData());
        
        // Modal events
        this.cancelDelete.addEventListener('click', () => this.hideDeleteModal());
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.hideDeleteModal();
        });
    }

    // DATABASE OPERATIONS: Load database from LocalStorage
    loadDatabase() {
        try {
            const stored = localStorage.getItem(this.dbKey);
            this.records = stored ? JSON.parse(stored) : [];
            this.filteredRecords = [...this.records];
            console.log(`📊 Loaded ${this.records.length} records from database`);
        } catch (error) {
            console.error('Error loading database:', error);
            this.records = [];
            this.filteredRecords = [];
        }
    }

    // Save database to LocalStorage
    saveDatabase() {
        try {
            localStorage.setItem(this.dbKey, JSON.stringify(this.records));
            console.log(`💾 Saved ${this.records.length} records to database`);
        } catch (error) {
            console.error('Error saving database:', error);
            this.showToast('Error saving data to database', 'error');
        }
    }

    // Generate unique ID for new records
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // CRUD OPERATIONS: Create new record
    createRecord(recordData) {
        const record = {
            id: this.generateId(),
            ...recordData,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        this.records.unshift(record); // Add to beginning for newest first
        this.saveDatabase();
        this.applyCurrentFilter();
        return record;
    }

    // Delete record by ID
    deleteRecord(id) {
        const index = this.records.findIndex(record => record.id === id);
        if (index !== -1) {
            const deleted = this.records.splice(index, 1)[0];
            this.saveDatabase();
            this.applyCurrentFilter();
            return deleted;
        }
        return null;
    }

    // VALIDATION: Validate individual form field
    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        switch (field) {
            case 'name':
                const name = this.nameInput.value.trim();
                if (!name) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (name.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                this.nameError.textContent = errorMessage;
                break;

            case 'email':
                const email = this.emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(email)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (this.isEmailExists(email)) {
                    errorMessage = 'This email already exists';
                    isValid = false;
                }
                this.emailError.textContent = errorMessage;
                break;

            case 'phone':
                const phone = this.phoneInput.value.trim();
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phone) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                this.phoneError.textContent = errorMessage;
                break;

            case 'company':
                const company = this.companyInput.value.trim();
                if (!company) {
                    errorMessage = 'Company is required';
                    isValid = false;
                } else if (company.length < 2) {
                    errorMessage = 'Company name must be at least 2 characters';
                    isValid = false;
                }
                this.companyError.textContent = errorMessage;
                break;
        }

        this.updateFormStatus();
        return isValid;
    }

    // Check if email already exists
    isEmailExists(email) {
        return this.records.some(record => 
            record.email.toLowerCase() === email.toLowerCase()
        );
    }

    // Validate entire form
    validateForm() {
        const nameValid = this.validateField('name');
        const emailValid = this.validateField('email');
        const phoneValid = this.validateField('phone');
        const companyValid = this.validateField('company');
        
        return nameValid && emailValid && phoneValid && companyValid;
    }

    // Update form status indicator
    updateFormStatus() {
        const isValid = this.validateForm();
        this.addBtn.disabled = !isValid;
        this.formStatus.textContent = isValid ? 'Ready' : 'Invalid';
        this.formStatus.style.background = isValid ? 'var(--success-light)' : 'var(--error-light)';
        this.formStatus.style.color = isValid ? 'var(--success)' : 'var(--danger)';
    }

    // FORM HANDLING: Handle add record form submission
    handleAddRecord(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showToast('Please fix the form errors', 'error');
            return;
        }

        const recordData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            company: this.companyInput.value.trim()
        };

        const record = this.createRecord(recordData);
        this.clearForm();
        this.render();
        this.showToast(`Record for ${record.name} added successfully!`);
    }

    // Clear form inputs and errors
    clearForm() {
        this.dataForm.reset();
        this.clearErrors();
        this.updateFormStatus();
    }

    // Clear all error messages
    clearErrors() {
        this.nameError.textContent = '';
        this.emailError.textContent = '';
        this.phoneError.textContent = '';
        this.companyError.textContent = '';
    }

    // SEARCH & FILTER: Handle search input
    handleSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        
        if (!query) {
            this.filteredRecords = [...this.records];
        } else {
            this.filteredRecords = this.records.filter(record =>
                record.name.toLowerCase().includes(query) ||
                record.email.toLowerCase().includes(query) ||
                record.phone.toLowerCase().includes(query) ||
                record.company.toLowerCase().includes(query)
            );
        }
        
        this.renderTable();
    }

    // Clear search and show all records
    clearSearch() {
        this.searchInput.value = '';
        this.filteredRecords = [...this.records];
        this.renderTable();
    }

    // Apply current search filter
    applyCurrentFilter() {
        if (this.searchInput.value.trim()) {
            this.handleSearch();
        } else {
            this.filteredRecords = [...this.records];
        }
    }

    // SORTING: Handle table column sorting
    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredRecords.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle date sorting
            if (column === 'created') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            // Handle string sorting
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderTable();
        this.updateSortIndicators();
    }

    // Update sort indicators in table headers
    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(th => {
            th.classList.remove('sorted');
            const icon = th.querySelector('.sort-icon');
            icon.textContent = '↕️';
        });

        if (this.sortColumn) {
            const sortedTh = document.querySelector(`[data-column="${this.sortColumn}"]`);
            if (sortedTh) {
                sortedTh.classList.add('sorted');
                const icon = sortedTh.querySelector('.sort-icon');
                icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
            }
        }
    }

    // DELETE HANDLING: Show delete confirmation modal
    showDeleteModal(record) {
        this.deletePreview.innerHTML = `
            <strong>${record.name}</strong><br>
            <small>${record.email} • ${record.company}</small>
        `;
        
        this.confirmDelete.onclick = () => {
            this.deleteRecord(record.id);
            this.hideDeleteModal();
            this.render();
            this.showToast(`Record for ${record.name} deleted successfully!`);
        };
        
        this.deleteModal.style.display = 'flex';
    }

    // Hide delete confirmation modal
    hideDeleteModal() {
        this.deleteModal.style.display = 'none';
    }

    // EXPORT: Export data as JSON
    exportData() {
        const dataStr = JSON.stringify(this.records, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `database_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showToast(`Exported ${this.records.length} records successfully!`);
    }

    // RENDERING: Main render function - single source of truth for UI updates
    render() {
        this.renderRecordCount();
        this.renderTable();
    }

    // Render record count in header
    renderRecordCount() {
        this.recordCount.querySelector('.count-number').textContent = this.records.length;
    }

    // Render data table
    renderTable() {
        // Show/hide empty states
        if (this.records.length === 0) {
            this.dataTable.style.display = 'none';
            this.emptyState.style.display = 'block';
            this.noResults.style.display = 'none';
            return;
        }

        if (this.filteredRecords.length === 0 && this.searchInput.value.trim()) {
            this.dataTable.style.display = 'none';
            this.emptyState.style.display = 'none';
            this.noResults.style.display = 'block';
            return;
        }

        // Show table and render records
        this.dataTable.style.display = 'table';
        this.emptyState.style.display = 'none';
        this.noResults.style.display = 'none';

        this.tableBody.innerHTML = this.filteredRecords.map(record => `
            <tr class="fade-in" data-id="${record.id}">
                <td><strong>${record.name}</strong></td>
                <td>${record.email}</td>
                <td>${record.phone}</td>
                <td>${record.company}</td>
                <td>${this.formatDate(record.created)}</td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="action-btn edit-btn" onclick="dbManager.editRecord('${record.id}')">
                            Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="dbManager.showDeleteModal(dbManager.getRecord('${record.id}'))">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Highlight search results
        if (this.searchInput.value.trim()) {
            this.highlightSearchResults();
        }
    }

    // Highlight search results in table
    highlightSearchResults() {
        const query = this.searchInput.value.toLowerCase().trim();
        if (!query) return;

        this.tableBody.querySelectorAll('tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.classList.add('highlight');
            }
        });
    }

    // UTILITY FUNCTIONS
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Get record by ID
    getRecord(id) {
        return this.records.find(record => record.id === id);
    }

    // Edit record (placeholder for future implementation)
    editRecord(id) {
        const record = this.getRecord(id);
        if (record) {
            this.showToast(`Edit functionality for ${record.name} coming soon!`);
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        this.successToast.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.successToast.style.display = 'none';
        }, 3000);
    }

    // Public methods for debugging
    getDatabase() {
        return [...this.records];
    }

    clearDatabase() {
        this.records = [];
        this.filteredRecords = [];
        this.saveDatabase();
        this.render();
        this.showToast('Database cleared successfully!');
    }
}

// Initialize the database manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dbManager = new DatabaseManager();
    
    console.log('🗄️ Client-Side Database Manager initialized');
    console.log('📊 Features: CRUD operations, search, sorting, export');
    console.log('🔧 Try: dbManager.getDatabase() to see all records');
    console.log('🗑️ Try: dbManager.clearDatabase() to clear all data');
});